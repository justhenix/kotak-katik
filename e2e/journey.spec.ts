import { expect, test } from '@playwright/test';
import { curriculumLevels } from '../src/game/levels/curriculum';

test('expedition uses authored order and distinguishes skipped examples, completion and replay', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Ekspedisi', exact: true }).click();
  const nodes = page.locator('.stage-node');
  expect(await nodes.evaluateAll(buttons => buttons.map(button => button.getAttribute('data-level-id')))).toEqual(curriculumLevels.map(level => level.id));
  await expect(nodes.first()).toHaveAttribute('data-node-state', 'current');
  await expect(nodes.nth(1)).toBeDisabled();
  await nodes.first().click();
  await page.locator('summary').click();
  await page.getByRole('button', { name: 'Lewati contoh', exact: true }).click();
  await page.getByRole('button', { name: 'Lanjut', exact: true }).click();
  await expect(page.getByRole('region', { name: 'Maju ke ikan', exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Tambah Maju', exact: true }).click();
  await page.getByRole('button', { name: 'Jalankan', exact: true }).click();
  await expect(page.locator('.feedback')).toHaveAttribute('data-status', 'completed');
  await page.getByRole('button', { name: 'Ekspedisi', exact: true }).click();
  await expect(nodes.first()).toHaveAttribute('data-node-state', 'available');
  await expect(nodes.nth(1)).toHaveAttribute('data-node-state', 'completed');
  await expect(nodes.nth(2)).toHaveAttribute('data-node-state', 'current');
  await expect(page.getByText('1 dari 16 tahap selesai.', { exact: true })).toBeVisible();
  await nodes.nth(1).click();
  await expect(page.locator('.feedback')).toHaveAttribute('data-actions', '0');
  await expect(page.locator('.feedback')).toHaveAttribute('data-status', 'idle');
  await expect(page.locator('.command-block')).toHaveCount(1);
});

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
  await page.locator('[data-level-id="m2-move-watch"]').click();
  await expect(page.locator('.feedback')).toHaveAttribute('data-actions', '0');
  await expect(page.locator('.lesson-scaffold')).toHaveAttribute('data-demo-phase', 'done', { timeout: 15000 });
  await expect(page.locator('.feedback')).toHaveAttribute('data-status', 'completed');
  expect(errors).toEqual([]);
});
