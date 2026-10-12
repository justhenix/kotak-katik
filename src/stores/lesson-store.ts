import { createStore } from 'zustand/vanilla';
import { useStore } from 'zustand';
import { curriculumLevels } from '../game/levels/curriculum';
import { samePosition } from '../game/engine/simulation';
import { gameStore } from './game-store';
import type { createGameStore } from './game-store';
import type { CommandPath, DemonstrationAction, GameState, LevelDefinition, Program, VisualHint } from '../game/types';

export const DEMO_COMMAND_MS = 700;
export const DEMO_ACTION_MS = 350;
export const DEMO_RESULT_MS = 1000;
type DemoPhase = 'idle' | 'command' | 'action' | 'result' | 'done' | 'skipped';
type LessonState = {
  levelId: string;
  revealed: readonly string[];
  observedAttempt: boolean;
  demoPhase: DemoPhase;
  demoIndex: number;
  demoPath: CommandPath | null;
  demoAction: DemonstrationAction | null;
  showHint: () => void;
  startDemo: () => void;
  skipDemo: () => void;
  resetLesson: () => void;
  nextLesson: () => void;
  dispose: () => void;
};

export const demoPlaying = (phase: DemoPhase) => ['command', 'action', 'result'].includes(phase);
const terminal = (simulation: GameState) => ['failed', 'finished', 'completed'].includes(simulation.status);
const entryHints = (level: LevelDefinition) => (level.learning.visualHints ?? [])
  .filter((hint) => hint.reveal.when === 'on-entry').map((hint) => hint.id);

export function visibleHints(level: LevelDefinition, program: Program, simulation: GameState, revealed: readonly string[]): readonly VisualHint[] {
  if (simulation.completion) return [];
  return (level.learning.visualHints ?? []).filter((hint) => {
    if (!revealed.includes(hint.id)) return false;
    const cue = hint.cue;
    if (cue.type === 'relative-turn') return samePosition(simulation.avatar.position, cue.position) && simulation.avatar.orientation === cue.orientation;
    if (cue.type === 'repeat-count') return program[cue.commandIndex]?.type === 'repeat';
    if (cue.type === 'program-slot') {
      const loop = cue.loopIndex === undefined ? undefined : program[cue.loopIndex];
      if (cue.loopIndex !== undefined && loop?.type !== 'repeat') return false;
      const scope = loop?.type === 'repeat' ? loop.commands : program;
      return cue.index === scope.length;
    }
    if (cue.type === 'command') {
      const command = program[cue.path[0]], original = level.initialProgram[cue.path[0]];
      const current = cue.path.length === 1 ? command : command?.type === 'repeat' ? command.commands[cue.path[1]] : undefined;
      const initial = cue.path.length === 1 ? original : original?.type === 'repeat' ? original.commands[cue.path[1]] : undefined;
      return current !== undefined && current.type === initial?.type;
    }
    return true;
  });
}

// Tutorials operate the same public actions as the child. Rendering never advances a lesson.
export function createLessonStore(game: ReturnType<typeof createGameStore>) {
  let timer: ReturnType<typeof setTimeout> | undefined;
  let disposed = false;
  let finishRun: () => void;
  const cancel = () => { clearTimeout(timer); timer = undefined; };
  const initial = () => ({
    levelId: game.getState().level.id, revealed: entryHints(game.getState().level), observedAttempt: false,
    demoPhase: 'idle' as DemoPhase, demoIndex: 0, demoPath: null, demoAction: null,
  });
  const store = createStore<LessonState>((set, get) => {
    const present = (index: number) => {
      if (disposed) return;
      const { level, program, simulation } = game.getState();
      const action = level.learning.demonstration?.[index];
      if (!action) { set({ demoPhase: 'done', demoAction: null, demoPath: null }); return; }
      // The real editor resets the board when a command is selected for replacement.
      if (action.type === 'replace') game.getState().resetSimulation();
      const command = program[simulation.cursor.commandIndex];
      const path: CommandPath | null = action.type === 'replace' ? action.path
        : action.type === 'restart' ? null
        : command?.type === 'repeat' ? [simulation.cursor.commandIndex, simulation.cursor.bodyIndex]
        : [simulation.cursor.commandIndex];
      set({ demoPhase: 'command', demoIndex: index, demoAction: action, demoPath: path });
      timer = setTimeout(() => {
        set({ demoPhase: 'action' });
        const current = game.getState();
        if (action.type === 'step') current.step();
        if (action.type === 'restart') current.resetSimulation();
        if (action.type === 'replace') current.replaceCommand(action.path[action.path.length - 1], action.command, action.path.length === 2 ? action.path[0] : undefined);
        if (action.type === 'run') {
          current.run();
          // Run completes through the game subscription below, including collisions.
        } else settle();
      }, DEMO_COMMAND_MS);
    };
    const settle = () => {
      cancel();
      timer = setTimeout(() => {
        set({ demoPhase: 'result' });
        timer = setTimeout(() => present(get().demoIndex + 1), DEMO_RESULT_MS);
      }, DEMO_ACTION_MS);
    };
    finishRun = settle;
    return {
      ...initial(),
      showHint: () => {
        const requested = game.getState().level.learning.visualHints?.filter((hint) => hint.reveal.when === 'on-request').map((hint) => hint.id) ?? [];
        set({ revealed: [...new Set([...get().revealed, ...requested])] });
      },
      startDemo: () => {
        if (disposed || !game.getState().level.learning.demonstration) return;
        cancel();
        game.getState().stop();
        game.getState().resetProgram();
        game.getState().resetSimulation();
        set(initial());
        present(0);
      },
      skipDemo: () => {
        if (!game.getState().level.learning.demonstration) return;
        cancel();
        game.getState().stop();
        // Skip is an explicit exit from observation; it never awards puzzle completion.
        if (demoPlaying(get().demoPhase)) {
          game.getState().resetProgram();
          game.getState().resetSimulation();
        }
        set({ ...initial(), demoPhase: 'skipped' });
      },
      resetLesson: () => {
        cancel();
        game.getState().stop();
        game.getState().resetProgram();
        game.getState().resetSimulation();
        set(initial());
      },
      nextLesson: () => {
        const { level, simulation } = game.getState();
        const index = curriculumLevels.findIndex((candidate) => candidate.id === level.id);
        const skipped = level.learning.phase === 'demonstration' && get().demoPhase === 'skipped';
        if (index < 0 || !curriculumLevels[index + 1] || demoPlaying(get().demoPhase) || (!simulation.completion && !skipped)) return;
        cancel();
        game.getState().loadLevel(curriculumLevels[index + 1]);
      },
      dispose: () => { disposed = true; cancel(); unsubscribe(); },
    };
  });
  const unsubscribe = game.subscribe((state, previous) => {
    if (state.level !== previous.level) { cancel(); store.setState(initial()); return; }
    const lesson = store.getState();
    const revealed = [...lesson.revealed];
    for (const hint of state.level.learning.visualHints ?? []) {
      const reveal = hint.reveal;
      if (reveal.when === 'after-attempt' && terminal(state.simulation)
        || reveal.when === 'after-action' && state.simulation.events.length > 0 && state.simulation.activeCommandPath?.join('.') === reveal.path.join('.')) {
        if (!revealed.includes(hint.id)) revealed.push(hint.id);
      }
    }
    if (revealed.length !== lesson.revealed.length || terminal(state.simulation) && !lesson.observedAttempt) {
      store.setState({ revealed, observedAttempt: lesson.observedAttempt || terminal(state.simulation) });
    }
    if (lesson.demoPhase === 'action' && lesson.demoAction?.type === 'run' && previous.simulation.status === 'running' && terminal(state.simulation)) {
      finishRun();
    }
  });
  return store;
}

export const lessonStore = createLessonStore(gameStore);
export const useLessonStore = <T,>(selector: (state: LessonState) => T) => useStore(lessonStore, selector);
