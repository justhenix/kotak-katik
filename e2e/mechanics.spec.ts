import { expect, test } from '@playwright/test';
import type { Locator, Page } from '@playwright/test';
import type { RepeatCount } from '../src/game/types';
import { setRepeatCount } from './repeat-counter';

const button = (page: Page, name: string) => page.getByRole('button', { name, exact: true });
const feedback = (page: Page) => page.locator('.feedback');
const step = (page: Page) => button(page, 'Satu langkah');
async function setCount(page: Page, count: RepeatCount, index = 1) {
  await button(page, `Pilih Ulangi ${index}`).click();
  await setRepeatCount(page, index - 1, count);
  const length = await page.getByRole('list', { name: `Isi Ulangi ${index}`, exact: true }).locator('.command-block').count();
  await button(page, `Tambah di posisi ${length + 1} dalam Ulangi ${index}`).click();
}
const waitForTurn = (page: Page, expectedTurnCount?: number) => page.waitForFunction(
  (count) => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return false;
    if (canvas.dataset.catAnimation === 'turn') return true;
    if (count !== undefined) return Number(canvas.dataset.catTurns) >= count;
    return false;
  },
  expectedTurnCount,
  { polling: 'raf' }
);
const settledYaw = (page: Page, yaw: number) => page.waitForFunction((target) => {
  const canvas = document.querySelector('canvas');
  const current = Number(canvas?.dataset.catYaw);
  return canvas?.dataset.catAnimation !== 'turn' && Math.abs(Math.sin(current) - Math.sin(target)) < 0.0001 && Math.abs(Math.cos(current) - Math.cos(target)) < 0.0001;
}, yaw, { polling: 'raf' });

function watchErrors(page: Page) {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  return errors;
}

test('relative turning, every facing, cyan/orange cues, and reduced motion', async ({ page }, info) => {
  const errors = watchErrors(page);
  const press = (control: Locator) => info.project.name === 'mobile' ? control.tap() : control.click();
  await page.goto('/?fixture=turning');
  await expect(page.locator('.board-scene')).toHaveAttribute('aria-busy', 'false');
  await expect(button(page, 'Tambah Ulangi')).toHaveCount(0);
  expect(await button(page, 'Tambah Kiri').evaluate((element) => getComputedStyle(element).backgroundColor)).toBe('rgb(130, 214, 208)');
  expect(await button(page, 'Tambah Kanan').evaluate((element) => getComputedStyle(element).backgroundColor)).toBe('rgb(243, 174, 142)');
  for (const name of ['Kanan', 'Kanan', 'Kanan', 'Kanan', 'Kiri', 'Kiri', 'Kiri', 'Kiri']) await press(button(page, `Tambah ${name}`));
  const facings = ['south', 'west', 'north', 'east', 'north', 'west', 'south', 'east'];
  const yaws = [-Math.PI, Math.PI / 2, 0, -Math.PI / 2, 0, Math.PI / 2, -Math.PI, -Math.PI / 2];
  for (let i = 0; i < facings.length; i++) {
    const turning = waitForTurn(page, i + 1);
    await press(step(page));
    await turning;
    if (i === 0) await page.screenshot({ path: `.verification/${info.project.name}-m1-turn.png`, fullPage: true });
    await expect(feedback(page)).toHaveAttribute('data-orientation', facings[i]);
    await expect(feedback(page)).toHaveAttribute('data-x', '0');
    await expect(feedback(page)).toHaveAttribute('data-z', '0');
    await expect(page.locator('[aria-current="step"]')).toHaveAttribute('data-command-path', String(i));
    await settledYaw(page, yaws[i]);
    if (i < 4) await page.screenshot({ path: `.verification/${info.project.name}-m1-facing-${facings[i]}.png`, fullPage: true });
  }
  await expect(feedback(page)).toHaveAttribute('data-status', 'finished');
  await press(button(page, 'Hapus semua'));
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await press(button(page, 'Tambah Maju'));
  await press(button(page, 'Tambah Kiri'));
  await press(button(page, 'Tambah Maju'));
  await press(step(page)); await press(step(page));
  await expect(page.locator('canvas')).toHaveAttribute('data-cat-animation', 'static');
  await expect(page.locator('canvas')).toHaveAttribute('data-cat-yaw', '0');
  await press(step(page));
  await expect(feedback(page)).toHaveAttribute('data-status', 'completed');
  await expect(feedback(page)).toHaveAttribute('data-x', '1');
  await expect(feedback(page)).toHaveAttribute('data-z', '-1');
  await expect(page.getByLabel('1 dari 1 ikan terkumpul')).toBeVisible();
  expect(errors).toEqual([]);
});

for (const count of [2, 3, 4] as const) test(`${count}× Repeat: exact primitive Steps, iteration highlights, and Run parity`, async ({ page }, info) => {
  const errors = watchErrors(page);
  const press = (control: Locator) => info.project.name === 'mobile' ? control.tap() : control.click();
  await page.goto('/?fixture=loops');
  await expect(page.locator('.board-scene')).toHaveAttribute('aria-busy', 'false');
  await press(button(page, 'Tambah Ulangi'));
  await expect(button(page, 'Jalankan')).toBeDisabled();
  await setCount(page, count);
  await press(button(page, 'Tambah Maju ke Ulangi 1'));
  await press(button(page, 'Tambah Kanan ke Ulangi 1'));
  await expect(page.locator('.palette-area')).toHaveCount(1);
  await expect(page.locator('.palette-area').getByRole('button', { name: /Ulangi.*Ulangi/ })).toHaveCount(0);
  for (let action = 0; action < count * 2; action++) {
    await press(step(page));
    await expect(feedback(page)).toHaveAttribute('data-actions', String(action + 1));
    await expect(feedback(page)).toHaveAttribute('data-command-path', `0.${action % 2}`);
    await expect(feedback(page)).toHaveAttribute('data-loop-iteration', String(Math.floor(action / 2) + 1));
    await expect(page.locator('[aria-current="step"]')).toHaveAttribute('data-command-path', `0.${action % 2}`);
    await expect(page.locator('.loop-progress')).toHaveAttribute('aria-label', `Putaran ${Math.floor(action / 2) + 1} dari ${count}`);
    await expect(page.locator('.current-iteration')).toHaveText(String(Math.floor(action / 2) + 1));
    if (count === 4 && action === 2) await page.screenshot({ path: `.verification/${info.project.name}-m1-loop-highlight.png`, fullPage: true });
  }
  const logical = await feedback(page).evaluate((element) => ({ ...((element as HTMLElement).dataset) }));
  await expect(feedback(page)).toHaveAttribute('data-status', count === 2 ? 'finished' : 'completed');
  await expect(button(page, 'Coba lagi')).toHaveCount(0);
  const replayStarted = page.waitForFunction(() => document.querySelector('.feedback')?.getAttribute('data-status') === 'running', undefined, { polling: 'raf' });
  await press(button(page, 'Jalankan lagi'));
  await replayStarted;
  await expect(feedback(page)).toHaveAttribute('data-actions', String(count * 2), { timeout: 5000 });
  await expect(feedback(page)).toHaveAttribute('data-status', logical.status!);
  expect(await feedback(page).evaluate((element) => ({ ...((element as HTMLElement).dataset) }))).toEqual(logical);
  await press(button(page, 'Hapus semua'));
  await expect(page.locator('.repeat-item')).toHaveCount(0);
  await expect(page.getByLabel('0 dari 3 ikan terkumpul')).toBeVisible();
  expect(errors).toEqual([]);
});

test('leaves Repeat, highlights a top-level action, then enters another Repeat before completion', async ({ page }, info) => {
  const errors = watchErrors(page);
  const press = (control: Locator) => info.project.name === 'mobile' ? control.tap() : control.click();
  await page.goto('/?fixture=loops');
  await expect(page.locator('.board-scene')).toHaveAttribute('aria-busy', 'false');
  await press(button(page, 'Tambah Ulangi')); await setCount(page, 3);
  await press(button(page, 'Tambah Maju ke Ulangi 1')); await press(button(page, 'Tambah Kanan ke Ulangi 1'));
  await press(button(page, 'Tambah di posisi 2'));
  await press(button(page, 'Tambah Kiri'));
  await press(button(page, 'Tambah Ulangi')); await press(button(page, 'Tambah Kanan ke Ulangi 3'));
  const paths = ['0.0', '0.1', '0.0', '0.1', '0.0', '0.1', '1', '2.0', '2.0'];
  for (let i = 0; i < paths.length; i++) {
    await press(step(page));
    await expect(feedback(page)).toHaveAttribute('data-actions', String(i + 1));
    await expect(page.locator('[aria-current="step"]')).toHaveAttribute('data-command-path', paths[i]);
    await expect(feedback(page)).toHaveAttribute('data-status', i === paths.length - 1 ? 'completed' : 'paused');
    if (i === 6) await expect(feedback(page)).toHaveAttribute('data-loop-iteration', '');
    if (i === 7) await expect(page.locator('[data-loop="2"]')).toHaveAttribute('aria-label', 'Putaran 1 dari 2');
  }
  await expect(page.getByLabel('3 dari 3 ikan terkumpul')).toBeVisible();
  expect(errors).toEqual([]);
});

test('tap editor: body/top ordering, removal, slot limits, editing after Step/error, keyboard and layout', async ({ page }, info) => {
  const errors = watchErrors(page);
  const press = (control: Locator) => info.project.name === 'mobile' ? control.tap() : control.click();
  await page.goto('/?fixture=loops');
  await expect(page.locator('.board-scene')).toHaveAttribute('aria-busy', 'false');
  await button(page, 'Tambah Ulangi').focus(); await page.keyboard.press('Enter');
  await expect(button(page, 'Pilih Ulangi 1')).toContainText('2×');
  await press(button(page, 'Tambah Kanan ke Ulangi 1'));
  await press(button(page, 'Tambah Maju ke Ulangi 1'));
  await press(button(page, 'Pilih perintah 2 di Ulangi 1: Maju'));
  await press(button(page, 'Geser perintah 2 di Ulangi 1 sebelumnya'));
  await expect(page.locator('.loop-body .command-block').first()).toHaveClass(/forward/);
  await press(step(page));
  await expect(page.getByLabel('1 dari 3 ikan terkumpul')).toBeVisible();
  await press(button(page, 'Tambah di posisi 3 dalam Ulangi 1'));
  await press(button(page, 'Tambah Kiri ke Ulangi 1'));
  await expect(feedback(page)).toHaveAttribute('data-status', 'idle');
  await expect(page.getByLabel('0 dari 3 ikan terkumpul')).toBeVisible();
  await expect(button(page, 'Tambah Maju ke Ulangi 1')).toHaveCount(0);
  await expect(page.getByText('Ulangi penuh.', { exact: true })).toBeVisible();
  await press(button(page, 'Pilih perintah 3 di Ulangi 1: Kiri'));
  await press(button(page, 'Hapus perintah 3 di Ulangi 1: Kiri'));
  await expect(button(page, 'Tambah Maju ke Ulangi 1')).toBeEnabled();
  await press(button(page, 'Pilih perintah 2 di Ulangi 1: Kanan'));
  await press(button(page, 'Hapus perintah 2 di Ulangi 1: Kanan'));
  const replayStarted = page.waitForFunction(() => document.querySelector('.feedback')?.getAttribute('data-status') === 'running', undefined, { polling: 'raf' });
  await press(button(page, 'Jalankan'));
  await replayStarted;
  await expect(feedback(page)).toHaveAttribute('data-status', 'failed');
  await expect(feedback(page)).toHaveAttribute('data-command-path', '0.0');
  await expect(feedback(page)).toHaveAttribute('data-loop-iteration', '2');
  await expect(page.locator('.failed-command')).toHaveAttribute('aria-current', 'step');
  await page.screenshot({ path: `.verification/${info.project.name}-m1-loop-error.png`, fullPage: true });
  await press(button(page, 'Tambah Kanan ke Ulangi 1'));
  await expect(feedback(page)).toHaveAttribute('data-status', 'idle');
  await press(button(page, 'Tambah di posisi 2'));
  await press(button(page, 'Tambah Kiri'));
  await press(button(page, 'Pilih perintah 2: Kiri'));
  await press(button(page, 'Geser perintah 2 sebelumnya'));
  await expect(page.locator('.program-list').first().locator(':scope > li').first()).toHaveClass(/primitive-item/);
  await expect(button(page, 'Pilih Ulangi 2')).toBeVisible();
  await press(button(page, 'Geser perintah 1 berikutnya'));
  await expect(button(page, 'Pilih Ulangi 1')).toBeVisible();
  await press(button(page, 'Tambah di posisi 3'));
  await press(button(page, 'Tambah Maju')); await press(button(page, 'Tambah Kanan'));
  await expect(button(page, 'Tambah Ulangi')).toHaveCount(0);
  await expect(page.getByText('Urutan penuh.', { exact: true })).toBeVisible();
  await expect(page.locator('.program-list').first().locator(':scope > li')).toHaveCount(4);
  await press(button(page, 'Pilih perintah 4: Kanan'));
  await press(button(page, 'Hapus perintah 4: Kanan'));
  await expect(button(page, 'Tambah Ulangi')).toBeEnabled();
  await press(button(page, 'Tambah Ulangi'));
  await expect(button(page, 'Jalankan')).toBeDisabled();
  await press(button(page, 'Pilih Ulangi 4'));
  await press(button(page, 'Hapus Ulangi 4'));
  await page.screenshot({ path: `.verification/${info.project.name}-m1-editor.png`, fullPage: true });
  for (const control of await page.locator('button:visible, select:visible').all()) {
    const box = await control.boundingBox();
    expect(box?.width).toBeGreaterThanOrEqual(44); expect(box?.height).toBeGreaterThanOrEqual(44);
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(page.viewportSize()!.width);
  await page.addStyleTag({ content: 'html { font-size: 200%; }' });
  await page.evaluate(() => document.fonts.ready);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(page.viewportSize()!.width);
  for (const fits of await page.locator('.command-block').evaluateAll((blocks) => blocks.map((block) => {
    const bounds = block.getBoundingClientRect(), icon = block.querySelector('svg')!.getBoundingClientRect();
    return icon.left >= bounds.left && icon.right <= bounds.right && icon.bottom <= bounds.bottom;
  }))) {
    expect(fits).toBe(true);
  }
  await page.screenshot({ path: `.verification/${info.project.name}-m1-editor-zoom.png`, fullPage: true });
  expect(errors).toEqual([]);
});

test('Stop cancels Run; Step continues; Play restarts; reduced-motion loops retain highlights', async ({ page }, info) => {
  const errors = watchErrors(page);
  const press = (control: Locator) => info.project.name === 'mobile' ? control.tap() : control.click();
  await page.goto('/?fixture=loops');
  await expect(page.locator('.board-scene')).toHaveAttribute('aria-busy', 'false');
  await press(button(page, 'Tambah Ulangi'));
  await setCount(page, 4);
  await press(button(page, 'Tambah Maju ke Ulangi 1')); await press(button(page, 'Tambah Kanan ke Ulangi 1'));
  await button(page, 'Jalankan').evaluate((element) => (element as HTMLButtonElement).click());
  await page.waitForFunction(() => {
    const state = document.querySelector<HTMLElement>('.feedback');
    return state?.dataset.status === 'running' && Number(state.dataset.actions) >= 2;
  }, undefined, { polling: 'raf' });
  await button(page, 'Berhenti').evaluate((element) => (element as HTMLButtonElement).click());
  await expect(feedback(page)).toHaveAttribute('data-status', 'paused');
  const stopped = Number(await feedback(page).getAttribute('data-actions'));
  await page.waitForTimeout(850);
  await expect(feedback(page)).toHaveAttribute('data-actions', String(stopped));
  await press(step(page));
  await expect(feedback(page)).toHaveAttribute('data-actions', String(stopped + 1));
  await press(button(page, 'Jalankan'));
  await expect(feedback(page)).toHaveAttribute('data-actions', '8');
  await expect(feedback(page)).toHaveAttribute('data-status', 'completed');
  await press(button(page, 'Hapus semua'));
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await press(button(page, 'Tambah Ulangi')); await setCount(page, 3);
  await press(button(page, 'Tambah Maju ke Ulangi 1')); await press(button(page, 'Tambah Kanan ke Ulangi 1'));
  await press(button(page, 'Jalankan'));
  await expect(feedback(page)).toHaveAttribute('data-status', 'completed');
  await expect(feedback(page)).toHaveAttribute('data-actions', '6');
  await expect(page.locator('canvas')).toHaveAttribute('data-cat-animation', 'static');
  await expect(page.locator('.loop-progress')).toHaveAttribute('aria-label', 'Putaran 3 dari 3');
  await expect(page.locator('[aria-current="step"]')).toHaveAttribute('data-command-path', '0.1');
  await page.screenshot({ path: `.verification/${info.project.name}-m1-reduced.png`, fullPage: true });
  await page.goto('/');
  await button(page, 'Mulai').click();
  await expect(page.getByRole('region', { name: 'Satu langkah', exact: true })).toBeVisible();
  await expect(button(page, 'Tambah Kiri')).toHaveCount(0);
  await expect(button(page, 'Tambah Ulangi')).toHaveCount(0);
  expect(errors).toEqual([]);
});
