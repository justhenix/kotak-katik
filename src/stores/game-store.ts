import { createStore } from 'zustand/vanilla';
import { useStore } from 'zustand';
import { createInitialState, executeNextAction } from '../game/interpreter/interpreter';
import { selectFixture } from '../game/levels/mechanics';
import { validateLevel } from '../game/engine/simulation';
import { programError } from '../game/program';
import type { Command, CommandType, GameState, LevelDefinition, PrimitiveCommand, Program, RepeatCount } from '../game/types';

export const ACTION_PACE_MS = 400;

type GameStore = {
  level: LevelDefinition;
  program: Program;
  simulation: GameState;
  addCommand: (type: CommandType, loopIndex?: number) => void;
  removeCommand: (index: number, loopIndex?: number) => void;
  moveCommand: (index: number, offset: -1 | 1, loopIndex?: number) => void;
  setRepeatCount: (index: number, count: RepeatCount) => void;
  step: () => void;
  run: () => void;
  retry: () => void;
  resetProgram: () => void;
  stop: () => void;
  dispose: () => void;
};

export function createGameStore(level: LevelDefinition) {
  validateLevel(level);
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
      if (get().program.length === 0 || programError(level, get().program) || get().simulation.status === 'running') return;
      cancel();
      // Let the restored board settle before the first action, including on Retry.
      set({ simulation: { ...resetSimulation(), status: 'running' } });
      timer = setTimeout(() => advance(true), ACTION_PACE_MS);
    };
    const edit = (program: Program) => {
      if (program === get().program || get().simulation.status === 'running' || programError(level, program, true)) return;
      cancel();
      set({ program, simulation: resetSimulation() });
    };
    const editScope = (loopIndex: number | undefined, transform: (commands: readonly Command[]) => readonly Command[]) => {
      const program = get().program;
      if (loopIndex === undefined) return edit(transform(program));
      const loop = program[loopIndex];
      if (loop?.type !== 'repeat') return;
      const commands = transform(loop.commands);
      if (commands === loop.commands) return;
      if (commands.some((command) => command.type === 'repeat')) return;
      edit(program.map((command, index) => index === loopIndex
        ? { ...loop, commands: commands as readonly PrimitiveCommand[] } : command));
    };
    return {
      level, program: structuredClone(level.initialProgram),
      simulation: resetSimulation(),
      addCommand: (type, loopIndex) => {
        if (get().simulation.status === 'running' || !level.allowedCommands.includes(type)) return;
        if (loopIndex !== undefined && type === 'repeat') return;
        editScope(loopIndex, (commands) => [...commands, type === 'repeat' ? { type, count: 2, commands: [] } : { type }]);
      },
      removeCommand: (index, loopIndex) => {
        editScope(loopIndex, (commands) => commands[index] ? commands.filter((_, commandIndex) => index !== commandIndex) : commands);
      },
      moveCommand: (index, offset, loopIndex) => {
        editScope(loopIndex, (commands) => {
          if (!commands[index] || !commands[index + offset]) return commands;
          const moved = [...commands];
          [moved[index], moved[index + offset]] = [moved[index + offset], moved[index]];
          return moved;
        });
      },
      setRepeatCount: (index, count) => {
        const loop = get().program[index];
        if (loop?.type !== 'repeat' || ![2, 3, 4].includes(count)) return;
        edit(get().program.map((command, commandIndex) => commandIndex === index ? { ...loop, count } : command));
      },
      step: () => {
        const status = get().simulation.status;
        if (status === 'running' || get().program.length === 0 || programError(level, get().program)) return;
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
        edit(structuredClone(level.initialProgram));
      },
      stop: () => {
        if (get().simulation.status !== 'running') return;
        cancel();
        const simulation = get().simulation;
        set({ simulation: { ...simulation, status: simulation.nextCommandIndex === 0 ? 'idle' : 'paused' } });
      },
      dispose: cancel,
    };
  });
  return store;
}

export const gameStore = createGameStore(selectFixture(typeof window === 'undefined' ? '' : window.location.search));
export const useGameStore = <T,>(selector: (state: GameStore) => T) => useStore(gameStore, selector);
