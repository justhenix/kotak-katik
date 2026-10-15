import { expect, test } from '@playwright/test';
import type { Locator, Page, TestInfo } from '@playwright/test';
import { boardIsVisible } from './board-frame';
import { setRepeatCount } from './repeat-counter';

const button = (page: Page, name: string) => page.getByRole('button', { name, exact: true });
const feedback = (page: Page) => page.locator('.feedback');
async function ready(page: Page, id: string) {
  await page.goto(`/?level=${id}`);
  await expect(page.locator('.board-scene')).toHaveAttribute('aria-busy', 'false');
}
async function tap(page: Page, control: Locator, info: TestInfo) {
  const bounds = (await control.boundingBox())!;
  const x = bounds.x + bounds.width / 2, y = bounds.y + bounds.height / 2;
  if (info.project.name === 'mobile') await page.touchscreen.tap(x, y); else await page.mouse.click(x, y);
}
async function anchorIsReal(page: Page) {
  const spotlight = page.locator('.tutorial-spotlight');
  const selector = await spotlight.getAttribute('data-target');
  await expect(page.locator(selector!)).toBeVisible();
  const bounds = (await page.locator(selector!).boundingBox())!;
  expect(bounds.x).toBeGreaterThanOrEqual(-1);
  expect(bounds.x).toBeLessThan(page.viewportSize()!.width);
  if (selector !== '.world-area') await expect(page.locator('.ghost-hand')).toHaveAttribute('data-target', selector!);
  if (selector !== '.world-area') await expect.poll(() => page.locator('.ghost-hand').evaluate(hand => {
    const control = document.querySelector(hand.getAttribute('data-control')!);
    if (!control) return false;
    const box = control.getBoundingClientRect(), finger = hand.getBoundingClientRect();
    const x = finger.x + 29 / 64 * 52, y = finger.y + 4 / 64 * 52;
    return x >= box.left && x <= box.right && y >= box.top && y <= box.bottom;
  })).toBe(true);
  await expect(spotlight).toHaveCSS('pointer-events', 'none');
}
async function capture(page: Page, info: TestInfo, name: string) {
  await expect.poll(() => boardIsVisible(page)).toBe(true);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await expect(page.locator('[role="dialog"], .command-popover, .selection-tools')).toHaveCount(0);
  await page.screenshot({ path: `docs/evidence/smart-idwdyd/${info.project.name}-${name}.png` });
}
const errors = new WeakMap<Page, string[]>();
test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  const messages: string[] = []; errors.set(page, messages);
  page.on('pageerror', error => messages.push(error.message));
  page.on('console', message => { if (message.type() === 'error') messages.push(message.text()); });
});
test.afterEach(async ({ page }) => expect(errors.get(page)).toEqual([]));

test('I Do spotlights actual automation, ignores manual input, and retains Replay, Skip and navigation', async ({ page }, info) => {
  await ready(page, 'm2-left-watch');
  await expect(page.locator('.tutorial-spotlight')).toHaveAttribute('data-phase', 'watch');
  await expect(button(page, 'Tambah Maju')).toBeDisabled();
  await expect(button(page, 'Tambah Maju')).toHaveCSS('opacity', '1');
  await anchorIsReal(page); await capture(page, info, 'i-do');
  const choice = button(page, 'Tambah Maju'); if (await choice.isVisible()) await tap(page, choice, info);
  await page.locator('.world-area').click({ position: { x: 10, y: 30 } });
  await expect(page.locator('.lesson-scaffold')).toHaveAttribute('data-demo-phase', 'done', { timeout: 20_000 });
  await expect(feedback(page)).toHaveAttribute('data-status', 'completed');
  expect(await page.locator('.command-block').evaluateAll(nodes => nodes.map(node => node.getAttribute('aria-label')))).toEqual(['Pilih perintah 1: Maju', 'Pilih perintah 2: Kiri', 'Pilih perintah 3: Maju']);
  await expect(page.locator('.tutorial-spotlight, .ghost-hand')).toHaveCount(0);
  await page.locator('summary').click(); await button(page, 'Ulang contoh').click();
  await expect(page.locator('.tutorial-spotlight')).toHaveAttribute('data-phase', 'watch');
  await page.locator('summary').click(); await button(page, 'Lewati contoh').click();
  await expect(button(page, 'Lanjut')).toBeVisible();
  await expect(page.locator('.tutorial-spotlight, .ghost-hand')).toHaveCount(0);
  await page.locator('summary').click(); await button(page, 'Ulang contoh').click();
  await button(page, 'Ekspedisi').click();
  await expect(page.getByRole('heading', { name: 'Ekspedisi', exact: true })).toBeVisible();
  await expect(page.locator('.tutorial-spotlight, .ghost-hand, .board-scene')).toHaveCount(0);
});

test('We Do protects prepared work, allows either turn, and guides inspection, correction and retry after a mistake', async ({ page }, info) => {
  await ready(page, 'm2-right-together');
  await expect(page.locator('.tutorial-spotlight')).toHaveAttribute('data-phase', 'guided');
  const starter = button(page, 'Pilih perintah 1: Maju');
  await expect(starter).toHaveAttribute('aria-disabled', 'true');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.evaluate(() => {
    document.body.dataset.reminderOpacity = '1';
    let frames = 0, lowest = 1;
    const sample = () => {
      const target = document.querySelector('.instruction-focus');
      if (target?.isConnected) lowest = Math.min(lowest, Number(getComputedStyle(target).opacity));
      document.body.dataset.reminderOpacity = `${lowest}`;
      if (++frames < 120) requestAnimationFrame(sample);
    };
    requestAnimationFrame(sample);
  });
  await tap(page, starter, info);
  await expect.poll(() => page.locator('body').getAttribute('data-reminder-opacity').then(Number)).toBeLessThan(1);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await starter.focus(); await page.keyboard.press('Enter');
  await expect(page.locator('.instruction-focus')).toHaveCSS('opacity', '1');
  await expect(page.locator('[data-nudge]')).toHaveText('Coba yang ditunjuk.');
  await expect(page.locator('.command-block')).toHaveCount(1);
  await expect(page.locator('.dock-context, .delete-selected')).toHaveCount(0);
  await expect(page.locator('.insert-slot')).toHaveCount(1);
  await expect(button(page, 'Tambah di posisi 1')).toHaveCount(0);
  await button(page, 'Tambah di posisi 2').focus(); await page.keyboard.press('Enter');
  await expect(button(page, 'Tambah Kiri')).toBeVisible(); await expect(button(page, 'Tambah Kanan')).toBeVisible();
  await expect(button(page, 'Tambah Maju')).toHaveCount(0);
  await anchorIsReal(page); await capture(page, info, 'we-do-choice');
  await button(page, 'Tambah Kiri').click();
  await expect(page.locator('.dock-context')).toHaveCount(0);
  await expect(button(page, 'Tambah di posisi 3')).toBeFocused();
  await button(page, 'Tambah di posisi 3').click(); await button(page, 'Tambah Maju').click();
  await expect(button(page, 'Jalankan')).toBeFocused();
  await button(page, 'Jalankan').click(); await expect(feedback(page)).toHaveAttribute('data-status', 'failed');
  await expect(page.locator('.ghost-hand')).toHaveAttribute('data-target', '.editor [data-command-path="1"]');
  await anchorIsReal(page); await capture(page, info, 'we-do-failure');
  await button(page, 'Satu langkah').click(); await expect(feedback(page)).toHaveAttribute('data-actions', '1');
  await button(page, 'Pilih perintah 2: Kiri').click();
  await expect(page.locator('.delete-selected')).toHaveCount(0);
  await expect(page.getByRole('button', { name: /Geser perintah/ })).toHaveCount(0);
  await button(page, 'Ganti perintah').click(); await expect(button(page, 'Ganti dengan Kiri')).toBeVisible();
  await button(page, 'Ganti dengan Kanan').click();
  await expect(page.locator('.ghost-hand')).toHaveAttribute('data-target', '.run-button');
  await expect(button(page, 'Jalankan')).toBeFocused();
  await button(page, 'Jalankan').click(); await expect(feedback(page)).toHaveAttribute('data-status', 'completed');
  await expect(starter).toBeVisible(); await expect(page.locator('.tutorial-spotlight, .ghost-hand')).toHaveCount(0);
});

test('guided Repeat permits count alternatives while its prepared body and container cannot be destroyed', async ({ page }, info) => {
  await ready(page, 'm2-repeat-together'); await button(page, 'Pilih Ulangi 1').click();
  await expect(button(page, 'Edit isi Ulangi 1')).toHaveCount(0);
  await expect(button(page, 'Pilihan Ulangi')).toHaveCount(0);
  await expect(page.locator('.delete-selected, .insert-slot')).toHaveCount(0);
  await anchorIsReal(page); await capture(page, info, 'we-do-repeat');
  await button(page, 'Tambah banyaknya Ulangi 1').click();
  await expect(button(page, 'Tambah banyaknya Ulangi 1')).toBeVisible();
  await button(page, 'Tambah banyaknya Ulangi 1').click();
  await expect(button(page, 'Pilih Ulangi 1')).toContainText('4×');
  await button(page, 'Jalankan').click(); await expect(feedback(page)).toHaveAttribute('data-status', 'failed');
  await page.setViewportSize({ width: 320, height: 740 });
  await tap(page, button(page, 'Pilih perintah 1 di Ulangi 1: Maju'), info);
  await expect(page.locator('.delete-selected, .dock-context')).toHaveCount(0);
  await expect(page.locator('.ghost-hand')).toHaveAttribute('data-target', '.scope-back');
  await anchorIsReal(page); await capture(page, info, 'we-do-repeat-failure-320');
  await button(page, 'Kembali ke urutan').click(); await button(page, 'Pilih Ulangi 1').click();
  await button(page, 'Kurangi banyaknya Ulangi 1').click(); await button(page, 'Jalankan').click();
  await expect(feedback(page)).toHaveAttribute('data-status', 'completed');
});

test('You Do removes procedural guidance and retains count, body, replacement, movement and deletion', async ({ page }, info) => {
  await ready(page, 'm2-repeat-alone'); await expect(page.locator('.tutorial-spotlight, .ghost-hand, .instruction-focus')).toHaveCount(0);
  await button(page, 'Tambah di posisi 1').click(); await button(page, 'Tambah Ulangi').click(); await setRepeatCount(page, 0, 3);
  await button(page, 'Edit isi Ulangi 1').click(); await button(page, 'Tambah di posisi 1 dalam Ulangi 1').click();
  await button(page, 'Tambah Maju ke Ulangi 1').click(); await button(page, 'Tambah Kanan ke Ulangi 1').click();
  await button(page, 'Pilih perintah 2 di Ulangi 1: Kanan').click(); await button(page, 'Geser perintah 2 di Ulangi 1 sebelumnya').click();
  await expect(page.locator('.command-block').first()).toHaveClass(/turn-right/);
  await button(page, 'Geser perintah 1 di Ulangi 1 berikutnya').click();
  await button(page, 'Pilih perintah 2 di Ulangi 1: Kanan').click(); await button(page, 'Hapus perintah 2 di Ulangi 1: Kanan').click();
  await button(page, 'Tambah di posisi 2 dalam Ulangi 1').click(); await button(page, 'Tambah Kiri ke Ulangi 1').click();
  await button(page, 'Pilih perintah 2 di Ulangi 1: Kiri').click(); await button(page, 'Ganti perintah').click(); await button(page, 'Ganti dengan Kanan').click();
  await expect(page.locator('.tutorial-spotlight, .ghost-hand')).toHaveCount(0); await capture(page, info, 'you-do');
  await button(page, 'Jalankan').click(); await expect(feedback(page)).toHaveAttribute('data-status', 'completed');
});

test('guided debugging keeps Step and keyboard choices available and anchors the spotlight after narrow text reflow', async ({ page }, info) => {
  await ready(page, 'm2-debug-together'); await button(page, 'Jalankan').click(); await expect(feedback(page)).toHaveAttribute('data-status', 'finished');
  await button(page, 'Periksa satu per satu').click();
  for (let index = 0; index < 3; index++) { await button(page, 'Satu langkah').click(); await expect(feedback(page)).toHaveAttribute('data-actions', `${index + 1}`); }
  await page.setViewportSize({ width: 320, height: 740 });
  await page.addStyleTag({ content: 'html { font-size:200%; }' });
  await button(page, 'Tambah di posisi 4').focus(); await page.keyboard.press('Enter');
  await anchorIsReal(page); await capture(page, info, 'we-do-debug-zoom');
  await button(page, 'Tambah Maju').focus(); await page.keyboard.press('Enter');
  await expect(page.locator('.ghost-hand')).toHaveAttribute('data-target', '.run-button');
  await button(page, 'Jalankan').focus(); await page.keyboard.press('Space');
  await expect(feedback(page)).toHaveAttribute('data-status', 'completed');
});
