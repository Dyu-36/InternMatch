import assert from 'node:assert/strict';

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

for (const [query, domain] of [
  ['HUST', 'hust.edu.vn'], ['ftu', 'ftu.edu.vn'],
  ['Bách khoa', 'hust.edu.vn'], ['bach khoa', 'hust.edu.vn'],
  ['Ngoại thương', 'ftu.edu.vn'], ['ngoai thuong', 'ftu.edu.vn'],
  ['  Đại học   Bách khoa Hà Nội  ', 'hust.edu.vn'],
  ['Hanoi University of Science and Technology', 'hust.edu.vn'],
  ['Foreign Trade University', 'ftu.edu.vn'], ['hanu.edu.vn', 'hanu.edu.vn'],
]) {
  const results = await search(query);
  assert.ok(results.some((school) => school.id === domain), `${query} did not find ${domain}`);
  console.log(`PASS search: ${query}`);
}
assert.deepEqual(await search('zz_nonexistent_university'), []);
console.log('PASS unknown school returns an empty list');
