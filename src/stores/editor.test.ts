import { afterEach, describe, expect, it, vi } from 'vitest';
import { createGameStore } from './game-store';
import { loopLevel } from '../game/levels/mechanics';
import { kernelLevel } from '../game/levels/kernel';
import { createInitialState } from '../game/interpreter/interpreter';

afterEach(() => vi.useRealTimers());

describe('contextual program editing', () => {
  it('inserts at either end or between commands, including a Repeat body', () => {
    const store = createGameStore(loopLevel), state = () => store.getState();
    state().addCommand('turn-right');
    state().addCommand('forward', undefined, 0);
    state().addCommand('repeat', undefined, 1);
    state().addCommand('turn-left', 1);
    state().addCommand('forward', 1, 0);
    state().addCommand('turn-right', 1, 1);
    expect(state().program).toEqual([
      { type: 'forward' },
      { type: 'repeat', count: 2, commands: [{ type: 'forward' }, { type: 'turn-right' }, { type: 'turn-left' }] },
      { type: 'turn-right' },
    ]);
    const fullBody = state().program;
    state().addCommand('forward', 1, 0);
    state().addCommand('repeat', 1, 0);
    expect(state().program).toBe(fullBody);
    for (const index of [-1, 8, 0.5, NaN]) state().addCommand('forward', undefined, index);
    expect(state().program).toBe(fullBody);
    state().addCommand('turn-left', undefined, 3);
    const full = state().program;
    state().addCommand('forward', undefined, 0);
    expect(state().program).toBe(full);
  });

  it('replaces a primitive in a full scope, resetting stepped/failed state without deleting its neighbors', () => {
    const store = createGameStore({ ...loopLevel, maxProgramSlots: 1, maxLoopBodySlots: 2 }), state = () => store.getState();
    state().addCommand('repeat'); state().addCommand('forward', 0); state().addCommand('forward', 0);
    state().step(); state().step();
    expect(state().simulation.status).toBe('failed');
    state().replaceCommand(1, 'turn-right', 0);
    expect(state().simulation).toEqual(createInitialState(state().level));
    expect(state().program).toEqual([{ type: 'repeat', count: 2, commands: [{ type: 'forward' }, { type: 'turn-right' }] }]);
    state().step();
    const snapshot = state();
    state().replaceCommand(0, 'forward', 0);
    state().replaceCommand(0, 'turn-left');
    state().replaceCommand(7, 'turn-left', 0);
    expect(state()).toBe(snapshot);
    state().replaceCommand(0, 'turn-left', 0);
    expect(state().simulation.status).toBe('idle');
  });

  it('locks insertion and replacement during execution and preserves permission checks', () => {
    vi.useFakeTimers();
    const store = createGameStore(loopLevel), state = () => store.getState();
    state().addCommand('forward'); state().run();
    const snapshot = state();
    state().replaceCommand(0, 'turn-right');
    state().addCommand('turn-left', undefined, 0);
    expect(state()).toBe(snapshot);
    state().dispose();
    const beginner = createGameStore(kernelLevel);
    beginner.getState().addCommand('forward');
    beginner.getState().replaceCommand(0, 'turn-right');
    expect(beginner.getState().program).toEqual([{ type: 'forward' }]);
  });
});
