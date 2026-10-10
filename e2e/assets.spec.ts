import { expect, test } from '@playwright/test';
import type { Locator } from '@playwright/test';

test('GLB gameplay: phases, movement, collection, interruption, and reduced motion', async ({ page }, testInfo) => {
  const press = (control: Locator) => testInfo.project.name === 'mobile' ? control.tap() : control.click();
  const errors: string[] = [];
  const models = new Set<string>();
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('response', (response) => {
    if (response.url().endsWith('.glb') && response.ok()) models.add(new URL(response.url()).pathname);
  });
  await page.goto('/');
  const canvas = page.locator('canvas');
  // Locator retries can back off beyond the duration of a one-shot clip.
  const waitForPhase = (phase: string) => page.waitForFunction(
    (expected) => document.querySelector('canvas')?.dataset.catAnimation === expected,
    phase,
    { polling: 'raf' },
  );
  const add = page.getByRole('button', { name: 'Tambah Maju', exact: true });
  const step = page.getByRole('button', { name: 'Satu langkah', exact: true });
  const reset = page.getByRole('button', { name: 'Hapus semua', exact: true });
  await expect(page.locator('.board-scene')).toHaveAttribute('aria-busy', 'false');
  await expect(canvas).toHaveAttribute('data-cat-animation', 'idle');
  await expect(canvas).toHaveAttribute('data-cat-x', '0');
  expect([...models].sort()).toEqual(['/assets/models/cat.glb', '/assets/models/fish.glb']);
  await press(add);
  await press(add);
  await press(step);
  await waitForPhase('walk');
  await expect(canvas).toHaveAttribute('data-cat-animation', 'idle');
  await expect(canvas).toHaveAttribute('data-cat-x', '1');
  await page.screenshot({ path: `.verification/${testInfo.project.name}-glb-step.png`, fullPage: true });
  await press(step);
  await expect(page.getByLabel('1 dari 1 ikan terkumpul')).toBeVisible();
  await waitForPhase('eat');
  await expect(canvas).toHaveAttribute('data-cat-x', '2');
  await page.screenshot({ path: `.verification/${testInfo.project.name}-glb-eat.png`, fullPage: true });
  await waitForPhase('dance');
  await page.screenshot({ path: `.verification/${testInfo.project.name}-glb-dance.png`, fullPage: true });
  await press(reset);
  await expect(canvas).toHaveAttribute('data-cat-x', '0');
  await expect(page.getByLabel('0 dari 1 ikan terkumpul')).toBeVisible();
  await expect(canvas).toHaveAttribute('data-cat-animation', 'idle');

  await press(add);
  await press(add);
  await press(step);
  await press(step);
  await waitForPhase('eat');
  await press(reset);
  await expect(canvas).toHaveAttribute('data-cat-x', '0');
  await page.waitForTimeout(800);
  await expect(canvas).toHaveAttribute('data-cat-animation', 'idle');

  await press(add);
  await press(add);
  await press(step);
  await waitForPhase('walk');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(canvas).toHaveAttribute('data-cat-animation', 'static');
  await expect(canvas).toHaveAttribute('data-cat-x', '1');
  await press(step);
  await expect(canvas).toHaveAttribute('data-cat-x', '2');
  await expect(canvas).toHaveAttribute('data-cat-animation', 'static');
  await page.screenshot({ path: `.verification/${testInfo.project.name}-glb-reduced.png`, fullPage: true });
  await press(reset);
  await expect(canvas).toHaveAttribute('data-cat-x', '0');
  await expect(page.getByLabel('0 dari 1 ikan terkumpul')).toBeVisible();
  expect(errors).toEqual([]);
});

test('execution waits for GLBs rather than canvas creation', async ({ page }) => {
  let release!: () => void;
  const gate = new Promise<void>((resolve) => { release = resolve; });
  await page.route('**/assets/models/cat.glb', async (route) => { await gate; await route.continue(); });
  await page.goto('/');
  await page.getByRole('button', { name: 'Tambah Maju', exact: true }).click();
  await expect(page.getByText('Menyiapkan papan…')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Jalankan', exact: true })).toBeDisabled();
  await expect(page.getByRole('button', { name: 'Satu langkah', exact: true })).toBeDisabled();
  release();
  await expect(page.getByText('Menyiapkan papan…')).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Jalankan', exact: true })).toBeEnabled();
});

test('demand rendering rests after idle and immediately for reduced motion', async ({ page }) => {
  await page.addInitScript(() => {
    const tracker = window as typeof window & { sceneDraws: number };
    tracker.sceneDraws = 0;
    for (const type of [WebGLRenderingContext, WebGL2RenderingContext]) {
      const original = type.prototype.drawElements;
      type.prototype.drawElements = function (...args) {
        tracker.sceneDraws++;
        return original.apply(this, args);
      };
    }
  });
  await page.goto('/');
  await expect(page.locator('.board-scene')).toHaveAttribute('aria-busy', 'false');
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(1300);
  const before = await page.evaluate(() => (window as typeof window & { sceneDraws: number }).sceneDraws);
  expect(before).toBeGreaterThan(0);
  await page.waitForTimeout(300);
  expect(await page.evaluate(() => (window as typeof window & { sceneDraws: number }).sceneDraws)).toBe(before);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('canvas')).toHaveAttribute('data-cat-animation', 'static');
  await page.waitForTimeout(100);
  const reduced = await page.evaluate(() => (window as typeof window & { sceneDraws: number }).sceneDraws);
  await page.waitForTimeout(300);
  expect(await page.evaluate(() => (window as typeof window & { sceneDraws: number }).sceneDraws)).toBe(reduced);
});

test('missing GLB shows the existing recovery state and cannot start execution', async ({ page }) => {
  await page.route('**/assets/models/cat.glb', (route) => route.fulfill({ status: 404, body: 'missing' }));
  await page.goto('/');
  await expect(page.getByText('Papan belum bisa dibuka.', { exact: true }).first()).toBeVisible();
  await expect(page.getByRole('button', { name: 'Muat ulang', exact: true }).first()).toBeVisible();
  await page.getByRole('button', { name: 'Tambah Maju', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Jalankan', exact: true })).toBeDisabled();
});
