import { describe, expect, it } from 'vitest';
import { validateLevel } from '../engine/simulation';
import { createInitialState, executeNextAction } from '../interpreter/interpreter';
import { programError } from '../program';
import type { LevelDefinition, PrimitiveCommand, Program, VisualHint } from '../types';
import { curriculumSolutions } from './__tests__/solutions';
import { CURRICULUM_CONCEPTS, curriculumLevels, findCurriculumLevel } from './curriculum';
import type { CurriculumLevel } from './curriculum';
import { kernelLevel } from './kernel';
import { loopLevel, selectFixture, turningLevel } from './mechanics';
import { executeForValidation, validateCurriculum, verifySolution } from './validate-curriculum';

const F: PrimitiveCommand = { type: 'forward' };
const solution = (level: LevelDefinition) => curriculumSolutions[level.id];
const getLevel = (id: string) => curriculumLevels.find((level) => level.id === id)!;
const replaceLevel = (id: string, change: (level: CurriculumLevel) => CurriculumLevel) =>
  curriculumLevels.map((level) => level.id === id ? change(structuredClone(level)) : level);
const hints = (level: CurriculumLevel, visualHints: readonly VisualHint[]): CurriculumLevel =>
  ({ ...level, learning: { ...level.learning, visualHints } });

function primitiveSolutionExists(level: LevelDefinition): boolean {
  const commands = level.allowedCommands.filter((type): type is PrimitiveCommand['type'] => type !== 'repeat');
  let prefixes: Program[] = [[]];
  for (let length = 1; length <= level.maxProgramSlots!; length++) {
    const next: Program[] = [];
    for (const prefix of prefixes) for (const type of commands) {
      const program: Program = [...prefix, { type }];
      const state = executeForValidation(level, program);
      if (state.completion) return true;
      if (state.status !== 'failed') next.push(program);
    }
    prefixes = next;
  }
  return false;
}

describe('M2A authored curriculum', () => {
  it('has 16 distinct stages, all seven concepts in order and exact solution coverage', () => {
    expect(curriculumLevels).toHaveLength(16);
    expect(new Set(curriculumLevels.map((level) => level.learning.concept))).toEqual(new Set(CURRICULUM_CONCEPTS));
    expect(Object.keys(curriculumSolutions).sort()).toEqual(curriculumLevels.map((level) => level.id).sort());
    expect(() => validateCurriculum(curriculumLevels)).not.toThrow();
    expect(curriculumLevels.map((level) => level.tiles.length)).toEqual([2, 3, 3, 4, 3, 3, 3, 4, 4, 3, 4, 4, 3, 4, 4, 5]);
  });

  it.each(curriculumLevels)('$id has a legal, deterministic solution that collects every fish and exhausts the program', (level) => {
    const snapshot = structuredClone(level);
    const program = solution(level);
    const programSnapshot = structuredClone(program);
    expect(() => validateLevel(level)).not.toThrow();
    expect(programError(level, program)).toBeNull();
    const first = verifySolution(level, program);
    expect(verifySolution(level, program)).toEqual(first);
    expect(first.collectedIds.slice().sort()).toEqual(level.collectibles.map((fish) => fish.id).sort());
    expect(first.cursor.commandIndex).toBe(program.length);
    expect(first.nextCommandIndex).toBe(program.reduce((count, command) => count + (command.type === 'repeat' ? command.count * command.commands.length : 1), 0));
    expect(first.collision).toBeNull();
    expect(first.events.filter((event) => event.type === 'completed')).toHaveLength(1);
    expect(executeNextAction(level, program, first)).toBe(first);
    expect(level).toEqual(snapshot);
    expect(program).toEqual(programSnapshot);
  });

  it.each(curriculumLevels)('$id enforces its top-level budget before any movement', (level) => {
    const oversized: Program = Array.from({ length: level.maxProgramSlots! + 1 }, () => F);
    expect(programError(level, oversized)).toBe('Urutan penuh.');
    const initial = createInitialState(level);
    expect(executeNextAction(level, oversized, initial)).toBe(initial);
    expect(() => verifySolution(level, oversized)).toThrow('Invalid verification program');
  });

  it.each(curriculumLevels.filter((level) => level.allowedCommands.includes('repeat')))('$id enforces loop body budgets and blocks empty bodies for execution', (level) => {
    const oversized: Program = [{ type: 'repeat', count: 2, commands: Array.from({ length: level.maxLoopBodySlots! + 1 }, () => F) }];
    expect(programError(level, oversized)).toBe('Ulangi penuh.');
    const empty: Program = [{ type: 'repeat', count: 2, commands: [] }];
    expect(programError(level, empty, true)).toBeNull();
    expect(programError(level, empty)).toBe('Isi perintah di dalam Ulangi.');
    const initial = createInitialState(level);
    expect(executeNextAction(level, oversized, initial)).toBe(initial);
    expect(executeNextAction(level, empty, initial)).toBe(initial);
  });

  it.each(curriculumLevels.filter((level) => level.learning.concept === 'loop' || level.learning.concept === 'mixed-application'))('$id uses a budget that requires repetition, with no primitive-only solution', (level) => {
    expect(primitiveSolutionExists(level)).toBe(false);
    expect(solution(level).some((command) => command.type === 'repeat')).toBe(true);
  });

  it.each(curriculumLevels.filter((level) => level.allowedCommands.length < 4))('$id rejects every locked command before execution', (level) => {
    for (const type of ['forward', 'turn-left', 'turn-right', 'repeat'] as const) {
      if (level.allowedCommands.includes(type)) continue;
      const program: Program = type === 'repeat' ? [{ type, count: 2, commands: [F] }] : [{ type }];
      expect(programError(level, program)).toBe('Perintah belum tersedia.');
      expect(() => verifySolution(level, program)).toThrow('Invalid verification program');
    }
  });

  it('keeps simple movement budgets generous and accepts different valid repeated patterns', () => {
    for (const level of curriculumLevels.filter((level) => ['movement', 'sequencing', 'turning', 'combined-paths'].includes(level.learning.concept))) {
      expect(level.maxProgramSlots).toBeGreaterThan(solution(level).length);
      expect(primitiveSolutionExists(level)).toBe(true);
    }
    const square = getLevel('m2-repeat-alone');
    const three: Program = [{ type: 'repeat', count: 3, commands: [F, { type: 'turn-right' }] }];
    const four: Program = [{ type: 'repeat', count: 4, commands: [F, { type: 'turn-right' }] }];
    expect(verifySolution(square, three).avatar.position).toEqual({ x: 0, z: 1 });
    expect(verifySolution(square, four).avatar.position).toEqual(square.avatar.position);
  });

  it('introduces only forward, then left, then right, then Repeat; uses every starting facing', () => {
    expect(curriculumLevels.map((level) => level.allowedCommands)).toEqual([
      ...Array(4).fill(['forward']), ['forward', 'turn-left'],
      ...Array(4).fill(['forward', 'turn-left', 'turn-right']),
      ...Array(7).fill(['forward', 'turn-left', 'turn-right', 'repeat']),
    ]);
    expect(new Set(curriculumLevels.map((level) => level.avatar.orientation))).toEqual(new Set(['north', 'east', 'south', 'west']));
  });

  it('makes sequence order observable once different commands have been taught', () => {
    const level = getLevel('m2-left-watch');
    const reordered: Program = [{ type: 'turn-left' }, F, F];
    expect(programError(level, reordered)).toBeNull();
    expect(executeForValidation(level, reordered).status).toBe('failed');
    expect(verifySolution(level, solution(level)).status).toBe('completed');
  });

  it.each(curriculumLevels.filter((level) => level.learning.concept === 'debugging' && level.initialProgram.length))('$id begins with a legal editable mistake and withholds fault hints until observation', (level) => {
    expect(programError(level, level.initialProgram)).toBeNull();
    expect(['failed', 'finished']).toContain(executeForValidation(level, level.initialProgram).status);
    expect(() => verifySolution(level, level.initialProgram)).toThrow('Unsolved level');
    expect(level.learning.visualHints.every((hint) => hint.reveal.when === 'after-attempt' || hint.reveal.when === 'on-request')).toBe(true);
    expect(solution(level)).not.toEqual(level.initialProgram);
  });

  it('distinguishes a wrong turn, a missing step, and overrun after collecting all fish', () => {
    const results = ['m2-debug-watch', 'm2-debug-together', 'm2-debug-alone'].map((id) => {
      const level = getLevel(id);
      return executeForValidation(level, id === 'm2-debug-alone' ? [{ type: 'repeat', count: 4, commands: [F] }] : level.initialProgram);
    });
    expect(results.map((state) => state.status)).toEqual(['failed', 'finished', 'failed']);
    expect(results.map((state) => state.objectiveSatisfied)).toEqual([false, false, true]);
    expect(results[0].activeCommandPath).toEqual([2]);
    expect(results[2].activeCommandPath).toEqual([0, 0]);
    expect(results[2].loopIteration).toBe(4);
    expect(results.every((state) => !state.completion)).toBe(true);
  });
});

describe('M2A data validation rejects authoring mistakes', () => {
  const mutations: readonly [string, string, (level: CurriculumLevel) => CurriculumLevel, string][] = [
    ['duplicate ID', 'm2-move-try', (level) => ({ ...level, id: 'm2-move-watch' }), 'duplicate stage ID'],
    ['stage order', 'm2-move-try', (level) => ({ ...level, curriculum: { ...level.curriculum, order: 8 } }), 'stage order'],
    ['future prerequisite', 'm2-move-try', (level) => ({ ...level, curriculum: { ...level.curriculum, prerequisiteIds: ['m2-repeat-alone'] } }), 'prerequisite'],
    ['concept skip', 'm2-sequence-watch', (level) => ({ ...level, learning: { ...level.learning, concept: 'turning' } }), 'concept progression'],
    ['premature turns', 'm2-move-watch', (level) => ({ ...level, allowedCommands: ['forward', 'turn-left'] }), 'too early'],
    ['disconnected tile', 'm2-move-watch', (level) => ({ ...level, tiles: [...level.tiles, { position: { x: 9, z: 9 }, kind: 'floor' }] }), 'Disconnected'],
    ['overlapping fish', 'm2-move-watch', (level) => ({ ...level, collectibles: [...level.collectibles, { id: 'other', position: level.collectibles[0].position }] }), 'Overlapping'],
    ['no slot budget', 'm2-move-watch', (level) => ({ ...level, maxProgramSlots: undefined }), 'program limit'],
    ['invalid region', 'm2-move-watch', (level) => hints(level, [{ ...level.learning.visualHints[0], cue: { type: 'board-region', positions: [{ x: 9, z: 9 }] } }]), 'hint region'],
    ['unavailable choice', 'm2-move-try', (level) => hints(level, [{ ...level.learning.visualHints[0], cue: { type: 'program-slot', index: 0, choices: ['repeat'] } }]), 'hint command'],
    ['unreachable slot', 'm2-move-try', (level) => hints(level, [{ ...level.learning.visualHints[0], cue: { type: 'program-slot', index: 3, choices: ['forward'] } }]), 'hint slot'],
    ['missing reveal action', 'm2-sequence-watch', (level) => hints(level, [{ ...level.learning.visualHints[0], reveal: { when: 'after-action', path: [8] } }]), 'reveal path'],
    ['incorrect facing cue', 'm2-left-watch', (level) => hints(level, [{ ...level.learning.visualHints[0], cue: { type: 'relative-turn', position: { x: 1, z: 0 }, orientation: 'west', direction: 'left' } }]), 'disagrees'],
    ['early fault reveal', 'm2-debug-watch', (level) => hints(level, [{ ...level.learning.visualHints[0], reveal: { when: 'on-entry' } }]), 'before observation'],
    ['prepared independent stage', 'm2-debug-alone', (level) => ({ ...level, initialProgram: solution(level) }), 'start empty'],
    ['relocked commands', 'm2-repeat-together', (level) => ({ ...level, allowedCommands: ['forward', 'repeat'] }), 'relocked'],
    ['solved guided task', 'm2-move-try', (level) => ({ ...level, initialProgram: [F, F] }), 'already solved'],
    ['unreachable guided target', 'm2-move-try', (level) => ({ ...level, learning: { ...level.learning, guidance: [{ target: { type: 'slot', index: 8 }, complete: { type: 'command', path: [1], choices: ['forward'] } }] } }), 'guided slot'],
    ['unavailable guided choice', 'm2-move-try', (level) => ({ ...level, learning: { ...level.learning, guidance: [{ target: { type: 'palette' }, complete: { type: 'command', path: [1], choices: ['repeat'] } }] } }), 'guided command'],
    ['pre-completed interaction', 'm2-move-try', (level) => ({ ...level, learning: { ...level.learning, guidance: [{ target: { type: 'palette' }, complete: { type: 'command', path: [0], choices: ['forward'] } }] } }), 'already complete'],
  ];
  it.each(mutations)('rejects %s', (_, id, change, message) => {
    expect(() => validateCurriculum(replaceLevel(id, change))).toThrow(message);
  });
  it('rejects repeated scaffolding, missing concepts, and missing demonstrated solutions', () => {
    expect(() => validateCurriculum([])).toThrow('12–16');
    expect(() => validateCurriculum(replaceLevel('m2-repeat-alone', (level) => ({ ...level, learning: { ...level.learning, phase: 'guided' } })))).toThrow('lacks support');
    expect(() => validateCurriculum(replaceLevel('m2-left-watch', (level) => ({ ...level, initialProgram: [F, F] })))).toThrow('Unsolved');
    expect(() => verifySolution(kernelLevel, [])).toThrow('empty');
  });
});

describe('M2A preview selection preserves engineering routes', () => {
  it.each(curriculumLevels)('previews $id by stable ID, even alongside a fixture parameter', (level) => {
    expect(findCurriculumLevel(level.id)).toBe(level);
    expect(selectFixture(`?level=${level.id}`)).toBe(level);
    expect(selectFixture(`?fixture=loops&level=${level.id}`)).toBe(level);
  });
  it('preserves default, named fixtures, and predictable unknown-ID fallback', () => {
    expect(selectFixture('')).toBe(kernelLevel);
    expect(selectFixture('?level=missing')).toBe(kernelLevel);
    expect(selectFixture('?level=')).toBe(kernelLevel);
    expect(selectFixture('?level=M2-MOVE-WATCH')).toBe(kernelLevel);
    expect(selectFixture('?fixture=turning&level=missing')).toBe(turningLevel);
    expect(selectFixture('?fixture=loops')).toBe(loopLevel);
    expect(selectFixture('?fixture=kernel')).toBe(kernelLevel);
    expect(selectFixture('?fixture=unknown')).toBe(kernelLevel);
    expect(findCurriculumLevel('missing')).toBeUndefined();
  });
});
