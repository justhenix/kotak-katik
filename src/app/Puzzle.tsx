import { useEffect, useRef, useState } from 'react';
import { CircleAlert, Map, TriangleAlert } from 'lucide-react';
import { GameScene } from '../scene/GameScene';
import { ProgramTray } from '../components/program/ProgramTray';
import { ControlIcon } from '../components/controls/ControlIcon';
import { CommandIcon, commandLabels } from '../components/commands/CommandIcon';
import { gameStore, useGameStore } from '../stores/game-store';
import { LessonOptions } from '../components/learning/LessonScaffold';
import { lessonStore, useLessonStore, visibleHints } from '../stores/lesson-store';

const bannerHints: Readonly<Record<string, string>> = {
  'Lihat kucing dan jalan ke ikan.': 'Lihat jalan ke ikan.',
  'Coba satu langkah. Lihat belokan ini.': 'Lihat belokan. Coba satu langkah.',
  'Masih ada satu petak ke ikan.': 'Masih satu petak ke ikan.',
};
const mobileHints: Readonly<Record<string, string>> = {
  'Satu Maju, satu petak.': 'Maju satu petak.',
  'Taruh Maju di sini.': 'Taruh Maju.',
  'Lalu ambil ikan berikutnya.': 'Ambil ikannya.',
  'Kiri mengikuti arah kucing.': 'Kiri kucing.',
  'Lihat sisi kanan kucing.': 'Kanan kucing.',
  'Tambahkan belokan di sini.': 'Tambah belokan.',
  'Lihat jalan setelah ikan pertama.': 'Lihat belokan.',
  'Maju yang sama berjalan lagi.': 'Maju berulang.',
  'Hitung petak menuju ikan.': 'Hitung petak.',
  'Lihat kucing dan jalan ke ikan.': 'Lihat jalannya.',
  'Coba satu langkah. Lihat belokan ini.': 'Coba satu langkah.',
  'Masih ada satu petak ke ikan.': 'Satu petak lagi.',
  'Lanjutkan urutan di sini.': 'Lanjutkan urutan.',
};

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
  const [collectionVisible, setCollectionVisible] = useState(false);
  const collectionTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => {
    if (status === 'idle') { clearTimeout(collectionTimer.current); setCollectionVisible(false); }
    else if (collecting) {
      clearTimeout(collectionTimer.current);
      setCollectionVisible(true);
      collectionTimer.current = setTimeout(() => setCollectionVisible(false), 1200);
    }
  }, [simulation.events, collecting, status]);
  useEffect(() => () => clearTimeout(collectionTimer.current), []);
  const emptyLoop = program.some((item) => item.type === 'repeat' && item.commands.length === 0);
  const message = status === 'completed' ? 'Semua ikan terkumpul!'
    : status === 'failed' ? 'Jalan habis. Ubah urutanmu.'
    : status === 'finished' ? 'Masih ada ikan.'
    : emptyLoop ? 'Isi perintah dalam Ulangi.'
    : status === 'paused' ? collectionVisible ? 'Jeda. Ikan terkumpul!' : 'Jeda. Lihat hasilnya.'
    : collectionVisible ? 'Ikan terkumpul!'
    : status === 'running' ? primitive ? commandLabels[primitive.type] : 'Siap jalan…'
    : 'Ambil semua ikan';
  const mobileMessage = hint ? mobileHints[hint] ?? bannerHints[hint] ?? hint
    : status === 'completed' || collectionVisible && status !== 'failed' && status !== 'finished' ? 'Ikan terkumpul!'
    : status === 'failed' ? 'Ubah urutanmu.' : emptyLoop ? 'Isi Ulangi.' : status === 'paused' ? 'Lihat hasilnya.' : message;
  const fullMessage = hint ? (bannerHints[hint] ?? hint).split(/\s+/).slice(0, 5).join(' ') : message;
  const fishSymbol = status !== 'completed' && status !== 'failed' && status !== 'paused'
    && !(primitive && status === 'running' && !collectionVisible);
  return <div className={`feedback ${status} ${collectionVisible ? 'collected-feedback' : ''}`} role="status" aria-live="polite" aria-atomic="true" data-status={status} data-visible={!quiet || !!hint || collectionVisible}
    data-command-path={activeCommandPath?.join('.') ?? ''} data-loop-iteration={loopIteration ?? ''}
    data-x={simulation.avatar.position.x} data-z={simulation.avatar.position.z} data-orientation={simulation.avatar.orientation}
    data-actions={simulation.nextCommandIndex}>
    <span className={`feedback-symbol ${fishSymbol ? 'fish-symbol' : ''} ${quiet && !hint && !collectionVisible ? 'sr-only' : ''}`} aria-hidden="true">{status === 'completed' ? <ControlIcon type="check" />
      : status === 'failed' ? <CircleAlert /> : status === 'finished' ? <TriangleAlert /> : status === 'paused' ? <ControlIcon type="pause" />
      : collectionVisible ? <FishIcon />
      : primitive && status === 'running' ? <CommandIcon type={primitive.type} /> : <FishIcon />}</span>
    <p className={quiet && !hint && !collectionVisible ? 'sr-only' : ''}>{fullMessage === mobileMessage ? fullMessage
      : <><span className="feedback-full">{fullMessage}</span><span className="feedback-short">{mobileMessage}</span></>}</p>
    {command?.type === 'repeat' && loopIteration !== null && <span className="sr-only" aria-label={`Putaran ${loopIteration} dari ${command.count}`} />}
  </div>;
}

function FishIcon() {
  return <svg viewBox="0 0 64 40" aria-hidden="true" className="fish-icon"><path d="m17 20-13-12v24Z" fill="#ee9657" stroke="#80502e" strokeWidth="2" /><path d="M15 20C20-2 53-2 61 20c-8 22-41 22-46 0Z" fill="#f5b453" stroke="#80502e" strokeWidth="2" /><path d="M32 5c-7 9-7 21 0 30M43 5c-6 10-6 20 0 30" fill="none" stroke="#fff3d6" strokeWidth="6" /><circle cx="51" cy="16" r="3" fill="#263d45" /></svg>;
}

export default function Puzzle({ onExit, onContinue, onFinish }: { onExit: () => void; onContinue?: () => void; onFinish?: () => void }) {
  const [sceneReady, setSceneReady] = useState(false);
  const [editorRevision, setEditorRevision] = useState(0);
  const title = useGameStore((s) => s.level.title);
  const collected = useGameStore((s) => s.simulation.collectedIds.length);
  const total = useGameStore((s) => s.level.collectibles.length);
  const levelId = useGameStore((s) => s.level.id);
  const phase = useGameStore((s) => s.level.learning.phase);
  const status = useGameStore((s) => s.simulation.status);
  useEffect(() => () => { lessonStore.getState().resetLesson(); gameStore.getState().dispose(); }, []);
  return <main className="game-shell" data-learning-phase={phase} data-status={status}>
    <header className="game-header"><h1 className="sr-only">{title}</h1><button className="puzzle-exit" aria-label="Ekspedisi" onClick={onExit}><Map aria-hidden="true" /><span>Ekspedisi</span></button>
      <div className="header-actions"><div className={`fish-progress ${collected === total ? 'all-collected' : ''}`} role="img" aria-label={`${collected} dari ${total} ikan terkumpul`}>
        <FishIcon /><span>{collected}/{total}</span>
      </div><LessonOptions onRestart={() => setEditorRevision(value => value + 1)} /></div>
    </header>
    <section className="world-area" aria-label={title} onPointerDown={() => lessonStore.getState().requestInteraction({ type: 'unrelated' })}>
      <GameScene onReady={setSceneReady} />
      <Feedback />
    </section>
    <div className="workbench">
      <ProgramTray key={`${levelId}:${editorRevision}`} ready={sceneReady} onContinue={onContinue} onFinish={onFinish} />
    </div>
  </main>;
}
