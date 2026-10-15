import { useGameStore } from '../../stores/game-store';
import { programError } from '../../game/program';
import { ControlIcon } from './ControlIcon';
import { gameStore } from '../../stores/game-store';
import { demoPlaying, useLessonStore } from '../../stores/lesson-store';
import type { ReactNode } from 'react';

export function RunControls({ ready, watching = false, showStep = true, resetControl }: { ready: boolean; watching?: boolean; showStep?: boolean; resetControl?: ReactNode }) {
  const status = useGameStore((s) => s.simulation.status);
  const empty = useGameStore((s) => s.program.length === 0);
  const run = useGameStore((s) => s.run);
  const step = useGameStore((s) => s.step);
  const stop = useGameStore((s) => s.stop);
  const invalid = useGameStore((s) => programError(s.level, s.program) !== null);
  const debugging = useGameStore((s) => s.level.learning.concept === 'debugging');
  const lesson = useLessonStore((s) => s);
  const inspect = debugging && (status === 'failed' || status === 'finished')
    && (!demoPlaying(lesson.demoPhase) || lesson.demoAction?.type === 'restart');
  const running = status === 'running';
  const terminal = ['failed', 'finished', 'completed'].includes(status);
  const disabled = !ready || empty || invalid || running || watching;
  return <div className="controls-area" role="group" aria-label="Jalankan urutan">
    <button className={`run-button ${running ? 'stop-button' : ''}`} disabled={watching || (!running && disabled)}
      aria-label={running ? 'Berhenti' : terminal ? 'Jalankan lagi' : 'Jalankan'} onClick={running ? stop : run}>
      <ControlIcon type={running ? 'stop' : 'play'} /><span className="run-label" aria-hidden="true">{running ? 'Berhenti' : 'Main'}</span>
    </button>
    {showStep && <button className="step-button" disabled={disabled} aria-label="Satu langkah" title="Satu langkah" onClick={step}>
      <ControlIcon type="step" />
      <span className="step-label" aria-hidden="true">Langkah</span>
    </button>}
    {inspect && <button className="inspect-action" disabled={watching} aria-label="Periksa satu per satu" onClick={() => {
      gameStore.getState().resetSimulation();
      requestAnimationFrame(() => document.querySelector<HTMLButtonElement>('.step-button')?.focus({ preventScroll: true }));
    }}><ControlIcon type="reset" /><span>Periksa</span></button>}
    {resetControl}
  </div>;
}

