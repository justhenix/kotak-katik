import { afterEach, describe, expect, it, vi } from 'vitest';
import { ACTION_PACE_MS, createGameStore } from '../../stores/game-store';
import { createInitialState } from '../interpreter/interpreter';
import type { Program } from '../types';
import { curriculumSolutions } from './__tests__/solutions';
import { curriculumLevels } from './curriculum';

afterEach(() => { vi.clearAllTimers(); vi.useRealTimers(); });

describe('M2A uses the existing M1 execution and editor', () => {
  it.each(curriculumLevels)('$id solution Run/Step agree after every primitive and Reset/Retry restore the board', (level) => {
    vi.useFakeTimers();
    const program = curriculumSolutions[level.id];
    const playable = { ...level, initialProgram: program };
    const run = createGameStore(playable);
    const step = createGameStore(playable);
    run.getState().run();
    expect(run.getState().simulation.nextCommandIndex).toBe(0);
    for (let action = 0; run.getState().simulation.status === 'running' && action < 64; action++) {
      const before = run.getState().simulation.nextCommandIndex;
      vi.advanceTimersByTime(ACTION_PACE_MS - 1);
      expect(run.getState().simulation.nextCommandIndex).toBe(before);
      vi.advanceTimersByTime(1);
      step.getState().step();
      expect({ ...run.getState().simulation, status: step.getState().simulation.status }).toEqual(step.getState().simulation);
    }
    const completed = run.getState().simulation;
    expect(completed.status).toBe('completed');
    expect(completed).toEqual(step.getState().simulation);
    expect(vi.getTimerCount()).toBe(0);
    run.getState().retry();
    expect(run.getState().simulation.avatar).toEqual(level.avatar);
    expect(run.getState().simulation.collectedIds).toEqual([]);
    expect(run.getState().program).toEqual(program);
    vi.runAllTimers();
    expect(run.getState().simulation).toEqual(completed);
    run.getState().removeCommand(0);
    expect(run.getState().simulation).toEqual(createInitialState(level));
    run.getState().resetProgram();
    expect(run.getState().program).toEqual(program);
    expect(run.getState().program).not.toBe(program);
    run.getState().dispose(); step.getState().dispose();
  });

  it.each(curriculumLevels.filter((level) => level.initialProgram.length))('$id authored starter Run/Step agree, including guided shortfalls and debugging collisions', (level) => {
    vi.useFakeTimers();
    const run = createGameStore(level);
    const step = createGameStore(level);
    run.getState().run();
    for (let action = 0; run.getState().simulation.status === 'running' && action < 64; action++) {
      vi.advanceTimersByTime(ACTION_PACE_MS);
      step.getState().step();
      expect({ ...run.getState().simulation, status: step.getState().simulation.status }).toEqual(step.getState().simulation);
    }
    expect(run.getState().simulation).toEqual(step.getState().simulation);
    expect(run.getState().simulation.status).not.toBe('running');
    expect(vi.getTimerCount()).toBe(0);
    run.getState().resetProgram();
    expect(run.getState().program).toEqual(level.initialProgram);
    expect(run.getState().simulation).toEqual(createInitialState(level));
    run.getState().dispose(); step.getState().dispose();
  });

  it.each(curriculumLevels)('$id can be constructed through legal editor operations and guards capacity and locked commands', (level) => {
    const emptyLevel = { ...level, initialProgram: [] as Program };
    const store = createGameStore(emptyLevel);
    const state = () => store.getState();
    for (const command of curriculumSolutions[level.id]) {
      const index = state().program.length;
      state().addCommand(command.type);
      if (command.type === 'repeat') {
        for (const child of command.commands) state().addCommand(child.type, index);
        state().setRepeatCount(index, command.count);
      }
    }
    expect(state().program).toEqual(curriculumSolutions[level.id]);
    while (state().program.length < level.maxProgramSlots!) state().addCommand('forward');
    const full = state().program;
    state().addCommand('forward');
    expect(state().program).toBe(full);
    for (const type of ['turn-left', 'turn-right', 'repeat'] as const) {
      if (level.allowedCommands.includes(type)) continue;
      state().addCommand(type);
      if (type !== 'repeat') state().replaceCommand(0, type);
      expect(state().program).toBe(full);
    }
    const loop = state().program[0];
    if (loop?.type === 'repeat') {
      for (let size = loop.commands.length; size < level.maxLoopBodySlots!; size++) state().addCommand('forward', 0);
      const bodyFull = state().program;
      state().addCommand('forward', 0);
      expect(state().program).toBe(bodyFull);
    }
    state().dispose();
  });

  it.each(curriculumLevels.filter((level) => level.learning.concept === 'debugging'))('$id supports inspect, repair, retry, and restoration of the deliberately faulty starter', (level) => {
    vi.useFakeTimers();
    const snapshot = structuredClone(level);
    const store = createGameStore(level);
    const state = () => store.getState();
    if (level.id === 'm2-debug-alone') {
      state().addCommand('repeat'); state().addCommand('forward', 0); state().setRepeatCount(0, 4);
    }
    state().run(); vi.runAllTimers();
    const failed = state().simulation;
    expect(['failed', 'finished']).toContain(failed.status);
    state().retry(); vi.runAllTimers();
    expect(state().simulation).toEqual(failed);
    state().step();
    expect(state().simulation.nextCommandIndex).toBe(1);
    if (level.id === 'm2-debug-watch') state().replaceCommand(1, 'turn-left');
    else if (level.id === 'm2-debug-together') state().addCommand('forward');
    else state().setRepeatCount(0, 3);
    expect(state().program).toEqual(curriculumSolutions[level.id]);
    expect(state().simulation).toEqual(createInitialState(level));
    state().retry(); vi.runAllTimers();
    expect(state().simulation.status).toBe('completed');
    state().resetProgram();
    expect(state().program).toEqual(level.initialProgram);
    expect(state().simulation).toEqual(createInitialState(level));
    expect(level).toEqual(snapshot);
    state().dispose();
    expect(vi.getTimerCount()).toBe(0);
  });
});
