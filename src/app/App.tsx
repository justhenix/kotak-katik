import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Map } from 'lucide-react';
import { curriculumLevels } from '../game/levels/curriculum';
import { GameScene } from '../scene/GameScene';
import { ProgramTray } from '../components/program/ProgramTray';
import { ControlIcon } from '../components/controls/ControlIcon';
import { CommandIcon, commandLabels } from '../components/commands/CommandIcon';
import { gameStore, useGameStore } from '../stores/game-store';
import { LessonScaffold, LessonOptions } from '../components/learning/LessonScaffold';
import { lessonStore, useLessonStore, visibleHints } from '../stores/lesson-store';

function Feedback() {
  const simulation = useGameStore((s) => s.simulation);
  const program = useGameStore((s) => s.program);
  const { status, activeCommandIndex, activeCommandPath, loopIteration } = simulation;
  const level = useGameStore((s) => s.level);
  const lesson = useLessonStore((s) => s);
  const quiet = level.learning.phase !== 'practice' && ['idle', 'running'].includes(status);
  const hint = level.learning.phase === 'guided' && lesson.hintStrength > 0 && status === 'idle'
    ? visibleHints(level, program, simulation, lesson.revealed)[0]?.text : undefined;
  const command = activeCommandIndex === null ? undefined : program[activeCommandIndex];
  const primitive = command?.type === 'repeat' ? command.commands[activeCommandPath?.[1] ?? 0] : command;
  const collecting = simulation.events.some((event) => event.type === 'collected');
  const emptyLoop = program.some((item) => item.type === 'repeat' && item.commands.length === 0);
  const message = status === 'completed' ? 'Semua ikan terkumpul!'
    : status === 'failed' ? 'Jalan habis. Ubah urutanmu.'
    : status === 'finished' ? 'Masih ada ikan.'
    : emptyLoop ? 'Isi perintah dalam Ulangi.'
    : status === 'paused' ? collecting ? 'Jeda. Ikan terkumpul!' : 'Jeda. Lihat hasilnya.'
    : collecting ? 'Ikan terkumpul!'
    : status === 'running' ? primitive ? commandLabels[primitive.type] : 'Siap jalan…'
    : 'Ambil semua ikan';
  return <div className={`feedback ${status}`} role="status" aria-live="polite" aria-atomic="true" data-status={status}
    data-command-path={activeCommandPath?.join('.') ?? ''} data-loop-iteration={loopIteration ?? ''}
    data-x={simulation.avatar.position.x} data-z={simulation.avatar.position.z} data-orientation={simulation.avatar.orientation}
    data-actions={simulation.nextCommandIndex}>
    <span className={`feedback-symbol ${quiet && !hint ? 'sr-only' : ''}`} aria-hidden="true">{status === 'completed' ? <ControlIcon type="check" />
      : status === 'failed' ? '!' : status === 'paused' ? <ControlIcon type="pause" />
      : collecting ? <ControlIcon type="check" />
      : primitive && status === 'running' ? <CommandIcon type={primitive.type} /> : <FishIcon />}</span>
    <p className={quiet && !hint ? 'sr-only' : ''}>{hint ?? message}</p>
    {command?.type === 'repeat' && loopIteration !== null && <span className="feedback-iteration" aria-label={`Putaran ${loopIteration} dari ${command.count}`}>↻ {loopIteration} / {command.count}</span>}
  </div>;
}

function FishIcon() {
  return <svg viewBox="0 0 64 40" aria-hidden="true" className="fish-icon"><path d="m17 20-13-12v24Z" fill="#ee9657" stroke="#80502e" strokeWidth="2" /><path d="M15 20C20-2 53-2 61 20c-8 22-41 22-46 0Z" fill="#f5b453" stroke="#80502e" strokeWidth="2" /><path d="M32 5c-7 9-7 21 0 30M43 5c-6 10-6 20 0 30" fill="none" stroke="#fff3d6" strokeWidth="6" /><circle cx="51" cy="16" r="3" fill="#263d45" /></svg>;
}

function Puzzle({ onExit }: { onExit: () => void }) {
  const [sceneReady, setSceneReady] = useState(false);
  const title = useGameStore((s) => s.level.title);
  const collected = useGameStore((s) => s.simulation.collectedIds.length);
  const total = useGameStore((s) => s.level.collectibles.length);
  const levelId = useGameStore((s) => s.level.id);
  const phase = useGameStore((s) => s.level.learning.phase);
  useEffect(() => () => { lessonStore.getState().resetLesson(); gameStore.getState().dispose(); }, []);
  return <main className="game-shell" data-learning-phase={phase}>
    <header className="game-header"><button className="puzzle-exit" onClick={onExit}><Map aria-hidden="true" /><span>Ekspedisi</span></button>
      <div className="header-actions"><div className={`fish-progress ${collected === total ? 'all-collected' : ''}`} role="img" aria-label={`${collected} dari ${total} ikan terkumpul`}>
        <FishIcon /><span>{collected} / {total}</span>
      </div><LessonOptions /></div>
    </header>
    <section className="world-area" aria-label={title}>
      <GameScene onReady={setSceneReady} />
      <Feedback />
    </section>
    <div className="workbench">
      <LessonScaffold ready={sceneReady} />
      <ProgramTray key={levelId} ready={sceneReady} />
    </div>
  </main>;
}

export function App() {
  const preview = new URLSearchParams(window.location.search);
  const [screen, setScreen] = useState<'title' | 'expedition' | 'puzzle'>(
    preview.has('level') || preview.has('fixture') ? 'puzzle' : 'title',
  );
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => { heading.current?.focus({ preventScroll: true }); }, [screen]);
  const start = () => {
    lessonStore.getState().resetLesson();
    gameStore.getState().loadLevel(curriculumLevels[0]);
    setScreen('puzzle');
  };
  const exit = () => {
    lessonStore.getState().resetLesson();
    gameStore.getState().dispose();
    window.history.replaceState(null, '', window.location.pathname);
    setScreen('expedition');
  };
  if (screen === 'puzzle') return <Puzzle onExit={exit} />;
  return <main className={`journey-shell ${screen}-screen`}>
    {screen === 'title' ? <>
      <h1 className="wordmark" tabIndex={-1} ref={heading}>Kotak-Katik</h1>
      <p>Susun langkah. Bantu kucing ambil ikan.</p>
      <button className="journey-primary" onClick={start}>Mulai</button>
      <button className="journey-secondary" onClick={() => setScreen('expedition')}><Map aria-hidden="true" />Ekspedisi</button>
    </> : <>
      <button className="journey-secondary" onClick={() => setScreen('title')}><ArrowLeft aria-hidden="true" />Beranda</button>
      <h1 tabIndex={-1} ref={heading}>Ekspedisi</h1>
      <button className="journey-primary" onClick={start}>1. {curriculumLevels[0].title}</button>
    </>}
  </main>;
}
