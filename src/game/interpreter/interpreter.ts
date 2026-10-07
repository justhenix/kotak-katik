import { moveForward, collectFish } from '../engine/simulation';
import type { GameState, LevelDefinition, Program } from '../types';

export function createInitialState(level: LevelDefinition): GameState {
  return {
    levelId: level.id,
    avatar: { position: { ...level.avatar.position }, orientation: level.avatar.orientation },
    collectedIds: [], nextCommandIndex: 0, activeCommandIndex: null,
    status: 'idle', objectiveSatisfied: false, completion: false, collision: null, events: [],
  };
}

export function executeNextAction(level: LevelDefinition, program: Program, state: GameState): GameState {
  if (['failed', 'finished', 'completed'].includes(state.status) || program.length === 0) return state;
  const command = program[state.nextCommandIndex];
  if (!command) return state;
  const result = moveForward(level, state.avatar);
  if (result.collision) {
    return {
      ...state, status: 'failed', completion: false, collision: result.collision,
      activeCommandIndex: state.nextCommandIndex, events: [result.event],
    };
  }
  const pickup = collectFish(level, result.avatar.position, state.collectedIds);
  const nextCommandIndex = state.nextCommandIndex + 1;
  const objectiveSatisfied = level.collectibles.every((fish) => pickup.collectedIds.includes(fish.id));
  const ended = nextCommandIndex === program.length;
  const completion = ended && objectiveSatisfied;
  return {
    ...state, avatar: result.avatar, collectedIds: pickup.collectedIds,
    nextCommandIndex, activeCommandIndex: state.nextCommandIndex,
    objectiveSatisfied, completion, collision: null,
    status: ended ? (completion ? 'completed' : 'finished') : 'paused',
    events: [...[result.event], ...pickup.events, ...(completion ? [{ type: 'completed' } as const] : [])],
  };
}
