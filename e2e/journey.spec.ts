import { expect, test } from '@playwright/test';

test('title starts immediately; leaving a demonstration cancels it and replay starts clean', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Kotak-Katik' })).toBeVisible();
  await expect(page.locator('canvas')).toHaveCount(0);
  await page.getByRole('button', { name: 'Mulai', exact: true }).click();
  await expect(page.locator('.lesson-scaffold')).toHaveAttribute('data-demo-phase', 'command');
  await page.getByRole('button', { name: 'Ekspedisi', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Ekspedisi' })).toBeFocused();
  await expect(page.locator('canvas, .ghost-hand')).toHaveCount(0);
  await page.waitForTimeout(1700);
  await page.getByRole('button', { name: /^1\. Satu langkah/ }).click();
  await expect(page.locator('.feedback')).toHaveAttribute('data-actions', '0');
  await expect(page.locator('.lesson-scaffold')).toHaveAttribute('data-demo-phase', 'done', { timeout: 15000 });
  await expect(page.locator('.feedback')).toHaveAttribute('data-status', 'completed');
  expect(errors).toEqual([]);
});
