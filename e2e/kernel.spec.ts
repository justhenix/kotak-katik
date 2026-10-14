import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';

const add = (page: Page) => page.getByRole('button', { name: 'Tambah Maju', exact: true });
const active = (page: Page) => page.locator('.program-list [aria-current="step"]');
const feedback = (page: Page) => page.locator('.feedback');

test('M0 desktop/mobile smoke: Forward, Step, Run again, Clear, invalid-tile stop', async ({ page }, testInfo) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  await page.goto('/?fixture=kernel');
  await expect(page.locator('canvas')).toBeVisible();
  await expect(page.getByText('Menyiapkan papan…')).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Jalankan', exact: true })).toBeDisabled();
  await expect(page.getByRole('button', { name: 'Coba lagi', exact: true })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Reset papan', exact: true })).toHaveCount(0);
  await expect(page.locator('.controls-area button')).toHaveCount(2);
  await expect(page.getByRole('button', { name: 'Hapus semua', exact: true })).toBeDisabled();
  if (testInfo.project.name === 'desktop') {
    const play = await page.getByRole('button', { name: 'Jalankan', exact: true }).boundingBox();
    const step = await page.getByRole('button', { name: 'Satu langkah', exact: true }).boundingBox();
    const trash = await page.getByRole('button', { name: 'Hapus semua', exact: true }).boundingBox();
    expect(play?.width).toBe(104);
    expect(play!.x + play!.width).toBeLessThan(step!.x);
    expect(step?.width).toBe(88);
    expect(step?.height).toBe(88);
    expect(trash?.width).toBe(70);
  } else {
    const play = await page.getByRole('button', { name: 'Jalankan', exact: true }).boundingBox();
    const step = await page.getByRole('button', { name: 'Satu langkah', exact: true }).boundingBox();
    const trash = await page.getByRole('button', { name: 'Hapus semua', exact: true }).boundingBox();
    expect(step?.x).toBeGreaterThan(play!.x + play!.width);
    expect(step?.y).toBe(play?.y);
    expect(play!.width).toBeGreaterThan(step!.width);
    await expect(page.locator('.run-label')).toBeVisible();
    expect(trash?.width).toBe(48);
  }
  await page.screenshot({ path: `.verification/${testInfo.project.name}-initial.png`, fullPage: true });

  // R3F's canvas can be a tab stop; follow the real focus order to the first control.
  for (let i = 0; i < 6 && !(await add(page).evaluate((button) => button === document.activeElement)); i++) {
    await page.keyboard.press('Tab');
  }
  await expect(add(page)).toBeFocused();
  await page.keyboard.press('Enter');
  await add(page).click();
  await page.getByRole('button', { name: 'Satu langkah', exact: true }).click();
  await expect(feedback(page)).toHaveAttribute('data-status', 'paused');
  await expect(active(page)).toHaveAttribute('aria-label', 'Pilih perintah 1: Maju');
  await expect(page.getByLabel('0 dari 1 ikan terkumpul')).toBeVisible();
  await page.getByRole('button', { name: 'Pilih perintah 1: Maju', exact: true }).click();
  await expect(feedback(page)).toHaveAttribute('data-status', 'idle');
  await expect(feedback(page)).toHaveAttribute('data-actions', '0');
  await expect(feedback(page)).toHaveAttribute('data-x', '0');
  await expect(page.locator('.program-list li')).toHaveCount(2);
  await expect(page.getByLabel('0 dari 1 ikan terkumpul')).toBeVisible();
  await page.getByRole('button', { name: 'Satu langkah', exact: true }).click();
  await expect(feedback(page)).toHaveAttribute('data-status', 'paused');
  await page.getByRole('button', { name: 'Satu langkah', exact: true }).click();
  await expect(feedback(page)).toHaveAttribute('data-status', 'completed');
  await expect(page.getByLabel('1 dari 1 ikan terkumpul')).toBeVisible();
  await page.waitForTimeout(300);
  await page.screenshot({ path: `.verification/${testInfo.project.name}-completed.png`, fullPage: true });

  const completedReplay = page.waitForFunction(() => document.querySelector('.feedback')?.getAttribute('data-status') === 'running', undefined, { polling: 'raf' });
  await page.getByRole('button', { name: 'Jalankan lagi', exact: true }).click();
  await completedReplay;
  await expect(feedback(page)).toHaveAttribute('data-status', 'completed');
  await expect(feedback(page)).toHaveAttribute('data-actions', '2');
  await expect(page.getByLabel('1 dari 1 ikan terkumpul')).toBeVisible();
  await expect(page.locator('.program-list li')).toHaveCount(2);
  await expect(feedback(page)).toHaveAttribute('data-status', 'completed');
  await page.getByRole('button', { name: 'Pilih perintah 2: Maju', exact: true }).click();
  await page.getByRole('button', { name: 'Hapus perintah 2: Maju', exact: true }).click();
  await expect(feedback(page)).toHaveAttribute('data-status', 'idle');
  await expect(page.getByLabel('0 dari 1 ikan terkumpul')).toBeVisible();
  await page.getByRole('button', { name: 'Jalankan', exact: true }).click();
  await expect(feedback(page)).toHaveAttribute('data-status', 'finished');
  await expect(page.getByText('Masih ada ikan.', { exact: true })).toBeVisible();
  await add(page).click();
  await add(page).click();
  await page.getByRole('button', { name: 'Jalankan', exact: true }).click();
  await expect(feedback(page)).toHaveAttribute('data-status', 'failed');
  await expect(page.getByText('Jalan habis. Ubah urutanmu.')).toBeVisible();
  await expect(active(page)).toHaveAttribute('aria-label', 'Pilih perintah 3: Maju');
  await page.screenshot({ path: `.verification/${testInfo.project.name}-invalid-tile.png`, fullPage: true });
  const failedActions = await feedback(page).getAttribute('data-actions');
  const failedReplay = page.waitForFunction(() => document.querySelector('.feedback')?.getAttribute('data-status') === 'running', undefined, { polling: 'raf' });
  await page.getByRole('button', { name: 'Jalankan lagi', exact: true }).click();
  await failedReplay;
  await expect(feedback(page)).toHaveAttribute('data-status', 'failed', { timeout: 5000 });
  await expect(feedback(page)).toHaveAttribute('data-actions', failedActions!);
  await page.getByRole('button', { name: 'Hapus semua', exact: true }).click();
  await expect(page.getByText('Ketuk perintah di bawah.', { exact: true })).toHaveCount(0);

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
  for (const button of await page.locator('.palette-area button, .controls-area button, .delete-program-button').all()) {
    const box = await button.boundingBox();
    expect(box!.x + box!.width).toBeLessThanOrEqual(page.viewportSize()!.width);
    expect(await button.evaluate((element) => {
      const bounds = element.getBoundingClientRect();
      return [...element.querySelectorAll('span')].filter((label) => getComputedStyle(label).display !== 'none').every((label) => {
        const text = label.getBoundingClientRect();
        return text.left >= bounds.left && text.right <= bounds.right;
      });
    })).toBe(true);
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(await page.evaluate(() => innerWidth));
  await page.screenshot({ path: `.verification/${testInfo.project.name}-text-zoom.png`, fullPage: true });
  expect(errors).toEqual([]);
});
