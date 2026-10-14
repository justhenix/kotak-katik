import { expect, test } from '@playwright/test';
import type { Locator, Page } from '@playwright/test';
import { curriculumSolutions } from '../src/game/levels/__tests__/solutions';
import { curriculumLevels } from '../src/game/levels/curriculum';
import { verifySolution } from '../src/game/levels/validate-curriculum';
import type { CommandType, Program } from '../src/game/types';
import { setRepeatCount } from './repeat-counter';

const labels: Record<CommandType, string> = { forward: 'Maju', 'turn-left': 'Kiri', 'turn-right': 'Kanan', repeat: 'Ulangi' };
const button = (page: Page, name: string) => page.getByRole('button', { name, exact: true });
const feedback = (page: Page) => page.locator('.feedback');
const scaffold = (page: Page) => page.locator('.lesson-scaffold');
type Press = (locator: Locator) => Promise<void>;

async function removeStarter(page: Page, program: Program, press: Press) {
  for (let index = program.length - 1; index >= 0; index--) {
    const command = program[index];
    const label = command.type === 'repeat' ? `Ulangi ${index + 1}` : `perintah ${index + 1}: ${labels[command.type]}`;
    await press(button(page, `Pilih ${label}`));
    await press(button(page, `Hapus ${label}`));
  }
}

async function buildProgram(page: Page, program: Program, press: Press) {
  for (const [index, command] of program.entries()) {
    await press(button(page, `Tambah di posisi ${index + 1}`));
    await press(button(page, `Tambah ${labels[command.type]}`));
    if (command.type === 'repeat') {
      await press(button(page, `Pilih Ulangi ${index + 1}`));
      await setRepeatCount(page, index, command.count, press);
      await press(button(page, `Tambah di posisi 1 dalam Ulangi ${index + 1}`));
      for (const child of command.commands) await press(button(page, `Tambah ${labels[child.type]} ke Ulangi ${index + 1}`));
    }
  }
}

for (const level of curriculumLevels) test(`Curriculum ${level.id}: real demonstration or editable solution, feedback and reset`, async ({ page }, info) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  const press: Press = (locator) => info.project.name === 'mobile' ? locator.tap() : locator.click();
  await page.goto(`/?level=${level.id}`);
  await expect(page.getByRole('region', { name: level.title, exact: true })).toBeVisible();
  await expect(page.locator('.board-scene')).toHaveAttribute('aria-busy', 'false');
  await expect(page.locator('canvas')).toBeVisible();
  await expect(page.locator('.slot-count, .lesson-phase, .demo-trace')).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);

  const program = curriculumSolutions[level.id];
  if (level.learning.phase === 'demonstration') {
    await expect(scaffold(page)).toHaveAttribute('data-demo-phase', 'done', { timeout: 30000 });
    await expect(page.locator('.controls-area, .palette-area, .selection-tools, .ghost-hand')).toHaveCount(0);
  } else {
    await expect(feedback(page)).toHaveAttribute('data-actions', '0');
    if (level.learning.phase === 'independent') await expect(page.locator('.ghost-hand, .instruction-focus')).toHaveCount(0);
    await removeStarter(page, level.initialProgram, press);
    await buildProgram(page, program, press);
    await press(button(page, 'Jalankan'));
  }
  await expect(feedback(page)).toHaveAttribute('data-status', 'completed');
  const expected = verifySolution(level, program);
  await expect(feedback(page)).toHaveAttribute('data-x', String(expected.avatar.position.x));
  await expect(feedback(page)).toHaveAttribute('data-z', String(expected.avatar.position.z));
  await expect(feedback(page)).toHaveAttribute('data-orientation', expected.avatar.orientation);
  await expect(feedback(page)).toHaveAttribute('data-actions', String(expected.nextCommandIndex));
  await expect(page.getByLabel(`${level.collectibles.length} dari ${level.collectibles.length} ikan terkumpul`)).toBeVisible();
  await page.screenshot({ path: `.verification/idwdyd-${info.project.name}-${level.id}-solved.png`, fullPage: true });

  await page.locator('summary').click();
  await press(button(page, level.learning.phase === 'demonstration' ? 'Ulang contoh' : 'Mulai ulang'));
  if (level.learning.phase === 'demonstration') {
    await page.locator('summary').click();
    await press(button(page, 'Lewati contoh'));
    await expect(scaffold(page)).toHaveAttribute('data-demo-phase', 'skipped');
  }
  await expect(feedback(page)).toHaveAttribute('data-status', 'idle');
  await expect(feedback(page)).toHaveAttribute('data-orientation', level.avatar.orientation);
  await expect(page.getByLabel(`0 dari ${level.collectibles.length} ikan terkumpul`)).toBeVisible();
  expect(errors).toEqual([]);
});

test('debugging observes the wrong turn before its repair; child inspects and completes a missing step', async ({ page }, info) => {
  const press: Press = (locator) => info.project.name === 'mobile' ? locator.tap() : locator.click();
  await page.goto('/?level=m2-debug-watch');
  await expect(feedback(page)).toHaveAttribute('data-status', 'failed', { timeout: 15000 });
  await expect(feedback(page)).toHaveAttribute('data-command-path', '2');
  await expect(feedback(page)).toHaveAttribute('data-orientation', 'south');
  await expect(button(page, 'Pilih perintah 2: Kanan')).toBeVisible();
  await page.screenshot({ path: `.verification/idwdyd-${info.project.name}-debug-observation.png`, fullPage: true });
  await page.evaluate(() => {
    const observer = new MutationObserver(() => {
      const selected = document.querySelector('button[data-command-path="1"].instruction-focus');
      if (selected) document.body.dataset.sawTutorialSelection = 'true';
    });
    observer.observe(document.querySelector('.editor')!, { subtree: true, attributes: true, attributeFilter: ['class'] });
  });
  await expect(scaffold(page)).toHaveAttribute('data-demo-phase', 'done', { timeout: 30000 });
  await expect(page.locator('body')).toHaveAttribute('data-saw-tutorial-selection', 'true');
  await expect(button(page, 'Pilih perintah 2: Kiri')).toBeVisible();
  await page.goto('/?level=m2-debug-together');
  await press(button(page, 'Jalankan'));
  await expect(feedback(page)).toHaveAttribute('data-status', 'finished');
  await press(button(page, 'Periksa satu per satu'));
  await expect(feedback(page)).toHaveAttribute('data-actions', '0');
  for (let index = 0; index < 3; index++) {
    await press(button(page, 'Satu langkah'));
    await expect(feedback(page)).toHaveAttribute('data-actions', String(index + 1));
  }
  await press(button(page, 'Tambah di posisi 4'));
  await press(button(page, 'Tambah Maju'));
  await press(button(page, 'Jalankan'));
  await expect(feedback(page)).toHaveAttribute('data-status', 'completed');
  await page.locator('summary').click(); await press(button(page, 'Mulai ulang'));
  await expect(page.locator('.command-block')).toHaveCount(3);
  await expect(feedback(page)).toHaveAttribute('data-status', 'idle');
});

test('unknown preview keeps the default board and the selected engineering fixture', async ({ page }) => {
  await page.goto('/?level=missing');
  await expect(page.getByRole('region', { name: 'Ambil semua ikan', exact: true })).toBeVisible();
  await expect(button(page, 'Tambah Kiri')).toHaveCount(0);
  await expect(page.locator('.slot-count')).toHaveCount(0);
  await page.goto('/?fixture=loops&level=missing');
  await expect(button(page, 'Tambah Ulangi')).toBeVisible();
  await expect(page.getByLabel('0 dari 3 ikan terkumpul')).toBeVisible();
});
