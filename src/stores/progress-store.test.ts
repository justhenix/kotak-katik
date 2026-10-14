import { describe, expect, it, vi } from 'vitest';
import { curriculumLevels } from '../game/levels/curriculum';
import { createProgressStore, decodeProgress, freshProgress, nodeState, PROGRESS_KEY } from './progress-store';

describe('expedition progression', () => {
  it('starts at the first authored stage and guards locked and unknown stages', () => {
    const store = createProgressStore();
    expect(nodeState(store.getState(), curriculumLevels[0].id)).toBe('current');
    expect(nodeState(store.getState(), curriculumLevels[1].id)).toBe('locked');
    expect(store.getState().selectLevel(curriculumLevels[1].id)).toBe(false);
    store.getState().recordResult(curriculumLevels[1].id, 'completed');
    store.getState().recordResult('missing', 'completed');
    expect(store.getState().completedLevelIds).toEqual([]);
  });
  it('separates skipped demonstration unlocks from completion and allows replay', () => {
    const store = createProgressStore();
    store.getState().recordResult(curriculumLevels[0].id, 'skipped');
    expect(store.getState().completedLevelIds).toEqual([]);
    expect(nodeState(store.getState(), curriculumLevels[0].id)).toBe('available');
    expect(nodeState(store.getState(), curriculumLevels[1].id)).toBe('current');
    store.getState().recordResult(curriculumLevels[1].id, 'skipped');
    expect(store.getState().unlockedLevelIds).toHaveLength(2);
    expect(store.getState().selectLevel(curriculumLevels[0].id)).toBe(true);
    store.getState().recordResult(curriculumLevels[0].id, 'completed');
    store.getState().recordResult(curriculumLevels[0].id, 'completed');
    expect(store.getState().completedLevelIds).toEqual([curriculumLevels[0].id]);
  });
  it('completes the exact 16-stage route, replays without losing progress and resets', () => {
    const store = createProgressStore();
    for (const level of curriculumLevels) store.getState().recordResult(level.id, 'completed');
    expect(store.getState().completedLevelIds).toEqual(curriculumLevels.map(level => level.id));
    expect(store.getState().unlockedLevelIds).toHaveLength(16);
    expect(store.getState().selectLevel(curriculumLevels[0].id)).toBe(true);
    store.getState().recordResult(curriculumLevels[0].id, 'completed');
    expect(store.getState().completedLevelIds).toHaveLength(16);
    store.getState().reset();
    expect(store.getState().completedLevelIds).toEqual([]);
    expect(store.getState().unlockedLevelIds).toEqual([curriculumLevels[0].id]);
  });
});

describe('versioned local persistence', () => {
  function memoryStorage() {
    const data = new Map<string, string>();
    return { getItem: (key: string) => data.get(key) ?? null, setItem: (key: string, value: string) => { data.set(key, value); } };
  }
  it('restores completion, skip unlocks and selected stage without runtime data', () => {
    const storage = memoryStorage();
    const store = createProgressStore(storage);
    store.getState().recordResult(curriculumLevels[0].id, 'skipped');
    store.getState().recordResult(curriculumLevels[1].id, 'completed');
    const restored = createProgressStore(storage).getState();
    expect(restored.completedLevelIds).toEqual([curriculumLevels[1].id]);
    expect(restored.unlockedLevelIds).toEqual(curriculumLevels.slice(0, 3).map(level => level.id));
    expect(restored.currentLevelId).toBe(curriculumLevels[2].id);
    expect(Object.keys(JSON.parse(storage.getItem(PROGRESS_KEY)!)).sort()).toEqual(['completedLevelIds', 'currentLevelId', 'unlockedLevelIds', 'version']);
    store.getState().reset();
    expect(createProgressStore(storage).getState().unlockedLevelIds).toHaveLength(1);
  });
  it.each(['{', 'null', '[]', '1', JSON.stringify({ version: 2 }), JSON.stringify({ version: 1, completedLevelIds: 'bad', unlockedLevelIds: [] })])('recovers malformed or unsupported data: %s', raw => {
    expect(decodeProgress(raw)).toEqual(freshProgress());
  });
  it('drops unknown IDs, duplicates, inaccessible completions and gaps in unlocks', () => {
    const [first, second, third, fourth] = curriculumLevels;
    expect(decodeProgress(JSON.stringify({ version: 1, completedLevelIds: [first.id, first.id, fourth.id, 'old'],
      unlockedLevelIds: [first.id, third.id, 'old'], currentLevelId: fourth.id }))).toEqual({
      completedLevelIds: [first.id], unlockedLevelIds: [first.id, second.id, third.id], currentLevelId: second.id,
    });
    expect(decodeProgress(JSON.stringify({ version: 1, completedLevelIds: [third.id], unlockedLevelIds: [third.id] }))).toEqual(freshProgress());
  });
  it('survives denied reads and quota writes, retaining functional session progress', () => {
    const storage = { getItem: vi.fn(() => { throw new Error('denied'); }), setItem: vi.fn(() => { throw new Error('quota'); }) };
    const store = createProgressStore(storage);
    expect(store.getState().persistenceAvailable).toBe(false);
    store.getState().recordResult(curriculumLevels[0].id, 'completed');
    expect(store.getState().completedLevelIds).toHaveLength(1);
    expect(store.getState().unlockedLevelIds).toHaveLength(2);
    expect(store.getState().persistenceAvailable).toBe(false);
  });
});
