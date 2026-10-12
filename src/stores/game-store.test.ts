import { afterEach, describe, expect, it, vi } from 'vitest';
import { kernelLevel } from '../game/levels/kernel';
import { createInitialState } from '../game/interpreter/interpreter';
import { ACTION_PACE_MS, createGameStore } from './game-store';

afterEach(() => vi.useRealTimers());
const createSolution = () => {
  const store = createGameStore(kernelLevel);
  store.getState().addCommand('forward');
  store.getState().addCommand('forward');
  return store;
};

describe('kernel integration', () => {
  it('Run and Step produce identical state, paced one primitive at a time', () => {
    vi.useFakeTimers();
    const run = createSolution();
    const step = createSolution();
    run.getState().run();
    expect(run.getState().simulation.nextCommandIndex).toBe(0);
    expect(run.getState().simulation.status).toBe('running');
    vi.advanceTimersByTime(ACTION_PACE_MS - 1);
    expect(run.getState().simulation.nextCommandIndex).toBe(0);
    vi.advanceTimersByTime(1);
    expect(run.getState().simulation.nextCommandIndex).toBe(1);
    vi.runAllTimers();
    step.getState().step();
    step.getState().step();
    expect(run.getState().simulation).toEqual(step.getState().simulation);
  });
  it('locks editing during Run and editing after Step restores the board', () => {
    vi.useFakeTimers();
    const store = createSolution();
    store.getState().run();
    store.getState().addCommand('forward');
    store.getState().removeCommand(0);
    store.getState().resetProgram();
    store.getState().step();
    expect(store.getState().program).toHaveLength(2);
    expect(store.getState().simulation.nextCommandIndex).toBe(0);
    vi.runAllTimers();
    store.getState().removeCommand(1);
    expect(store.getState().simulation).toEqual(createInitialState(kernelLevel));
    expect(store.getState().program).toHaveLength(1);
  });
  it('Retry runs the same program from the start and Reset Program clears it', () => {
    vi.useFakeTimers();
    const store = createSolution();
    store.getState().run();
    vi.runAllTimers();
    const completed = store.getState().simulation;
    store.getState().retry();
    expect(store.getState().simulation.collectedIds).toEqual([]);
    expect(store.getState().program).toHaveLength(2);
    vi.runAllTimers();
    expect(store.getState().simulation).toEqual(completed);
    store.getState().resetProgram();
    expect(store.getState().simulation).toEqual(createInitialState(kernelLevel));
    expect(store.getState().program).toEqual(kernelLevel.initialProgram);
  });
  it('Reset restores the board and cursor while retaining the program and cancelling Run', () => {
    vi.useFakeTimers();
    const store = createSolution();
    const program = store.getState().program;
    store.getState().run();
    vi.advanceTimersByTime(ACTION_PACE_MS);
    expect(store.getState().simulation.nextCommandIndex).toBe(1);
    store.getState().resetSimulation();
    expect(store.getState().simulation).toEqual(createInitialState(kernelLevel));
    expect(store.getState().program).toEqual(program);
    vi.runAllTimers();
    expect(store.getState().simulation).toEqual(createInitialState(kernelLevel));
  });
  it('Run after a partial Step restarts; disposal cancels pending actions', () => {
    vi.useFakeTimers();
    const store = createSolution();
    store.getState().step();
    store.getState().run();
    expect(store.getState().simulation.nextCommandIndex).toBe(0);
    store.getState().dispose();
    vi.runAllTimers();
    expect(store.getState().simulation.nextCommandIndex).toBe(0);
  });
});
