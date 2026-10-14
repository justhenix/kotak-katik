import { describe, expect, it } from 'vitest';
import { curriculumLevels } from '../game/levels/curriculum';
import { createProgressStore, nodeState } from './progress-store';

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
