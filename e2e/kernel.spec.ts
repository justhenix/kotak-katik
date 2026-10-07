import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';

const add = (page: Page) => page.getByRole('button', { name: 'Tambah Maju', exact: true });
const active = (page: Page) => page.locator('.program-list [aria-current="step"]');
const feedback = (page: Page) => page.locator('.feedback');

test('M0 desktop/mobile smoke: Forward, Step, Run, Retry, Reset, invalid-tile stop', async ({ page }, testInfo) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  await page.goto('/');
  await expect(page.locator('canvas')).toBeVisible();
  await expect(page.getByText('Menyiapkan papan…')).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Jalankan', exact: true })).toBeDisabled();
  await page.screenshot({ path: `.verification/${testInfo.project.name}-initial.png`, fullPage: true });

  // R3F's canvas can be a tab stop; follow the real focus order to the first control.
  for (let i = 0; i < 3 && !(await add(page).evaluate((button) => button === document.activeElement)); i++) {
    await page.keyboard.press('Tab');
  }
  await expect(add(page)).toBeFocused();
  await page.keyboard.press('Enter');
  await add(page).click();
  await page.getByRole('button', { name: 'Satu langkah', exact: true }).click();
  await expect(feedback(page)).toHaveAttribute('data-status', 'paused');
  await expect(active(page)).toHaveAttribute('aria-label', 'Hapus perintah 1: Maju');
  await expect(page.getByLabel('0 dari 1 ikan terkumpul')).toBeVisible();
  await page.getByRole('button', { name: 'Satu langkah', exact: true }).click();
  await expect(feedback(page)).toHaveAttribute('data-status', 'completed');
  await expect(page.getByLabel('1 dari 1 ikan terkumpul')).toBeVisible();
  await page.waitForTimeout(300);
  await page.screenshot({ path: `.verification/${testInfo.project.name}-completed.png`, fullPage: true });

  await page.getByRole('button', { name: 'Coba lagi', exact: true }).click();
  await expect(page.getByLabel('0 dari 1 ikan terkumpul')).toBeVisible();
  await expect(add(page)).toBeDisabled();
  await expect(page.getByRole('button', { name: 'Satu langkah', exact: true })).toBeDisabled();
  await expect(page.locator('.program-list li')).toHaveCount(2);
  await expect(feedback(page)).toHaveAttribute('data-status', 'completed');
  await page.getByRole('button', { name: 'Hapus perintah 2: Maju', exact: true }).click();
  await expect(feedback(page)).toHaveAttribute('data-status', 'idle');
  await expect(page.getByLabel('0 dari 1 ikan terkumpul')).toBeVisible();
  await page.getByRole('button', { name: 'Jalankan', exact: true }).click();
  await expect(feedback(page)).toHaveAttribute('data-status', 'finished');
  await expect(page.getByText('Masih ada ikan. Tambah perintah.')).toBeVisible();
  await add(page).click();
  await add(page).click();
  await page.getByRole('button', { name: 'Jalankan', exact: true }).click();
  await expect(feedback(page)).toHaveAttribute('data-status', 'failed');
  await expect(page.getByText('Tidak ada kotak di depan. Ubah urutanmu.')).toBeVisible();
  await expect(active(page)).toHaveAttribute('aria-label', 'Hapus perintah 3: Maju');
  await page.screenshot({ path: `.verification/${testInfo.project.name}-invalid-tile.png`, fullPage: true });
  await page.getByRole('button', { name: 'Hapus semua', exact: true }).click();
  await expect(page.getByText('Ketuk perintah di bawah.')).toBeVisible();

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await add(page).click();
  await add(page).click();
  await page.getByRole('button', { name: 'Jalankan', exact: true }).click();
  await expect(feedback(page)).toHaveAttribute('data-status', 'completed');
  await page.getByRole('button', { name: 'Jalankan lagi', exact: true }).click();
  await expect(feedback(page)).toHaveAttribute('data-status', 'completed');
  expect(await page.evaluate(() => document.querySelectorAll('audio,video').length)).toBe(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(await page.evaluate(() => innerWidth));
  for (const button of await page.getByRole('button').all()) {
    const box = await button.boundingBox();
    expect(box?.width).toBeGreaterThanOrEqual(44);
    expect(box?.height).toBeGreaterThanOrEqual(44);
  }
  await page.addStyleTag({ content: 'html { font-size: 200%; }' });
  await page.evaluate(() => document.fonts.ready);
  for (const button of await page.getByRole('button').all()) {
    const box = await button.boundingBox();
    expect(box!.x + box!.width).toBeLessThanOrEqual(await page.evaluate(() => innerWidth));
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(await page.evaluate(() => innerWidth));
  await page.screenshot({ path: `.verification/${testInfo.project.name}-text-zoom.png`, fullPage: true });
  expect(errors).toEqual([]);
});
