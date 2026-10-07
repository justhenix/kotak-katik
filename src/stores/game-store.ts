import { createStore } from 'zustand/vanilla';
import { useStore } from 'zustand';
import { createInitialState, executeNextAction } from '../game/interpreter/interpreter';
import { kernelLevel } from '../game/levels/kernel';
import type { CommandType, GameState, LevelDefinition, Program } from '../game/types';

export const ACTION_PACE_MS = 400;

type GameStore = {
  level: LevelDefinition;
  program: Program;
  simulation: GameState;
  addCommand: (type: CommandType) => void;
  removeCommand: (index: number) => void;
  step: () => void;
  run: () => void;
  retry: () => void;
  resetProgram: () => void;
  dispose: () => void;
};

export function createGameStore(level: LevelDefinition) {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const cancel = () => { clearTimeout(timer); timer = undefined; };
  const store = createStore<GameStore>((set, get) => {
    const resetSimulation = () => createInitialState(level);
    const advance = (continuous: boolean) => {
      const { program, simulation } = get();
      const next = executeNextAction(level, program, simulation);
      const continues = continuous && next.status === 'paused';
      set({ simulation: continues ? { ...next, status: 'running' } : next });
      if (continues) timer = setTimeout(() => advance(true), ACTION_PACE_MS);
    };
    const start = () => {
      if (get().program.length === 0 || get().simulation.status === 'running') return;
      cancel();
      // Let the restored board settle before the first action, including on Retry.
      set({ simulation: { ...resetSimulation(), status: 'running' } });
      timer = setTimeout(() => advance(true), ACTION_PACE_MS);
    };
    const edit = (program: Program) => {
      cancel();
      set({ program, simulation: resetSimulation() });
    };
    return {
      level, program: level.initialProgram.map((command) => ({ ...command })),
      simulation: resetSimulation(),
      addCommand: (type) => {
        if (get().simulation.status === 'running' || !level.allowedCommands.includes(type)) return;
        edit([...get().program, { type }]);
      },
      removeCommand: (index) => {
        if (get().simulation.status === 'running' || !get().program[index]) return;
        edit(get().program.filter((_, commandIndex) => index !== commandIndex));
      },
      step: () => {
        const status = get().simulation.status;
        if (status === 'running' || get().program.length === 0) return;
        cancel();
        if (['failed', 'finished', 'completed'].includes(status)) set({ simulation: resetSimulation() });
        advance(false);
      },
      run: start,
      retry: () => {
        if (get().simulation.status === 'running') return;
        start();
      },
      resetProgram: () => {
        if (get().simulation.status === 'running') return;
        edit(level.initialProgram.map((command) => ({ ...command })));
      },
      dispose: cancel,
    };
  });
  return store;
}

export const gameStore = createGameStore(kernelLevel);
export const useGameStore = <T,>(selector: (state: GameStore) => T) => useStore(gameStore, selector);
