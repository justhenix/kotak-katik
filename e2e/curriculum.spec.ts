import { expect, test } from '@playwright/test';
import type { Locator, Page } from '@playwright/test';
import { curriculumSolutions } from '../src/game/levels/__tests__/solutions';
import { curriculumLevels } from '../src/game/levels/curriculum';
import { verifySolution } from '../src/game/levels/validate-curriculum';
import type { CommandType, Program } from '../src/game/types';

const labels: Record<CommandType, string> = { forward: 'Maju', 'turn-left': 'Kiri', 'turn-right': 'Kanan', repeat: 'Ulangi' };
const button = (page: Page, name: string) => page.getByRole('button', { name, exact: true });
const feedback = (page: Page) => page.locator('.feedback');
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
      await page.getByLabel(`Banyaknya Ulangi ${index + 1}`).selectOption(String(command.count));
      await press(button(page, `Tambah di posisi 1 dalam Ulangi ${index + 1}`));
      for (const child of command.commands) await press(button(page, `Tambah ${labels[child.type]} ke Ulangi ${index + 1}`));
    }
  }
}

for (const level of curriculumLevels) test(`M2A ${level.id}: rendered preview, legal editing, Step, Run and reset`, async ({ page }, info) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  const press: Press = (locator) => info.project.name === 'mobile' ? locator.tap() : locator.click();
  await page.goto(`/?level=${level.id}`);
  await expect(page.getByRole('region', { name: level.title, exact: true })).toBeVisible();
  await expect(page.locator('.board-scene')).toHaveAttribute('aria-busy', 'false');
  await expect(page.locator('canvas')).toBeVisible();
  await expect(page.getByLabel(`0 dari ${level.collectibles.length} ikan terkumpul`)).toBeVisible();
  await expect(page.getByLabel(`${level.initialProgram.length} dari ${level.maxProgramSlots} tempat terisi`)).toBeVisible();
  for (const type of ['forward', 'turn-left', 'turn-right', 'repeat'] as const) {
    await expect(button(page, `Tambah ${labels[type]}`)).toHaveCount(level.allowedCommands.includes(type) ? 1 : 0);
  }
  await page.screenshot({ path: `.verification/m2-${info.project.name}-${level.id}-initial.png`, fullPage: true });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  for (const control of await page.locator('.controls-area button, .palette-area button').all()) {
    const bounds = await control.boundingBox();
    expect(bounds!.width).toBeGreaterThanOrEqual(44);
    expect(bounds!.height).toBeGreaterThanOrEqual(44);
    expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(info.project.use.viewport!.width);
  }
  const program = curriculumSolutions[level.id];
  await removeStarter(page, level.initialProgram, press);
  await buildProgram(page, program, press);
  const actions = program.reduce((sum, command) => sum + (command.type === 'repeat' ? command.commands.length * command.count : 1), 0);
  for (let index = 0; index < actions; index++) {
    await press(button(page, 'Satu langkah'));
    await expect(feedback(page)).toHaveAttribute('data-actions', String(index + 1));
  }
  await expect(feedback(page)).toHaveAttribute('data-status', 'completed');
  const expected = verifySolution(level, program);
  await expect(feedback(page)).toHaveAttribute('data-x', String(expected.avatar.position.x));
  await expect(feedback(page)).toHaveAttribute('data-z', String(expected.avatar.position.z));
  await expect(feedback(page)).toHaveAttribute('data-orientation', expected.avatar.orientation);
  const stepped = await feedback(page).evaluate((element) => ({ ...(element as HTMLElement).dataset }));
  await press(button(page, 'Jalankan lagi'));
  await expect(feedback(page)).toHaveAttribute('data-status', 'completed');
  expect(await feedback(page).evaluate((element) => ({ ...(element as HTMLElement).dataset }))).toEqual(stepped);
  await press(button(page, level.initialProgram.length > 0 ? 'Mulai ulang' : 'Hapus semua'));
  await expect(feedback(page)).toHaveAttribute('data-status', 'idle');
  await expect(feedback(page)).toHaveAttribute('data-orientation', level.avatar.orientation);
  await expect(page.getByLabel(`0 dari ${level.collectibles.length} ikan terkumpul`)).toBeVisible();
  await expect(page.getByLabel(`${level.initialProgram.length} dari ${level.maxProgramSlots} tempat terisi`)).toBeVisible();
  expect(errors).toEqual([]);
});

test('M2A debugging: observe a wrong turn, replace it, run again, and retain the original reset program', async ({ page }, info) => {
  const press: Press = (locator) => info.project.name === 'mobile' ? locator.tap() : locator.click();
  await page.goto('/?level=m2-debug-watch');
  await expect(page.locator('.board-scene')).toHaveAttribute('aria-busy', 'false');
  await press(button(page, 'Jalankan'));
  await expect(feedback(page)).toHaveAttribute('data-status', 'failed');
  await expect(feedback(page)).toHaveAttribute('data-command-path', '2');
  await expect(feedback(page)).toHaveAttribute('data-orientation', 'south');
  await page.screenshot({ path: `.verification/m2-${info.project.name}-debug-observation.png`, fullPage: true });
  await press(button(page, 'Pilih perintah 2: Kanan'));
  await press(button(page, 'Ganti dengan Kiri'));
  await expect(feedback(page)).toHaveAttribute('data-status', 'idle');
  await press(button(page, 'Jalankan'));
  await expect(feedback(page)).toHaveAttribute('data-status', 'completed');
  await press(button(page, 'Mulai ulang'));
  await expect(button(page, 'Pilih perintah 2: Kanan')).toBeVisible();
});

test('M2A unknown preview keeps the default board and the selected engineering fixture', async ({ page }) => {
  await page.goto('/?level=missing');
  await expect(page.getByRole('region', { name: 'Ambil semua ikan', exact: true })).toBeVisible();
  await expect(button(page, 'Tambah Kiri')).toHaveCount(0);
  await expect(page.locator('.slot-count')).toHaveCount(0);
  await page.goto('/?fixture=loops&level=missing');
  await expect(button(page, 'Tambah Ulangi')).toBeVisible();
  await expect(page.getByLabel('0 dari 3 ikan terkumpul')).toBeVisible();
});
