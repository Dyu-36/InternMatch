#!/usr/bin/env node
// Seed 100 demo jobs (IT / accounting / sales) for InternMatch.
//
// The jobs table is the single source of truth for the public job board
// (src/lib/repository.ts `readAppState`), so the demo content lives in the
// database, not in a mock layer.
//
// How it stays safe and idempotent:
// - Every company, profile and job id is a UUIDv5 derived from a fixed
//   namespace plus a stable slug, so re-running updates the same rows instead
//   of creating duplicates.
// - Demo companies use the reserved username prefix `seed_` and the reserved,
//   non-deliverable email domain `internmatch.example`. The script refuses to
//   touch any account that does not carry that marker, so real users can never
//   be overwritten.
// - Accounts are created with a random password that is never printed, so the
//   demo companies cannot be signed into.
// - Only the deterministic id set of this script is ever written or deleted.
// - Nothing is written unless `--apply` is passed; the default run is a plan.
//
// Usage:
//   node --env-file=.env.local scripts/seed-jobs.mjs                 # plan only
//   node --env-file=.env.local scripts/seed-jobs.mjs --apply         # seed
//   node --env-file=.env.local scripts/seed-jobs.mjs --apply --today=2026-09-25
//   node --env-file=.env.local scripts/seed-jobs.mjs --apply --purge # remove
//
// Requires NEXT_PUBLIC_SUPABASE_URL plus SUPABASE_TEST_SERVICE_ROLE_KEY (or
// INTERNMATCH_SUPABASE_SECRET_KEY). Secrets are read from the environment and
// are never written to disk or stdout.

import { createHash, randomBytes } from 'node:crypto';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@supabase/supabase-js';
import { companies, JOB_INDUSTRY } from './seed-data/companies.mjs';
import { allJobs } from './seed-data/jobs.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const logoCatalog = JSON.parse(readFileSync(path.join(HERE, 'seed-data', 'company-logos.json'), 'utf8'));

const APPLY = process.argv.includes('--apply');
const PURGE = process.argv.includes('--purge');
const TODAY_ARG = process.argv.find((arg) => arg.startsWith('--today='))?.split('=')[1];
const EXPECTED_JOB_COUNT = 100;
const USERNAME_PREFIX = 'seed_';
const DEMO_EMAIL_DOMAIN = 'internmatch.example';
// Fixed namespace UUID: bump it only if you intend to create a second, parallel
// seed set with different ids.
const NAMESPACE = '7c1f0a6e-2b84-5d3e-9a17-6e5c4b0d8f21';

const JOB_TYPES = new Set([
  'Full-time', 'Part-time', 'Remote', 'Thực tập Toàn thời gian', 'Thực tập Bán thời gian',
]);

const slug = process.argv.find((arg) => arg.startsWith('--slug='))?.split('=')[1];
const today = TODAY_ARG ? new Date(`${TODAY_ARG}T00:00:00Z`) : new Date();
if (Number.isNaN(today.getTime())) throw new Error(`Invalid --today value: ${TODAY_ARG}`);

function uuidV5(name) {
  const namespace = Buffer.from(NAMESPACE.replace(/-/g, ''), 'hex');
  const digest = createHash('sha1').update(Buffer.concat([namespace, Buffer.from(name, 'utf8')])).digest();
  const bytes = Buffer.from(digest.subarray(0, 16));
  bytes[6] = (bytes[6] & 0x0f) | 0x50;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = bytes.toString('hex');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`;
}

const companyId = (companySlug) => uuidV5(`company:${companySlug}`);
const jobId = (jobSlug) => uuidV5(`job:${jobSlug}`);
// The auth trigger only accepts usernames matching ^[a-z0-9_]{3,32}$.
const username = (companySlug) => `${USERNAME_PREFIX}${companySlug.replace(/-/g, '_')}`;
const demoEmail = (companySlug) => `careers+${companySlug}@${DEMO_EMAIL_DOMAIN}`;

function dateOffset(days) {
  const value = new Date(today);
  value.setUTCDate(value.getUTCDate() + days);
  return value.toISOString().slice(0, 10);
}

// ---------------------------------------------------------------- validation
function validate() {
  const problems = [];
  if (allJobs.length !== EXPECTED_JOB_COUNT) {
    problems.push(`expected ${EXPECTED_JOB_COUNT} jobs, found ${allJobs.length}`);
  }
  const seen = new Set();
  const byCategory = { it: 0, accounting: 0, sales: 0 };
  for (const [index, job] of allJobs.entries()) {
    const at = `#${index + 1} ${job.slug ?? '(no slug)'}`;
    if (!job.slug || seen.has(job.slug)) problems.push(`${at}: slug missing or duplicated`);
    seen.add(job.slug);
    const company = companies.find((item) => item.slug === job.company);
    if (!company) {
      problems.push(`${at}: unknown company "${job.company}"`);
      continue;
    }
    byCategory[company.category] += 1;
    if (!JOB_TYPES.has(job.jobType)) problems.push(`${at}: invalid jobType "${job.jobType}"`);
    if (!Array.isArray(job.salary) || job.salary.length !== 2) problems.push(`${at}: salary must be [min, max]`);
    else if (job.salary[0] <= 0 || job.salary[1] < job.salary[0]) problems.push(`${at}: invalid salary range`);
    if (!Number.isInteger(job.quota) || job.quota < 1) problems.push(`${at}: quota must be a positive integer`);
    for (const field of ['title', 'location', 'description', 'requirements']) {
      if (typeof job[field] !== 'string' || !job[field].trim()) problems.push(`${at}: ${field} is required`);
    }
    if (!Array.isArray(job.skills) || job.skills.length === 0) problems.push(`${at}: skills are required`);
    if (job.deadline !== undefined && !Number.isInteger(job.deadline)) problems.push(`${at}: deadline must be an integer day offset`);
  }
  for (const company of companies) {
    if (username(company.slug).length > 32) problems.push(`company ${company.slug}: reserved username exceeds 32 characters`);
    if (!/^[a-z0-9_]{3,32}$/.test(username(company.slug))) problems.push(`company ${company.slug}: reserved username is not valid`);
  }
  for (const [key, count] of Object.entries(byCategory)) {
    if (!count) problems.push(`no jobs for category "${key}"`);
  }
  if (problems.length) throw new Error(`Seed data is invalid:\n- ${problems.join('\n- ')}`);
  return byCategory;
}

function buildJobRows(companyIds = new Map(companies.map((company) => [company.slug, companyId(company.slug)]))) {
  return allJobs.map((job, index) => {
    const company = companies.find((item) => item.slug === job.company);
    const postedDaysAgo = job.posted ?? index % 21;
    return {
      id: jobId(job.slug),
      company_id: companyIds.get(company.slug),
      title: job.title,
      industry: JOB_INDUSTRY[company.category],
      job_type: job.jobType,
      location: job.location,
      min_salary: job.salary[0],
      max_salary: job.salary[1],
      skills: job.skills,
      description: job.description,
      requirements: job.requirements,
      benefits: job.benefits ?? company.benefits,
      is_hot: Boolean(job.hot),
      is_featured: Boolean(job.featured),
      quota: job.quota,
      deadline: job.deadline === undefined ? null : dateOffset(job.deadline),
      created_at: dateOffset(-postedDaysAgo),
    };
  });
}

function companyRows(companyIds = new Map(companies.map((company) => [company.slug, companyId(company.slug)]))) {
  return companies.map((company) => ({
    user_id: companyIds.get(company.slug),
    company_name: company.name,
    tax_code: '0000000000',
    industry: company.industry,
    company_size: company.size,
    email: demoEmail(company.slug),
    hotline: '',
    address: company.address,
    city: company.city,
    website: company.website,
    logo_url: logoCatalog.logos?.[company.slug]?.url ?? null,
    description: company.description,
  }));
}

// ------------------------------------------------------------------- runtime
function createAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_TEST_SERVICE_ROLE_KEY || process.env.INTERNMATCH_SUPABASE_SECRET_KEY;
  if (!url || !key) {
    throw new Error('Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_TEST_SERVICE_ROLE_KEY (see .env.local) before seeding.');
  }
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

function fail(response, what) {
  if (response.error) throw new Error(`${what}: ${response.error.message}`);
  return response.data;
}

async function ensureCompany(admin, company) {
  const { data: existing } = await admin.from('profiles').select('id, username, email, role').eq('username', username(company.slug)).maybeSingle();
  if (existing) {
    if (existing.role !== 'COMPANY') {
      throw new Error(`Account "${existing.username}" is not a company account; refusing to modify it.`);
    }
    if (existing.email !== demoEmail(company.slug)) {
      throw new Error(`Account "${existing.username}" is not a reserved demo account (${DEMO_EMAIL_DOMAIN}); refusing to modify it.`);
    }
    return { profileId: existing.id, created: false };
  }

  const { error } = await admin.auth.admin.createUser({
    email: demoEmail(company.slug),
    // Random and never printed: the demo account cannot be signed into.
    password: `Seed-${randomBytes(24).toString('base64url')}`,
    email_confirm: true,
    user_metadata: { username: username(company.slug), role: 'COMPANY' },
  });
  if (error && !/already (been )?(registered|exists)/i.test(error.message)) {
    throw new Error(`Could not create demo account for ${company.slug}: ${error.message}`);
  }
  const { data: created, error: lookupError } = await admin.from('profiles').select('id, email, role').eq('username', username(company.slug)).maybeSingle();
  if (lookupError) throw new Error(`Could not verify demo account for ${company.slug}: ${lookupError.message}`);
  if (!created) throw new Error(`Demo account for ${company.slug} was not created.`);
  return { profileId: created.id, created: true };
}

async function seed() {
  const byCategory = validate();
  const admin = createAdmin();
  const selected = slug ? companies.filter((company) => company.slug === slug) : companies;
  if (!selected.length) throw new Error(`Unknown company slug: ${slug}`);
  const jobRows = buildJobRows().filter((row) => selected.some((company) => companyId(company.slug) === row.company_id));

  console.log(`Seed plan for ${selected.length} companies and ${jobRows.length} jobs (run date ${dateOffset(0)}).`);
  console.log(`Categories: IT ${byCategory.it} | accounting ${byCategory.accounting} | sales ${byCategory.sales}`);
  for (const company of selected) {
    const logo = logoCatalog.logos?.[company.slug]?.url;
    console.log(`- ${company.name.padEnd(24)} ${company.slug.padEnd(20)} ${logo ? 'real logo' : 'initial only (no verified logo)'}`);
  }
  if (!APPLY) {
    console.log('\nDry run. Re-run with --apply to write to the database.');
    return;
  }

  let createdAccounts = 0;
  const companyIds = new Map();
  for (const company of selected) {
    const { profileId, created } = await ensureCompany(admin, company);
    companyIds.set(company.slug, profileId);
    if (created) createdAccounts += 1;
  }
  const rows = companyRows(companyIds).filter((row) => selected.some((company) => companyIds.get(company.slug) === row.user_id));
  const seededJobRows = buildJobRows(companyIds).filter((row) => selected.some((company) => companyIds.get(company.slug) === row.company_id));
  fail(await admin.from('company_profiles').upsert(rows, { onConflict: 'user_id' }), 'Could not upsert company profiles');
  fail(await admin.from('jobs').upsert(seededJobRows, { onConflict: 'id' }), 'Could not upsert jobs');

  const { count } = await admin.from('jobs').select('id', { count: 'exact', head: true }).in('id', seededJobRows.map((row) => row.id));
  console.log(`\nApplied. ${createdAccounts} demo accounts created, ${selected.length - createdAccounts} reused.`);
  console.log(`${count}/${seededJobRows.length} demo jobs present for run date ${dateOffset(0)}.`);
}

async function purge() {
  const admin = createAdmin();
  validate();
  const targetIds = companies.map((company) => companyId(company.slug));
  const jobIds = allJobs.map((job) => jobId(job.slug));
  const { data: profiles } = await admin.from('profiles').select('id, username, email').in('id', targetIds);
  const removable = (profiles ?? []).filter((profile) => profile.username.startsWith(USERNAME_PREFIX) && profile.email.endsWith(`@${DEMO_EMAIL_DOMAIN}`));
  if (removable.length !== targetIds.length) {
    console.warn(`Only ${removable.length}/${targetIds.length} demo accounts carry the reserved marker; leaving the rest untouched.`);
  }
  if (!APPLY) {
    console.log(`Dry run. Would delete ${jobIds.length} demo jobs and ${removable.length} demo company accounts. Re-run with --apply.`);
    return;
  }
  fail(await admin.from('jobs').delete().in('id', jobIds), 'Could not delete demo jobs');
  fail(await admin.from('company_profiles').delete().in('user_id', removable.map((profile) => profile.id)), 'Could not delete demo company profiles');
  for (const profile of removable) {
    const { error } = await admin.auth.admin.deleteUser(profile.id);
    if (error) console.warn(`Could not delete auth user ${profile.username}: ${error.message}`);
  }
  fail(await admin.from('profiles').delete().in('id', removable.map((profile) => profile.id)), 'Could not delete demo profiles');
  console.log(`\nPurged ${jobIds.length} demo jobs and ${removable.length} demo company accounts.`);
}

if (PURGE) await purge();
else await seed();
