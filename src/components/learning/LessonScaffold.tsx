import { useEffect, useRef } from 'react';
import { ArrowRight, Check, Ellipsis, RotateCcw, SkipForward } from 'lucide-react';
import { useGameStore, gameStore } from '../../stores/game-store';
import { demoPlaying, lessonStore, useLessonStore } from '../../stores/lesson-store';
import { curriculumLevels } from '../../game/levels/curriculum';
import { GhostHand } from './GhostHand';

export function LessonOptions() {
  const level = useGameStore((state) => state.level);
  const lesson = useLessonStore((state) => state);
  const menu = useRef<HTMLDetailsElement>(null);
  if (level.learning.phase === 'practice') return null;
  const close = () => { if (menu.current) menu.current.open = false; };
  return <details className="lesson-options" ref={menu}>
    <summary aria-label="Pilihan"><Ellipsis aria-hidden="true" /></summary>
    <div className="lesson-options-list">
      {level.learning.demonstration ? <>
        <button onClick={() => { lesson.startDemo(); close(); }}><RotateCcw aria-hidden="true" />Ulang contoh</button>
        <button onClick={() => { lesson.skipDemo(); close(); }}><SkipForward aria-hidden="true" />Lewati contoh</button>
      </> : <button onClick={() => { lesson.resetLesson(); close(); }}><RotateCcw aria-hidden="true" />Mulai ulang</button>}
    </div>
  </details>;
}

export function LessonScaffold({ ready }: { ready: boolean }) {
  const level = useGameStore((state) => state.level);
  const simulation = useGameStore((state) => state.simulation);
  const lesson = useLessonStore((state) => state);
  useEffect(() => {
    if (ready && level.learning.demonstration && lesson.demoPhase === 'idle') lessonStore.getState().startDemo();
  }, [ready, level.id, level.learning.demonstration, lesson.demoPhase]);
  useEffect(() => {
    const interrupt = () => { if (document.hidden) lessonStore.getState().interruptDemo(); };
    document.addEventListener('visibilitychange', interrupt);
    return () => document.removeEventListener('visibilitychange', interrupt);
  }, []);
  useEffect(() => {
    if (level.learning.phase !== 'guided' || simulation.completion || simulation.status === 'running' || lesson.hintStrength >= 2) return;
    const timer = setTimeout(() => lessonStore.getState().showHint(), lesson.hintStrength === 0 ? 8000 : 14000);
    return () => clearTimeout(timer);
  }, [level.id, level.learning.phase, simulation.completion, simulation.status, lesson.guideIndex, lesson.guideChoice, lesson.hintStrength]);
  if (level.learning.phase === 'practice') return null;
  const watching = demoPlaying(lesson.demoPhase);
  const index = curriculumLevels.findIndex((candidate) => candidate.id === level.id);
  const canContinue = !watching && (simulation.completion || lesson.demoPhase === 'skipped');
  const inspect = level.learning.concept === 'debugging' && (simulation.status === 'failed' || simulation.status === 'finished')
    && (!watching || lesson.demoAction?.type === 'restart');
  return <section className="lesson-scaffold" aria-label="Bantuan belajar" data-phase={level.learning.phase} data-demo-phase={lesson.demoPhase}>
    <GhostHand />
    {inspect && <button className="inspect-action" disabled={watching} onClick={() => {
      gameStore.getState().resetSimulation();
      requestAnimationFrame(() => document.querySelector<HTMLButtonElement>('.step-button')?.focus({ preventScroll: true }));
    }}>Periksa satu per satu</button>}
    {lesson.demoPhase === 'interrupted' && <button className="continue-lesson" onClick={lesson.startDemo}><RotateCcw aria-hidden="true" />Ulang contoh</button>}
    {canContinue && index < curriculumLevels.length - 1 && <button className="next-lesson" onClick={() => {
      lesson.nextLesson();
      requestAnimationFrame(() => document.querySelector<HTMLButtonElement>('.next-lesson, .palette-command:not(:disabled), .run-button:not(:disabled)')?.focus({ preventScroll: true }));
    }}>Lanjut<ArrowRight aria-hidden="true" /></button>}
    {canContinue && index === curriculumLevels.length - 1 && <span className="journey-complete"><Check aria-hidden="true" />Semua tahap selesai!</span>}
  </section>;
}
