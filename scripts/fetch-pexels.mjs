import fs from 'node:fs/promises';
import path from 'node:path';

const apiKey = process.env.PEXELS_API_KEY;
const query = process.argv.slice(2).join(' ').trim() || 'students internship teamwork';
const limit = Number(process.env.PEXELS_LIMIT || 6);

if (!apiKey) {
  throw new Error('Missing PEXELS_API_KEY. Put it in .env.local only.');
}

const params = new URLSearchParams({
  query,
  orientation: 'landscape',
  size: 'large',
  per_page: String(Math.min(Math.max(limit, 1), 80)),
});

const response = await fetch(`https://api.pexels.com/v1/search?${params}`, {
  headers: { Authorization: apiKey },
});

if (!response.ok) {
  throw new Error(`Pexels request failed: ${response.status} ${response.statusText}`);
}

const data = await response.json();
const outputDir = path.resolve('public/assets/backgrounds');
const manifestPath = path.resolve('public/assets/pexels-assets.json');
await fs.mkdir(outputDir, { recursive: true });

const safeQuery = query.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const assets = [];
for (const [index, photo] of (data.photos ?? []).entries()) {
  const imageUrl = photo.src?.large2x || photo.src?.landscape || photo.src?.large;
  if (!imageUrl) continue;

  const imageResponse = await fetch(imageUrl);
  if (!imageResponse.ok) continue;

  const filename = `pexels-${safeQuery || 'asset'}-${photo.id}-${index + 1}.jpg`;
  await fs.writeFile(path.join(outputDir, filename), Buffer.from(await imageResponse.arrayBuffer()));
  assets.push({
    filename: `backgrounds/${filename}`,
    pexelsUrl: photo.url,
    photographer: photo.photographer,
    photographerUrl: photo.photographer_url,
    originalUrl: photo.src?.original,
    query,
    downloadedAt: new Date().toISOString(),
  });
}

await fs.writeFile(manifestPath, `${JSON.stringify(assets, null, 2)}\n`);
console.log(`Downloaded ${assets.length} Pexels assets for: ${query}`);
