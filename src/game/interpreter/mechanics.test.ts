import { describe, expect, it } from 'vitest';
import { ORIENTATIONS, moveForward, turn, validateLevel } from '../engine/simulation';
import { kernelLevel } from '../levels/kernel';
import { loopLevel, selectFixture, turningLevel } from '../levels/mechanics';
import { programError } from '../program';
import type { GameState, LevelDefinition, Program, RepeatCount } from '../types';
import { createInitialState, executeNextAction } from './interpreter';

function trace(level: LevelDefinition, program: Program) {
  const states: GameState[] = [];
  let state = createInitialState(level);
  for (let i = 0; i < 100; i++) {
    const next = executeNextAction(level, program, state);
    if (next === state) break;
    states.push(next);
    state = next;
  }
  return states;
}

describe('M1 primitive execution', () => {
  it.each(ORIENTATIONS)('turns left/right from %s without translation; Forward follows the new facing', (orientation) => {
    const avatar = { position: { x: 0, z: 0 }, orientation };
    const index = ORIENTATIONS.indexOf(orientation);
    for (const direction of ['left', 'right'] as const) {
      const result = turn(avatar, direction);
      expect(result.avatar.orientation).toBe(ORIENTATIONS[(index + (direction === 'left' ? 3 : 1)) % 4]);
      expect(result.avatar.position).toEqual(avatar.position);
      expect(result.event).toEqual({ type: 'turned', direction, from: orientation, to: result.avatar.orientation });
      const grid = { ...turningLevel, tiles: [-1, 0, 1].flatMap((x) => [-1, 0, 1].map((z) => ({ position: { x, z }, kind: 'floor' as const }))) };
      expect(moveForward(grid, result.avatar).avatar.position).not.toEqual(avatar.position);
    }
    expect(turn(turn(avatar, 'left').avatar, 'right').avatar).toEqual(avatar);
    for (const direction of ['left', 'right'] as const) {
      let spun = avatar;
      for (let i = 0; i < 4; i++) spun = turn(spun, direction).avatar;
      expect(spun).toEqual(avatar);
    }
  });

  it('executes turning combinations in order and completes only at the end', () => {
    const states = trace(turningLevel, [{ type: 'forward' }, { type: 'turn-left' }, { type: 'forward' }, { type: 'turn-right' }]);
    expect(states.map((state) => state.avatar)).toEqual([
      { position: { x: 1, z: 0 }, orientation: 'east' },
      { position: { x: 1, z: 0 }, orientation: 'north' },
      { position: { x: 1, z: -1 }, orientation: 'north' },
      { position: { x: 1, z: -1 }, orientation: 'east' },
    ]);
    expect(states[2].objectiveSatisfied).toBe(true);
    expect(states[2].completion).toBe(false);
    expect(states[3].status).toBe('completed');
    expect(states[1].events).toHaveLength(1);
    const wrongOrder = trace(turningLevel, [{ type: 'turn-left' }, { type: 'forward' }]);
    expect(wrongOrder[1].status).toBe('failed');
    expect(wrongOrder[1].activeCommandPath).toEqual([1]);
  });

  it.each([2, 3, 4] as const)('one Step runs one primitive in a %s× loop, including boundaries', (count) => {
    const program: Program = [{ type: 'repeat', count, commands: [{ type: 'forward' }, { type: 'turn-right' }] }];
    const snapshot = structuredClone(program);
    const states = trace(loopLevel, program);
    expect(states).toHaveLength(count * 2);
    expect(states.map((state) => [state.activeCommandPath, state.loopIteration])).toEqual(
      Array.from({ length: count }, (_, iteration) => [[[0, 0], iteration + 1], [[0, 1], iteration + 1]]).flat());
    expect(states.map((state) => state.nextCommandIndex)).toEqual(Array.from({ length: count * 2 }, (_, i) => i + 1));
    expect(states.at(-1)?.cursor).toEqual({ commandIndex: 1, bodyIndex: 0, iteration: 1 });
    expect(states.at(-1)?.status).toBe(count === 2 ? 'finished' : 'completed');
    expect(program).toEqual(snapshot);
    expect(trace(loopLevel, program)).toEqual(states);
  });

  it('leaves a loop, executes the next top-level action and enters another loop', () => {
    const program: Program = [
      { type: 'turn-left' },
      { type: 'repeat', count: 2, commands: [{ type: 'turn-right' }] },
      { type: 'turn-left' },
      { type: 'repeat', count: 3, commands: [{ type: 'turn-left' }, { type: 'turn-right' }] },
    ];
    const states = trace(loopLevel, program);
    expect(states).toHaveLength(10);
    expect(states.map((s) => s.activeCommandPath)).toEqual([[0], [1, 0], [1, 0], [2], [3, 0], [3, 1], [3, 0], [3, 1], [3, 0], [3, 1]]);
    expect(states[3].loopIteration).toBeNull();
    expect(states.at(-1)?.avatar).toEqual(loopLevel.avatar);
    expect(states.at(-1)?.status).toBe('finished');
  });

  it('retains the precise failing loop path/iteration and refuses further actions', () => {
    const program: Program = [{ type: 'repeat', count: 3, commands: [{ type: 'forward' }] }, { type: 'turn-left' }];
    const states = trace(loopLevel, program);
    expect(states).toHaveLength(2);
    const failed = states[1];
    expect(failed.activeCommandPath).toEqual([0, 0]);
    expect(failed.loopIteration).toBe(2);
    expect(failed.nextCommandIndex).toBe(1);
    expect(failed.cursor).toEqual({ commandIndex: 0, bodyIndex: 0, iteration: 2 });
    expect(failed.avatar.position).toEqual({ x: 1, z: 0 });
    expect(executeNextAction(loopLevel, program, failed)).toBe(failed);
    const afterObjective = trace(turningLevel, [{ type: 'forward' }, { type: 'turn-left' }, { type: 'forward' }, { type: 'forward' }]).at(-1)!;
    expect(afterObjective.objectiveSatisfied).toBe(true);
    expect(afterObjective.completion).toBe(false);
    expect(afterObjective.status).toBe('failed');
  });

  it('enforces both optional slot limits, counts a container once, and rejects unsupported/nested/empty loops', () => {
    const loop: Program = [{ type: 'repeat', count: 4, commands: [{ type: 'turn-right' }, { type: 'turn-left' }] }];
    expect(programError({ ...loopLevel, maxProgramSlots: 1, maxLoopBodySlots: 2 }, loop)).toBeNull();
    expect(programError({ ...loopLevel, maxProgramSlots: 0 }, loop)).toBe('Urutan penuh.');
    expect(programError({ ...loopLevel, maxLoopBodySlots: 1 }, loop)).toBe('Ulangi penuh.');
    expect(programError({ ...loopLevel, maxProgramSlots: undefined, maxLoopBodySlots: undefined }, Array(20).fill(loop[0]))).toBeNull();
    expect(programError(kernelLevel, [{ type: 'turn-left' }])).toBe('Perintah belum tersedia.');
    const empty: Program = [{ type: 'repeat', count: 2, commands: [] }];
    const initial = createInitialState(loopLevel);
    expect(executeNextAction(loopLevel, empty, initial)).toBe(initial);
    expect(programError(loopLevel, empty, true)).toBeNull();
    expect(programError(loopLevel, [{ type: 'repeat', count: 5 as RepeatCount, commands: [{ type: 'forward' }] }])).toContain('2×');
    const nested = [{ type: 'repeat', count: 2, commands: [{ type: 'repeat', count: 2, commands: [{ type: 'forward' }] }] }] as unknown as Program;
    expect(programError(loopLevel, nested)).toContain('hanya berisi');
    expect(() => validateLevel({ ...loopLevel, initialProgram: nested })).toThrow('Invalid initial program');
    expect(() => validateLevel({ ...loopLevel, maxLoopBodySlots: -1 })).toThrow('Invalid slot limit');
    expect(() => validateLevel({ ...loopLevel, maxProgramSlots: 1.5 })).toThrow('Invalid slot limit');
  });

  it('preserves the kernel and chooses only known engineering fixtures', () => {
    expect(selectFixture('')).toBe(kernelLevel);
    expect(selectFixture('?fixture=unknown')).toBe(kernelLevel);
    expect(selectFixture('?fixture=kernel')).toBe(kernelLevel);
    expect(selectFixture('?fixture=turning')).toBe(turningLevel);
    expect(selectFixture('?fixture=loops')).toBe(loopLevel);
  });
});
