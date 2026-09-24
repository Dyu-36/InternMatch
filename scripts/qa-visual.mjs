import { chromium, expect } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

const base = process.env.BASE_URL || 'http://localhost:3000';
await mkdir('qa-artifacts', { recursive: true });
const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await page.goto(base);
  const cta = page.getByRole('main').getByRole('link', { name: 'Đăng tin tuyển dụng', exact: true });
  const colors = await cta.evaluate(element => ({ color: getComputedStyle(element).color, background: getComputedStyle(element).backgroundColor }));
  expect(colors.color).not.toBe(colors.background);
  const original = colors.background;
  await cta.hover();
  await expect.poll(() => cta.evaluate(element => getComputedStyle(element).backgroundColor)).not.toBe(original);
  await page.keyboard.press('Tab');
  const outline = await page.evaluate(() => getComputedStyle(document.activeElement).outlineStyle);
  expect(outline).not.toBe('none');
  await page.screenshot({ path: 'qa-artifacts/final-desktop-home.png', fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole('button', { name: 'Mở menu' }).click();
  await expect(page.getByRole('link', { name: 'Đăng nhập', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Change language' }).click();
  await expect(page.getByRole('link', { name: 'Sign in', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Close menu' }).click();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.screenshot({ path: 'qa-artifacts/final-mobile-home-en.png', fullPage: true });
  await page.goto(base + '/login');
  await page.locator('input[name=username]').fill('qa_nonexistent_user');
  await page.locator('input[name=password]').fill('invalid_qa_password');
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await expect(page.locator('button[type=submit]')).toBeDisabled();
  await expect(page.locator('p[role=alert]')).toContainText('Incorrect username', { timeout: 20000 });
  console.log('PASS CTA contrast, hover, keyboard focus, mobile menu, English layout, disabled submission and login error');
} finally { await browser.close(); }
