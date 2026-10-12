import { ORIENTATIONS, samePosition, validateLevel } from '../engine/simulation';
import { createInitialState, executeNextAction } from '../interpreter/interpreter';
import { programError } from '../program';
import type { CommandPath, CommandType, GameState, LevelDefinition, Position, Program } from '../types';
import { CURRICULUM_CONCEPTS } from './curriculum';
import type { CurriculumLevel } from './curriculum';

const key = ({ x, z }: Position) => `${x},${z}`;
const commandAt = (program: Program, path: CommandPath) => {
  if (path.some((index) => !Number.isInteger(index) || index < 0)) return undefined;
  const command = program[path[0]];
  return path.length === 1 ? command : command?.type === 'repeat' ? command.commands[path[1]] : undefined;
};

// Validation uses the authoritative interpreter, including end-of-program completion.
export function executeForValidation(level: LevelDefinition, program: Program): GameState {
  const error = programError(level, program);
  if (error || program.length === 0) throw new Error(`Invalid verification program in ${level.id}: ${error ?? 'empty'}`);
  const actions = program.reduce((count, command) => count + (command.type === 'repeat' ? command.count * command.commands.length : 1), 0);
  let state = createInitialState(level);
  for (let index = 0; index < actions; index++) {
    const next = executeNextAction(level, program, state);
    if (next === state) break;
    state = next;
  }
  return state;
}

export function verifySolution(level: LevelDefinition, program: Program): GameState {
  const state = executeForValidation(level, program);
  if (!state.completion || state.status !== 'completed') throw new Error(`Unsolved level ${level.id}: ${state.status}`);
  return state;
}

export function validateDemonstration(level: LevelDefinition): void {
  const actions = level.learning.demonstration;
  if (!actions) {
    if (level.learning.phase === 'demonstration') throw new Error(`Missing demonstration in ${level.id}`);
    return;
  }
  if (level.learning.phase !== 'demonstration' || actions.length === 0 || actions.length > 12) throw new Error(`Invalid demonstration in ${level.id}`);
  let program: Program = level.learning.demonstrationFromEmpty ? [] : structuredClone(level.initialProgram);
  let state = createInitialState(level);
  let observedFault = false;
  for (const action of actions) {
    if (action.type === 'select') {
      if (!commandAt(program, action.path)) throw new Error(`Invalid demonstration selection in ${level.id}`);
      state = createInitialState(level);
    }
    if (action.type === 'add') {
      const insertionLoop = action.loopIndex === undefined ? undefined : program[action.loopIndex];
      const scope = action.loopIndex === undefined ? program : insertionLoop?.type === 'repeat' ? insertionLoop.commands : undefined;
      if (!scope || !Number.isInteger(action.index) || action.index < 0 || action.index > scope.length
        || action.loopIndex !== undefined && (!Number.isInteger(action.loopIndex) || action.loopIndex < 0)) throw new Error(`Invalid demonstration insertion in ${level.id}`);
      const command = action.command === 'repeat' ? { type: 'repeat' as const, count: 2 as const, commands: [] } : { type: action.command };
      if (action.loopIndex === undefined) program = [...program.slice(0, action.index), command, ...program.slice(action.index)];
      else {
        const loop = program[action.loopIndex];
        if (loop?.type !== 'repeat' || command.type === 'repeat') throw new Error(`Invalid demonstration insertion in ${level.id}`);
        program = program.map((entry, index) => index === action.loopIndex ? { ...loop, commands: [...loop.commands.slice(0, action.index), command, ...loop.commands.slice(action.index)] } : entry);
      }
      if (programError(level, program, true)) throw new Error(`Invalid demonstration insertion in ${level.id}`);
    }
    if (action.type === 'restart') state = createInitialState(level);
    if (action.type === 'run') state = executeForValidation(level, program);
    if (action.type === 'step') {
      if (['failed', 'finished', 'completed'].includes(state.status)) state = createInitialState(level);
      const next = executeNextAction(level, program, state);
      if (next === state) throw new Error(`Demonstration cannot step in ${level.id}`);
      state = next;
    }
    if (action.type === 'replace') {
      const command = commandAt(program, action.path);
      if (!command || command.type === 'repeat' || !level.allowedCommands.includes(action.command)
        || level.learning.concept === 'debugging' && !observedFault) throw new Error(`Invalid demonstration repair in ${level.id}`);
      program = program.map((entry, index) => index !== action.path[0] ? entry
        : action.path.length === 1 ? { type: action.command }
        : entry.type === 'repeat' ? { ...entry, commands: entry.commands.map((child, body) => body === action.path[1] ? { type: action.command } : child) } : entry);
      state = createInitialState(level);
    }
    observedFault ||= state.status === 'failed' || state.status === 'finished';
  }
  if (!state.completion) throw new Error(`Unfinished demonstration in ${level.id}`);
}

export function validateCurriculum(levels: readonly CurriculumLevel[]): void {
  const fail = (level: CurriculumLevel, reason: string): never => { throw new Error(`${reason} in ${level.id}`); };
  if (levels.length < 12 || levels.length > 16) throw new Error('Curriculum needs 12–16 stages');
  const ids = new Set<string>();
  let previousConcept = -1;
  let previousPhase = -1;
  let previousCommands: readonly CommandType[] = [];
  for (const [index, level] of levels.entries()) {
    validateLevel(level);
    if (!/^m2-[a-z]+(?:-[a-z]+)*$/.test(level.id) || ids.has(level.id)) fail(level, 'Invalid or duplicate stage ID');
    ids.add(level.id);
    if (level.curriculum.order !== index + 1) fail(level, 'Invalid stage order');
    const prerequisites = level.curriculum.prerequisiteIds;
    if (index === 0 ? prerequisites.length !== 0 : prerequisites.length !== 1 || prerequisites[0] !== levels[index - 1].id) {
      fail(level, 'Invalid instructional prerequisite');
    }
    const concept = CURRICULUM_CONCEPTS.indexOf(level.learning.concept);
    if (concept < 0 || concept < previousConcept || concept > previousConcept + 1) fail(level, 'Invalid concept progression');
    const firstInConcept = concept !== previousConcept;
    const phase = ['demonstration', 'guided', 'independent'].indexOf(level.learning.phase);
    if (phase < 0 || (!firstInConcept && phase < previousPhase)) fail(level, 'Invalid scaffold progression');
    if (level.learning.introducesNewConcept !== (firstInConcept && level.learning.concept !== 'mixed-application')) {
      fail(level, 'Invalid concept introduction');
    }
    previousConcept = concept;
    previousPhase = phase;
    if ([level.title, level.learning.learningGoal, level.learning.instruction].some((text) => !text.trim())) fail(level, 'Missing learning text');
    if (!level.allowedCommands.includes('forward') || new Set(level.allowedCommands).size !== level.allowedCommands.length
      || level.allowedCommands.some((command) => !['forward', 'turn-left', 'turn-right', 'repeat'].includes(command))) {
      fail(level, 'Invalid command palette');
    }
    if (previousCommands.some((command) => !level.allowedCommands.includes(command))) fail(level, 'Commands relocked');
    previousCommands = level.allowedCommands;
    if (concept < 2 && level.allowedCommands.some((command) => command !== 'forward')) fail(level, 'Turning unlocked too early');
    if (concept < 4 && level.allowedCommands.includes('repeat')) fail(level, 'Repeat unlocked too early');
    if (concept >= 4 && !level.allowedCommands.includes('repeat')) fail(level, 'Repeat not unlocked');
    if (level.maxProgramSlots === undefined || level.maxProgramSlots < 1) fail(level, 'Missing useful program limit');
    if (level.allowedCommands.includes('repeat') && (level.maxLoopBodySlots === undefined || level.maxLoopBodySlots < 1)) {
      fail(level, 'Missing useful loop limit');
    }

    const tiles = new Set(level.tiles.map(({ position }) => key(position)));
    const visited = new Set([key(level.avatar.position)]);
    const queue = [level.avatar.position];
    for (let cursor = 0; cursor < queue.length; cursor++) {
      const position = queue[cursor];
      for (const [dx, dz] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const neighbor = { x: position.x + dx, z: position.z + dz };
        if (tiles.has(key(neighbor)) && !visited.has(key(neighbor))) {
          visited.add(key(neighbor)); queue.push(neighbor);
        }
      }
    }
    if (visited.size !== tiles.size) fail(level, 'Disconnected board');
    if (new Set(level.collectibles.map(({ position }) => key(position))).size !== level.collectibles.length) fail(level, 'Overlapping fish');

    const hints = new Set<string>();
    const initialProgram = level.initialProgram;
    for (const hint of level.learning.visualHints) {
      if (!hint.id.trim() || hints.has(hint.id) || !hint.text.trim()) fail(level, 'Invalid hint identity or text');
      hints.add(hint.id);
      if (hint.reveal.when === 'after-action' && !commandAt(initialProgram, hint.reveal.path)) fail(level, 'Invalid hint reveal path');
      const cue = hint.cue;
      switch (cue.type) {
        case 'board-region':
          if (!cue.positions.length || cue.positions.some((position) => !tiles.has(key(position)))) fail(level, 'Invalid hint region');
          break;
        case 'command':
          if (!commandAt(initialProgram, cue.path)) fail(level, 'Invalid hint command path');
          break;
        case 'program-slot': {
          const loop = cue.loopIndex === undefined ? undefined : initialProgram[cue.loopIndex];
          if (cue.loopIndex !== undefined && (!Number.isInteger(cue.loopIndex) || loop?.type !== 'repeat')) fail(level, 'Invalid hint loop');
          const scope = loop?.type === 'repeat' ? loop.commands : initialProgram;
          const limit = loop ? level.maxLoopBodySlots : level.maxProgramSlots;
          if (!Number.isInteger(cue.index) || cue.index < 0 || cue.index > scope.length || (limit !== undefined && cue.index >= limit)) {
            fail(level, 'Invalid hint slot');
          }
          if (!cue.choices.length || cue.choices.some((choice) => !level.allowedCommands.includes(choice) || (loop && choice === 'repeat'))) {
            fail(level, 'Unavailable hint command');
          }
          break;
        }
        case 'relative-turn':
          if (!tiles.has(key(cue.position)) || !ORIENTATIONS.includes(cue.orientation)
            || !level.allowedCommands.includes(cue.direction === 'left' ? 'turn-left' : 'turn-right')) fail(level, 'Invalid relative-turn hint');
          if (hint.reveal.when === 'after-action') {
            let state = createInitialState(level);
            const actions = executeForValidation(level, initialProgram).nextCommandIndex;
            for (let action = 0; action < actions; action++) {
              state = executeNextAction(level, initialProgram, state);
              if (state.activeCommandPath?.join('.') === hint.reveal.path.join('.')) break;
            }
            if (!samePosition(state.avatar.position, cue.position) || state.avatar.orientation !== cue.orientation) fail(level, 'Relative-turn hint disagrees with execution');
          }
          break;
        case 'repeat-count':
          if (initialProgram[cue.commandIndex]?.type !== 'repeat' || !cue.choices.length
            || cue.choices.some((count) => ![2, 3, 4].includes(count))) fail(level, 'Invalid repeat-count hint');
          break;
      }
      if (level.learning.concept === 'debugging' && hint.reveal.when !== 'after-attempt' && hint.reveal.when !== 'on-request') {
        fail(level, 'Debug hint reveals fault before observation');
      }
    }
    if (level.learning.phase === 'independent' && level.learning.visualHints.length) fail(level, 'Independent support did not fade');
    if (level.learning.phase === 'guided' && !level.learning.visualHints.length) fail(level, 'Guided stage lacks support');
    if (level.learning.phase === 'demonstration' && !initialProgram.length) fail(level, 'Demonstration lacks starter');
    if (level.learning.phase === 'independent' && initialProgram.length) fail(level, 'Independent stage must start empty');
    if (level.learning.concept === 'debugging') {
      if (initialProgram.length ? executeForValidation(level, initialProgram).completion : level.learning.phase !== 'independent') fail(level, 'Debug starter is not faulty');
    } else if (level.learning.phase === 'demonstration') {
      verifySolution(level, initialProgram);
    } else if (initialProgram.length && executeForValidation(level, initialProgram).completion) {
      fail(level, 'Guided stage is already solved');
    }
    const guidance = level.learning.guidance ?? [];
    if (level.learning.phase === 'guided' ? guidance.length === 0 : guidance.length > 0) fail(level, 'Invalid guided interactions');
    const withinProgram = (path: CommandPath) => path.every((position) => Number.isInteger(position) && position >= 0)
      && path[0] < level.maxProgramSlots!
      && (path.length === 1 || initialProgram[path[0]]?.type === 'repeat' && path[1] < level.maxLoopBodySlots!);
    for (const { target, complete } of guidance) {
      if (complete.type === 'command') {
        if (!withinProgram(complete.path) || !complete.choices.length
          || complete.choices.some((type) => !level.allowedCommands.includes(type) || complete.path.length === 2 && type === 'repeat')) fail(level, 'Invalid guided command');
        const original = commandAt(initialProgram, complete.path);
        if (original && complete.choices.includes(original.type)) fail(level, 'Guided edit is already complete');
      }
      if (complete.type === 'count') {
        const loop = initialProgram[complete.index];
        if (loop?.type !== 'repeat' || loop.count !== complete.differentFrom) fail(level, 'Invalid guided count');
      }
      if (target.type === 'palette' && target.command && !level.allowedCommands.includes(target.command)
        || target.type === 'command' && !withinProgram(target.path)
        || target.type === 'count' && initialProgram[target.index]?.type !== 'repeat') fail(level, 'Invalid guided target');
      if (target.type === 'slot') {
        const path: CommandPath = target.loopIndex === undefined ? [target.index] : [target.loopIndex, target.index];
        if (!withinProgram(path) || complete.type !== 'command' || path.join('.') !== complete.path.join('.')) fail(level, 'Invalid guided slot');
      }
    }
    validateDemonstration(level);
  }
  if (previousConcept !== CURRICULUM_CONCEPTS.length - 1) throw new Error('Curriculum misses concepts');
  for (const concept of ['turning', 'loop', 'debugging'] as const) {
    const phases = levels.filter((level) => level.learning.concept === concept).map((level) => level.learning.phase);
    if (phases.join(',') !== 'demonstration,guided,independent') throw new Error(`Missing I Do / We Do / You Do for ${concept}`);
  }
}
