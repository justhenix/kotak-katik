import { afterEach, describe, expect, it, vi } from 'vitest';
import { createInitialState } from '../game/interpreter/interpreter';
import { loopLevel, turningLevel } from '../game/levels/mechanics';
import type { Program, RepeatCount } from '../game/types';
import { ACTION_PACE_MS, createGameStore } from './game-store';

afterEach(() => vi.useRealTimers());
const circle = (count: RepeatCount): Program => [{ type: 'repeat', count, commands: [{ type: 'forward' }, { type: 'turn-right' }] }];

describe('M1 store and timer lifecycle', () => {
  it('Run/Step agree across top-level/loop boundaries and a failed action', () => {
    vi.useFakeTimers();
    const programs: Program[] = [
      [{ type: 'turn-left' }, { type: 'repeat', count: 2, commands: [{ type: 'turn-right' }] }, { type: 'turn-left' }, { type: 'repeat', count: 3, commands: [{ type: 'turn-left' }, { type: 'turn-right' }] }],
      [{ type: 'repeat', count: 3, commands: [{ type: 'forward' }] }, { type: 'turn-right' }],
    ];
    for (const initialProgram of programs) {
      const level = { ...loopLevel, initialProgram };
      const run = createGameStore(level), step = createGameStore(level);
      run.getState().run();
      for (let i = 0; i < 20; i++) {
        vi.advanceTimersByTime(ACTION_PACE_MS);
        step.getState().step();
        expect({ ...run.getState().simulation, status: step.getState().simulation.status }).toEqual(step.getState().simulation);
        if (run.getState().simulation.status !== 'running') break;
      }
      expect(run.getState().simulation).toEqual(step.getState().simulation);
      expect(vi.getTimerCount()).toBe(0);
    }
  });

  it.each([2, 3, 4] as const)('Run/Step agree after every primitive of %s× Repeat, with 400 ms pacing', (count) => {
    vi.useFakeTimers();
    const level = { ...loopLevel, initialProgram: circle(count) };
    const run = createGameStore(level), step = createGameStore(level);
    run.getState().run();
    for (let i = 0; i < count * 2; i++) {
      const before = run.getState().simulation.nextCommandIndex;
      vi.advanceTimersByTime(ACTION_PACE_MS - 1);
      expect(run.getState().simulation.nextCommandIndex).toBe(before);
      vi.advanceTimersByTime(1);
      step.getState().step();
      expect({ ...run.getState().simulation, status: step.getState().simulation.status }).toEqual(step.getState().simulation);
    }
    expect(run.getState().simulation).toEqual(step.getState().simulation);
    expect(vi.getTimerCount()).toBe(0);
  });

  it('locks every editor action during Run and deep-restores the initial Repeat on Reset', () => {
    vi.useFakeTimers();
    const level = { ...loopLevel, initialProgram: circle(4) };
    const snapshot = structuredClone(level);
    const store = createGameStore(level);
    store.getState().run();
    store.getState().addCommand('forward');
    store.getState().addCommand('turn-left', 0);
    store.getState().removeCommand(0, 0);
    store.getState().removeCommand(0);
    store.getState().setRepeatCount(0, 2);
    store.getState().moveCommand(0, 1, 0);
    store.getState().resetProgram();
    store.getState().step();
    expect(store.getState().program).toEqual(circle(4));
    vi.runAllTimers();
    store.getState().removeCommand(0, 0);
    expect(store.getState().simulation).toEqual(createInitialState(level));
    store.getState().resetProgram();
    expect(store.getState().program).toEqual(circle(4));
    expect(store.getState().program).not.toBe(level.initialProgram);
    expect(level).toEqual(snapshot);
  });

  it('edits and reorders top-level/body commands after Step and restores the board for every real edit', () => {
    const store = createGameStore(loopLevel);
    const state = () => store.getState();
    state().addCommand('turn-left');
    state().addCommand('repeat');
    state().addCommand('forward', 1);
    state().addCommand('turn-right', 1);
    state().step();
    state().moveCommand(1, -1);
    expect(state().program[0].type).toBe('repeat');
    expect(state().simulation).toEqual(createInitialState(loopLevel));
    state().step();
    state().moveCommand(0, 1, 0);
    expect(state().program[0]).toEqual({ type: 'repeat', count: 2, commands: [{ type: 'turn-right' }, { type: 'forward' }] });
    expect(state().simulation.status).toBe('idle');
    state().step();
    state().setRepeatCount(0, 3);
    expect(state().simulation.status).toBe('idle');
    state().step();
    state().removeCommand(1, 0);
    expect(state().simulation.status).toBe('idle');
    state().step();
    state().addCommand('turn-left', 0);
    expect(state().simulation.status).toBe('idle');
    expect(state().program).toHaveLength(2);
  });

  it('enforces limits at store boundaries, rejects nested loops and leaves invalid edits untouched', () => {
    const store = createGameStore({ ...loopLevel, maxProgramSlots: 1, maxLoopBodySlots: 1 });
    const state = () => store.getState();
    state().addCommand('repeat');
    state().run(); state().step();
    expect(state().simulation.status).toBe('idle');
    state().addCommand('forward');
    state().addCommand('repeat', 0);
    state().addCommand('forward', 0);
    state().addCommand('turn-right', 0);
    expect(state().program).toEqual([{ type: 'repeat', count: 2, commands: [{ type: 'forward' }] }]);
    state().step();
    const simulation = state().simulation;
    state().removeCommand(99); state().moveCommand(0, -1, 0); state().addCommand('forward', 99);
    expect(state().simulation).toBe(simulation);
    const turning = createGameStore(turningLevel);
    turning.getState().addCommand('repeat');
    expect(turning.getState().program).toEqual([]);
  });

  it('Stop cancels before/after an action; Step resumes at the loop boundary; Retry restarts the retained program', () => {
    vi.useFakeTimers();
    const level = { ...loopLevel, initialProgram: circle(4) };
    const store = createGameStore(level);
    const state = () => store.getState();
    state().run(); state().stop(); vi.runAllTimers();
    expect(state().simulation).toEqual(createInitialState(level));
    state().run(); vi.advanceTimersByTime(2 * ACTION_PACE_MS);
    state().stop();
    const stopped = state().simulation;
    expect(stopped.status).toBe('paused');
    expect(stopped.cursor).toEqual({ commandIndex: 0, bodyIndex: 0, iteration: 2 });
    vi.runAllTimers(); expect(state().simulation).toBe(stopped);
    state().step();
    expect(state().simulation.loopIteration).toBe(2);
    expect(state().simulation.nextCommandIndex).toBe(3);
    state().retry();
    expect(state().simulation.avatar).toEqual(level.avatar);
    expect(state().simulation.collectedIds).toEqual([]);
    expect(state().simulation.nextCommandIndex).toBe(0);
    expect(state().program).toEqual(circle(4));
    vi.runAllTimers();
    expect(state().simulation.status).toBe('completed');
    state().step(); expect(state().simulation.nextCommandIndex).toBe(1);
    state().run(); expect(state().simulation.nextCommandIndex).toBe(0);
    state().dispose(); vi.runAllTimers(); expect(state().simulation.nextCommandIndex).toBe(0);
    expect(vi.getTimerCount()).toBe(0);
  });

  it('Run stops at a loop collision; Retry retains it and editing after failure resets collection/cursor', () => {
    vi.useFakeTimers();
    const store = createGameStore(loopLevel);
    const state = () => store.getState();
    state().addCommand('repeat'); state().addCommand('forward', 0);
    state().run(); vi.runAllTimers();
    const failed = state().simulation;
    expect(failed.status).toBe('failed');
    expect(failed.loopIteration).toBe(2);
    expect(vi.getTimerCount()).toBe(0);
    state().retry(); vi.runAllTimers(); expect(state().simulation).toEqual(failed);
    state().addCommand('turn-right', 0);
    expect(state().simulation).toEqual(createInitialState(loopLevel));
    state().resetProgram(); expect(state().program).toEqual([]);
  });
});
