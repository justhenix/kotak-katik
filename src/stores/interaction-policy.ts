import type { CommandType, GameState, GuidedInteraction, LevelDefinition, Program, RepeatCount } from '../game/types';

export type Interaction =
  | { type: 'add' | 'replace'; command: CommandType; index: number; loopIndex?: number }
  | { type: 'remove' | 'move' | 'select' | 'insert'; index: number; loopIndex?: number }
  | { type: 'body'; index: number }
  | { type: 'count'; index: number; count: RepeatCount }
  | { type: 'run' | 'retry' | 'step' | 'stop' | 'resetSimulation' | 'resetProgram' | 'unrelated' };

type Game = { level: LevelDefinition; program: Program; simulation: GameState };
type Lesson = { guideIndex: number; observedAttempt: boolean };
type Task = GuidedInteraction['complete'];

export const isRecovering = (game: Game, lesson: Lesson) => lesson.observedAttempt && !game.simulation.completion;

function commandAt(program: Program, path: readonly number[]) {
  const command = program[path[0]];
  return path.length === 2 ? command?.type === 'repeat' ? command.commands[path[1]] : undefined : command;
}

export function guidedTask(game: Game, lesson: Lesson): Task | undefined {
  const guidance = game.level.learning.guidance ?? [];
  if (!isRecovering(game, lesson)) return guidance[lesson.guideIndex]?.complete;
  const tasks = guidance.map(step => step.complete);
  // Revisit the learner's decision, rather than assuming the collision command caused the mistake.
  return tasks.find(task => task.type === 'command' && !commandAt(game.program, task.path))
    ?? tasks.find(task => task.type === 'count')
    ?? tasks.find(task => task.type === 'command' && task.choices.length > 1)
    ?? tasks.find(task => task.type === 'command');
}

export function guidedCountTask(game: Game, lesson: Lesson) {
  const task = guidedTask(game, lesson);
  const previous = game.level.learning.guidance?.[lesson.guideIndex - 1]?.complete;
  return task?.type === 'count' ? task : task?.type === 'attempt' && previous?.type === 'count' ? previous : undefined;
}

export function canInteract(game: Game, lesson: Lesson, action: Interaction): boolean {
  const { level, program, simulation } = game;
  if (level.learning.phase === 'demonstration') return false;
  if (simulation.status === 'running') return action.type === 'stop';
  if (level.learning.phase !== 'guided') return true;
  if (simulation.completion) return false;
  const task = guidedTask(game, lesson);
  const count = guidedCountTask(game, lesson);
  const recovering = isRecovering(game, lesson);
  if (action.type === 'run' || action.type === 'retry') return recovering || task?.type === 'attempt';
  if (action.type === 'step') return recovering || task?.type === 'attempt' || level.learning.concept === 'debugging';
  if (action.type === 'resetSimulation') return recovering || level.learning.concept === 'debugging';
  if (action.type === 'count') return count?.index === action.index;
  if (action.type === 'select') {
    if (count) return action.loopIndex === undefined && action.index === count.index;
    if (task?.type !== 'command') return false;
    return task.path.length === 2 && action.loopIndex === undefined && action.index === task.path[0]
      || action.index === task.path.at(-1) && action.loopIndex === (task.path.length === 2 ? task.path[0] : undefined);
  }
  if (action.type === 'body') return task?.type === 'command' && task.path.length === 2 && task.path[0] === action.index;
  if (action.type === 'insert' || action.type === 'add' || action.type === 'replace') {
    if (task?.type !== 'command' || task.path.at(-1) !== action.index || (task.path.length === 2 ? task.path[0] : undefined) !== action.loopIndex) return false;
    const exists = commandAt(program, task.path) !== undefined;
    if (action.type === 'insert') return !exists;
    return 'command' in action && task.choices.includes(action.command) && (action.type === 'replace' ? exists && recovering : !exists);
  }
  return false;
}
