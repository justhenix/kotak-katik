import { expect, test } from '@playwright/test';

test('title fits reference and phone sizes; reduced motion freezes the complete diorama', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const canvas = page.locator('.title-diorama canvas');
  await expect(canvas).toHaveAttribute('data-cat-loaded', 'true');
  await expect(canvas).toHaveAttribute('data-fish-loaded', 'true');
  await page.evaluate(() => document.fonts.ready);
  for (const [width, height] of [[1672, 941], [1440, 900], [390, 844], [320, 740]]) {
    await page.setViewportSize({ width, height });
    await expect(page.getByRole('button', { name: 'Mulai', exact: true })).toBeInViewport();
    await expect(page.getByRole('button', { name: 'Ekspedisi', exact: true })).toBeInViewport();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect(await page.locator('button').evaluateAll(buttons => buttons.every(button => {
      const rect = button.getBoundingClientRect();
      return rect.width >= 44 && rect.height >= 44;
    }))).toBe(true);
    await page.screenshot({ path: `.verification/title-${width}x${height}.png` });
  }
  await page.waitForTimeout(250);
  const still = await canvas.screenshot();
  await page.waitForTimeout(500);
  expect((await canvas.screenshot()).equals(still)).toBe(true);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.waitForTimeout(300);
  const animated = await canvas.screenshot();
  await page.waitForTimeout(800);
  expect((await canvas.screenshot()).equals(animated)).toBe(false);
  expect(errors).toEqual([]);
});

test('title controls work by keyboard and direct puzzle entries omit the title scene', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Mulai', exact: true })).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Ekspedisi', exact: true })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('heading', { name: 'Ekspedisi', exact: true })).toBeFocused();
  await expect(page.locator('.title-diorama')).toHaveCount(0);
  await page.getByRole('button', { name: 'Beranda', exact: true }).click();
  await page.keyboard.press('Tab');
  await page.keyboard.press('Space');
  await expect(page.locator('.board-scene')).toBeVisible();
  await expect(page.locator('.title-diorama')).toHaveCount(0);
  for (const entry of ['/?fixture=kernel', '/?level=m2-move-watch']) {
    await page.goto(entry);
    await expect(page.locator('.board-scene')).toHaveAttribute('aria-busy', 'false');
    await expect(page.locator('.title-diorama')).toHaveCount(0);
  }
});
