import { expect, test } from '@playwright/test';
import type { Locator, Page, TestInfo } from '@playwright/test';

const button = (page: Page, name: string) => page.getByRole('button', { name, exact: true });
const feedback = (page: Page) => page.locator('.feedback');
const scaffold = (page: Page) => page.getByRole('region', { name: 'Bantuan belajar' });
const press = (info: TestInfo) => (control: Locator) => info.project.name === 'mobile' ? control.tap() : control.click();

const errorsByPage = new WeakMap<Page, string[]>();
test.beforeEach(async ({ page }) => {
  const errors: string[] = [];
  errorsByPage.set(page, errors);
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
});
test.afterEach(async ({ page }) => { expect(errorsByPage.get(page)).toEqual([]); });

async function layout(page: Page, info: TestInfo, name: string) {
  // R3F measures its canvas asynchronously after a viewport/text-size change.
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(page.viewportSize()!.width);
  for (const control of await page.locator('.lesson-scaffold button:visible, .controls-area button:visible, .palette-command:visible').all()) {
    const bounds = await control.boundingBox();
    expect(bounds!.width).toBeGreaterThanOrEqual(44); expect(bounds!.height).toBeGreaterThanOrEqual(44);
    expect(bounds!.x).toBeGreaterThanOrEqual(0); expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(page.viewportSize()!.width);
  }
  await page.screenshot({ path: `.verification/m2b-${info.project.name}-${name}.png`, fullPage: true });
}

test('beginner: watch, replay, skip, insert at the cue, progress and fade support', async ({ page }, info) => {
  const tap = press(info);
  await page.goto('/');
  await expect(scaffold(page)).toHaveAttribute('data-phase', 'demonstration');
  await expect(page.locator('.board-scene')).toHaveAttribute('aria-busy', 'false');
  await expect(button(page, 'Tambah Kiri')).toHaveCount(0);
  await expect(button(page, 'Lanjut')).toHaveCount(0);
  await button(page, 'Lihat contoh').focus(); await page.keyboard.press('Enter');
  await expect(scaffold(page)).toHaveAttribute('data-demo-phase', 'command');
  await expect(button(page, 'Satu langkah')).toBeDisabled();
  await expect(page.locator('.demo-trace')).toBeVisible();
  await expect(scaffold(page)).toHaveAttribute('data-demo-phase', 'done');
  await expect(feedback(page)).toHaveAttribute('data-status', 'completed');
  await layout(page, info, 'first-example');
  await tap(button(page, 'Ulang contoh'));
  await tap(button(page, 'Lewati'));
  await expect(scaffold(page)).toHaveAttribute('data-demo-phase', 'skipped');
  await expect(feedback(page)).toHaveAttribute('data-status', 'idle');
  await tap(button(page, 'Lanjut'));
  await expect(scaffold(page)).toHaveAttribute('data-phase', 'guided');
  await expect(page.locator('[data-insert-path="0"]')).toHaveAttribute('data-learning-cue', 'true');
  await expect(page.locator('.lesson-hint')).toContainText('Taruh Maju di sini.');
  await layout(page, info, 'guided-insertion');
  await tap(button(page, 'Tambah Maju'));
  await expect(page.locator('.lesson-hint')).toHaveCount(0);
  await tap(button(page, 'Jalankan'));
  await expect(feedback(page)).toHaveAttribute('data-status', 'completed');
  await tap(button(page, 'Lanjut'));
  await expect(page.getByText('3 / 16 · Lihat', { exact: true })).toBeVisible();
  await tap(button(page, 'Lewati')); await tap(button(page, 'Lanjut'));
  await expect(scaffold(page)).toHaveAttribute('data-phase', 'independent');
  await expect(page.locator('[data-learning-cue="true"]')).toHaveCount(0);
  await expect(button(page, 'Petunjuk')).toHaveCount(0);
  for (let index = 0; index < 3; index++) await tap(button(page, 'Tambah Maju'));
  await tap(button(page, 'Jalankan'));
  await expect(feedback(page)).toHaveAttribute('data-status', 'completed');
  await tap(button(page, 'Lanjut'));
  await expect(button(page, 'Tambah Kiri')).toBeVisible();
  await expect(button(page, 'Tambah Kanan')).toHaveCount(0);
});

test('turning example: command highlights, stationary turn, guided right and independent south-facing left', async ({ page }, info) => {
  const tap = press(info);
  await page.goto('/?level=m2-left-watch');
  await tap(button(page, 'Lihat contoh'));
  await page.waitForFunction(() => document.querySelector<HTMLElement>('.feedback')?.dataset.actions === '2');
  await expect(feedback(page)).toHaveAttribute('data-x', '1');
  await expect(feedback(page)).toHaveAttribute('data-z', '0');
  await expect(feedback(page)).toHaveAttribute('data-orientation', 'north');
  await expect(scaffold(page)).toHaveAttribute('data-demo-phase', 'done');
  await tap(button(page, 'Lanjut'));
  await tap(button(page, 'Satu langkah'));
  await expect(page.locator('.lesson-hint')).toContainText('Lihat sisi kanan kucing.');
  await tap(button(page, 'Petunjuk'));
  await expect(page.locator('[data-insert-path="1"]')).toHaveAttribute('data-learning-cue', 'true');
  await layout(page, info, 'relative-right');
  await tap(button(page, 'Tambah Kanan')); await tap(button(page, 'Tambah Maju'));
  await tap(button(page, 'Jalankan'));
  await expect(feedback(page)).toHaveAttribute('data-status', 'completed');
  await tap(button(page, 'Lanjut'));
  await expect(feedback(page)).toHaveAttribute('data-orientation', 'south');
  await expect(page.locator('.lesson-hint')).toHaveCount(0);
  for (const name of ['Maju', 'Kiri', 'Maju']) await tap(button(page, `Tambah ${name}`));
  await tap(button(page, 'Jalankan'));
  await expect(feedback(page)).toHaveAttribute('data-status', 'completed');
});

test('Repeat: observe iterations, guided count and independent move-turn pattern', async ({ page }, info) => {
  const tap = press(info);
  await page.goto('/?level=m2-repeat-watch');
  await tap(button(page, 'Lihat contoh'));
  await expect(scaffold(page)).toHaveAttribute('data-demo-phase', 'done');
  await expect(feedback(page)).toHaveAttribute('data-loop-iteration', '2');
  await tap(button(page, 'Lanjut'));
  await tap(button(page, 'Petunjuk'));
  await expect(button(page, 'Pilih Ulangi 1')).toHaveAttribute('data-learning-cue', 'true');
  await tap(button(page, 'Pilih Ulangi 1'));
  await expect(page.getByLabel('Banyaknya Ulangi 1')).toHaveClass(/learning-target/);
  await expect(page.locator('.palette-area')).toHaveCount(0);
  await expect(button(page, 'Hapus Ulangi 1')).toBeVisible();
  await page.getByLabel('Banyaknya Ulangi 1').selectOption('3');
  await layout(page, info, 'repeat-count');
  await tap(button(page, 'Jalankan'));
  await expect(feedback(page)).toHaveAttribute('data-status', 'completed');
  await tap(button(page, 'Lanjut'));
  await expect(scaffold(page)).toHaveAttribute('data-phase', 'independent');
  await expect(button(page, 'Petunjuk')).toHaveCount(0);
  await tap(button(page, 'Tambah Ulangi'));
  await tap(button(page, 'Tambah Maju ke Ulangi 1')); await tap(button(page, 'Tambah Kanan ke Ulangi 1'));
  await tap(button(page, 'Pilih Ulangi 1')); await page.getByLabel('Banyaknya Ulangi 1').selectOption('3');
  await tap(button(page, 'Jalankan'));
  await expect(feedback(page)).toHaveAttribute('data-status', 'completed');
  await expect(feedback(page)).toHaveAttribute('data-actions', '6');
  await layout(page, info, 'independent-repeat');
});

test('debugging: observe before hint, retain evidence, inspect, repair, retry and restore starter', async ({ page }, info) => {
  const tap = press(info);
  await page.goto('/?level=m2-debug-watch');
  await expect(page.locator('[data-learning-cue="true"]')).toHaveCount(0);
  await expect(page.locator('.lesson-hint')).toHaveCount(0);
  await tap(button(page, 'Jalankan'));
  await expect(feedback(page)).toHaveAttribute('data-status', 'failed');
  await expect(feedback(page)).toHaveAttribute('data-command-path', '2');
  await expect(button(page, 'Pilih perintah 2: Kanan')).toHaveAttribute('data-learning-cue', 'true');
  await expect(feedback(page)).toHaveAttribute('data-orientation', 'south');
  await layout(page, info, 'debug-observation');
  await tap(button(page, 'Periksa satu per satu'));
  await tap(button(page, 'Satu langkah')); await tap(button(page, 'Satu langkah'));
  await expect(feedback(page)).toHaveAttribute('data-orientation', 'south');
  await tap(button(page, 'Pilih perintah 2: Kanan')); await tap(button(page, 'Ganti dengan Kiri'));
  await expect(feedback(page)).toHaveAttribute('data-status', 'idle');
  await tap(button(page, 'Jalankan'));
  await expect(feedback(page)).toHaveAttribute('data-status', 'completed');
  await tap(button(page, 'Mulai ulang'));
  await expect(button(page, 'Pilih perintah 2: Kanan')).toBeVisible();
  await expect(page.locator('.lesson-hint')).toHaveCount(0);
  await tap(button(page, 'Lihat contoh'));
  await expect(scaffold(page)).toHaveAttribute('data-demo-phase', 'done', { timeout: 25_000 });
  await expect(button(page, 'Pilih perintah 2: Kiri')).toBeVisible();
  await expect(feedback(page)).toHaveAttribute('data-status', 'completed');
});

test('guided debugging appends after observation; independent overrun collects fish without completing', async ({ page }, info) => {
  const tap = press(info);
  await page.goto('/?level=m2-debug-together');
  await expect(page.locator('.lesson-hint')).toHaveCount(0);
  await tap(button(page, 'Jalankan'));
  await expect(feedback(page)).toHaveAttribute('data-status', 'finished');
  await expect(page.locator('[data-insert-path="3"]')).toHaveAttribute('data-learning-cue', 'true');
  await tap(button(page, 'Tambah Maju')); await tap(button(page, 'Jalankan'));
  await expect(feedback(page)).toHaveAttribute('data-status', 'completed');
  await tap(button(page, 'Lanjut'));
  await tap(button(page, 'Jalankan'));
  await expect(feedback(page)).toHaveAttribute('data-status', 'failed');
  await expect(page.getByLabel('2 dari 2 ikan terkumpul')).toBeVisible();
  await expect(button(page, 'Lanjut')).toHaveCount(0);
  await expect(page.locator('.lesson-hint')).toHaveCount(0);
  await tap(button(page, 'Pilih Ulangi 1')); await page.getByLabel('Banyaknya Ulangi 1').selectOption('3');
  await tap(button(page, 'Jalankan'));
  await expect(feedback(page)).toHaveAttribute('data-status', 'completed');
  await tap(button(page, 'Lanjut'));
  for (const [index, name] of ['Ulangi', 'Kanan', 'Ulangi'].entries()) {
    await tap(button(page, `Tambah di posisi ${index + 1}`));
    await tap(button(page, `Tambah ${name}`));
    if (name === 'Ulangi') await tap(button(page, `Tambah Maju ke Ulangi ${index + 1}`));
  }
  await tap(button(page, 'Jalankan'));
  await expect(feedback(page)).toHaveAttribute('data-status', 'completed');
  await expect(page.getByText('Semua tahap selesai!', { exact: true })).toBeVisible();
  await layout(page, info, 'journey-complete');
});

test('reduced motion keeps tutorial states, cancelling a running example leaves no stale actions, narrow text zoom fits', async ({ page }, info) => {
  const tap = press(info);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/?level=m2-debug-watch');
  await tap(button(page, 'Lihat contoh'));
  await expect(feedback(page)).toHaveAttribute('data-status', 'running');
  await tap(button(page, 'Lewati'));
  await expect(feedback(page)).toHaveAttribute('data-status', 'idle');
  await page.waitForTimeout(1300);
  await expect(feedback(page)).toHaveAttribute('data-actions', '0');
  await tap(button(page, 'Ulang contoh'));
  await expect(scaffold(page)).toHaveAttribute('data-demo-phase', 'done', { timeout: 25_000 });
  await expect(page.locator('canvas')).toHaveAttribute('data-cat-animation', 'static');
  await expect(feedback(page)).toHaveAttribute('data-status', 'completed');
  await page.setViewportSize({ width: 320, height: 740 });
  await page.addStyleTag({ content: 'html { font-size: 200%; }' });
  await page.evaluate(() => document.fonts.ready);
  await layout(page, info, 'reduced-zoom');
});
