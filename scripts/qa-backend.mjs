import assert from 'node:assert/strict';
import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const adminKey = process.env.SUPABASE_TEST_SERVICE_ROLE_KEY;
if (!url || !key || !adminKey) throw new Error('Set app environment and SUPABASE_TEST_SERVICE_ROLE_KEY for isolated QA account cleanup.');
const client = () => createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
const admin = createClient(url, adminKey, { auth: { persistSession: false, autoRefreshToken: false } });
const users = [];
const objects = [];
let checks = 0;
function pass(name) { checks++; console.log(`PASS ${name}`); }
function ok(response) { assert.equal(response.error, null, response.error?.message); return response.data; }
const stamp = `qa_${Date.now()}`;

try {
  const student = client(), company = client(), stranger = client(), anonymous = client();
  for (const [api, role, suffix] of [[student, 'STUDENT', 'student'], [company, 'COMPANY', 'company'], [stranger, 'COMPANY', 'stranger']]) {
    const username = `${stamp}_${suffix}`;
    const data = ok(await api.auth.signUp({ email: `${username}@internmatch.local`, password: `Qa!${crypto.randomUUID()}`, options: { data: { username, role } } }));
    assert.ok(data.session); users.push(data.user.id);
    const profile = ok(await api.from('profiles').select('*').single());
    assert.equal(profile.role, role);
  }
  const [studentId, companyId] = users;
  pass('Registration creates authenticated sessions and correct profiles atomically');
  assert.ok((await student.from('profiles').update({ role: 'COMPANY' }).eq('id', studentId)).error);
  assert.ok((await anonymous.from('profiles').select('*')).error);
  pass('Account roles are immutable; private account data is not public');
  ok(await company.from('company_profiles').update({ company_name: 'QA InternMatch', email: 'qa@example.com' }).eq('user_id', companyId));
  const jobPayload = { company_id: companyId, title: `${stamp} Frontend`, industry: 'Technology', job_type: 'Remote', location: 'Hà Nội', min_salary: 100, max_salary: 200, skills: ['React'], description: 'QA description', requirements: 'QA requirements', benefits: 'QA benefits', quota: 1 };
  assert.ok((await student.from('jobs').insert({ ...jobPayload, company_id: studentId })).error);
  const job = ok(await company.from('jobs').insert(jobPayload).select('*').single());
  assert.equal(job.company_name, 'QA InternMatch');
  assert.ok(ok(await anonymous.from('jobs').select('id').eq('id', job.id)).length === 1);
  pass('Company creates jobs; public visitors see live data; student job creation denied');
  assert.equal(ok(await stranger.from('jobs').update({ title: 'hijack' }).eq('id', job.id).select()).length, 0);
  ok(await company.from('jobs').update({ title: `${stamp} Updated` }).eq('id', job.id));
  assert.equal(ok(await anonymous.from('jobs').select('title').eq('id', job.id).single()).title, `${stamp} Updated`);
  assert.ok((await company.from('jobs').update({ company_id: users[2] }).eq('id', job.id)).error);
  pass('Only job owner can edit; ownership cannot be reassigned');
  const expiredJob = ok(await company.from('jobs').insert({ ...jobPayload, deadline: '2020-01-01' }).select('id').single());
  ok(await student.from('student_profiles').update({ full_name: 'QA Student', university: 'QA University', major: 'IT', skills: ['React'], gpa: 3.5 }).eq('user_id', studentId));
  const cvPath = `${studentId}/${stamp}.pdf`;
  ok(await student.storage.from('resumes').upload(cvPath, new Blob(['%PDF-1.4\nQA CV\n%%EOF'], { type: 'application/pdf' })));
  objects.push(['resumes', cvPath]);
  ok(await student.from('student_profiles').update({ cv_url: cvPath, cv_file_name: 'qa.pdf' }).eq('user_id', studentId));
  assert.ok((await stranger.storage.from('resumes').createSignedUrl(cvPath, 60)).error);
  assert.ok((await company.storage.from('resumes').createSignedUrl(cvPath, 60)).error);
  assert.ok((await student.storage.from('resumes').upload(`${users[2]}/unauthorized.pdf`, new Blob(['x'], { type: 'application/pdf' }))).error);
  assert.ok((await student.storage.from('avatars').upload(`${studentId}/invalid.html`, new Blob(['x'], { type: 'text/html' }))).error);
  pass('Private CV upload, folder ownership, and MIME restrictions enforced');
  const application = ok(await student.from('applications').insert({ job_id: job.id, student_id: studentId, student_name: 'Forged', status: 'PENDING', cover_letter: 'QA application' }).select('*').single());
  assert.equal(application.student_name, 'QA Student');
  assert.equal(application.cv_url, cvPath);
  assert.ok((await student.from('applications').insert({ job_id: job.id, student_id: studentId })).error);
  assert.ok((await student.from('applications').insert({ job_id: expiredJob.id, student_id: studentId })).error);
  assert.ok((await company.from('applications').insert({ job_id: job.id, student_id: companyId })).error);
  pass('Application snapshots verified profile; duplicates, expired jobs, company applications denied');
  assert.equal(ok(await stranger.from('applications').select('*')).length, 0);
  assert.equal(ok(await stranger.from('student_profiles').select('*').eq('user_id', studentId)).length, 0);
  assert.equal(ok(await company.from('student_profiles').select('*').eq('user_id', studentId)).length, 1);
  const signed = ok(await company.storage.from('resumes').createSignedUrl(cvPath, 60));
  assert.equal((await fetch(signed.signedUrl)).status, 200);
  assert.ok((await stranger.storage.from('resumes').createSignedUrl(cvPath, 60)).error);
  pass('Only receiving company can read applicant profile and signed CV');
  assert.equal(ok(await student.from('applications').update({ status: 'ACCEPTED' }).eq('id', application.id).select()).length, 0);
  assert.equal(ok(await stranger.from('applications').update({ status: 'ACCEPTED' }).eq('id', application.id).select()).length, 0);
  assert.ok((await company.from('applications').update({ student_name: 'Altered' }).eq('id', application.id)).error);
  ok(await company.from('applications').update({ status: 'ACCEPTED' }).eq('id', application.id));
  assert.equal(ok(await student.from('applications').select('status').eq('id', application.id).single()).status, 'ACCEPTED');
  pass('Only receiving company changes status; applicant data is immutable');
  const oldSession = ok(await student.auth.getSession()).session;
  assert.ok(ok(await student.auth.refreshSession({ refresh_token: oldSession.refresh_token })).session);
  pass('Session refresh works');
  ok(await company.from('jobs').delete().eq('id', job.id));
  assert.equal(ok(await student.from('applications').select('id').eq('id', application.id)).length, 0);
  assert.ok((await company.storage.from('resumes').createSignedUrl(cvPath, 60)).error);
  pass('Job deletion removes applications and revokes company CV access');
  ok(await student.auth.signOut());
  assert.equal(ok(await student.auth.getSession()).session, null);
  pass('Sign out clears session');
} finally {
  for (const [bucket, path] of objects) ok(await admin.storage.from(bucket).remove([path]));
  for (const id of users) ok(await admin.auth.admin.deleteUser(id));
  console.log(`Cleaned up ${users.length} isolated QA accounts and ${objects.length} test files.`);
}
console.log(`${checks} backend checks passed.`);
