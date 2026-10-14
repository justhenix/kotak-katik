import { createStore } from 'zustand/vanilla';
import { useStore } from 'zustand';
import { curriculumLevels } from '../game/levels/curriculum';

export type Progress = {
  completedLevelIds: readonly string[];
  unlockedLevelIds: readonly string[];
  currentLevelId: string;
};
export const PROGRESS_KEY = 'kotak-katik:progress';
export const PROGRESS_VERSION = 1;
type ProgressStorage = Pick<Storage, 'getItem' | 'setItem'>;
export const freshProgress = (): Progress => ({
  completedLevelIds: [], unlockedLevelIds: [curriculumLevels[0].id], currentLevelId: curriculumLevels[0].id,
});
export type NodeState = 'locked' | 'available' | 'current' | 'completed';
export function nodeState(progress: Progress, id: string): NodeState {
  if (progress.completedLevelIds.includes(id)) return 'completed';
  if (!progress.unlockedLevelIds.includes(id)) return 'locked';
  return progress.currentLevelId === id ? 'current' : 'available';
}
type ProgressStore = Progress & {
  persistenceAvailable: boolean;
  selectLevel: (id: string) => boolean;
  recordResult: (id: string, outcome: 'completed' | 'skipped') => void;
  reset: () => void;
};

export function decodeProgress(raw: string | null): Progress {
  if (!raw) return freshProgress();
  try {
    const value: unknown = JSON.parse(raw);
    if (!value || typeof value !== 'object' || !('version' in value) || value.version !== PROGRESS_VERSION
      || !('completedLevelIds' in value) || !Array.isArray(value.completedLevelIds)
      || !('unlockedLevelIds' in value) || !Array.isArray(value.unlockedLevelIds)) return freshProgress();
    const completed: string[] = [];
    const unlocked = [curriculumLevels[0].id];
    // Restore a contiguous authored route, including unlocks from explicit skips.
    for (const [index, level] of curriculumLevels.entries()) {
      if (!unlocked.includes(level.id)) break;
      if (value.completedLevelIds.includes(level.id)) completed.push(level.id);
      const next = curriculumLevels[index + 1];
      if (next && (completed.includes(level.id) || value.unlockedLevelIds.includes(next.id))) unlocked.push(next.id);
    }
    const current = 'currentLevelId' in value && typeof value.currentLevelId === 'string' && unlocked.includes(value.currentLevelId)
      ? value.currentLevelId : unlocked.find(id => !completed.includes(id)) ?? unlocked.at(-1)!;
    return { completedLevelIds: completed, unlockedLevelIds: unlocked, currentLevelId: current };
  } catch { return freshProgress(); }
}

export function createProgressStore(storage?: ProgressStorage) {
  let initial = freshProgress();
  let persistenceAvailable = Boolean(storage);
  try { if (storage) initial = decodeProgress(storage.getItem(PROGRESS_KEY)); }
  catch { persistenceAvailable = false; }
  const store = createStore<ProgressStore>((set, get) => ({
    ...initial, persistenceAvailable,
    selectLevel: (id) => {
      if (!get().unlockedLevelIds.includes(id)) return false;
      set({ currentLevelId: id });
      return true;
    },
    recordResult: (id, outcome) => {
      const index = curriculumLevels.findIndex(level => level.id === id);
      const state = get();
      if (index < 0 || !state.unlockedLevelIds.includes(id)) return;
      if (outcome === 'skipped' && curriculumLevels[index].learning.phase !== 'demonstration') return;
      const next = curriculumLevels[index + 1];
      const completed = outcome === 'completed' && !state.completedLevelIds.includes(id);
      const unlocked = next && !state.unlockedLevelIds.includes(next.id);
      if (!completed && !unlocked) return;
      set({
        completedLevelIds: completed ? [...state.completedLevelIds, id] : state.completedLevelIds,
        unlockedLevelIds: unlocked ? [...state.unlockedLevelIds, next.id] : state.unlockedLevelIds,
        currentLevelId: state.currentLevelId === id && next ? next.id : state.currentLevelId,
      });
    },
    reset: () => set(freshProgress()),
  }));
  store.subscribe((state, previous) => {
    if (!storage || state.completedLevelIds === previous.completedLevelIds && state.unlockedLevelIds === previous.unlockedLevelIds
      && state.currentLevelId === previous.currentLevelId) return;
    try {
      storage.setItem(PROGRESS_KEY, JSON.stringify({
        version: PROGRESS_VERSION, completedLevelIds: state.completedLevelIds,
        unlockedLevelIds: state.unlockedLevelIds, currentLevelId: state.currentLevelId,
      }));
      if (!state.persistenceAvailable) store.setState({ persistenceAvailable: true });
    } catch { if (state.persistenceAvailable) store.setState({ persistenceAvailable: false }); }
  });
  return store;
}
function browserStorage(): ProgressStorage | undefined {
  try { return typeof window === 'undefined' ? undefined : window.localStorage; }
  catch { return undefined; }
}
export const progressStore = createProgressStore(browserStorage());
export const useProgressStore = <T,>(selector: (state: ProgressStore) => T) => useStore(progressStore, selector);
