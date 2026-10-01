import { expect } from '@playwright/test';

// The caller supplies a signed-in profile with the required fields populated.
// Only invalid submissions happen here; the caller owns persistence checks.
export async function checkProfileInputs(page) {
  const skills = page.locator('#skills');
  const gpa = page.locator('#student-gpa');
  const goals = page.locator('#goals');
  const name = page.locator('#student-full-name');
  const major = page.locator('#student-major');
  const fields = [skills, gpa, goals, name, major];
  const original = await Promise.all(fields.map((field) => field.inputValue()));
  const save = page.getByRole('button', { name: 'Lưu hồ sơ', exact: true });
  try {
    await expect(page.getByLabel('Kỹ năng chuyên môn (cách nhau bởi dấu phẩy)', { exact: true })).toBeVisible();
    await skills.fill('');
    await skills.pressSequentially('React, TypeScript, giao tiep');
    await expect(skills).toHaveValue('React, TypeScript, giao tiep');
    await skills.press('Space');
    await expect(skills).toHaveValue('React, TypeScript, giao tiep ');
    await skills.press('Backspace');
    await expect(skills).toHaveValue('React, TypeScript, giao tiep');

    // Inserting/deleting near a separator must keep the caret in place.
    await skills.fill('React, TypeScript');
    await skills.evaluate((element) => element.setSelectionRange(5, 5));
    await skills.pressSequentially(' Native');
    await expect(skills).toHaveValue('React Native, TypeScript');
    expect(await skills.evaluate((element) => element.selectionStart)).toBe(12);
    await skills.press('Delete');
    await expect(skills).toHaveValue('React Native TypeScript');
    await skills.pressSequentially(',');
    await expect(skills).toHaveValue('React Native, TypeScript');
    await skills.evaluate((element) => element.setSelectionRange(14, 24));
    await skills.pressSequentially('SQL');
    await expect(skills).toHaveValue('React Native, SQL');

    const height = (await skills.boundingBox()).height;
    await skills.press('End');
    await skills.press('Enter');
    await page.keyboard.insertText('Giao tiếp');
    await expect(skills).toHaveValue('React Native, SQL\nGiao tiếp');
    expect((await skills.boundingBox()).height).toBe(height);
    await skills.press('Tab');
    await expect(goals).toBeFocused();

    // Insert a multiline paste and verify its whitespace remains untouched.
    await skills.fill('');
    await page.keyboard.insertText('  React,  TypeScript\n\nGiao tiếp, ');
    await expect(skills).toHaveValue('  React,  TypeScript\n\nGiao tiếp, ');
    const cdp = await page.context().newCDPSession(page);
    try {
      await skills.fill('React, ');
      await cdp.send('Input.imeSetComposition', { text: 'tie', selectionStart: 3, selectionEnd: 3 });
      await cdp.send('Input.imeSetComposition', { text: 'tiếng', selectionStart: 5, selectionEnd: 5 });
      await cdp.send('Input.insertText', { text: 'tiếng Việt' });
      await expect(skills).toHaveValue('React, tiếng Việt');
    } finally { await cdp.detach(); }

    for (const [field, text] of [[name, 'Nguyễn Văn An'], [major, 'Công nghệ thông tin']]) {
      await field.fill('');
      await page.keyboard.insertText(text);
      await field.press('Home');
      await field.pressSequentially('QA ');
      await expect(field).toHaveValue('QA ' + text);
      expect(await field.evaluate((element) => element.selectionStart)).toBe(3);
    }
    await goals.fill('Dòng một');
    await goals.press('End');
    await goals.press('Enter');
    await page.keyboard.insertText('Dòng hai');
    await expect(goals).toHaveValue('Dòng một\nDòng hai');

    await gpa.fill('');
    await gpa.pressSequentially('3.50');
    await expect(gpa).toHaveValue('3.50');
    for (const invalid of ['4.1', '-1', 'abc', '0x4', '1e0', '3,5,5', ' ']) {
      await gpa.fill(invalid);
      await save.click();
      await expect(page.locator('.student-profile-form').getByRole('alert')).toContainText('Vui lòng nhập GPA từ 0 đến 4');
      await expect(gpa).toHaveValue(invalid);
      await expect(skills).toHaveValue('React, tiếng Việt');
    }
    await gpa.fill('3,5');
    await skills.fill(' , \n, ');
    await save.click();
    await expect(page.locator('.student-profile-form').getByRole('alert')).toHaveText('Vui lòng nhập ít nhất một kỹ năng.');
    await expect(skills).toHaveValue(' , \n, ');
    await skills.fill('React');
    await name.fill('   ');
    await save.click();
    await expect(page.locator('.student-profile-form').getByRole('alert')).toHaveText('Vui lòng điền đủ thông tin bắt buộc.');
  } finally {
    for (let index = 0; index < fields.length; index++) await fields[index].fill(original[index]);
  }
  console.log('PASS profile typing, spaces, caret, deletion, selection, newlines, paste, IME and validation');
}
