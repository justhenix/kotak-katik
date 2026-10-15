import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { ArrowLeft, Check, Map } from 'lucide-react';
import { Expedition } from '../components/journey/Expedition';
import { progressStore, useProgressStore } from '../stores/progress-store';
import { curriculumLevels } from '../game/levels/curriculum';
import { gameStore } from '../stores/game-store';
import { demoPlaying, lessonStore } from '../stores/lesson-store';

const TitleScene = lazy(async () => {
  const { TitleScene } = await import('../scene/title/TitleScene');
  return { default: TitleScene };
});

const PuzzleScreen = lazy(() => import('./Puzzle'));

function PuzzleLoading() {
  return <main className="game-shell" aria-busy="true"><div className="scene-loading" role="status">Menyiapkan papan…</div></main>;
}
export function App() {
  const preview = new URLSearchParams(window.location.search);
  const [screen, setScreen] = useState<'title' | 'expedition' | 'puzzle' | 'complete'>(
    preview.has('level') || preview.has('fixture') ? 'puzzle' : 'title',
  );
  const isPreview = preview.has('level') || preview.has('fixture');
  const progress = useProgressStore(state => state);
  const [confirmReset, setConfirmReset] = useState(false);
  const cancelReset = useRef<HTMLButtonElement>(null);
  const resetAction = useRef<HTMLButtonElement>(null);
  useEffect(() => { (confirmReset ? cancelReset : resetAction).current?.focus(); }, [confirmReset]);
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => { heading.current?.focus(); }, [screen]);
  useEffect(() => {
    if (screen !== 'puzzle' || isPreview) return;
    const observe = () => {
      const { level, simulation } = gameStore.getState();
      const lesson = lessonStore.getState();
      if (level.learning.phase === 'demonstration' && lesson.demoPhase === 'skipped') progressStore.getState().recordResult(level.id, 'skipped');
      else if (simulation.completion && !demoPlaying(lesson.demoPhase)) progressStore.getState().recordResult(level.id, 'completed');
    };
    const gameSubscription = gameStore.subscribe(observe);
    const lessonSubscription = lessonStore.subscribe(observe);
    observe();
    return () => { gameSubscription(); lessonSubscription(); };
  }, [screen, isPreview]);
  const openLevel = (id: string) => {
    if (!progressStore.getState().selectLevel(id)) return;
    lessonStore.getState().resetLesson();
    gameStore.getState().loadLevel(curriculumLevels.find(level => level.id === id)!);
    setScreen('puzzle');
  };
  const start = () => openLevel(progress.currentLevelId);
  const exit = () => {
    lessonStore.getState().resetLesson();
    gameStore.getState().dispose();
    window.history.replaceState(null, '', window.location.pathname);
    setScreen('expedition');
  };
  const continueLesson = () => {
    lessonStore.getState().nextLesson();
    progressStore.getState().selectLevel(gameStore.getState().level.id);
  };
  if (screen === 'puzzle') return <Suspense fallback={<PuzzleLoading />}><PuzzleScreen onExit={exit} onContinue={isPreview ? undefined : continueLesson}
    onFinish={isPreview ? undefined : () => setScreen('complete')} /></Suspense>;
  return <main className={`journey-shell ${screen}-screen`}>
    {screen === 'title' ? <>
      <Suspense fallback={null}><TitleScene /></Suspense>
      <div className="title-controls">
      <h1 className="wordmark" tabIndex={-1} ref={heading}>Kotak-Katik</h1>
      <p>Susun langkah. Bantu kucing ambil ikan.</p>
      <button className="journey-primary" onClick={start}>{progress.completedLevelIds.includes(curriculumLevels.at(-1)!.id) ? 'Main lagi' : progress.unlockedLevelIds.length > 1 ? 'Lanjutkan' : 'Mulai'}</button>
      <button className="journey-secondary" onClick={() => setScreen('expedition')}><Map aria-hidden="true" />Ekspedisi</button>
      </div>
    </> : screen === 'complete' ? <>
      <h1 tabIndex={-1} ref={heading}><Check aria-hidden="true" />Ekspedisi selesai!</h1>
      <p>{progress.completedLevelIds.length} dari 16 tahap selesai.</p>
      {!progress.persistenceAvailable && <p role="status">Progres belum bisa disimpan. Kamu tetap bisa bermain.</p>}
      {progress.completedLevelIds.length < curriculumLevels.length && <p>Contoh yang dilewati bisa dilihat lagi.</p>}
      <button className="journey-primary" onClick={() => setScreen('expedition')}>Lihat ekspedisi</button>
      <button className="journey-secondary" onClick={() => setScreen('title')}>Beranda</button>
    </> : <>
      <button className="journey-secondary" onClick={() => setScreen('title')}><ArrowLeft aria-hidden="true" />Beranda</button>
      <h1 tabIndex={-1} ref={heading}>Ekspedisi</h1>
      <p>{progress.completedLevelIds.length} dari 16 tahap selesai.</p>
      {!progress.persistenceAvailable && <p role="status">Progres belum bisa disimpan. Kamu tetap bisa bermain.</p>}
      {progress.completedLevelIds.includes(curriculumLevels.at(-1)!.id) && <button className="journey-secondary" onClick={() => setScreen('complete')}>Ekspedisi selesai!</button>}
      <Expedition onSelect={openLevel} />
      <details className="progress-options" onToggle={event => { if (!event.currentTarget.open) setConfirmReset(false); }}
        onKeyDown={event => { if (event.key === 'Escape') { event.currentTarget.open = false; event.currentTarget.querySelector('summary')?.focus(); } }}>
        <summary>Progres</summary>
        {confirmReset ? <div className="progress-reset"><p>Hapus progres dan mulai dari tahap 1?</p>
          <button className="journey-secondary" ref={cancelReset} onClick={() => setConfirmReset(false)}>Batal</button>
          <button className="journey-secondary" onClick={() => {
            progressStore.getState().reset(); setConfirmReset(false);
            document.querySelector<HTMLDetailsElement>('.progress-options')?.removeAttribute('open');
            heading.current?.focus();
          }}>Hapus progres</button>
        </div> : <button className="journey-secondary" ref={resetAction} onClick={() => setConfirmReset(true)}>Mulai dari awal</button>}
      </details>
    </>}
  </main>;
}
