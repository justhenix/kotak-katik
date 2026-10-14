import { expect, test } from '@playwright/test';

const sizes = [{ width: 1440, height: 900 }, { width: 390, height: 844 }, { width: 320, height: 740 }];

test('repeat counter: supported limits, touch targets, keyboard editing, completion and progression', async ({ page }) => {
  for (const size of sizes) {
    await page.setViewportSize(size);
    await page.goto('/?level=m2-repeat-together');
    await expect(page.locator('.board-scene')).toHaveAttribute('aria-busy', 'false');
    await page.getByRole('button', { name: 'Pilih Ulangi 1', exact: true }).click();
    const counter = page.getByRole('group', { name: 'Banyaknya Ulangi 1', exact: true });
    const less = counter.getByRole('button', { name: 'Kurangi banyaknya Ulangi 1' });
    const more = counter.getByRole('button', { name: 'Tambah banyaknya Ulangi 1' });
    await expect(less).toBeVisible(); await expect(less).toBeDisabled();
    for (const button of [less, more]) {
      const bounds = await button.boundingBox();
      expect(bounds!.width).toBeGreaterThanOrEqual(44); expect(bounds!.height).toBeGreaterThanOrEqual(44);
    }
    await more.press('End');
    await expect(counter.locator('output')).toHaveText('4×'); await expect(more).toBeDisabled();
    await expect(more).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(page.locator('.program-list button').last()).toBeFocused();
    await expect(page.getByRole('button', { name: 'Jalankan', exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Pilih Ulangi 1', exact: true }).click();
    await less.press('Home'); await expect(counter.locator('output')).toHaveText('2×');
    await more.press('ArrowUp'); await expect(counter.locator('output')).toHaveText('3×');
    const play = page.getByRole('button', { name: 'Jalankan', exact: true });
    const playBounds = await play.boundingBox();
    expect(playBounds!.y + playBounds!.height).toBeLessThanOrEqual(size.height);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(size.width);
    await play.click();
    await expect(page.locator('.feedback')).toHaveAttribute('data-status', 'completed');
    await page.getByRole('button', { name: 'Lanjut', exact: true }).click();
    await expect(page.getByRole('region', { name: 'Pola mengelilingi', exact: true })).toBeVisible();
  }
});

test('a long strip exposes complete edge blocks and keyboard focus without scrolling the page sideways', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await page.goto('/?fixture=turning');
  await expect(page.locator('.board-scene')).toHaveAttribute('aria-busy', 'false');
  for (let index = 0; index < 12; index++) await page.getByRole('button', { name: 'Tambah Kiri', exact: true }).click();
  const strip = page.locator('.program-sequence');
  const first = page.getByRole('button', { name: 'Pilih perintah 1: Kiri', exact: true });
  const last = page.getByRole('button', { name: 'Pilih perintah 12: Kiri', exact: true });
  await expect(page.getByRole('group', { name: 'Geser urutan', exact: true })).toBeVisible();
  await first.focus();
  const start = await first.boundingBox(), viewport = await strip.boundingBox();
  expect(start!.x - viewport!.x).toBeGreaterThanOrEqual(12);
  await last.focus();
  const end = await last.boundingBox();
  expect(viewport!.x + viewport!.width - end!.x - end!.width).toBeGreaterThanOrEqual(12);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
  await page.getByRole('button', { name: 'Lihat awal urutan', exact: true }).click();
  await page.setViewportSize({ width: 390, height: 844 });
  await last.focus();
  await expect(last).toBeFocused();
  const resizedEnd = await last.boundingBox(), resizedViewport = await strip.boundingBox();
  expect(resizedViewport!.x + resizedViewport!.width - resizedEnd!.x - resizedEnd!.width).toBeGreaterThanOrEqual(12);
});

test('a filled Repeat and final completion retain edge padding on narrow mobile', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await page.goto('/?level=m2-mixed-journey');
  await expect(page.locator('.board-scene')).toHaveAttribute('aria-busy', 'false');
  const press = (name: string) => page.getByRole('button', { name, exact: true }).click();
  await press('Tambah Ulangi'); await press('Tambah Maju ke Ulangi 1');
  await press('Tambah di posisi 2'); await press('Tambah Kanan');
  await press('Tambah Ulangi'); await press('Tambah Maju ke Ulangi 3');
  const strip = page.locator('.program-sequence');
  const last = page.locator('.repeat-wrapper').last().locator('.repeat-item');
  const viewport = await strip.boundingBox(), block = await last.boundingBox();
  expect(viewport!.x + viewport!.width - block!.x - block!.width).toBeGreaterThanOrEqual(12);
  await press('Jalankan');
  await expect(page.locator('.feedback')).toHaveAttribute('data-status', 'completed');
  await expect(page.getByText('Semua tahap selesai!', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Lihat awal urutan', exact: true })).toBeDisabled();
  const first = await page.locator('.repeat-wrapper').first().locator('.repeat-item').boundingBox();
  expect(first!.x - viewport!.x).toBeGreaterThanOrEqual(12);
  await press('Lihat akhir urutan');
  const end = await last.boundingBox();
  expect(viewport!.x + viewport!.width - end!.x - end!.width).toBeGreaterThanOrEqual(12);
});
