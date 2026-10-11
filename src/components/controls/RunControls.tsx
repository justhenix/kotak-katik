import { useGameStore } from '../../stores/game-store';
import { programError } from '../../game/program';
import { ControlIcon } from './ControlIcon';

export function RunControls({ ready }: { ready: boolean }) {
  const status = useGameStore((s) => s.simulation.status);
  const empty = useGameStore((s) => s.program.length === 0);
  const run = useGameStore((s) => s.run);
  const step = useGameStore((s) => s.step);
  const retry = useGameStore((s) => s.retry);
  const reset = useGameStore((s) => s.resetProgram);
  const stop = useGameStore((s) => s.stop);
  const invalid = useGameStore((s) => programError(s.level, s.program) !== null);
  const running = status === 'running';
  const terminal = ['failed', 'finished', 'completed'].includes(status);
  const disabled = !ready || empty || invalid || running;
  return <div className="controls-area" role="group" aria-label="Jalankan urutan">
    <button className={`run-button ${running ? 'stop-button' : ''}`} disabled={!running && disabled}
      aria-label={running ? 'Berhenti' : terminal ? 'Jalankan lagi' : 'Jalankan'}
      title={running ? 'Berhenti' : terminal ? 'Jalankan lagi' : 'Jalankan'} onClick={running ? stop : run}>
      <ControlIcon type={running ? 'stop' : 'play'} />
    </button>
    <button className="step-button" disabled={disabled} aria-label="Satu langkah" title="Satu langkah" onClick={step}>
      <ControlIcon type="step" />
    </button>
    <button className="retry-button" disabled={disabled} aria-label="Coba lagi" title="Coba lagi" onClick={retry}>
      <ControlIcon type="retry" />
    </button>
    <button className="clear-button" disabled={empty || running} aria-label="Hapus semua" title="Hapus semua" onClick={reset}>
      <ControlIcon type="delete" />
    </button>
  </div>;
}
