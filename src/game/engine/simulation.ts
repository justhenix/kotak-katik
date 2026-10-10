import type { AvatarState, GameEvent, LevelDefinition, Orientation, Position } from '../types';
import { programError } from '../program';

export const ORIENTATIONS: readonly Orientation[] = ['north', 'east', 'south', 'west'];
const VECTORS: Record<Orientation, Position> = {
  north: { x: 0, z: -1 }, east: { x: 1, z: 0 },
  south: { x: 0, z: 1 }, west: { x: -1, z: 0 },
};
export const samePosition = (a: Position, b: Position) => a.x === b.x && a.z === b.z;

export function turn(avatar: AvatarState, direction: 'left' | 'right') {
  const orientation = ORIENTATIONS[(ORIENTATIONS.indexOf(avatar.orientation) + (direction === 'right' ? 1 : 3)) % 4];
  return {
    avatar: { ...avatar, orientation }, collision: null,
    event: { type: 'turned', direction, from: avatar.orientation, to: orientation } as const,
  };
}

export function moveForward(level: LevelDefinition, avatar: AvatarState) {
  const vector = VECTORS[avatar.orientation];
  const position = { x: avatar.position.x + vector.x, z: avatar.position.z + vector.z };
  const tile = level.tiles.find((tile) => samePosition(tile.position, position));
  if (!tile) {
    const collision = { position, reason: 'invalid-tile' } as const;
    return { avatar, collision, event: { type: 'collision', collision } as const };
  }
  return {
    avatar: { ...avatar, position }, collision: null,
    event: { type: 'moved', from: avatar.position, to: position } as const,
  };
}

export function collectFish(level: LevelDefinition, position: Position, collectedIds: readonly string[]) {
  const pickups = level.collectibles.filter((fish) =>
    samePosition(fish.position, position) && !collectedIds.includes(fish.id));
  return {
    collectedIds: [...collectedIds, ...pickups.map((fish) => fish.id)],
    events: pickups.map((fish): GameEvent => ({ type: 'collected', id: fish.id })),
  };
}

export function validateLevel(level: LevelDefinition): void {
  const positions = new Set(level.tiles.map(({ position }) => `${position.x},${position.z}`));
  const traversable = (position: Position) => level.tiles.some((tile) =>
    tile.kind === 'floor' && samePosition(tile.position, position));
  if (positions.size !== level.tiles.length) throw new Error(`Duplicate tile in ${level.id}`);
  if (level.tiles.some(({ position }) => !Number.isInteger(position.x) || !Number.isInteger(position.z))) {
    throw new Error(`Non-integer tile in ${level.id}`);
  }
  if (!traversable(level.avatar.position)) throw new Error(`Invalid start in ${level.id}`);
  if (!ORIENTATIONS.includes(level.avatar.orientation)) throw new Error(`Invalid orientation in ${level.id}`);
  if (level.collectibles.length === 0 || level.collectibles.some((fish) =>
    !traversable(fish.position) || samePosition(fish.position, level.avatar.position))) {
    throw new Error(`Invalid fish position in ${level.id}`);
  }
  if (new Set(level.collectibles.map((fish) => fish.id)).size !== level.collectibles.length) {
    throw new Error(`Duplicate fish ID in ${level.id}`);
  }
  for (const limit of [level.maxProgramSlots, level.maxLoopBodySlots]) {
    if (limit !== undefined && (!Number.isInteger(limit) || limit < 0)) throw new Error(`Invalid slot limit in ${level.id}`);
  }
  const error = programError(level, level.initialProgram, true);
  if (error) throw new Error(`Invalid initial program in ${level.id}: ${error}`);
}
