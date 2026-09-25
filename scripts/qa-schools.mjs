import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const base = process.env.BASE_URL || 'http://localhost:3000';
async function search(query = '') {
  const response = await fetch(`${base}/api/schools?search=${encodeURIComponent(query)}`);
  assert.equal(response.status, 200, `School search failed: ${query}`);
  const schools = await response.json();
  assert.ok(Array.isArray(schools));
  return schools;
}

const schools = await search();
assert.ok(schools.length > 20, 'The directory must include both country spellings without a 20-result cap');
assert.equal(new Set(schools.map((school) => school.id)).size, schools.length);
assert.equal(new Set(schools.map((school) => school.name)).size, schools.length);
for (const domain of ['hust.edu.vn', 'ftu.edu.vn', 'hanu.edu.vn']) {
  assert.ok(schools.some((school) => school.id === domain), `${domain} missing from unfiltered list`);
}
console.log(`PASS ${schools.length} schools across both country spellings, unique IDs and names`);

const localSchools = JSON.parse(await readFile(new URL('../src/data/vietnam-universities.json', import.meta.url), 'utf8'));
const nameKey = (name) => name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[đĐ]/g, 'd').toLowerCase().replace(/\s+/g, ' ').trim().replace(/^truong\s+/, '');
const directoryNames = new Set(schools.map((school) => nameKey(school.name)));
const knownNames = new Map([
  [nameKey('Trường Đại học Bách khoa Hà Nội'), 'hust.edu.vn'],
  [nameKey('Trường Đại học Ngoại thương'), 'ftu.edu.vn'],
]);
for (const school of localSchools) {
  const key = nameKey(school.name);
  assert.ok(directoryNames.has(key) || schools.some((entry) => entry.id === knownNames.get(key)), `${school.name} missing from the directory`);
}
console.log('PASS every local school and campus remains available despite shared codes or abbreviations');

for (const [query, domain] of [
  ['HUST', 'hust.edu.vn'], ['ftu', 'ftu.edu.vn'],
  ['Bách khoa', 'hust.edu.vn'], ['bach khoa', 'hust.edu.vn'],
  ['Ngoại thương', 'ftu.edu.vn'], ['ngoai thuong', 'ftu.edu.vn'],
  ['  Đại học   Bách khoa Hà Nội  ', 'hust.edu.vn'],
  ['Hanoi University of Science and Technology', 'hust.edu.vn'],
  ['Foreign Trade University', 'ftu.edu.vn'], ['hanu.edu.vn', 'hanu.edu.vn'],
  ['BKA', 'hust.edu.vn'], ['NTH', 'ftu.edu.vn'],
]) {
  const results = await search(query);
  assert.ok(results.some((school) => school.id === domain), `${query} did not find ${domain}`);
  console.log(`PASS search: ${query}`);
}
for (const [query, names] of [
  ['HPU', ['Trường Đại học Kiểm sát Hà Nội', 'Trường Đại học Hải Phòng']],
  ['QHF', ['Đại học Quốc gia Hà Nội', 'Trường Đại học Ngoại ngữ – ĐH QGHN']],
  ['NTH', ['Trường Đại học Ngoại thương, cơ sở Quảng Ninh']],
  ['Thủ đô Hà Nội', ['Trường Đại học Thủ đô Hà Nội']],
]) {
  const results = await search(query);
  for (const name of names) assert.ok(results.some((school) => school.name === name), `${query} did not find ${name}`);
  console.log(`PASS shared-code and campus search: ${query}`);
}
assert.deepEqual(await search('zz_nonexistent_university'), []);
console.log('PASS unknown school returns an empty list');
