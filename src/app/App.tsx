import { useEffect } from 'react';
import { GameScene } from '../scene/GameScene';
import { ProgramTray } from '../components/program/ProgramTray';
import { CommandPalette } from '../components/commands/CommandPalette';
import { RunControls } from '../components/controls/RunControls';
import { gameStore, useGameStore } from '../stores/game-store';

function Feedback() {
  const simulation = useGameStore((s) => s.simulation);
  const { status, activeCommandIndex } = simulation;
  const number = activeCommandIndex === null ? null : activeCommandIndex + 1;
  const message = status === 'completed' ? 'Semua ikan terkumpul!'
    : status === 'failed' ? 'Tidak ada kotak di depan. Ubah urutanmu.'
    : status === 'finished' ? 'Masih ada ikan. Tambah perintah.'
    : status === 'running' ? 'Lihat kucing bergerak.'
    : status === 'paused' ? 'Lihat hasilnya. Lanjut satu langkah?'
    : 'Bawa kucing ke semua ikan.';
  return <div className={`feedback ${status}`} role="status" aria-live="polite" aria-atomic="true" data-status={status}>
    <span className="feedback-symbol" aria-hidden="true">{status === 'completed' ? '✓' : status === 'failed' ? '!' : number ?? '•'}</span>
    <p>{message}</p>
  </div>;
}

export function App() {
  const title = useGameStore((s) => s.level.title);
  const collected = useGameStore((s) => s.simulation.collectedIds.length);
  const total = useGameStore((s) => s.level.collectibles.length);
  useEffect(() => () => gameStore.getState().dispose(), []);
  return <main className="game-shell">
    <header className="game-header"><span className="wordmark">Kotak-Katik</span></header>
    <section className="world-area" aria-labelledby="level-title">
      <div className="objective-row">
        <h1 id="level-title">{title}</h1>
        <span className="fish-progress" aria-label={`${collected} dari ${total} ikan terkumpul`}>
          <svg viewBox="0 0 32 24" aria-hidden="true"><path d="M8 12 1 5v14Zm2 0C10 1 29 1 31 12c-2 11-21 11-21 0Z" fill="currentColor" /><circle cx="25" cy="10" r="1.5" fill="#263D45" /></svg>
          {collected} / {total}
        </span>
      </div>
      <GameScene />
      <Feedback />
    </section>
    <div className="workbench">
      <ProgramTray />
      <CommandPalette />
      <RunControls />
    </div>
  </main>;
}
