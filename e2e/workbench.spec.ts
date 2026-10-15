import { expect, test } from '@playwright/test';
import type { Locator, Page } from '@playwright/test';
import { OrthographicCamera, Vector3 } from 'three';
import { sceneryBounds } from '../src/scene/Environment/layout';
import type { SceneryPlacement } from '../src/scene/Environment/layout';

const button = (page: Page, name: string) => page.getByRole('button', { name, exact: true });

async function centeredBanner(page: Page) {
  const snapshot = await page.evaluate(() => {
    const canvas = document.querySelector('canvas')!;
    const banner = document.querySelector('.feedback')!.getBoundingClientRect();
    const bench = document.querySelector('.workbench')!.getBoundingClientRect();
    return { frame: canvas.dataset.cameraFrame!, tiles: canvas.dataset.playableTiles!, width: canvas.clientWidth, height: canvas.clientHeight,
      canvasTop: canvas.getBoundingClientRect().top, bannerCenter: banner.y + banner.height / 2, bannerX: banner.x + banner.width / 2, benchTop: bench.y };
  });
  const frame = JSON.parse(snapshot.frame);
  const camera = new OrthographicCamera(-snapshot.width / 2, snapshot.width / 2, snapshot.height / 2, -snapshot.height / 2, 0.1, 100);
  camera.position.fromArray(frame.position); camera.quaternion.fromArray(frame.rotation); camera.zoom = frame.zoom;
  camera.updateMatrixWorld(); camera.updateProjectionMatrix();
  const tiles: { x: number; z: number }[] = JSON.parse(snapshot.tiles);
  const boardBottom = Math.max(...tiles.flatMap(({ x, z }) => [-0.56, 0.56].flatMap(dx => [-0.56, 0.56].map(dz => {
    const point = new Vector3(x + dx, -0.4, z + dz).project(camera);
    return snapshot.canvasTop + (1 - point.y) * snapshot.height / 2;
  }))));
  return { verticalError: Math.abs(snapshot.bannerCenter - (boardBottom + snapshot.benchTop) / 2),
    horizontalError: Math.abs(snapshot.bannerX - snapshot.width / 2) };
}

async function sceneryAvoidsUI(page: Page) {
  const snapshot = await page.evaluate(() => {
    const canvas = document.querySelector('canvas')!;
    const rect = (element: Element) => {
      const bounds = element.getBoundingClientRect();
      return { x: bounds.x, y: bounds.y, width: bounds.width, height: bounds.height };
    };
    return { box: rect(canvas), frame: canvas.dataset.cameraFrame!, placements: canvas.dataset.scenery!,
      gui: [...document.querySelectorAll('.puzzle-exit, .header-actions, .workbench, .feedback, .lesson-options[open] .lesson-options-list')].map(rect) };
  });
  const { box } = snapshot;
  const frame = JSON.parse(snapshot.frame);
  const camera = new OrthographicCamera(-box.width / 2, box.width / 2, box.height / 2, -box.height / 2, 0.1, 100);
  camera.position.fromArray(frame.position); camera.quaternion.fromArray(frame.rotation); camera.zoom = frame.zoom;
  camera.updateMatrixWorld(); camera.updateProjectionMatrix();
  const placements: SceneryPlacement[] = JSON.parse(snapshot.placements);
  for (const item of placements) {
    const rect = sceneryBounds(camera, item);
    const scene = { left: box.x + (rect.left + 1) * box.width / 2, right: box.x + (rect.right + 1) * box.width / 2,
      top: box.y + (1 - rect.top) * box.height / 2, bottom: box.y + (1 - rect.bottom) * box.height / 2 };
    for (const bounds of snapshot.gui) {
      if (scene.left < bounds.x + bounds.width && scene.right > bounds.x && scene.top < bounds.y + bounds.height && scene.bottom > bounds.y) return false;
    }
  }
  return true;
}

test('compact workbench keeps command actions attached and scenery clear across execution states', async ({ page }, info) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/?fixture=loops');
  await expect(page.locator('.board-scene')).toHaveAttribute('aria-busy', 'false');
  await button(page, 'Tambah Ulangi').click();
  await button(page, 'Tambah Maju ke Ulangi 1').click();
  await button(page, 'Tambah Kanan ke Ulangi 1').click();
  if (info.project.name === 'mobile') expect((await page.locator('.workbench').boundingBox())!.height).toBeLessThan(330);
  await expect.poll(() => sceneryAvoidsUI(page)).toBe(true);
  await button(page, 'Pilih perintah 1 di Ulangi 1: Maju').click();
  await expect(page.locator('.program-area .selection-tools')).toBeVisible();
  await expect(page.locator('[aria-controls="command-actions"]')).toHaveAttribute('aria-pressed', 'true');
  const context = (await page.locator('.selection-tools').boundingBox())!;
  const rail = (await page.locator('.program-scroll').boundingBox())!;
  expect(context.y).toBeGreaterThanOrEqual(rail.y + rail.height);
  expect(context.y - rail.y - rail.height).toBeLessThan(55);
  await page.screenshot({ path: `.verification/workbench-${info.project.name}-editing.png`, fullPage: true });
  await button(page, 'Jalankan').click();
  await expect(page.locator('.selection-tools')).toHaveCount(0);
  await expect(page.locator('.feedback')).toHaveAttribute('data-status', 'running');
  await page.screenshot({ path: `.verification/workbench-${info.project.name}-running.png`, fullPage: true });
  await expect(page.locator('.feedback')).toHaveAttribute('data-status', 'finished');
  await expect(page.locator('.feedback-symbol .fish-icon')).toBeVisible();
  await expect(page.locator('.feedback .fish-symbol')).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
  await page.screenshot({ path: `.verification/workbench-${info.project.name}-unfinished.png`, fullPage: true });
  await button(page, 'Pilih Ulangi 1').click();
  await button(page, 'Tambah banyaknya Ulangi 1').click();
  await button(page, 'Jalankan').click();
  await expect(page.locator('.feedback')).toHaveAttribute('data-status', 'completed');
  await expect.poll(() => sceneryAvoidsUI(page)).toBe(true);
  await page.locator('.lesson-options summary').click();
  await expect.poll(() => sceneryAvoidsUI(page)).toBe(true);
  await page.screenshot({ path: `.verification/workbench-${info.project.name}-complete.png`, fullPage: true });
  expect(errors).toEqual([]);
});

test('banner occupies the middle gap and narrow Repeat editing preserves board space', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const [width, height] of [[1474, 1023], [1440, 900], [390, 844], [320, 740]]) {
    await page.setViewportSize({ width, height });
    await page.goto('/?fixture=loops');
    await expect(page.locator('.board-scene')).toHaveAttribute('aria-busy', 'false');
    for (const name of ['Tambah Ulangi', 'Tambah Maju ke Ulangi 1', 'Tambah Kanan ke Ulangi 1']) await button(page, name).click();
    if (width <= 390) {
      expect((await page.locator('.workbench').boundingBox())!.height).toBeLessThan(300);
      await expect(page.locator('.program-navigation')).toHaveCount(0);
    }
    await expect.poll(async () => (await centeredBanner(page)).verticalError).toBeLessThan(5);
    expect((await centeredBanner(page)).horizontalError).toBeLessThan(1);
    await expect(page.locator('.feedback .fish-symbol')).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
    await button(page, 'Pilih Ulangi 1').click();
    await button(page, 'Tambah banyaknya Ulangi 1').click();
    await button(page, 'Jalankan').click();
    await expect(page.locator('.feedback')).toHaveAttribute('data-status', 'completed');
    await expect.poll(async () => (await centeredBanner(page)).verticalError).toBeLessThan(5);
    await expect(page.locator('.feedback-symbol .control-icon')).toBeVisible();
  }
});

test('feedback stays on one line and large text reflows controls without clipped labels', async ({ page }, info) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const [width, height] of [[1474, 1023], [1440, 900], [390, 844], [320, 740]]) {
    await page.setViewportSize({ width, height });
    await page.goto('/?fixture=turning');
    await expect(page.locator('.board-scene')).toHaveAttribute('aria-busy', 'false');
    await button(page, 'Tambah Maju').click(); await button(page, 'Tambah Maju').click();
    await button(page, 'Jalankan').click();
    await expect(page.locator('.feedback')).toHaveAttribute('data-status', 'failed');
    await page.addStyleTag({ content: 'html { font-size: 200%; }' });
    await expect.poll(() => page.evaluate(() => [...document.querySelectorAll<HTMLElement>('.controls-area button')].every(control => control.scrollWidth <= control.clientWidth))).toBe(true);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const text = page.locator('.feedback p');
    expect((await text.innerText()).trim().split(/\s+/).length).toBeLessThanOrEqual(5);
    const lines = await text.evaluate(node => node.getBoundingClientRect().height / parseFloat(getComputedStyle(node).lineHeight));
    expect(lines).toBeLessThan(1.1);
    await page.screenshot({ path: `.verification/workbench-${info.project.name}-${width}-zoom.png`, fullPage: true });
  }
});

test('mouse and touch drag add and reorder real puzzle blocks without duplicate clicks', async ({ page }, info) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/?fixture=turning');
  await expect(page.locator('.board-scene')).toHaveAttribute('aria-busy', 'false');
  const drag = async (source: Locator, destination: Locator, fraction = 0.5) => {
    await source.scrollIntoViewIfNeeded();
    const from = (await source.boundingBox())!, to = (await destination.boundingBox())!;
    const start = { x: from.x + from.width / 2, y: from.y + from.height / 2 };
    const end = { x: to.x + to.width * fraction, y: to.y + to.height / 2 };
    if (info.project.name === 'mobile') {
      const session = await page.context().newCDPSession(page);
      await session.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ ...start, id: 0 }] });
      for (let i = 1; i <= 12; i++) await session.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: start.x + (end.x - start.x) * i / 12, y: start.y + (end.y - start.y) * i / 12, id: 0 }] });
      await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
      await session.detach();
    } else {
      await page.mouse.move(start.x, start.y); await page.mouse.down();
      await page.mouse.move(end.x, end.y, { steps: 12 }); await page.mouse.up();
    }
  };
  await drag(button(page, 'Tambah Maju'), button(page, 'Tambah di posisi 1'));
  await expect(page.locator('.command-block')).toHaveCount(1);
  await button(page, 'Tambah Kanan').click();
  await drag(button(page, 'Pilih perintah 2: Kanan'), button(page, 'Pilih perintah 1: Maju'), 0.15);
  await expect(page.locator('.command-block').first()).toHaveClass(/turn-right/);
  await expect(page.locator('.command-block')).toHaveCount(2);
  await expect(page.locator('.drag-preview')).toHaveCount(0);
  await button(page, 'Hapus perintah 1: Kanan').click();
  await expect(page.locator('.command-block')).toHaveCount(1);
  await page.goto('/?fixture=loops');
  await button(page, 'Tambah Ulangi').click();
  await drag(button(page, 'Tambah Maju ke Ulangi 1'), button(page, 'Tambah di posisi 1 dalam Ulangi 1'));
  await expect(page.locator('.loop-body .command-block')).toHaveCount(1);
  await expect(page.locator('.repeat-item')).toHaveCount(1);
});
