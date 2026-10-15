import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createGameStore } from './game-store';
import { createLessonStore, tutorialTarget } from './lesson-store';
import { findCurriculumLevel } from '../game/levels/curriculum';
import { canInteract } from './interaction-policy';

const instances: { game: ReturnType<typeof createGameStore>; lesson: ReturnType<typeof createLessonStore> }[] = [];
function setup(id: string) {
  const game = createGameStore(findCurriculumLevel(id)!);
  const lesson = createLessonStore(game);
  const instance = { game, lesson }; instances.push(instance); return instance;
}
beforeEach(() => vi.useFakeTimers());
afterEach(() => { for (const { game, lesson } of instances.splice(0)) { lesson.getState().dispose(); game.getState().dispose(); } vi.useRealTimers(); });

describe('phase permissions at the real store action boundary', () => {
  it('blocks every manual mutation in I Do while the authored automation, replay and skip still work', () => {
    const { game, lesson } = setup('m2-repeat-watch');
    const before = game.getState();
    before.addCommand('forward'); before.removeCommand(0); before.moveCommand(0, 1);
    before.replaceCommand(0, 'turn-right', 0); before.setRepeatCount(0, 4);
    before.step(); before.run(); before.retry(); before.stop(); before.resetProgram(); before.resetSimulation();
    expect(game.getState().program).toBe(before.program); expect(game.getState().simulation).toBe(before.simulation);
    expect(lesson.getState().blockedInteraction).toBe(11);
    lesson.getState().startDemo(); vi.advanceTimersByTime(900);
    const watching = game.getState().program; game.getState().removeCommand(0);
    expect(game.getState().program).toBe(watching);
    vi.runAllTimers(); expect(game.getState().simulation.completion).toBe(true);
    lesson.getState().startDemo(); lesson.getState().skipDemo(); vi.runAllTimers();
    expect(lesson.getState().demoPhase).toBe('skipped'); expect(game.getState().simulation.status).toBe('idle');
    lesson.getState().startDemo(); vi.runAllTimers(); expect(game.getState().simulation.completion).toBe(true);
  });

  it('protects starter commands, unrelated slots, early Run and stale edits after a guided step', () => {
    const { game, lesson } = setup('m2-move-try'); const prepared = game.getState().program;
    game.getState().removeCommand(0); game.getState().replaceCommand(0, 'forward'); game.getState().moveCommand(0, 1);
    game.getState().addCommand('forward', undefined, 0); game.getState().run(); game.getState().resetProgram();
    expect(game.getState().program).toBe(prepared); expect(game.getState().simulation.status).toBe('idle');
    expect(lesson.getState().requestInteraction({ type: 'select', index: 0 })).toBe(false);
    expect(lesson.getState().requestInteraction({ type: 'insert', index: 1 })).toBe(true);
    game.getState().addCommand('forward', undefined, 1);
    expect(lesson.getState().guideIndex).toBe(1);
    const ready = game.getState().program;
    game.getState().addCommand('forward', undefined, 1);
    game.getState().addCommand('forward'); game.getState().removeCommand(1); game.getState().replaceCommand(1, 'forward');
    expect(game.getState().program).toBe(ready);
    game.getState().run(); vi.runAllTimers(); expect(game.getState().simulation.completion).toBe(true);
  });

  it('ends the automated dispatch scope after exceptions and before delayed callbacks', () => {
    const { game, lesson } = setup('m2-repeat-watch'); const program = game.getState().program;
    expect(() => game.withLessonActions(() => { throw new Error('interrupted'); })).toThrow('interrupted');
    game.getState().removeCommand(0);
    game.withLessonActions(() => setTimeout(() => game.getState().removeCommand(0), 1)); vi.runAllTimers();
    expect(game.getState().program).toBe(program); expect(lesson.getState().blockedInteraction).toBe(2);
  });

  it.each(['turn-left', 'turn-right'] as const)('permits the meaningful %s choice without using the solution as a permission rule', command => {
    const { game, lesson } = setup('m2-right-together');
    expect(canInteract(game.getState(), lesson.getState(), { type: 'add', index: 1, command })).toBe(true);
    game.getState().addCommand(command); game.getState().addCommand('forward');
    expect(lesson.getState().guideIndex).toBe(2);
    game.getState().run(); vi.runAllTimers();
    expect(game.getState().simulation.status).toBe(command === 'turn-left' ? 'failed' : 'completed');
  });

  it('failed movement redirects correction to the turn decision; inspection and retry never unlock the starter', () => {
    const { game, lesson } = setup('m2-right-together');
    game.getState().addCommand('turn-left'); game.getState().addCommand('forward'); game.getState().run(); vi.runAllTimers();
    expect(game.getState().simulation.activeCommandPath).toEqual([2]);
    expect(tutorialTarget(game.getState().level, game.getState().program, game.getState().simulation, lesson.getState())).toEqual({ type: 'command', path: [1] });
    game.getState().resetSimulation(); game.getState().step();
    expect(game.getState().simulation.nextCommandIndex).toBe(1);
    const program = game.getState().program; game.getState().removeCommand(0); game.getState().replaceCommand(2, 'turn-right');
    expect(game.getState().program).toBe(program);
    game.getState().replaceCommand(1, 'turn-right'); game.getState().retry(); vi.runAllTimers();
    expect(game.getState().simulation.completion).toBe(true); expect(game.getState().program[0]).toEqual({ type: 'forward' });
  });

  it('allows wrong Repeat counts and repairs while protecting the prepared Repeat and its body', () => {
    const { game, lesson } = setup('m2-repeat-together'); const prepared = game.getState().program;
    expect(lesson.getState().requestInteraction({ type: 'body', index: 0 })).toBe(false);
    game.getState().removeCommand(0); game.getState().removeCommand(0, 0); game.getState().replaceCommand(0, 'turn-left', 0);
    expect(game.getState().program).toBe(prepared);
    game.getState().setRepeatCount(0, 3); expect(lesson.getState().guideIndex).toBe(1);
    game.getState().setRepeatCount(0, 4); game.getState().run(); vi.runAllTimers(); expect(game.getState().simulation.status).toBe('failed');
    expect(tutorialTarget(game.getState().level, game.getState().program, game.getState().simulation, lesson.getState())).toEqual({ type: 'command', path: [0] });
    game.getState().setRepeatCount(0, 2); game.getState().run(); vi.runAllTimers(); expect(game.getState().simulation.status).toBe('finished');
    game.getState().setRepeatCount(0, 3); game.getState().run(); vi.runAllTimers(); expect(game.getState().simulation.completion).toBe(true);
    const repeat = game.getState().program[0]; expect(repeat.type === 'repeat' && repeat.commands).toEqual([{ type: 'forward' }]);
  });

  it('You Do restores body/count/replace/move/delete freedom and clears guidance on navigation', () => {
    const { game, lesson } = setup('m2-repeat-together'); game.getState().loadLevel(findCurriculumLevel('m2-repeat-alone')!);
    game.getState().addCommand('repeat'); game.getState().setRepeatCount(0, 3);
    game.getState().addCommand('turn-right', 0); game.getState().addCommand('forward', 0); game.getState().moveCommand(1, -1, 0);
    expect(game.getState().program[0]).toEqual({ type: 'repeat', count: 3, commands: [{ type: 'forward' }, { type: 'turn-right' }] });
    game.getState().replaceCommand(1, 'turn-left', 0); game.getState().removeCommand(1, 0); game.getState().addCommand('turn-right', 0);
    game.getState().run(); vi.runAllTimers(); expect(game.getState().simulation.completion).toBe(true);
    expect(tutorialTarget(game.getState().level, game.getState().program, game.getState().simulation, lesson.getState())).toBeNull();
    game.getState().resetProgram(); expect(game.getState().program).toEqual([]); expect(lesson.getState().blockedInteraction).toBe(0);
  });
});
