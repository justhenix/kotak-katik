import { expect } from '@playwright/test';
import type { Locator, Page } from '@playwright/test';
import type { RepeatCount } from '../src/game/types';

export async function setRepeatCount(page: Page, index: number, count: RepeatCount, press: (control: Locator) => Promise<void> = (control) => control.click()) {
  const counter = page.getByRole('group', { name: `Banyaknya Ulangi ${index + 1}`, exact: true });
  const current = Number((await counter.locator('output').innerText()).replace('×', ''));
  const action = current < count ? 'Tambah' : 'Kurangi';
  for (let step = 0; step < Math.abs(count - current); step++) await press(counter.getByRole('button', { name: `${action} banyaknya Ulangi ${index + 1}`, exact: true }));
  await expect(counter.locator('output')).toHaveText(`${count}×`);
}
