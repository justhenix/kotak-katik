import { useGameStore } from '../../stores/game-store';
import { programError } from '../../game/program';

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
  return <div className="controls-area">
    <div className="execution-controls">
      <button className="run-button" disabled={!ready || empty || invalid || running} onClick={run}>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="m6 3 16 9-16 9Z" fill="currentColor" />
        </svg>
        {running ? 'Berjalan…' : terminal ? 'Jalankan lagi' : 'Jalankan'}
      </button>
      <button className="step-button" disabled={!ready || empty || invalid || running} onClick={step}>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3 4 12 8-12 8Zm14 0h4v16h-4Z" fill="currentColor" /></svg>
        Satu langkah
      </button>
    </div>
    <div className="secondary-controls">
      {running && <button onClick={stop}>Berhenti</button>}
      <button disabled={!ready || empty || invalid || running} onClick={retry}>Coba lagi</button>
      <button disabled={empty || running} onClick={reset}>Hapus semua</button>
    </div>
  </div>;
}
