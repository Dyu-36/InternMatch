import { chromium, expect } from '@playwright/test';

// Run against `pnpm dev`: React reports attribute mismatches in development.
const base = process.env.BASE_URL || 'http://localhost:3000';
const browser = await chromium.launch({ headless: true });

try {
  for (const attribute of [null, 'bis_skin_checked', 'data-unexpected-hydration-test']) {
    for (const locale of ['vi', 'en']) {
      const context = await browser.newContext();
      try {
        await context.addCookies([{ name: 'internmatch_locale', value: locale, url: base }]);
        const page = await context.newPage();
        const errors = [];
        page.on('console', message => {
          if (message.type() === 'error') errors.push(message.text());
        });
        page.on('pageerror', error => errors.push(error.message));

        if (attribute) {
          // Reproduce an extension changing the DOM before React sees the HTML.
          await page.addInitScript(attributeName => {
            const seen = new WeakSet();
            const annotate = element => {
              if (seen.has(element)) return;
              seen.add(element);
              element.setAttribute(attributeName, '1');
            };
            const observer = new MutationObserver(records => {
              for (const record of records) {
                for (const node of record.addedNodes) {
                  if (!(node instanceof Element)) continue;
                  if (node.matches('div')) annotate(node);
                  node.querySelectorAll('div').forEach(annotate);
                }
              }
            });
            observer.observe(document, { childList: true, subtree: true });
            document.addEventListener('DOMContentLoaded', () => observer.disconnect(), { once: true });
          }, attribute);
        }

        await page.goto(base + '/');
        await expect(page.locator('html')).toHaveAttribute('lang', locale);
        // A working language toggle proves the page has hydrated.
        await page.getByRole('button', { name: /Đổi ngôn ngữ|Change language/ }).click();
        await expect(page.locator('html')).toHaveAttribute('lang', locale === 'vi' ? 'en' : 'vi');

        if (attribute === 'data-unexpected-hydration-test') {
          expect(errors.some(error => /hydrated|hydration/i.test(error))).toBe(true);
          await expect(page.locator(`[${attribute}]`).first()).toBeAttached();
        } else {
          expect(errors, `${locale}: ${attribute || 'clean HTML'}`).toEqual([]);
          await expect(page.locator('[bis_skin_checked]')).toHaveCount(0);
        }
        console.log(`PASS ${locale}: ${attribute || 'clean HTML'}`);
      } finally {
        await context.close();
      }
    }
  }
} finally {
  await browser.close();
}
