#!/usr/bin/env node
// Seed isolated fictional students and applications for the InternMatch demo.
//
// Safety and idempotency:
// - Applicant Auth/profile ids come from Supabase. Application ids are
//   deterministic UUIDv5 ids derived from stable applicant/job slugs, so
//   re-running updates/reuses those rows.
// - Auth emails use the RFC 2606 reserved `internmatch.example` domain and a
//   dedicated seed username prefix. The script refuses any identity collision
//   that does not match all reserved markers.
// - Passwords are long random values and are never printed or stored.
// - Avatar URLs are fixed Pexels workspace photos, not photographs of people.
// - The default is a local, no-write plan. Database access is required only for
//   apply/purge plans and writes. There is no anon or production-key fallback.
// - Purge discovers accounts only by exact reserved email and username, then
//   verifies their actual profile/Auth id and STUDENT role before deleting that
//   profile's applications and Auth user. Companies and jobs are never deleted.
//
// Usage:
//   node --env-file=.env.local scripts/seed-applicants.mjs
//   node --env-file=.env.local scripts/seed-applicants.mjs --apply
//   node --env-file=.env.local scripts/seed-applicants.mjs --purge
//   node --env-file=.env.local scripts/seed-applicants.mjs --purge --apply
//
// Requires NEXT_PUBLIC_SUPABASE_URL plus SUPABASE_TEST_SERVICE_ROLE_KEY (or
// INTERNMATCH_SUPABASE_SECRET_KEY). Point the URL at the test/demo Supabase
// project. Secrets are read from the environment and are never printed.

import { createHash, randomBytes } from 'node:crypto';
import { createClient } from '@supabase/supabase-js';
import { companies } from './seed-data/companies.mjs';
import { allJobs } from './seed-data/jobs.mjs';
import { applicants, WORKSPACE_IMAGES } from './seed-data/applicants.mjs';

const EXPECTED_APPLICANT_COUNT = 30;
const EXPECTED_JOB_COUNT = 100;
const EXPECTED_APPLICATION_COUNT = 200;
const USERNAME_PREFIX = 'seed_app_';
const EMAIL_PREFIX = 'seed-applicant-';
const DEMO_EMAIL_DOMAIN = 'internmatch.example';

// This must match scripts/seed-jobs.mjs. It cannot be imported because the
// job seeder exposes executable actions at module load time. Job ids stay
// deterministic; their company owner ids are discovered from the seeded rows.
const NAMESPACE = '7c1f0a6e-2b84-5d3e-9a17-6e5c4b0d8f21';

const FOCUSES = new Set(['it', 'accounting', 'sales']);
const STATUSES = new Set(['PENDING', 'REVIEWED', 'ACCEPTED', 'REJECTED']);
const COMPANIES_BY_SLUG = new Map(companies.map((company) => [company.slug, company]));
const COMPANY_POSITIONS = new Map(companies.map((company, index) => [company.slug, index]));
const APPLICANTS_BY_FOCUS = new Map([...FOCUSES].map((focus) => [focus, applicants.filter((applicant) => applicant.focus === focus)]));
const COVER_OPENINGS = {
  it: 'Tôi muốn đóng góp vào việc phát triển và vận hành sản phẩm công nghệ của đơn vị.',
  accounting: 'Tôi muốn áp dụng kiến thức tài chính và phương pháp làm việc có kiểm soát vào các quy trình của đơn vị.',
  sales: 'Tôi muốn phát triển cơ hội kinh doanh dựa trên nhu cầu khách hàng và dữ liệu thị trường.',
};
const STATUS_PATTERN = ['PENDING', 'PENDING', 'REVIEWED', 'PENDING', 'ACCEPTED', 'PENDING', 'REJECTED', 'REVIEWED'];
const allowedArgs = new Set(['--apply', '--purge', '--help', '-h']);
const unknownArgs = process.argv.slice(2).filter((arg) => !allowedArgs.has(arg));
if (unknownArgs.length) throw new Error(`Unknown argument(s): ${unknownArgs.join(', ')}`);

const APPLY = process.argv.includes('--apply');
const PURGE = process.argv.includes('--purge');
const HELP = process.argv.includes('--help') || process.argv.includes('-h');

function uuidV5(name) {
  const namespace = Buffer.from(NAMESPACE.replace(/-/g, ''), 'hex');
  const digest = createHash('sha1').update(Buffer.concat([namespace, Buffer.from(name, 'utf8')])).digest();
  const bytes = Buffer.from(digest.subarray(0, 16));
  bytes[6] = (bytes[6] & 0x0f) | 0x50;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = bytes.toString('hex');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`;
}

const jobId = (slug) => uuidV5(`job:${slug}`);
const applicationId = (applicantSlug, jobSlug) => uuidV5(`application:${applicantSlug}:${jobSlug}`);
const username = (slug) => `${USERNAME_PREFIX}${slug.replace(/-/g, '_')}`;
const email = (slug) => `${EMAIL_PREFIX}${slug}@${DEMO_EMAIL_DOMAIN}`;

function validate() {
  const problems = [];
  if (applicants.length !== EXPECTED_APPLICANT_COUNT) {
    problems.push(`expected ${EXPECTED_APPLICANT_COUNT} applicants, found ${applicants.length}`);
  }
  if (allJobs.length !== EXPECTED_JOB_COUNT) problems.push(`expected ${EXPECTED_JOB_COUNT} jobs, found ${allJobs.length}`);

  const seenApplicants = new Set();
  const focusCounts = { it: 0, accounting: 0, sales: 0 };
  for (const [index, applicant] of applicants.entries()) {
    const at = `applicant #${index + 1} ${applicant.slug ?? '(no slug)'}`;
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(applicant.slug ?? '') || seenApplicants.has(applicant.slug)) {
      problems.push(`${at}: slug is missing, invalid, or duplicated`);
    }
    seenApplicants.add(applicant.slug);
    if (!FOCUSES.has(applicant.focus)) problems.push(`${at}: invalid focus ${applicant.focus}`);
    else focusCounts[applicant.focus] += 1;
    if (!/^[a-z0-9_]{3,32}$/.test(username(applicant.slug))) problems.push(`${at}: reserved username is invalid`);
    if (applicant.name !== applicant.name?.trim() || !applicant.name) problems.push(`${at}: full name is required`);
    for (const field of ['university', 'major', 'goals']) {
      if (typeof applicant[field] !== 'string' || !applicant[field].trim()) problems.push(`${at}: ${field} is required`);
    }
    if (![2026, 2027].includes(applicant.graduationYear)) problems.push(`${at}: unexpected graduation year`);
    if (!Number.isInteger(Math.round(applicant.gpa * 100)) || applicant.gpa < 2.5 || applicant.gpa > 4) {
      problems.push(`${at}: GPA must be between 2.50 and 4.00`);
    }
    if (!Array.isArray(applicant.skills) || applicant.skills.length < 3 || applicant.skills.some((skill) => !skill?.trim())) {
      problems.push(`${at}: at least three non-empty skills are required`);
    }
    if (new Set(applicant.skills).size !== applicant.skills.length) problems.push(`${at}: skills must be unique`);
  }
  if (!WORKSPACE_IMAGES.length || WORKSPACE_IMAGES.some((url) => !url.startsWith('https://images.pexels.com/'))) {
    problems.push('avatar catalog: expected fixed HTTPS Pexels workspace images');
  }
  for (const [focus, count] of Object.entries(focusCounts)) {
    if (count !== 10) problems.push(`expected 10 ${focus} applicants, found ${count}`);
  }

  const seenJobs = new Set();
  for (const [index, job] of allJobs.entries()) {
    const at = `job #${index + 1} ${job.slug ?? '(no slug)'}`;
    if (!job.slug || seenJobs.has(job.slug)) problems.push(`${at}: slug missing or duplicated`);
    seenJobs.add(job.slug);
    if (!COMPANIES_BY_SLUG.has(job.company)) problems.push(`${at}: unknown company ${job.company}`);
  }

  if (problems.length) throw new Error(`Seed data is invalid:\n- ${problems.join('\n- ')}`);
  return focusCounts;
}

function coverLetter(applicant, job) {
  const skillList = applicant.skills.slice(0, 3).join(', ');
  return `${COVER_OPENINGS[applicant.focus]} Với kiến thức về ${skillList}, tôi có thể nhanh chóng tiếp cận yêu cầu của vị trí ${job.title}. Tôi mong có cơ hội học hỏi từ đội ngũ và đóng góp kết quả có thể đo lường trong suốt kỳ thực tập.`;
}

function buildApplicationRows(applicantIdsBySlug) {
  const companyJobIndexes = new Map(companies.map((company) => [company.slug, 0]));
  const rows = [];

  allJobs.forEach((job, jobIndex) => {
    const company = COMPANIES_BY_SLUG.get(job.company);
    const candidates = APPLICANTS_BY_FOCUS.get(company.category);
    const companyJobIndex = companyJobIndexes.get(company.slug);
    companyJobIndexes.set(company.slug, companyJobIndex + 1);
    const offset = ((COMPANY_POSITIONS.get(company.slug) + companyJobIndex * 2) % candidates.length + candidates.length) % candidates.length;

    for (let pairIndex = 0; pairIndex < 2; pairIndex += 1) {
      const applicant = candidates[(offset + pairIndex) % candidates.length];
      rows.push({
        id: applicationId(applicant.slug, job.slug),
        job_id: jobId(job.slug),
        student_id: applicantIdsBySlug.get(applicant.slug),
        // Inserted values are overwritten by prepare_application(). Keeping the
        // snapshot fields in the row also refreshes them on conflict updates.
        student_name: applicant.name,
        student_university: applicant.university,
        student_major: applicant.major,
        student_gpa: applicant.gpa,
        student_skills: applicant.skills,
        cover_letter: coverLetter(applicant, job),
        cv_url: null,
        cv_file_name: null,
        status: STATUS_PATTERN[(jobIndex + pairIndex) % STATUS_PATTERN.length],
      });
    }
  });
  return rows;
}

function createAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_TEST_SERVICE_ROLE_KEY || process.env.INTERNMATCH_SUPABASE_SECRET_KEY;
  if (!url || !key) {
    throw new Error('Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_TEST_SERVICE_ROLE_KEY (see .env.local) before apply/purge.');
  }
  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL is not a valid URL.');
  }
  if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error('NEXT_PUBLIC_SUPABASE_URL must use HTTP or HTTPS.');
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { 'X-Client-Info': 'internmatch-seed-applicants' } },
  });
}

async function availableWorkspaceImages() {
  const checks = await Promise.all(WORKSPACE_IMAGES.map(async (url) => {
    try {
      const response = await fetch(url, { method: 'HEAD', redirect: 'follow', signal: AbortSignal.timeout(5_000) });
      return response.ok && response.headers.get('content-type')?.startsWith('image/') ? url : null;
    } catch {
      return null;
    }
  }));
  return checks.filter(Boolean);
}

function avatarUrl(urls, index) {
  return urls.length ? urls[index % urls.length] : null;
}

function fail(response, what) {
  if (response.error) throw new Error(`${what}: ${response.error.message}`);
  return response.data;
}

function assertReservedProfile(profile, applicant) {
  if (profile.role !== 'STUDENT') throw new Error(`Reserved profile ${profile.id} is not a STUDENT; refusing to modify it.`);
  if (profile.username !== username(applicant.slug)) throw new Error(`Profile ${profile.id} has a different username; refusing to modify it.`);
  if (profile.email !== email(applicant.slug)) throw new Error(`Profile ${profile.id} has a different email; refusing to modify it.`);
}

async function preflightJobsAndApplicants(admin) {
  const jobIds = allJobs.map((job) => jobId(job.slug));
  const { data: jobRows, error: jobError } = await admin.from('jobs')
    .select('id, company_id, title')
    .in('id', jobIds);
  if (jobError) throw new Error(`Could not verify demo jobs: ${jobError.message}`);
  const jobsById = new Map((jobRows ?? []).map((job) => [job.id, job]));
  for (const job of allJobs) {
    if (!jobsById.has(jobId(job.slug))) {
      throw new Error(`Deterministic demo job is missing: ${job.slug}. Run scripts/seed-jobs.mjs --apply first.`);
    }
  }

  const ownerIds = [...new Set((jobRows ?? []).map((job) => job.company_id))];
  const { data: companyRows, error: companyError } = await admin.from('company_profiles')
    .select('user_id, company_name')
    .in('user_id', ownerIds);
  if (companyError) throw new Error(`Could not verify demo companies: ${companyError.message}`);
  const companyNames = new Map((companyRows ?? []).map((company) => [company.user_id, company.company_name]));
  for (const job of allJobs) {
    const row = jobsById.get(jobId(job.slug));
    if (row.title !== job.title || companyNames.get(row.company_id) !== COMPANIES_BY_SLUG.get(job.company).name) {
      throw new Error(`Demo job ${job.slug} does not match the expected seeded row and owner; refusing to seed applications.`);
    }
  }

  const applicantsByEmail = new Map(applicants.map((applicant) => [email(applicant.slug), applicant]));
  const applicantsByUsername = new Map(applicants.map((applicant) => [username(applicant.slug), applicant]));
  const applicantEmails = [...applicantsByEmail.keys()];
  const applicantUsernames = [...applicantsByUsername.keys()];
  const [byEmailResponse, byUsernameResponse] = await Promise.all([
    admin.from('profiles').select('id, username, email, role').in('email', applicantEmails),
    admin.from('profiles').select('id, username, email, role').in('username', applicantUsernames),
  ]);
  const profilesByEmail = fail(byEmailResponse, 'Could not inspect reserved applicant emails');
  const profilesByUsername = fail(byUsernameResponse, 'Could not inspect reserved applicant usernames');
  const discoveredProfiles = new Map();
  for (const profile of [...profilesByEmail, ...profilesByUsername]) discoveredProfiles.set(profile.id, profile);

  const existingProfiles = new Map();
  for (const profile of discoveredProfiles.values()) {
    const emailApplicant = applicantsByEmail.get(profile.email);
    const usernameApplicant = applicantsByUsername.get(profile.username);
    if (!emailApplicant || !usernameApplicant || emailApplicant.slug !== usernameApplicant.slug) {
      throw new Error(`Reserved applicant identity collision at profile ${profile.id}; refusing to continue.`);
    }
    assertReservedProfile(profile, emailApplicant);
    existingProfiles.set(emailApplicant.slug, profile);
  }

  return existingProfiles;
}

async function preflightApplications(admin, applicationRows) {
  const applicantIds = [...new Set(applicationRows.map((row) => row.student_id))];
  const applicationIds = applicationRows.map((row) => row.id);
  const [existingAppsResponse, appsByIdResponse] = await Promise.all([
    admin.from('applications').select('id, job_id, student_id').in('student_id', applicantIds),
    admin.from('applications').select('id, job_id, student_id').in('id', applicationIds),
  ]);
  const existingApps = fail(existingAppsResponse, 'Could not inspect existing applicant applications');
  const appsById = fail(appsByIdResponse, 'Could not inspect deterministic application ids');

  const targetPairs = new Set(applicationRows.map((row) => `${row.job_id}:${row.student_id}`));
  const targetApplicationIds = new Set(applicationIds);
  const collisions = existingApps.filter((row) => targetPairs.has(`${row.job_id}:${row.student_id}`) && !targetApplicationIds.has(row.id));
  if (collisions.length) {
    throw new Error(`Found ${collisions.length} non-seed application row(s) for the same applicant/job pairs; refusing to overwrite them.`);
  }
  const expectedAppsById = new Map(applicationRows.map((row) => [row.id, row]));
  const mismatchedIds = appsById.filter((row) => expectedAppsById.get(row.id)?.job_id !== row.job_id || expectedAppsById.get(row.id)?.student_id !== row.student_id);
  if (mismatchedIds.length) {
    throw new Error(`Found ${mismatchedIds.length} unexpected row(s) using deterministic application ids; refusing to overwrite them.`);
  }
}

async function ensureAuthUser(admin, applicant, existingProfile) {
  if (existingProfile) {
    assertReservedProfile(existingProfile, applicant);
    return { created: false, id: existingProfile.id };
  }

  const attributes = {
    email: email(applicant.slug),
    password: `Applicant-${randomBytes(32).toString('base64url')}`,
    email_confirm: true,
    user_metadata: { username: username(applicant.slug), role: 'STUDENT' },
  };
  const { data, error } = await admin.auth.admin.createUser(attributes);
  if (error && !/already (been )?(registered|exists)/i.test(error.message)) {
    throw new Error(`Could not create reserved Auth user ${attributes.email}: ${error.message}`);
  }

  const profileId = data?.user?.id;
  const { data: profiles, error: lookupError } = await admin.from('profiles')
    .select('id, username, email, role')
    .eq('email', attributes.email)
    .limit(2);
  if (lookupError) throw new Error(`Could not verify reserved Auth user ${attributes.email}: ${lookupError.message}`);
  if (profiles?.length !== 1) throw new Error(`Reserved Auth user ${attributes.email} does not have exactly one profile; refusing to continue.`);
  const profile = profiles[0];
  if (profileId && profile.id !== profileId) throw new Error(`Reserved Auth user and profile ids do not match for ${attributes.email}.`);
  assertReservedProfile(profile, applicant);
  return { created: !error, id: profile.id };
}

function profileRows(avatarUrls, applicantIdsBySlug) {
  return applicants.map((applicant, index) => ({
    id: applicantIdsBySlug.get(applicant.slug),
    username: username(applicant.slug),
    email: email(applicant.slug),
    role: 'STUDENT',
    name: applicant.name,
    avatar_url: avatarUrl(avatarUrls, index),
  }));
}

function studentProfileRows(avatarUrls, applicantIdsBySlug) {
  return applicants.map((applicant, index) => ({
    user_id: applicantIdsBySlug.get(applicant.slug),
    full_name: applicant.name,
    avatar_url: avatarUrl(avatarUrls, index),
    cv_url: null,
    cv_file_name: null,
    university: applicant.university,
    major: applicant.major,
    expected_graduation_year: applicant.graduationYear,
    gpa: applicant.gpa,
    skills: applicant.skills,
    goals: applicant.goals,
  }));
}

async function applySeed() {
  const focusCounts = validate();
  console.log(`Applicant seed plan: ${applicants.length} fictional students, ${allJobs.length} deterministic target jobs, ${EXPECTED_APPLICATION_COUNT} applications.`);
  console.log(`Focus groups: IT ${focusCounts.it} | accounting ${focusCounts.accounting} | sales ${focusCounts.sales}.`);
  console.log('Coverage target: 8 applications per seeded company; no CV files are created.');
  if (!APPLY) {
    console.log('\nDry run. No environment or database was accessed. Re-run with --apply to write to the test/demo project.');
    return;
  }
  const admin = createAdmin();
  const existingProfiles = await preflightJobsAndApplicants(admin);
  const avatarUrls = await availableWorkspaceImages();
  console.log(avatarUrls.length
    ? `Avatars: ${avatarUrls.length}/${WORKSPACE_IMAGES.length} verified Pexels workspace images available.`
    : 'Avatars: Pexels unavailable; using null avatar URLs so the UI can show initials, with no synthetic face art.');

  let createdAccounts = 0;
  const applicantIdsBySlug = new Map();
  for (const applicant of applicants) {
    const result = await ensureAuthUser(admin, applicant, existingProfiles.get(applicant.slug));
    applicantIdsBySlug.set(applicant.slug, result.id);
    if (result.created) createdAccounts += 1;
  }
  if (new Set(applicantIdsBySlug.values()).size !== applicants.length) {
    throw new Error('Supabase returned duplicate applicant Auth/profile ids; refusing to continue.');
  }

  const applicationRows = buildApplicationRows(applicantIdsBySlug);
  if (applicationRows.length !== EXPECTED_APPLICATION_COUNT) {
    throw new Error(`Expected ${EXPECTED_APPLICATION_COUNT} applications, built ${applicationRows.length}.`);
  }
  if (new Set(applicationRows.map((row) => row.id)).size !== applicationRows.length) {
    throw new Error('Generated application ids are not unique.');
  }
  if (applicationRows.some((row) => !STATUSES.has(row.status))) throw new Error('Generated application status is invalid.');
  await preflightApplications(admin, applicationRows);

  fail(await admin.from('profiles').upsert(profileRows(avatarUrls, applicantIdsBySlug), { onConflict: 'id' }), 'Could not upsert reserved applicant profiles');
  fail(await admin.from('student_profiles').upsert(studentProfileRows(avatarUrls, applicantIdsBySlug), { onConflict: 'user_id' }), 'Could not upsert fictional student profiles');
  fail(await admin.from('applications').upsert(applicationRows, { onConflict: 'id' }), 'Could not upsert fictional applications');

  const applicantIds = [...applicantIdsBySlug.values()];
  const applicationIds = applicationRows.map((row) => row.id);
  const [profilesResult, studentsResult, seededApplicationsResult] = await Promise.all([
    admin.from('profiles').select('id').in('id', applicantIds),
    admin.from('student_profiles').select('id').in('user_id', applicantIds),
    admin.from('applications').select('id').in('id', applicationIds),
  ]);
  const counts = [
    [fail(profilesResult, 'Could not read applicant profiles').length, applicants.length, 'profiles'],
    [fail(studentsResult, 'Could not read student profiles').length, applicants.length, 'student profiles'],
    [fail(seededApplicationsResult, 'Could not read fictional applications').length, applicationRows.length, 'applications'],
  ];
  const incomplete = counts.find(([actual, expected]) => actual !== expected);
  if (incomplete) throw new Error(`Post-apply verification failed for ${incomplete[2]}: expected ${incomplete[1]}, found ${incomplete[0]}.`);
  console.log(`\nApplied. ${createdAccounts} Auth accounts created; ${applicants.length - createdAccounts} reused.`);
  console.log(counts.map(([actual, expected, label]) => `${actual}/${expected} ${label}`).join(' | '));
}

async function purge() {
  validate();
  console.log(`Applicant purge plan: up to ${applicants.length} reserved accounts and all applications attached to their matching profiles.`);
  console.log('Guard: exact seed-applicant- email + seed_app_ username + STUDENT role must all match. Companies and jobs are out of scope.');
  if (!APPLY) {
    console.log('\nDry run. No environment or database was accessed. Re-run with --purge --apply to delete from the test/demo project.');
    return;
  }

  const admin = createAdmin();
  const applicantsByEmail = new Map(applicants.map((applicant) => [email(applicant.slug), applicant]));
  const applicantsByUsername = new Map(applicants.map((applicant) => [username(applicant.slug), applicant]));
  const applicantEmails = [...applicantsByEmail.keys()];
  const applicantUsernames = [...applicantsByUsername.keys()];
  const [byEmailResponse, byUsernameResponse] = await Promise.all([
    admin.from('profiles').select('id, username, email, role').in('email', applicantEmails),
    admin.from('profiles').select('id, username, email, role').in('username', applicantUsernames),
  ]);
  if (byEmailResponse.error) throw new Error(`Could not inspect reserved applicant emails: ${byEmailResponse.error.message}`);
  if (byUsernameResponse.error) throw new Error(`Could not inspect reserved applicant usernames: ${byUsernameResponse.error.message}`);

  const discoveredProfiles = new Map();
  for (const profile of [...byEmailResponse.data, ...byUsernameResponse.data]) discoveredProfiles.set(profile.id, profile);
  const removable = new Map();
  for (const profile of discoveredProfiles.values()) {
    const emailApplicant = applicantsByEmail.get(profile.email);
    const usernameApplicant = applicantsByUsername.get(profile.username);
    if (profile.role === 'STUDENT' && emailApplicant && emailApplicant.slug === usernameApplicant?.slug) {
      removable.set(profile.id, profile);
    }
  }
  if (discoveredProfiles.size && removable.size !== discoveredProfiles.size) {
    console.warn(`${discoveredProfiles.size - removable.size} discovered reserved identity collision(s) lack every marker and will be left untouched.`);
  }
  if (!removable.size) {
    console.log('No matching reserved applicant profiles are present; nothing to purge.');
    return;
  }

  const removableIds = [...removable.keys()];
  const { count: applicationCount, error: countError } = await admin
    .from('applications')
    .select('id', { count: 'exact', head: true })
    .in('student_id', removableIds);
  if (countError) throw new Error(`Could not count reserved applicant applications: ${countError.message}`);

  fail(await admin.from('applications').delete().in('student_id', removableIds), 'Could not delete reserved applicant applications');
  for (const [id, profile] of removable) {
    const { error: deleteError } = await admin.auth.admin.deleteUser(id);
    if (deleteError) throw new Error(`Could not delete reserved Auth user ${profile.username}: ${deleteError.message}`);
  }

  console.log(`\nPurged ${removable.size} reserved applicant accounts and ${applicationCount ?? 0} applications. Seeded companies and jobs were not touched.`);
}

if (HELP) {
  console.log('Usage: node --env-file=.env.local scripts/seed-applicants.mjs [--apply | --purge [--apply]]');
} else if (PURGE) {
  await purge();
} else {
  await applySeed();
}
