import { CommandIcon, commandLabels } from './CommandIcon';
import { useGameStore } from '../../stores/game-store';

export function CommandPalette({ loopIndex }: { loopIndex?: number }) {
  const allowed = useGameStore((s) => s.level.allowedCommands);
  const full = useGameStore((s) => {
    const loop = loopIndex === undefined ? undefined : s.program[loopIndex];
    return loop?.type === 'repeat'
      ? s.level.maxLoopBodySlots !== undefined && loop.commands.length >= s.level.maxLoopBodySlots
      : s.level.maxProgramSlots !== undefined && s.program.length >= s.level.maxProgramSlots;
  });
  const running = useGameStore((s) => s.simulation.status === 'running');
  const add = useGameStore((s) => s.addCommand);
  const body = loopIndex !== undefined;
  const titleId = body ? `loop-palette-${loopIndex}` : 'palette-title';
  return <section aria-labelledby={titleId} className={body ? 'loop-palette' : 'palette-area'}>
    {body ? <h3 id={titleId}>Tambah di dalam Ulangi {loopIndex + 1}</h3> : <h2 id={titleId}>Tambah perintah</h2>}
    <div className="flex flex-wrap gap-3">
      {allowed.filter((type) => !body || type !== 'repeat').map((type) => <button key={type} className={`palette-command ${type}`}
        disabled={running || full} aria-label={`Tambah ${commandLabels[type]}${body ? ` ke Ulangi ${loopIndex + 1}` : ''}`} onClick={() => add(type, loopIndex)}>
        <CommandIcon type={type} /><span>{commandLabels[type]}</span><span aria-hidden="true">+</span>
      </button>)}
    </div>
    {full && <p className="tray-hint">{body ? 'Ulangi penuh.' : 'Urutan penuh.'}</p>}
  </section>;
}
