import { createStore } from 'zustand/vanilla';
import { useStore } from 'zustand';
import { curriculumLevels } from '../game/levels/curriculum';

export type Progress = {
  completedLevelIds: readonly string[];
  unlockedLevelIds: readonly string[];
  currentLevelId: string;
};
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
  selectLevel: (id: string) => boolean;
  recordResult: (id: string, outcome: 'completed' | 'skipped') => void;
  reset: () => void;
};

export function createProgressStore() {
  return createStore<ProgressStore>((set, get) => ({
    ...freshProgress(),
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
}
export const progressStore = createProgressStore();
export const useProgressStore = <T,>(selector: (state: ProgressStore) => T) => useStore(progressStore, selector);
