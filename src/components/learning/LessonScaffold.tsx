import { Cat, Eye, RotateCcw, SkipForward, Lightbulb, ArrowRight, Check, Pencil } from 'lucide-react';
import { CommandIcon, commandLabels } from '../commands/CommandIcon';
import { ControlIcon } from '../controls/ControlIcon';
import { gameStore, useGameStore } from '../../stores/game-store';
import { demoPlaying, useLessonStore, visibleHints } from '../../stores/lesson-store';
import { curriculumLevels } from '../../game/levels/curriculum';

export function LessonScaffold({ ready }: { ready: boolean }) {
  const { level, program, simulation } = useGameStore((state) => state);
  const lesson = useLessonStore((state) => state);
  if (level.learning.phase === 'practice') return null;
  const watching = demoPlaying(lesson.demoPhase);
  const demo = level.learning.demonstration;
  const hints = visibleHints(level, program, simulation, lesson.revealed);
  const current = lesson.demoPath ? program[lesson.demoPath[0]] : undefined;
  const command = current?.type === 'repeat' && lesson.demoPath?.length === 2 ? current.commands[lesson.demoPath[1]] : current;
  const next = curriculumLevels.findIndex((candidate) => candidate.id === level.id) + 1;
  const canContinue = !watching && (simulation.completion || demo && lesson.demoPhase === 'skipped');
  const action = lesson.demoAction;
  const result = action?.type === 'restart' ? 'Kembali ke awal.'
    : action?.type === 'replace' ? 'Belokan berubah.'
    : simulation.status === 'failed' ? 'Jalan habis.'
    : simulation.completion ? 'Semua ikan terkumpul!'
    : simulation.events.some((event) => event.type === 'turned') ? 'Hadap berubah. Petak tetap.'
    : simulation.events.some((event) => event.type === 'collected') ? 'Ikan terkumpul!'
    : 'Maju satu petak.';
  const caption = watching ? action?.type === 'replace' ? 'Pilih blok, lalu ganti belokan.'
    : action?.type === 'restart' ? 'Kembali. Periksa satu per satu.'
    : action?.type === 'run' ? 'Tekan Main. Lihat hasilnya.' : 'Tekan satu langkah.'
    : lesson.demoPhase === 'done' ? 'Sekarang giliranmu.'
    : level.learning.instruction;
  return <section className="lesson-scaffold" aria-label="Bantuan belajar" data-phase={level.learning.phase} data-demo-phase={lesson.demoPhase}>
    <div className="lesson-heading">
      <div className="lesson-prompt" tabIndex={-1}>
        <span className="lesson-phase">{next} / {curriculumLevels.length} · {level.learning.phase === 'demonstration' ? 'Lihat' : level.learning.phase === 'guided' ? 'Coba bersama' : 'Coba sendiri'}</span>
        <p>{caption}</p>
      </div>
      <div className="lesson-actions">
        {demo && !watching && <button disabled={!ready || simulation.status === 'running'} onClick={lesson.startDemo}>
          {lesson.demoPhase === 'idle' ? <Eye aria-hidden="true" /> : <RotateCcw aria-hidden="true" />}<span>{lesson.demoPhase === 'idle' ? 'Lihat contoh' : 'Ulang contoh'}</span>
        </button>}
        {demo && (watching || !simulation.completion) && lesson.demoPhase !== 'skipped' && <button className="skip-demo" onClick={lesson.skipDemo}>
          <SkipForward aria-hidden="true" /><span>Lewati</span>
        </button>}
        {!watching && !simulation.completion && level.learning.visualHints?.some((hint) => hint.reveal.when === 'on-request') && <button aria-pressed={level.learning.visualHints.filter((hint) => hint.reveal.when === 'on-request').every((hint) => lesson.revealed.includes(hint.id))} onClick={lesson.showHint}>
          <Lightbulb aria-hidden="true" /><span>Petunjuk</span>
        </button>}
        {canContinue && next < curriculumLevels.length && <button className="next-lesson" onClick={() => {
          lesson.nextLesson();
          requestAnimationFrame(() => document.querySelector<HTMLElement>('.lesson-prompt')?.focus({ preventScroll: true }));
        }}><span>Lanjut</span><ArrowRight aria-hidden="true" /></button>}
        {canContinue && next === curriculumLevels.length && <span className="journey-complete"><Check aria-hidden="true" />Semua tahap selesai!</span>}
      </div>
    </div>
    {watching && <div className="demo-trace" aria-label="Perintah, kucing bergerak, hasil" data-demo-action={action?.type}>
      <span className={lesson.demoPhase === 'command' ? 'trace-current' : ''}>
        {action?.type === 'replace' ? <><Pencil aria-hidden="true" /><CommandIcon type={action.command} /></>
          : action?.type === 'restart' ? <RotateCcw aria-hidden="true" />
          : <><ControlIcon type={action?.type === 'run' ? 'play' : 'step'} />{command && <CommandIcon type={command.type} />}</>}
        <span>{action?.type === 'replace' ? `Ganti: ${commandLabels[action.command]}` : action?.type === 'restart' ? 'Dari awal' : command ? commandLabels[command.type] : 'Main'}</span>
      </span>
      <ArrowRight aria-hidden="true" />
      <span className={lesson.demoPhase === 'action' ? 'trace-current' : ''}><Cat aria-hidden="true" /><span>Lihat kucing</span></span>
      <ArrowRight aria-hidden="true" />
      <span className={lesson.demoPhase === 'result' ? 'trace-current' : ''}><span aria-hidden="true">{simulation.status === 'failed' ? '!' : '✓'}</span><span>{lesson.demoPhase === 'result' ? result : 'Hasil'}</span></span>
    </div>}
    {!watching && hints.length > 0 && <div className="lesson-hint" role="status"><Eye aria-hidden="true" /><p>{hints[0].text}</p></div>}
    {!watching && level.learning.concept === 'debugging' && lesson.observedAttempt && ['failed', 'finished'].includes(simulation.status) && <button className="inspect-action" onClick={() => {
      gameStore.getState().resetSimulation();
      requestAnimationFrame(() => document.querySelector<HTMLButtonElement>('.step-button')?.focus({ preventScroll: true }));
    }}><ControlIcon type="step" /><span>Periksa satu per satu</span></button>}
  </section>;
}
