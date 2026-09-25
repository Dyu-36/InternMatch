import { chromium, expect as baseExpect } from '@playwright/test';
import { createClient } from '@supabase/supabase-js';
import { mkdir } from 'node:fs/promises';

const base = process.env.BASE_URL || 'http://localhost:3000';
const expect = baseExpect.configure({ timeout: 60000 });
const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_TEST_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
const stamp = `ui_${Date.now()}`;
const password = `Ui!${crypto.randomUUID()}`;
const emails = [`${stamp}-company@example.com`, `${stamp}-student@example.com`];
const missingEmail = `${stamp}-missing@example.com`;
const displayNames = [`QA Company ${stamp}`, `QA Student ${stamp}`];
const errors = [];
const storageFailures = [];
const browser = await chromium.launch({ headless: true });
const companyContext = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
const studentContext = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
const company = await companyContext.newPage(), student = await studentContext.newPage();
for (const page of [company, student]) {
  page.setDefaultTimeout(60000);
  page.on('pageerror', error => errors.push(error.message));
  page.on('response', async response => {
    if (!response.url().includes('/storage/v1/object') || response.status() < 400) return;
    const body = await response.json().catch(() => ({}));
    const url = new URL(response.url());
    storageFailures.push({ host: url.host, bucket: url.pathname.split('/')[4], status: response.status(), code: body.code ?? body.error, message: body.message });
  });
}
await mkdir('qa-artifacts', { recursive: true });
async function register(page, email, displayName, role) {
  await page.goto(`${base}/register?role=${role}`);
  await page.locator('input[name=displayName]').fill(displayName);
  await page.locator('input[name=email]').fill(email);
  await page.locator('input[name=password]').fill(password);
  await page.locator('input[name=confirmPassword]').fill(password);
  await page.getByRole('button', { name: 'Tạo tài khoản', exact: true }).click();
  await expect(page).toHaveURL(new RegExp(`/${role === 'COMPANY' ? 'company' : 'student'}/profile`));
  await expect(page.getByLabel(role === 'COMPANY' ? 'Tên doanh nghiệp' : 'Họ và tên', { exact: true })).toHaveValue(displayName);
}
async function fill(page, label, value) { await page.getByLabel(label, { exact: false }).fill(value); }
async function requestGenericReset(page, email) {
  await page.goto(`${base}/forgot-password`);
  await page.locator('input[name=email]').fill(email);
  await page.getByRole('button', { name: /Gửi liên kết đặt lại|Send reset link/, exact: true }).click();
  const heading = page.getByRole('heading', { name: /Đã gửi liên kết đặt lại mật khẩu|Reset link sent/, exact: true });
  await expect(heading).toBeVisible();
  return heading.innerText();
}
async function snapshot(page, name) {
  await page.screenshot({ path: `qa-artifacts/${name}.png`, fullPage: true });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
  expect(overflow, `Horizontal overflow on ${name}`).toBe(false);
}
const tinyPng = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jWZkAAAAASUVORK5CYII=', 'base64');
try {
  await company.goto(`${base}/login`);
  await company.getByRole('button', { name: 'Đăng nhập', exact: true }).click();
  await expect(company.locator('p[role=alert].rounded-md')).toContainText('Vui lòng nhập');
  await company.getByRole('button', { name: /Đổi ngôn ngữ|Change language/ }).click();
  await expect(company.getByRole('heading', { name: 'Sign in', exact: true })).toBeVisible();
  await company.reload();
  await expect(company.locator('html')).toHaveAttribute('lang', 'en');
  await company.getByRole('button', { name: /Đổi ngôn ngữ|Change language/ }).click();
  await register(company, emails[0], displayNames[0], 'COMPANY');
  for (const [selector, value] of [['#company-name', 'QA InternMatch Company'], ['#company-tax-code', '0123456789'], ['#company-industry', 'Technology'], ['#company-size', '50–200'], ['#company-email', 'qa@example.com'], ['#company-hotline', '0901234567'], ['#company-address', '1 QA Street'], ['#company-city', 'Hà Nội'], ['#company-website', 'https://example.com'], ['#company-description', 'Company created for automated QA.']]) { const field = company.locator(selector); await field.fill(value); await expect(field).toHaveValue(value); }
  await company.locator('input[type=file]').setInputFiles({ name: 'logo.png', mimeType: 'image/png', buffer: tinyPng });
  await company.getByRole('button', { name: 'Lưu hồ sơ' }).click();
  await expect(company.getByText('Đã lưu thông tin doanh nghiệp.')).toBeVisible();
  await company.reload();
  await expect(company.getByLabel('Tên doanh nghiệp')).toHaveValue('QA InternMatch Company');
  await company.goto(`${base}/company/jobs/create`);
  for (const [label, value] of [['Tiêu đề tuyển dụng', `${stamp} Frontend Intern`], ['Ngành nghề', 'Technology'], ['Địa điểm làm việc', 'Hà Nội'], ['Trợ cấp tối thiểu', '2000000'], ['Trợ cấp tối đa', '4000000'], ['Số lượng tuyển', '2'], ['Kỹ năng yêu cầu', 'React, TypeScript'], ['Mô tả công việc', 'Build accessible interfaces.'], ['Yêu cầu ứng viên', 'React and TypeScript fundamentals.'], ['Quyền lợi & đào tạo', 'Mentoring and internship allowance.']]) await fill(company, label, value);
  await company.getByLabel('Đánh dấu tin nổi bật').check();
  await company.getByRole('button', { name: 'Xuất bản tin' }).click();
  await expect(company).toHaveURL(/\/company\/dashboard/);
  await expect(company.getByRole('heading', { name: `${stamp} Frontend Intern` })).toBeVisible();
  const editHref = await company.getByRole('link', { name: 'Sửa', exact: true }).getAttribute('href');
  const jobId = editHref.split('/').pop();
  await company.goto(`${base}${editHref}`);
  await expect(company.getByLabel('Tiêu đề tuyển dụng')).toHaveValue(`${stamp} Frontend Intern`);
  await fill(company, 'Tiêu đề tuyển dụng', `${stamp} React Intern`);
  await company.getByRole('button', { name: 'Lưu thay đổi' }).click();
  await expect(company).toHaveURL(/\/company\/dashboard/);
  console.log('PASS company registration, logo upload, profile persistence, job creation and editing');

  await register(student, emails[1], displayNames[1], 'STUDENT');
  for (const [label, value] of [['Họ và tên', 'QA Student'], ['Chuyên ngành', 'Computer Science'], ['Điểm GPA', '3.5'], ['Kỹ năng chuyên môn', 'React, TypeScript'], ['Mục tiêu & Giới thiệu', 'Looking for a frontend internship.']]) await fill(student, label, value);
  const university = student.getByRole('combobox', { name: 'Trường Đại học / Viện đào tạo' });
  await expect(university).toHaveCSS('background-color', 'rgb(255, 255, 255)');
  await university.click();
  await expect(university).toHaveCSS('background-color', 'rgb(255, 255, 255)');
  await expect(student.getByRole('option').filter({ hasText: 'hust.edu.vn' })).toBeVisible();
  await expect(student.getByRole('option').filter({ hasText: 'ftu.edu.vn' })).toBeVisible();
  const schoolSearch = student.getByPlaceholder('Gõ tên trường để tìm...');
  const directoryResponse = await student.request.get(`${base}/api/schools`);
  expect(directoryResponse.ok()).toBe(true);
  const directory = await directoryResponse.json();
  expect(directory.length).toBeGreaterThan(300);
  await expect(student.getByRole('option')).toHaveCount(directory.length);
  await expect(student.getByText(`Số trường tìm thấy: ${directory.length}`, { exact: true })).toBeVisible();
  await expect(schoolSearch).toBeFocused();
  await expect(schoolSearch).toHaveCSS('outline-style', 'none');
  const schoolList = student.locator('[data-slot=command-list]');
  async function expectLastSchoolReachable() {
    await schoolSearch.press('End');
    const lastSchool = student.getByRole('option').last();
    await expect(lastSchool).toHaveAttribute('data-selected', 'true');
    await expect.poll(async () => {
      const [list, last] = await Promise.all([schoolList.boundingBox(), lastSchool.boundingBox()]);
      return last.y >= list.y - 1 && last.y + last.height <= list.y + list.height + 1;
    }).toBe(true);
    await expect.poll(() => schoolList.evaluate((element) => element.scrollTop)).toBeGreaterThan(0);
  }
  await schoolList.hover();
  await student.mouse.wheel(0, 100000);
  await expectLastSchoolReachable();
  await snapshot(student, 'school-picker-full-directory');
  await schoolSearch.press('Home');
  await schoolSearch.fill('HPU');
  await expect(student.getByRole('option').filter({ hasText: 'Trường Đại học Hải Phòng' })).toBeVisible();
  await expect(student.getByRole('option').filter({ hasText: 'Trường Đại học Kiểm sát Hà Nội' })).toBeVisible();
  for (const [query, domain] of [['HUST', 'hust.edu.vn'], ['FTU', 'ftu.edu.vn'], ['Ngoại thương', 'ftu.edu.vn'], ['bach khoa', 'hust.edu.vn']]) {
    await schoolSearch.fill(query);
    await expect(student.getByRole('option').filter({ hasText: domain })).toBeVisible();
  }
  await schoolSearch.fill('zz_nonexistent_university');
  await expect(student.getByRole('option')).toHaveCount(0);
  await expect(student.getByText('Không tìm thấy trường phù hợp.')).toBeVisible();
  await schoolSearch.fill('Bách khoa');
  await expect(student.getByRole('option').filter({ hasText: 'hust.edu.vn' })).toBeVisible();
  await snapshot(student, 'school-picker-open');
  await schoolSearch.fill('');
  await expect(student.getByRole('option').filter({ hasText: 'hust.edu.vn' })).toBeVisible();
  await student.setViewportSize({ width: 513, height: 429 });
  await university.scrollIntoViewIfNeeded();
  const schoolPopover = student.locator('[data-slot=popover-content]');
  await student.waitForTimeout(100);
  const [compactTriggerBox, compactPopoverBox] = await Promise.all([university.boundingBox(), schoolPopover.boundingBox()]);
  const compactLayout = {
    trigger: compactTriggerBox,
    popover: compactPopoverBox,
    viewport: student.viewportSize(),
  };
  expect(compactPopoverBox.y, JSON.stringify(compactLayout)).toBeGreaterThanOrEqual(0);
  expect(compactPopoverBox.y + compactPopoverBox.height, JSON.stringify(compactLayout)).toBeLessThanOrEqual(429);
  expect(
    compactPopoverBox.y + compactPopoverBox.height <= compactTriggerBox.y + 1 || compactPopoverBox.y >= compactTriggerBox.y + compactTriggerBox.height - 1,
    JSON.stringify(compactLayout),
  ).toBe(true);
  await expect(student.getByRole('option')).toHaveCount(directory.length);
  await expectLastSchoolReachable();
  await snapshot(student, 'school-picker-compact-directory');
  await schoolSearch.fill('Bách khoa');
  await expect(student.getByRole('option').filter({ hasText: 'hust.edu.vn' })).toBeVisible();
  await student.getByRole('option').filter({ hasText: 'hust.edu.vn' }).click();
  await student.setViewportSize({ width: 1440, height: 1000 });
  await expect(university).toHaveCSS('background-color', 'rgb(255, 255, 255)');
  const universityName = await university.innerText();
  const studentFiles = student.locator('input[type=file]');
  await studentFiles.nth(0).setInputFiles({ name: 'avatar.png', mimeType: 'image/png', buffer: tinyPng });
  await studentFiles.nth(1).setInputFiles({ name: 'qa-resume.pdf', mimeType: 'application/pdf', buffer: Buffer.from('%PDF-1.4\nQA CV\n%%EOF') });
  await student.getByRole('button', { name: 'Lưu hồ sơ' }).click();
  await expect(student.getByRole('status')).toContainText('Đã lưu hồ sơ');
  await student.reload();
  await expect(student.getByLabel('Họ và tên')).toHaveValue('QA Student');
  await expect(university).toHaveText(universityName);
  await student.goto(`${base}/jobs?q=${stamp}`);
  await expect(student.getByRole('heading', { name: `${stamp} React Intern` })).toBeVisible();
  await student.getByPlaceholder('Vị trí, công ty hoặc kỹ năng').fill('no_such_job_qa');
  await expect(student.getByText('Chưa tìm thấy vị trí phù hợp')).toBeVisible();
  await student.goto(`${base}/jobs/${jobId}`);
  await student.getByLabel('Lời nhắn cho doanh nghiệp').fill('QA application from a student.');
  await student.getByRole('button', { name: 'Ứng tuyển ngay' }).click();
  await expect(student.getByRole('status')).toContainText('Đã ứng tuyển');
  await student.reload();
  await expect(student.getByRole('status')).toContainText('Đã ứng tuyển');
  console.log('PASS student registration, avatar/CV upload, search, application and reload persistence');

  await company.goto(`${base}/company/dashboard`);
  await expect(company.getByRole('heading', { name: 'QA Student', exact: true })).toBeVisible();
  await company.getByRole('button', { name: 'Xem qa-resume.pdf' }).click();
  const cv = company.getByRole('link', { name: 'Mở qa-resume.pdf' });
  await expect(cv).toBeVisible();
  const cvResponse = await company.request.get(await cv.getAttribute('href'));
  expect(cvResponse.status()).toBe(200);
  await company.getByLabel('Trạng thái hồ sơ của QA Student').click();
  await company.getByRole('option', { name: 'Đã nhận', exact: true }).click();
  await expect(company.locator('.company-candidate').filter({ hasText: 'QA Student' })).toContainText('Đã nhận');
  await student.goto(`${base}/student/dashboard`);
  await expect(student.getByText('Đã duyệt', { exact: true })).toBeVisible();
  await student.goto(`${base}/company/dashboard`);
  await expect(student).toHaveURL(/\/student\/dashboard/);
  console.log('PASS company CV access, acceptance, student status and role guard');

  for (const [width, label] of [[1440, 'desktop'], [768, 'tablet'], [390, 'mobile']]) {
    await company.setViewportSize({ width, height: 1000 });
    await student.setViewportSize({ width, height: 1000 });
    for (const [page, route, name] of [[company, '/company/profile', 'company-profile'], [company, '/company/dashboard', 'company-dashboard'], [company, '/company/jobs/create', 'job-create'], [company, editHref, 'job-edit'], [student, '/student/profile', 'student-profile'], [student, '/student/dashboard', 'student-dashboard'], [student, '/', 'home'], [student, '/jobs', 'jobs'], [student, `/jobs/${jobId}`, 'job-detail']]) {
      await page.goto(base + route); await snapshot(page, `${label}-${name}`);
    }
  }
  await student.setViewportSize({ width: 1440, height: 1000 });
  await student.getByRole('button', { name: /Đổi ngôn ngữ|Change language/ }).click();
  await student.goto(`${base}/student/profile`);
  await student.getByRole('combobox', { name: 'University / Training institute' }).click();
  await student.getByPlaceholder('Type a school name to search...').fill('FTU');
  await expect(student.getByRole('option').filter({ hasText: 'ftu.edu.vn' })).toBeVisible();
  await expect(student.getByPlaceholder('Type a school name to search...')).toHaveCSS('outline-style', 'none');
  await expect(student.getByText('Schools found:', { exact: false })).toBeVisible();
  await student.goto(`${base}/student/dashboard`);
  await expect(student.getByRole('heading', { name: 'Application history' })).toBeVisible();
  await snapshot(student, 'english-student-dashboard');
  await student.getByRole('button', { name: 'Sign out', exact: true }).click();
  await expect(student.getByRole('banner').getByRole('link', { name: 'Sign in', exact: true })).toBeVisible();
  await student.goto(`${base}/student/profile`);
  await expect(student).toHaveURL(/\/login\?next=/);
  const guardedLoginUrl = new URL(student.url());
  expect(guardedLoginUrl.pathname).toBe('/login');
  expect(guardedLoginUrl.searchParams.get('next')).toBe('/student/profile');
  const existingResetMessage = await requestGenericReset(student, emails[1]);
  const missingResetMessage = await requestGenericReset(student, missingEmail);
  expect(missingResetMessage).toBe(existingResetMessage);
  await student.goto(guardedLoginUrl.href);
  await student.locator('input[name=identifier]').fill(emails[1]);
  await student.locator('input[name=password]').fill(password);
  await student.getByRole('button', { name: /Đăng nhập|Sign in/, exact: true }).click();
  await expect(student).toHaveURL(/\/student\/profile/);
  await expect(student.getByRole('button', { name: /Đăng xuất|Sign out/, exact: true })).toBeVisible();
  expect(errors).toEqual([]);
  console.log('PASS responsive routes, bilingual UI, safe guards, generic recovery, email sign-in and zero browser errors');
} catch (error) {
  if (storageFailures.length) console.error('Storage failures:', storageFailures);
  await company.screenshot({ path: 'qa-artifacts/failure-company.png', fullPage: true });
  await student.screenshot({ path: 'qa-artifacts/failure-student.png', fullPage: true });
  throw error;
} finally {
  await browser.close();
  const { data } = await admin.auth.admin.listUsers({ perPage: 1000 });
  let cleanedAccounts = 0;
  const managedEmails = new Set(emails.map(email => email.toLowerCase()));
  for (const user of data.users.filter(user => managedEmails.has(user.email?.toLowerCase()))) {
    for (const bucket of ['avatars', 'company-logos', 'resumes']) {
      const { data: files } = await admin.storage.from(bucket).list(user.id);
      if (files?.length) await admin.storage.from(bucket).remove(files.map(file => `${user.id}/${file.name}`));
    }
    await admin.auth.admin.deleteUser(user.id);
    cleanedAccounts++;
  }
  console.log(`Cleaned up ${cleanedAccounts} UI test accounts and their files.`);
}
