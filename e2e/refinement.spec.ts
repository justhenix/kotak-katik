import { expect, test } from '@playwright/test';
import type { Locator, Page } from '@playwright/test';

const button = (page: Page, name: string) => page.getByRole('button', { name, exact: true });
const feedback = (page: Page) => page.locator('.feedback');

test('contextual insertion and replacement preserve order and reset the board after a Step', async ({ page }, info) => {
  const press = (control: Locator) => info.project.name === 'mobile' ? control.tap() : control.click();
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/?fixture=turning');
  await expect(page.locator('.board-scene')).toHaveAttribute('aria-busy', 'false');
  await press(button(page, 'Tambah Maju'));
  await press(button(page, 'Tambah Maju'));
  await expect(page.locator('.selection-tools')).toHaveCount(0);
  await press(button(page, 'Pilih perintah 2: Maju'));
  await expect(page.locator('.selection-tools')).toBeVisible();
  await press(button(page, '+ Sebelum'));
  await expect(page.locator('[data-insert-path="1"]')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('[data-insert-path="1"]')).toBeFocused();
  await press(button(page, 'Tambah Kanan'));
  await expect(page.locator('.command-block')).toHaveCount(3);
  await press(button(page, 'Satu langkah'));
  await expect(feedback(page)).toHaveAttribute('data-x', '1');
  await press(button(page, 'Pilih perintah 2: Kanan'));
  await press(button(page, 'Ganti dengan Kiri'));
  await expect(feedback(page)).toHaveAttribute('data-status', 'idle');
  await expect(feedback(page)).toHaveAttribute('data-x', '0');
  await expect(page.locator('.command-block')).toHaveCount(3);
  await press(button(page, 'Jalankan'));
  await expect(feedback(page)).toHaveAttribute('data-status', 'completed');
  await expect(page.getByLabel('1 dari 1 ikan terkumpul')).toBeVisible();
  await page.screenshot({ path: `.verification/${info.project.name}-m11-edited-solution.png`, fullPage: true });
  expect(errors).toEqual([]);
});

test('one shared palette edits Repeat bodies at their slot limit and can return to the outer program', async ({ page }, info) => {
  const press = (control: Locator) => info.project.name === 'mobile' ? control.tap() : control.click();
  await page.goto('/?fixture=loops');
  await press(button(page, 'Tambah Ulangi'));
  await expect(page.locator('.feedback')).toContainText('Isi perintah dalam Ulangi.');
  await expect(page.locator('.palette-area')).toHaveCount(1);
  await expect(button(page, 'Tambah Ulangi')).toHaveCount(0);
  await press(button(page, 'Tambah Maju ke Ulangi 1'));
  await press(button(page, 'Tambah Kiri ke Ulangi 1'));
  await press(button(page, 'Pilih perintah 2 di Ulangi 1: Kiri'));
  await press(button(page, '+ Sesudah'));
  await press(button(page, 'Tambah Maju ke Ulangi 1'));
  await expect(button(page, 'Tambah Maju ke Ulangi 1')).toBeDisabled();
  await press(button(page, 'Pilih perintah 3 di Ulangi 1: Maju'));
  await press(button(page, 'Ganti dengan Kanan'));
  await expect(button(page, 'Pilih perintah 3 di Ulangi 1: Kanan')).toHaveAttribute('aria-pressed', 'true');
  await press(button(page, 'Hapus perintah 3 di Ulangi 1: Kanan'));
  await expect(button(page, 'Tambah di posisi 3 dalam Ulangi 1')).toBeFocused();
  await press(button(page, 'Pilih Ulangi 1'));
  await page.getByLabel('Banyaknya Ulangi 1').selectOption('4');
  await expect(button(page, 'Pilih Ulangi 1')).toContainText('4×');
  await page.keyboard.press('Escape');
  await expect(button(page, 'Tambah di posisi 2')).toBeFocused();
  await expect(button(page, 'Tambah Ulangi')).toBeVisible();
  await press(button(page, 'Tambah Kanan'));
  await expect(page.locator('.program-list').first().locator(':scope > li')).toHaveCount(2);
});

test('keyboard focus, text zoom and long programs remain reachable without page overflow', async ({ page }, info) => {
  await page.goto('/?fixture=turning');
  await expect(page.locator('.board-scene')).toHaveAttribute('aria-busy', 'false');
  await button(page, 'Tambah Maju').focus();
  await page.keyboard.press('Space');
  await page.keyboard.press('Space');
  await button(page, 'Pilih perintah 2: Maju').focus();
  await page.keyboard.press('Enter');
  await expect(button(page, 'Pilih perintah 2: Maju')).toHaveAttribute('aria-pressed', 'true');
  await expect(button(page, 'Pilih perintah 2: Maju')).toBeFocused();
  expect(await button(page, 'Pilih perintah 2: Maju').evaluate((el) => getComputedStyle(el).outlineColor)).toBe('rgb(23, 63, 118)');
  await page.keyboard.press('Escape');
  await expect(button(page, 'Tambah di posisi 3')).toBeFocused();
  for (let index = 0; index < 10; index++) await button(page, 'Tambah Kiri').click();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.addStyleTag({ content: 'html { font-size: 200%; }' });
  await page.evaluate(() => document.fonts.ready);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(page.viewportSize()!.width);
  await button(page, 'Pilih perintah 12: Kiri').focus();
  const bounds = await button(page, 'Pilih perintah 12: Kiri').boundingBox();
  expect(bounds!.x).toBeGreaterThanOrEqual(0);
  expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(page.viewportSize()!.width);
  for (const control of await page.locator('.controls-area button, .palette-area button').all()) {
    const box = await control.boundingBox();
    expect(box!.width).toBeGreaterThanOrEqual(44);
    expect(box!.height).toBeGreaterThanOrEqual(44);
    const fits = await control.evaluate((element) => {
      const bounds = element.getBoundingClientRect();
      return [...element.querySelectorAll('span')].every((label) => {
        const rect = label.getBoundingClientRect();
        return rect.left >= bounds.left && rect.right <= bounds.right;
      });
    });
    expect(fits).toBe(true);
  }
  await page.screenshot({ path: `.verification/${info.project.name}-m11-keyboard-zoom.png`, fullPage: true });
});
