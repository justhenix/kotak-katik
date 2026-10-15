import { expect, test } from '@playwright/test';
import { curriculumLevels } from '../src/game/levels/curriculum';
import { OrthographicCamera, Vector3 } from 'three';
import type { Page } from '@playwright/test';

async function boardFitsAboveFeedback(page: Page) {
  const canvas = page.locator('canvas');
  const box = (await canvas.boundingBox())!;
  const frame = JSON.parse((await canvas.getAttribute('data-camera-frame'))!);
  const tiles: { x: number; z: number }[] = JSON.parse((await canvas.getAttribute('data-playable-tiles'))!);
  const camera = new OrthographicCamera(-box.width / 2, box.width / 2, box.height / 2, -box.height / 2, 0.1, 100);
  camera.position.fromArray(frame.position);
  camera.quaternion.fromArray(frame.rotation);
  camera.zoom = frame.zoom;
  camera.updateMatrixWorld();
  camera.updateProjectionMatrix();
  const points = tiles.flatMap(tile => [-0.5, 0.5].flatMap(dx => [-0.5, 0.5].flatMap(dz =>
    [-0.4, 1.2].map(y => new Vector3(tile.x + dx, y, tile.z + dz).project(camera)))));
  const screenY = points.map(point => box.y + (1 - point.y) * box.height / 2);
  const header = (await page.locator('.game-header').boundingBox())!;
  const feedback = (await page.locator('.feedback').boundingBox())!;
  return Math.min(...screenY) >= header.y + header.height && Math.max(...screenY) < feedback.y;
}

test('every authored board survives the new camera and scenery; viewport and zoom keep controls usable', async ({ page }, info) => {
  test.setTimeout(180_000);
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const level of curriculumLevels) {
    await page.goto(`/?level=${level.id}`);
    await expect(page.locator('.board-scene')).toHaveAttribute('aria-busy', 'false');
    expect(JSON.parse((await page.locator('canvas').getAttribute('data-playable-tiles'))!)).toEqual(level.tiles.map(tile => tile.position));
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
  for (const [width, height] of [[1474, 1023], [1440, 900], [390, 844], [320, 740]]) {
    await page.setViewportSize({ width, height });
    await page.goto('/?fixture=turning');
    await expect(page.locator('.board-scene')).toHaveAttribute('aria-busy', 'false');
    await page.addStyleTag({ content: 'html { font-size: 200%; }' });
    await page.evaluate(() => document.fonts.ready);
    await expect.poll(() => boardFitsAboveFeedback(page)).toBe(true);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    for (const control of await page.locator('.puzzle-exit, .palette-command, .controls-area button, .lesson-options summary').all()) {
      const bounds = await control.boundingBox();
      expect(bounds!.width).toBeGreaterThanOrEqual(44);
      expect(bounds!.height).toBeGreaterThanOrEqual(44);
      expect(bounds!.x).toBeGreaterThanOrEqual(0);
      expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(width);
    }
    await page.locator('.lesson-options summary').click();
    await page.getByRole('button', { name: 'Mulai ulang', exact: true }).click();
    await expect(page.locator('.lesson-options summary')).toBeFocused();
    await page.getByRole('button', { name: 'Tambah Maju', exact: true }).click();
    await page.getByRole('button', { name: 'Jalankan', exact: true }).click();
    await expect(page.locator('.feedback')).toHaveAttribute('data-status', 'finished');
    await expect.poll(() => boardFitsAboveFeedback(page)).toBe(true);
    await page.screenshot({ path: `.verification/gameplay-${info.project.name}-${width}-zoom.png`, fullPage: true });
  }
  expect(errors).toEqual([]);
});

test('camera stays fixed during relative steps; collection is brief and collision remains inspectable', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/?fixture=loops');
  await expect(page.locator('.board-scene')).toHaveAttribute('aria-busy', 'false');
  const press = (name: string) => page.getByRole('button', { name, exact: true }).click();
  await press('Tambah Maju');
  await press('Tambah Maju');
  const frame = await page.locator('canvas').getAttribute('data-camera-frame');
  await press('Satu langkah');
  await expect(page.locator('.feedback')).toHaveClass(/collected-feedback/);
  await expect(page.locator('.feedback')).not.toHaveClass(/collected-feedback/, { timeout: 2500 });
  await expect(page.locator('canvas')).toHaveAttribute('data-camera-frame', frame!);
  await press('Satu langkah');
  await expect(page.locator('.feedback')).toHaveAttribute('data-status', 'failed');
  await expect(page.locator('.failed-command')).toBeVisible();
  await page.waitForTimeout(1300);
  await expect(page.locator('.feedback')).toHaveAttribute('data-visible', 'true');
  expect((await page.locator('.feedback p').innerText()).split(/\s+/).length).toBeLessThanOrEqual(5);
  await expect(page.locator('canvas')).toHaveAttribute('data-camera-frame', frame!);
  await page.locator('.lesson-options summary').click();
  await page.keyboard.press('Escape');
  await expect(page.locator('.lesson-options')).not.toHaveAttribute('open');
  await expect(page.locator('.lesson-options summary')).toBeFocused();
});
