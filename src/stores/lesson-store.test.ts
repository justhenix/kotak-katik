import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createGameStore, selectInitialLevel } from './game-store';
import { createLessonStore, visibleHints, DEMO_COMMAND_MS, DEMO_ACTION_MS, DEMO_RESULT_MS, DEMO_TAP_MS, tutorialTarget } from './lesson-store';
import { curriculumLevels, findCurriculumLevel } from '../game/levels/curriculum';
import { kernelLevel } from '../game/levels/kernel';
import { loopLevel } from '../game/levels/mechanics';
import { validateDemonstration } from '../game/levels/validate-curriculum';

const level = (id: string) => findCurriculumLevel(id)!;
const stores: { game: ReturnType<typeof createGameStore>; lesson: ReturnType<typeof createLessonStore> }[] = [];
function setup(id: string) {
  const game = createGameStore(level(id));
  const lesson = createLessonStore(game);
  stores.push({ game, lesson });
  return { game, lesson };
}
beforeEach(() => vi.useFakeTimers());
afterEach(() => { for (const { game, lesson } of stores.splice(0)) { lesson.getState().dispose(); game.getState().dispose(); } vi.useRealTimers(); });

describe('authored demonstrations and linear lesson progression', () => {
  it('teaches placement before execution through the real store and fingertip tap timing', () => {
    const { game, lesson } = setup('m2-move-watch');
    lesson.getState().startDemo();
    expect(game.getState().program).toEqual([]);
    expect(tutorialTarget(game.getState().level, game.getState().program, game.getState().simulation, lesson.getState())).toEqual({ type: 'palette', command: 'forward', loopIndex: undefined });
    vi.advanceTimersByTime(DEMO_COMMAND_MS);
    expect(game.getState().program).toEqual([]);
    vi.advanceTimersByTime(DEMO_TAP_MS);
    expect(game.getState().program).toEqual([{ type: 'forward' }]);
    expect(game.getState().simulation.nextCommandIndex).toBe(0);
    vi.advanceTimersByTime(DEMO_ACTION_MS + DEMO_RESULT_MS);
    expect(lesson.getState().demoAction?.type).toBe('run');
    vi.runAllTimers();
    expect(game.getState().simulation.completion).toBe(true);
  });
  it('guided practice never inserts a block or advances the cat for the child', () => {
    const { game, lesson } = setup('m2-move-try');
    vi.advanceTimersByTime(30000);
    expect(game.getState().program).toEqual([{ type: 'forward' }]);
    expect(game.getState().simulation.nextCommandIndex).toBe(0);
    expect(lesson.getState().guideIndex).toBe(0);
    game.getState().addCommand('forward');
    expect(lesson.getState().guideIndex).toBe(1);
    expect(tutorialTarget(game.getState().level, game.getState().program, game.getState().simulation, lesson.getState())).toEqual({ type: 'run' });
    game.getState().run(); vi.runAllTimers();
    expect(game.getState().simulation.completion).toBe(true);
    lesson.getState().resetLesson();
    expect(lesson.getState().guideIndex).toBe(0);
  });
  it('interruption cancels pending placement/play and replay restores a clean sequence', () => {
    const { game, lesson } = setup('m2-move-watch');
    lesson.getState().startDemo();
    vi.advanceTimersByTime(DEMO_COMMAND_MS + DEMO_TAP_MS);
    lesson.getState().interruptDemo(); vi.runAllTimers();
    expect(lesson.getState().demoPhase).toBe('interrupted');
    expect(game.getState().simulation.nextCommandIndex).toBe(0);
    lesson.getState().startDemo(); vi.runAllTimers();
    expect(game.getState().program).toHaveLength(1);
    expect(game.getState().simulation.completion).toBe(true);
  });
  it('undoing a guided edit restores its cue while observed debugging attempts stay observed', () => {
    const { game, lesson } = setup('m2-move-try');
    game.getState().addCommand('forward');
    game.getState().removeCommand(1);
    expect(lesson.getState().guideIndex).toBe(1);
    expect(game.getState().program).toHaveLength(2);
    game.withLessonActions(() => game.getState().removeCommand(1));
    expect(lesson.getState().guideIndex).toBe(0);
    expect(tutorialTarget(game.getState().level, game.getState().program, game.getState().simulation, lesson.getState())).toEqual({ type: 'palette', command: 'forward' });
    game.getState().addCommand('forward');
    expect(lesson.getState().guideIndex).toBe(1);
    const debug = setup('m2-debug-together');
    debug.game.getState().run(); vi.runAllTimers();
    debug.game.getState().addCommand('forward');
    debug.game.withLessonActions(() => debug.game.getState().removeCommand(3));
    expect(debug.lesson.getState().guideIndex).toBe(1);
    expect(debug.lesson.getState().observedAttempt).toBe(true);
  });
  it('unsuccessful guided attempts retain both requested and observed visual hints', () => {
    const { game, lesson } = setup('m2-right-together');
    game.getState().addCommand('turn-left');
    game.getState().addCommand('forward');
    game.getState().run(); vi.runAllTimers();
    expect(game.getState().simulation.status).toBe('failed');
    expect(lesson.getState().hintStrength).toBe(1);
    expect(lesson.getState().revealed).toContain('continue-turn');
    expect(lesson.getState().revealed).toContain('cat-right');
  });
  it('every independent lesson begins empty and never exposes a procedural hand target', () => {
    for (const candidate of curriculumLevels.filter((item) => item.learning.phase === 'independent')) {
      const { game, lesson } = setup(candidate.id);
      expect(game.getState().program).toEqual([]);
      expect(tutorialTarget(candidate, game.getState().program, game.getState().simulation, lesson.getState())).toBeNull();
    }
  });
  it('starts beginners in the curriculum and retains fixture/fallback routes', () => {
    expect(selectInitialLevel('').id).toBe('m2-move-watch');
    expect(selectInitialLevel('?fish=trout').id).toBe('m2-move-watch');
    expect(selectInitialLevel('?fixture=kernel')).toBe(kernelLevel);
    expect(selectInitialLevel('?fixture=loops')).toBe(loopLevel);
    expect(selectInitialLevel('?level=missing')).toBe(kernelLevel);
  });
  it.each(curriculumLevels.filter((candidate) => candidate.learning.phase === 'demonstration'))('$id previews commands, performs real actions and completes without mutating authored data', (candidate) => {
    const { game, lesson } = setup(candidate.id);
    const snapshot = structuredClone(candidate);
    expect(game.getState().simulation.status).toBe('idle');
    lesson.getState().startDemo();
    expect(lesson.getState().demoPhase).toBe('command');
    expect(game.getState().simulation.nextCommandIndex).toBe(0);
    vi.advanceTimersByTime(DEMO_COMMAND_MS);
    expect(lesson.getState().demoPhase).toBe('action');
    vi.runAllTimers();
    expect(lesson.getState().demoPhase).toBe('done');
    expect(game.getState().simulation.completion).toBe(true);
    expect(candidate).toEqual(snapshot);
    expect(() => validateDemonstration(candidate)).not.toThrow();
  });
  it('shows a turn at a fixed tile and holds the result before the next action', () => {
    const { game, lesson } = setup('m2-left-watch');
    lesson.getState().startDemo();
    for (let elapsed = 0; elapsed < 15000 && game.getState().simulation.nextCommandIndex < 2; elapsed += 20) vi.advanceTimersByTime(20);
    expect(game.getState().simulation.avatar).toEqual({ position: { x: 1, z: 0 }, orientation: 'north' });
    expect(game.getState().simulation.nextCommandIndex).toBe(2);
    vi.advanceTimersByTime(100);
    expect(game.getState().simulation.nextCommandIndex).toBe(2);
  });
  it('observes a failure, restarts, steps through the turn, then repairs and retries', () => {
    const { game, lesson } = setup('m2-debug-watch');
    const changes: { phase: string; status: string; orientation: string; turn: string }[] = [];
    const record = () => changes.push({ phase: lesson.getState().demoPhase, status: game.getState().simulation.status,
      orientation: game.getState().simulation.avatar.orientation, turn: game.getState().program[1].type });
    const unsubscribe = game.subscribe(record);
    lesson.getState().startDemo();
    vi.runAllTimers();
    const failed = changes.findIndex((entry) => entry.status === 'failed');
    const fixed = changes.findIndex((entry) => entry.turn === 'turn-left');
    expect(failed).toBeGreaterThan(-1);
    expect(fixed).toBeGreaterThan(failed);
    expect(changes.slice(failed, fixed).some((entry) => entry.status === 'paused' && entry.orientation === 'south')).toBe(true);
    expect(game.getState().simulation.status).toBe('completed');
    unsubscribe();
  });
  it.each(['m2-left-watch', 'm2-debug-watch'])('skip during %s cancels both timers; replay restores the demonstration', (id) => {
    const { game, lesson } = setup(id);
    lesson.getState().startDemo();
    vi.advanceTimersByTime(DEMO_COMMAND_MS + 500);
    lesson.getState().skipDemo();
    vi.runAllTimers();
    expect(game.getState().simulation.status).toBe('idle');
    expect(game.getState().program).toEqual(game.getState().level.initialProgram);
    expect(lesson.getState().demoPhase).toBe('skipped');
    expect(game.getState().simulation.completion).toBe(false);
    lesson.getState().startDemo();
    vi.runAllTimers();
    expect(game.getState().simulation.completion).toBe(true);
  });
  it('only demonstrations can be skipped, while guided stages require a real completion', () => {
    const { game, lesson } = setup('m2-move-watch');
    lesson.getState().nextLesson();
    expect(game.getState().level.id).toBe('m2-move-watch');
    lesson.getState().skipDemo();
    lesson.getState().nextLesson();
    expect(game.getState().level.id).toBe('m2-move-try');
    expect(lesson.getState().demoPhase).toBe('idle');
    lesson.getState().skipDemo();
    lesson.getState().nextLesson();
    expect(game.getState().level.id).toBe('m2-move-try');
    game.getState().addCommand('forward'); game.getState().step(); game.getState().step();
    lesson.getState().nextLesson();
    expect(game.getState().level.id).toBe('m2-sequence-watch');
    expect(game.getState().program).toHaveLength(2);
  });
  it('loading a stage cancels old Run/demo timers and uses the new level rules', () => {
    const { game, lesson } = setup('m2-left-watch');
    lesson.getState().startDemo(); vi.advanceTimersByTime(200);
    game.getState().loadLevel(level('m2-move-try'));
    vi.runAllTimers();
    expect(lesson.getState().demoPhase).toBe('idle');
    expect(game.getState().simulation.levelId).toBe('m2-move-try');
    game.getState().addCommand('turn-left');
    expect(game.getState().program).toEqual([{ type: 'forward' }]);
    game.getState().addCommand('forward'); game.getState().run();
    game.getState().loadLevel(level('m2-turn-alone'));
    vi.runAllTimers();
    expect(game.getState().simulation.nextCommandIndex).toBe(0);
    game.getState().addCommand('forward'); game.getState().step();
    expect(game.getState().simulation.avatar.position).toEqual({ x: 0, z: 1 });
  });
  it('rejects an authored repair before observation and an unfinished demonstration', () => {
    const candidate = level('m2-debug-watch');
    expect(() => validateDemonstration({ ...candidate, learning: { ...candidate.learning, demonstration: [{ type: 'replace', path: [1], command: 'turn-left' }] } })).toThrow('Invalid demonstration repair');
    expect(() => validateDemonstration({ ...candidate, learning: { ...candidate.learning, demonstration: [{ type: 'step' }] } })).toThrow('Unfinished demonstration');
    const movement = level('m2-move-watch');
    expect(() => validateDemonstration({ ...movement, learning: { ...movement.learning, demonstration: [{ type: 'add', command: 'forward', index: 9 }, { type: 'run' }] } })).toThrow('Invalid demonstration insertion');
  });
});

describe('hint reveal and fading', () => {
  it('keeps a failed pose inspectable while directing an opened editor to its palette', () => {
    const { game, lesson } = setup('m2-right-together');
    game.getState().addCommand('turn-left'); game.getState().addCommand('forward');
    game.getState().run(); vi.runAllTimers();
    const failed = game.getState().simulation;
    expect(failed.status).toBe('failed');
    lesson.getState().showHint();
    expect(tutorialTarget(game.getState().level, game.getState().program, failed, lesson.getState())?.type).toBe('command');
    lesson.getState().chooseGuideTarget();
    expect(tutorialTarget(game.getState().level, game.getState().program, failed, lesson.getState())).toEqual({ type: 'palette' });
    expect(game.getState().simulation).toBe(failed);
  });
  it('reveals the insertion slot on entry and fades it after insertion', () => {
    const { game, lesson } = setup('m2-move-try');
    const hints = () => visibleHints(game.getState().level, game.getState().program, game.getState().simulation, lesson.getState().revealed);
    expect(hints()).toHaveLength(1);
    game.getState().addCommand('forward');
    expect(hints()).toHaveLength(0);
  });
  it('reveals a relative-turn cue after the matching action and removes a stale pose', () => {
    const { game, lesson } = setup('m2-right-together');
    expect(lesson.getState().revealed).toEqual([]);
    game.withLessonActions(() => game.getState().step());
    expect(lesson.getState().revealed).toContain('cat-right');
    game.withLessonActions(() => game.getState().resetSimulation());
    expect(visibleHints(game.getState().level, game.getState().program, game.getState().simulation, lesson.getState().revealed).map((hint) => hint.id)).not.toContain('cat-right');
    lesson.getState().showHint();
    expect(lesson.getState().revealed).toContain('continue-turn');
  });
  it('debugging reveals no fault cue until a terminal attempt; evidence survives inspection', () => {
    const { game, lesson } = setup('m2-debug-watch');
    lesson.getState().showHint();
    expect(lesson.getState().revealed).toEqual([]);
    game.withLessonActions(() => { game.getState().step(); game.getState().step(); });
    expect(lesson.getState().revealed).toEqual([]);
    game.withLessonActions(() => game.getState().step());
    expect(game.getState().simulation.status).toBe('failed');
    expect(lesson.getState().revealed).toEqual(['observe-route', 'inspect-turn']);
    game.withLessonActions(() => game.getState().resetSimulation());
    expect(lesson.getState().observedAttempt).toBe(true);
    game.withLessonActions(() => game.getState().replaceCommand(1, 'turn-left'));
    expect(visibleHints(game.getState().level, game.getState().program, game.getState().simulation, lesson.getState().revealed).map((hint) => hint.id)).not.toContain('inspect-turn');
    lesson.getState().resetLesson();
    expect(lesson.getState().observedAttempt).toBe(false);
    expect(lesson.getState().revealed).toEqual([]);
  });
  it.each(curriculumLevels.filter((candidate) => candidate.learning.phase === 'independent'))('$id retains no procedural hints', (candidate) => {
    const { lesson } = setup(candidate.id);
    lesson.getState().showHint();
    expect(lesson.getState().revealed).toEqual([]);
  });
});
