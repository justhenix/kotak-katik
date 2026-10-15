import { useGameStore } from '../../stores/game-store';
import { programError } from '../../game/program';
import { ControlIcon } from './ControlIcon';
import { gameStore } from '../../stores/game-store';
import { demoPlaying, useLessonStore } from '../../stores/lesson-store';

export function RunControls({ ready, watching = false, showStep = true }: { ready: boolean; watching?: boolean; showStep?: boolean }) {
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
    {showStep && <button className={`step-button ${inspect ? 'inspect-action' : ''}`} disabled={disabled}
      aria-label={inspect ? 'Periksa satu per satu' : 'Satu langkah'} onClick={inspect ? () => gameStore.getState().resetSimulation() : step}>
      <ControlIcon type={inspect ? 'reset' : 'step'} />
    </button>}
  </div>;
}

