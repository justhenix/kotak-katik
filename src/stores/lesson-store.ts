import { createStore } from 'zustand/vanilla';
import { useStore } from 'zustand';
import { curriculumLevels } from '../game/levels/curriculum';
import { samePosition } from '../game/engine/simulation';
import { gameStore } from './game-store';
import type { createGameStore } from './game-store';
import type { CommandPath, DemonstrationAction, GameState, LevelDefinition, Program, TutorialTarget, VisualHint } from '../game/types';

export const DEMO_COMMAND_MS = 700;
export const DEMO_ACTION_MS = 350;
export const DEMO_RESULT_MS = 1000;
export const DEMO_TAP_MS = 140;
type DemoPhase = 'idle' | 'command' | 'action' | 'result' | 'done' | 'skipped' | 'interrupted';
type LessonState = {
  levelId: string;
  revealed: readonly string[];
  observedAttempt: boolean;
  demoPhase: DemoPhase;
  demoIndex: number;
  demoPath: CommandPath | null;
  demoAction: DemonstrationAction | null;
  guideIndex: number;
  guideChoice: boolean;
  hintStrength: number;
  chooseGuideTarget: () => void;
  interruptDemo: () => void;
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
    guideIndex: 0, guideChoice: false, hintStrength: 0,
  });
  const store = createStore<LessonState>((set, get) => {
    const present = (index: number) => {
      if (disposed) return;
      const { level, program, simulation } = game.getState();
      const action = level.learning.demonstration?.[index];
      if (!action) { set({ demoPhase: 'done', demoAction: null, demoPath: null }); return; }
      // The real editor resets the board when a command is selected for replacement.
      const command = program[simulation.cursor.commandIndex];
      const path: CommandPath | null = action.type === 'replace' || action.type === 'select' ? action.path
        : action.type === 'add' ? action.loopIndex === undefined ? [action.index] : [action.loopIndex, action.index]
        : action.type === 'restart' ? null
        : command?.type === 'repeat' ? [simulation.cursor.commandIndex, simulation.cursor.bodyIndex]
        : [simulation.cursor.commandIndex];
      set({ demoPhase: 'command', demoIndex: index, demoAction: action, demoPath: path });
      timer = setTimeout(() => {
        set({ demoPhase: 'action' });
        timer = setTimeout(() => {
          const current = game.getState();
          if (action.type === 'add') current.addCommand(action.command, action.loopIndex, action.index);
          if (action.type === 'select') current.resetSimulation();
          if (action.type === 'step') current.step();
          if (action.type === 'restart') current.resetSimulation();
          if (action.type === 'replace') current.replaceCommand(action.path[action.path.length - 1], action.command, action.path.length === 2 ? action.path[0] : undefined);
          if (action.type === 'run') {
            current.run();
            // Run completes through the game subscription below, including collisions.
          } else settle();
        }, DEMO_TAP_MS);
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
      chooseGuideTarget: () => set({ guideChoice: true }),
      interruptDemo: () => {
        if (!demoPlaying(get().demoPhase)) return;
        cancel(); game.getState().stop(); set({ demoPhase: 'interrupted', demoAction: null, demoPath: null });
      },
      showHint: () => {
        const requested = game.getState().level.learning.visualHints?.filter((hint) => hint.reveal.when === 'on-request').map((hint) => hint.id) ?? [];
        set({ revealed: [...new Set([...get().revealed, ...requested])], hintStrength: Math.min(2, get().hintStrength + 1) });
      },
      startDemo: () => {
        if (disposed || !game.getState().level.learning.demonstration) return;
        cancel();
        game.getState().stop();
        game.getState().resetProgram();
        game.getState().resetSimulation();
        if (game.getState().level.learning.demonstrationFromEmpty) {
          for (let index = game.getState().program.length - 1; index >= 0; index--) game.getState().removeCommand(index);
        }
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
    if (state.level.learning.phase === 'guided') {
      let index = lesson.guideIndex;
      const guidance = state.level.learning.guidance ?? [];
      const complete = (guideIndex: number) => {
        const condition = guidance[guideIndex].complete;
        const top = condition.type === 'command' ? state.program[condition.path[0]] : undefined;
        const command = condition.type === 'command' && condition.path.length === 2 ? top?.type === 'repeat' ? top.commands[condition.path[1]] : undefined : top;
        const loop = condition.type === 'count' ? state.program[condition.index] : undefined;
        return condition.type === 'attempt' ? terminal(state.simulation)
          : condition.type === 'count' ? loop?.type === 'repeat' && loop.count !== condition.differentFrom
          : command !== undefined && condition.choices.includes(command.type);
      };
      // Undoing a completed edit restores its cue; an observed attempt stays observed.
      if (state.program !== previous.program) {
        const undone = guidance.findIndex((interaction, guideIndex) => guideIndex < index && interaction.complete.type !== 'attempt' && !complete(guideIndex));
        if (undone >= 0) index = undone;
      }
      while (guidance[index] && complete(index)) {
        index++;
      }
      if (index !== lesson.guideIndex || state.program !== previous.program) store.setState({ guideIndex: index, guideChoice: false, hintStrength: 0 });
      if (terminal(state.simulation) && state.simulation !== previous.simulation && !state.simulation.completion) store.getState().showHint();
    }
    const revealed = [...store.getState().revealed];
    for (const hint of state.level.learning.visualHints ?? []) {
      const reveal = hint.reveal;
      if (reveal.when === 'after-attempt' && terminal(state.simulation)
        || reveal.when === 'after-action' && state.simulation.events.length > 0 && state.simulation.activeCommandPath?.join('.') === reveal.path.join('.')) {
        if (!revealed.includes(hint.id)) revealed.push(hint.id);
      }
    }
    if (revealed.length !== store.getState().revealed.length || terminal(state.simulation) && !lesson.observedAttempt) {
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

export function tutorialTarget(level: LevelDefinition, program: Program, simulation: GameState, lesson: LessonState): TutorialTarget | null {
  if (demoPlaying(lesson.demoPhase)) {
    const action = lesson.demoAction;
    if (lesson.demoPhase === 'action' && simulation.status === 'running') return null;
    if (lesson.demoPhase === 'result') return action?.type === 'add' ? { type: 'command', path: lesson.demoPath! } : null;
    if (action?.type === 'add' || action?.type === 'replace') return { type: 'palette', command: action.command, loopIndex: action.type === 'add' ? action.loopIndex : undefined };
    if (action?.type === 'select') return { type: 'command', path: action.path };
    if (action?.type === 'restart') return { type: 'inspect' };
    return action?.type === 'step' ? { type: 'step' } : { type: 'run' };
  }
  if (level.learning.phase !== 'guided' || simulation.completion || simulation.status === 'running') return null;
  if (program.length < level.initialProgram.length) return { type: 'palette' };
  const emptyLoop = program.findIndex((command) => command.type === 'repeat' && command.commands.length === 0);
  if (emptyLoop >= 0) return lesson.guideChoice ? { type: 'palette', loopIndex: emptyLoop } : { type: 'slot', loopIndex: emptyLoop, index: 0 };
  if (simulation.status === 'failed' && simulation.activeCommandPath) return lesson.hintStrength > 0 ? { type: 'command', path: simulation.activeCommandPath } : null;
  const interaction = level.learning.guidance?.[lesson.guideIndex];
  if (!interaction) return program.length ? lesson.guideChoice ? { type: 'palette' } : { type: 'run' } : null;
  if (lesson.guideChoice && interaction.target.type === 'slot') return { type: 'palette' };
  if (lesson.guideChoice && interaction.target.type === 'run') return { type: 'palette' };
  if (lesson.guideChoice && interaction.target.type === 'command' && interaction.complete.type === 'count') return { type: 'count', index: interaction.complete.index };
  return interaction.target;
}

export function tutorialSelector(target: TutorialTarget | null): string | null {
  if (!target) return null;
  if (target.type === 'palette') return target.command ? `.palette-command[data-type="${target.command}"]` : '.palette-commands';
  if (target.type === 'slot') return `[data-insert-path="${target.loopIndex === undefined ? target.index : `${target.loopIndex}.${target.index}`}"]`;
  if (target.type === 'command') return `.editor [data-command-path="${target.path.join('.')}"]`;
  if (target.type === 'count') return `[data-count-index="${target.index}"]`;
  return target.type === 'inspect' ? '.inspect-action' : target.type === 'step' ? '.step-button' : '.run-button';
}
