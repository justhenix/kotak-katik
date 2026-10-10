import { moveForward, collectFish, turn } from '../engine/simulation';
import { programError } from '../program';
import type { ExecutionCursor, GameState, LevelDefinition, Program } from '../types';

export function createInitialState(level: LevelDefinition): GameState {
  return {
    levelId: level.id,
    avatar: { position: { ...level.avatar.position }, orientation: level.avatar.orientation },
    collectedIds: [], nextCommandIndex: 0, activeCommandIndex: null,
    cursor: { commandIndex: 0, bodyIndex: 0, iteration: 1 }, activeCommandPath: null, loopIteration: null,
    status: 'idle', objectiveSatisfied: false, completion: false, collision: null, events: [],
  };
}

export function executeNextAction(level: LevelDefinition, program: Program, state: GameState): GameState {
  if (['failed', 'finished', 'completed'].includes(state.status) || program.length === 0 || programError(level, program)) return state;
  const { commandIndex, bodyIndex, iteration } = state.cursor;
  const container = program[commandIndex];
  if (!container) return state;
  const inLoop = container.type === 'repeat';
  const command = inLoop ? container.commands[bodyIndex] : container;
  if (!command) return state;
  const activeCommandPath = inLoop ? [commandIndex, bodyIndex] as const : [commandIndex] as const;
  const loopIteration = inLoop ? iteration : null;
  const result = command.type === 'forward' ? moveForward(level, state.avatar)
    : turn(state.avatar, command.type === 'turn-left' ? 'left' : 'right');
  if (result.collision) {
    return {
      ...state, status: 'failed', completion: false, collision: result.collision,
      activeCommandIndex: commandIndex, activeCommandPath, loopIteration, events: [result.event],
    };
  }
  const pickup = command.type === 'forward' ? collectFish(level, result.avatar.position, state.collectedIds)
    : { collectedIds: state.collectedIds, events: [] };
  const nextCommandIndex = state.nextCommandIndex + 1;
  const cursor: ExecutionCursor = inLoop && bodyIndex + 1 < container.commands.length
    ? { commandIndex, bodyIndex: bodyIndex + 1, iteration }
    : inLoop && iteration < container.count
      ? { commandIndex, bodyIndex: 0, iteration: iteration + 1 }
      : { commandIndex: commandIndex + 1, bodyIndex: 0, iteration: 1 };
  const objectiveSatisfied = level.collectibles.every((fish) => pickup.collectedIds.includes(fish.id));
  const ended = cursor.commandIndex === program.length;
  const completion = ended && objectiveSatisfied;
  return {
    ...state, avatar: result.avatar, collectedIds: pickup.collectedIds,
    nextCommandIndex, cursor, activeCommandIndex: commandIndex, activeCommandPath, loopIteration,
    objectiveSatisfied, completion, collision: null,
    status: ended ? (completion ? 'completed' : 'finished') : 'paused',
    events: [...[result.event], ...pickup.events, ...(completion ? [{ type: 'completed' } as const] : [])],
  };
}
