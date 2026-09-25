#!/usr/bin/env node
// Resolve real company logos for the demo job seed from Wikimedia Commons.
//
// Source of truth is Wikidata (property P154 "logo image", fallback P41), which
// stores the official brand logo file of the real company. The Commons file is
// then rendered to a fixed 250px thumbnail on upload.wikimedia.org, a stable
// public host that serves brand logos without an API key.
//
// The script never downloads or stores artwork, and never generates a logo. A
// company whose logo cannot be resolved and verified is written out WITHOUT a
// logo; the UI then falls back to the company initial.
//
// Usage:
//   node scripts/resolve-company-logos.mjs            # resolve + verify + write
//   node scripts/resolve-company-logos.mjs --check    # verify current file only
//
// Output: scripts/seed-data/company-logos.json (committed, no secrets).
// Set LOGO_HTTP=0 to skip the HTTP verification pass (offline runs).

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { companies } from './seed-data/companies.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT = path.join(HERE, 'seed-data', 'company-logos.json');
const CHECK_ONLY = process.argv.includes('--check');
const SKIP_HTTP = process.env.LOGO_HTTP === '0';
const THUMB_WIDTH = 250;
const USER_AGENT = 'InternMatchSeed/1.0 (demo job seed; https://internmatch.vercel.app)';
const API = 'https://commons.wikimedia.org/w/api.php';
const WIKIDATA = 'https://www.wikidata.org/w/api.php';

// Human-reviewed picks. Wikidata occasionally points at a local member firm or
// an outdated lockup; these entries are the file that was actually checked.
const CURATED_COMMONS_FILE = {
  bdo: 'Bdo logo wikipedia.jpg',
  intel: 'Intel logo (2020, dark blue).svg',
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function api(base, params, attempts = 5) {
  const url = `${base}?${new URLSearchParams(params)}`;
  let lastError;
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      const response = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
      if (response.status === 429 || response.status >= 500) throw new Error(`HTTP ${response.status}`);
      if (!response.ok) throw new Error(`HTTP ${response.status} ${response.statusText}`);
      return await response.json();
    } catch (error) {
      lastError = error;
      await sleep(1200 * (attempt + 1));
    }
  }
  throw lastError;
}

async function wikidataLogoFiles(ids) {
  const data = await api(WIKIDATA, {
    action: 'wbgetentities',
    ids: ids.join('|'),
    props: 'claims',
    format: 'json',
  });
  const found = new Map();
  for (const id of ids) {
    const claims = data.entities?.[id]?.claims ?? {};
    let file = null;
    for (const property of ['P154', 'P41']) {
      for (const claim of claims[property] ?? []) {
        if (claim.rank === 'deprecated') continue;
        const value = claim.mainsnak?.datavalue?.value;
        if (typeof value === 'string' && /\.(svg|png|jpe?g|gif|webp)$/i.test(value)) {
          file = value;
          break;
        }
      }
      if (file) break;
    }
    found.set(id, file);
  }
  return found;
}

async function commonsThumb(files) {
  const unique = [...new Set(files.filter(Boolean))];
  const data = await api(API, {
    action: 'query',
    titles: unique.map((file) => `File:${file}`).join('|'),
    prop: 'imageinfo',
    iiprop: 'url|mime|extmetadata',
    iiurlwidth: String(THUMB_WIDTH),
    format: 'json',
  });
  const info = new Map();
  for (const page of Object.values(data.query?.pages ?? {})) {
    const image = page.imageinfo?.[0];
    if (page.missing || !image?.thumburl) {
      info.set(page.title, null);
      continue;
    }
    const meta = image.extmetadata ?? {};
    info.set(page.title, {
      file: page.title.replace(/^File:/, ''),
      url: image.thumburl
        .replace('//thumb.wikimedia.org/', '//upload.wikimedia.org/')
        .split('?')[0],
      sourcePage: `https://commons.wikimedia.org/wiki/${encodeURIComponent(page.title)}`,
      license: meta.LicenseShortName?.value ?? null,
      mime: image.mime,
    });
  }
  return info;
}

async function verify(url) {
  for (let attempt = 0; attempt < 4; attempt += 1) {
    try {
      const response = await fetch(url, { headers: { 'User-Agent': USER_AGENT }, redirect: 'follow' });
      const type = response.headers.get('content-type') ?? '';
      if (response.status === 200 && type.startsWith('image/')) return true;
    } catch {
      // fall through to the backoff below
    }
    // upload.wikimedia.org throttles bursts; retry before giving up on a company.
    await sleep(1500 * 2 ** attempt);
  }
  return false;
}
async function main() {
  const ids = companies.map((company) => company.wikidataId);
  const wikidataFiles = await wikidataLogoFiles(ids);
  const wanted = companies.map((company) => CURATED_COMMONS_FILE[company.slug] ?? wikidataFiles.get(company.wikidataId));
  const thumbs = await commonsThumb(wanted);

  const logos = {};
  for (const company of companies) {
    const curated = CURATED_COMMONS_FILE[company.slug];
    const file = curated ?? wikidataFiles.get(company.wikidataId);
    const info = file ? thumbs.get(`File:${file}`) ?? null : null;
    if (!info) {
      console.warn(`SKIP  ${company.slug}: no verifiable logo file (no logo is invented)`);
      continue;
    }
    if (!SKIP_HTTP && !(await verify(info.url))) {
      console.warn(`SKIP  ${company.slug}: ${info.url} did not return an image`);
      continue;
    }
    logos[company.slug] = {
      url: info.url,
      commonsFile: info.file,
      sourcePage: info.sourcePage,
      license: info.license,
      wikidataId: company.wikidataId,
      resolution: `${THUMB_WIDTH}px`,
      origin: curated ? 'curated' : 'wikidata-logo-property',
    };
    console.log(`OK    ${company.slug.padEnd(20)} ${info.file}`);
    await sleep(250);
  }

  const resolved = Object.keys(logos).length;
  console.log(`\nResolved ${resolved}/${companies.length} real company logos.`);
  if (CHECK_ONLY) {
    const previous = JSON.parse(await fs.readFile(OUTPUT, 'utf8'));
    const changed = Object.entries(logos).filter(([slug, value]) => previous.logos?.[slug]?.url !== value.url);
    for (const [slug, value] of changed) {
      console.log(`DRIFT ${slug}: ${previous.logos?.[slug]?.url ?? '(none)'} -> ${value.url}`);
    }
    if (changed.length) {
      console.error('\nRun without --check to update scripts/seed-data/company-logos.json.');
      process.exitCode = 1;
    }
    return;
  }

  const payload = {
    note: 'Generated by scripts/resolve-company-logos.mjs. Real brand logos hosted on Wikimedia Commons. Never edit by hand; never add artwork that was not resolved from Wikidata/Commons.',
    logos,
  };
  await fs.writeFile(OUTPUT, `${JSON.stringify(payload, null, 2)}\n`);
  console.log(`Wrote ${path.relative(process.cwd(), OUTPUT)}`);
}

await main();
