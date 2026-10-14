import { expect, test } from '@playwright/test';
import type { Locator, Page } from '@playwright/test';
import { curriculumLevels } from '../src/game/levels/curriculum';
import { curriculumSolutions } from '../src/game/levels/__tests__/solutions';
import { PROGRESS_KEY } from '../src/stores/progress-store';
import type { CommandType, Program } from '../src/game/types';
import { setRepeatCount } from './repeat-counter';

const labels: Record<CommandType, string> = { forward: 'Maju', 'turn-left': 'Kiri', 'turn-right': 'Kanan', repeat: 'Ulangi' };
const button = (page: Page, name: string) => page.getByRole('button', { name, exact: true });
type Press = (control: Locator) => Promise<void>;

async function replaceProgram(page: Page, starter: Program, solution: Program, press: Press) {
  for (let index = starter.length - 1; index >= 0; index--) {
    const command = starter[index];
    const label = command.type === 'repeat' ? `Ulangi ${index + 1}` : `perintah ${index + 1}: ${labels[command.type]}`;
    await press(button(page, `Pilih ${label}`));
    await press(button(page, `Hapus ${label}`));
  }
  for (const [index, command] of solution.entries()) {
    await press(button(page, `Tambah di posisi ${index + 1}`));
    await press(button(page, `Tambah ${labels[command.type]}`));
    if (command.type === 'repeat') {
      await press(button(page, `Pilih Ulangi ${index + 1}`));
      await setRepeatCount(page, index, command.count, press);
      await press(button(page, `Tambah di posisi 1 dalam Ulangi ${index + 1}`));
      for (const child of command.commands) await press(button(page, `Tambah ${labels[child.type]} ke Ulangi ${index + 1}`));
    }
  }
}

test('new player completes all 16 stages through real navigation, editing, reload and final screen', async ({ page }, info) => {
  test.setTimeout(600_000);
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  const press: Press = control => info.project.name === 'mobile' ? control.tap() : control.click();
  await page.goto('/');
  await press(button(page, 'Mulai'));
  for (const [index, level] of curriculumLevels.entries()) {
    await expect(page.getByRole('region', { name: level.title, exact: true })).toBeVisible();
    await expect(page.locator('.board-scene')).toHaveAttribute('aria-busy', 'false');
    if (level.learning.phase === 'demonstration') {
      await expect(page.locator('.lesson-scaffold')).toHaveAttribute('data-demo-phase', 'done', { timeout: 35000 });
    } else {
      await replaceProgram(page, level.initialProgram, curriculumSolutions[level.id], press);
      await press(button(page, 'Jalankan'));
    }
    await expect(page.locator('.feedback')).toHaveAttribute('data-status', 'completed');
    await expect.poll(() => page.evaluate(key => JSON.parse(localStorage.getItem(key)!).completedLevelIds.length, PROGRESS_KEY)).toBe(index + 1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    if (index === 1) {
      await press(button(page, 'Ekspedisi'));
      await expect(page.locator('.stage-node').nth(1)).toHaveAttribute('data-node-state', 'completed');
      await expect(page.locator('.stage-node').nth(2)).toHaveAttribute('data-node-state', 'current');
      await page.screenshot({ path: `.verification/m3-${info.project.name}-unlocked.png`, fullPage: true });
      await press(page.locator('.stage-node').nth(2));
    } else if (index === 10) {
      await page.reload();
      await press(button(page, 'Lanjutkan'));
    } else if (index < curriculumLevels.length - 1) {
      await press(button(page, 'Lanjut'));
    }
  }
  await press(button(page, 'Selesai'));
  await expect(page.getByRole('heading', { name: 'Ekspedisi selesai!' })).toBeFocused();
  await expect(page.getByText('16 dari 16 tahap selesai.', { exact: true })).toBeVisible();
  await page.screenshot({ path: `.verification/m3-${info.project.name}-final.png`, fullPage: true });
  await press(button(page, 'Lihat ekspedisi'));
  await expect(page.locator('[data-node-state="completed"]')).toHaveCount(16);
  await page.reload();
  await press(button(page, 'Ekspedisi'));
  await expect(page.locator('[data-node-state="completed"]')).toHaveCount(16);
  await press(page.locator('.stage-node').nth(15));
  await expect(page.locator('.feedback')).toHaveAttribute('data-actions', '0');
  await expect(page.locator('.command-block, .repeat-wrapper')).toHaveCount(0);
  expect(errors).toEqual([]);
});

test('entry and expedition fit 1440, 390 and 320 widths with keyboard, text zoom and reduced motion', async ({ page }, info) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  for (const [width, height] of [[1440, 900], [390, 844], [320, 740]]) {
    await page.setViewportSize({ width, height });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.screenshot({ path: `.verification/m3-${info.project.name}-title-${width}.png`, fullPage: true });
  }
  await button(page, 'Ekspedisi').focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('heading', { name: 'Ekspedisi', exact: true })).toBeFocused();
  await page.addStyleTag({ content: 'html { font-size: 200%; }' });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  for (const control of await page.locator('button:visible, summary:visible').all()) {
    const box = await control.boundingBox();
    expect(box!.width).toBeGreaterThanOrEqual(44);
    expect(box!.height).toBeGreaterThanOrEqual(44);
  }
  await page.getByText('Progres', { exact: true }).focus();
  await page.keyboard.press('Enter');
  await button(page, 'Mulai dari awal').click();
  await expect(button(page, 'Batal')).toBeFocused();
  await expect(button(page, 'Batal')).toBeInViewport();
  await page.keyboard.press('Escape');
  await expect(page.locator('.progress-options')).not.toHaveAttribute('open', '');
  await expect(page.getByText('Progres', { exact: true })).toBeFocused();
  await page.screenshot({ path: `.verification/m3-${info.project.name}-map-320-zoom.png`, fullPage: true });
});

test('leaving a running puzzle cannot advance a new stage or persist its runtime', async ({ page }) => {
  await page.goto('/');
  await button(page, 'Mulai').click();
  await page.locator('summary').click();
  await button(page, 'Lewati contoh').click();
  await button(page, 'Lanjut').click();
  await button(page, 'Tambah Maju').click();
  await button(page, 'Jalankan').click();
  await button(page, 'Ekspedisi').click();
  await page.waitForTimeout(1400);
  await expect(page.locator('.stage-node').nth(1)).toHaveAttribute('data-node-state', 'current');
  await expect(page.locator('.stage-node').nth(2)).toBeDisabled();
  await page.locator('.stage-node').nth(1).click();
  await expect(page.locator('.feedback')).toHaveAttribute('data-actions', '0');
  await expect(page.locator('.feedback')).toHaveAttribute('data-status', 'idle');
});
