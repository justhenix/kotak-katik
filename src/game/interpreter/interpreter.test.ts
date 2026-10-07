import { describe, expect, it } from 'vitest';
import { collectFish, moveForward, validateLevel } from '../engine/simulation';
import { kernelLevel } from '../levels/kernel';
import type { LevelDefinition, Program } from '../types';
import { createInitialState, executeNextAction } from './interpreter';

const forwards = (count: number): Program => Array.from({ length: count }, () => ({ type: 'forward' }));
const run = (commands: Program) => commands.reduce(
  (state) => executeNextAction(kernelLevel, commands, state), createInitialState(kernelLevel));

describe('Forward kernel', () => {
  const grid: LevelDefinition = {
    ...kernelLevel,
    tiles: [-1, 0, 1].flatMap((x) => [-1, 0, 1].map((z) => ({ position: { x, z }, kind: 'floor' as const }))),
  };
  it.each([
    ['north', { x: 0, z: -1 }], ['east', { x: 1, z: 0 }],
    ['south', { x: 0, z: 1 }], ['west', { x: -1, z: 0 }],
  ] as const)('moves one tile relative to %s', (orientation, position) => {
    expect(moveForward(grid, { position: { x: 0, z: 0 }, orientation }).avatar).toEqual({ position, orientation });
  });
  it('Step executes exactly one command and collection completes the final action', () => {
    const program = forwards(2);
    const first = executeNextAction(kernelLevel, program, createInitialState(kernelLevel));
    expect(first.avatar.position).toEqual({ x: 1, z: 0 });
    expect(first.collectedIds).toEqual([]);
    expect(first.nextCommandIndex).toBe(1);
    expect(first.status).toBe('paused');
    const final = executeNextAction(kernelLevel, program, first);
    expect(final.avatar.position).toEqual({ x: 2, z: 0 });
    expect(final.collectedIds).toEqual(['fish-end']);
    expect(final.activeCommandIndex).toBe(1);
    expect(final.completion).toBe(true);
    expect(final.status).toBe('completed');
  });
  it('stops at an invalid tile, keeps the cat in place and identifies the failing command', () => {
    const result = run(forwards(4));
    expect(result.avatar.position).toEqual({ x: 2, z: 0 });
    expect(result.status).toBe('failed');
    expect(result.activeCommandIndex).toBe(2);
    expect(result.nextCommandIndex).toBe(2);
    expect(result.collision?.position).toEqual({ x: 3, z: 0 });
    expect(result.completion).toBe(false);
  });
  it('is deterministic and does not mutate its inputs', () => {
    const program = forwards(2);
    const initial = createInitialState(kernelLevel);
    const snapshot = structuredClone({ initial, program, kernelLevel });
    executeNextAction(kernelLevel, program, initial);
    expect({ initial, program, kernelLevel }).toEqual(snapshot);
    expect(run(program)).toEqual(run(program));
  });
  it('collects each fish once and reset restores the initial state', () => {
    const collected = collectFish(kernelLevel, { x: 2, z: 0 }, []);
    expect(collectFish(kernelLevel, { x: 2, z: 0 }, collected.collectedIds))
      .toEqual({ collectedIds: ['fish-end'], events: [] });
    const initial = createInitialState(kernelLevel);
    run(forwards(2));
    expect(createInitialState(kernelLevel)).toEqual(initial);
    expect(initial.collectedIds).toEqual([]);
  });
  it('keeps empty programs idle and incomplete programs inspectable', () => {
    expect(run([])).toEqual(createInitialState(kernelLevel));
    expect(run(forwards(1)).status).toBe('finished');
  });
  it('validates fixture data instead of silently accepting malformed tiles', () => {
    expect(() => validateLevel(kernelLevel)).not.toThrow();
    expect(() => validateLevel({ ...kernelLevel, tiles: [...kernelLevel.tiles, kernelLevel.tiles[0]] })).toThrow('Duplicate tile');
    expect(() => validateLevel({ ...kernelLevel, avatar: { position: { x: 99, z: 99 }, orientation: 'east' } })).toThrow('Invalid start');
    expect(() => validateLevel({ ...kernelLevel, collectibles: [{ id: 'fish', position: { x: 3, z: 0 } }] })).toThrow('Invalid fish');
  });
});
