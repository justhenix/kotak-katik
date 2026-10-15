import { expect, test } from '@playwright/test';

test('Repeat count controls retain readable glyphs and touch bounds at 200% text size', async ({ page }, info) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const [width, height] of [[1474, 1023], [1440, 900], [390, 844], [320, 740]]) {
    await page.setViewportSize({ width, height });
    await page.goto('/?fixture=loops');
    await expect(page.locator('.board-scene')).toHaveAttribute('aria-busy', 'false');
    await page.getByRole('button', { name: 'Tambah Ulangi', exact: true }).click();
    await page.getByRole('button', { name: 'Pilih Ulangi 1', exact: true }).click();
    await page.addStyleTag({ content: 'html { font-size: 200%; }' });
    for (const control of await page.locator('.repeat-counter button').all()) {
      await control.scrollIntoViewIfNeeded();
      await expect.poll(() => control.evaluate(node => node.scrollHeight <= node.clientHeight && node.scrollWidth <= node.clientWidth)).toBe(true);
      const bounds = (await control.boundingBox())!;
      expect(bounds.width).toBeGreaterThanOrEqual(44);
      expect(bounds.height).toBeGreaterThanOrEqual(44);
      expect(bounds.x).toBeGreaterThanOrEqual(0);
      expect(bounds.x + bounds.width).toBeLessThanOrEqual(width);
    }
    await page.getByRole('button', { name: 'Tambah banyaknya Ulangi 1', exact: true }).click();
    await expect(page.locator('.repeat-counter output')).toHaveText('3×');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    if (width === 320) await page.screenshot({ path: `.verification/workbench-${info.project.name}-repeat-zoom.png`, fullPage: true });
  }
});
