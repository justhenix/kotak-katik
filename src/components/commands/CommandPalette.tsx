import { CommandIcon, commandLabels } from './CommandIcon';
import { useGameStore } from '../../stores/game-store';

export function CommandPalette() {
  const allowed = useGameStore((s) => s.level.allowedCommands);
  const running = useGameStore((s) => s.simulation.status === 'running');
  const add = useGameStore((s) => s.addCommand);
  return <section aria-labelledby="palette-title" className="palette-area">
    <h2 id="palette-title">Tambah perintah</h2>
    <div className="flex flex-wrap gap-3">
      {allowed.map((type) => <button key={type} className={`palette-command ${type}`}
        disabled={running} aria-label={`Tambah ${commandLabels[type]}`} onClick={() => add(type)}>
        <CommandIcon /><span>{commandLabels[type]}</span><span aria-hidden="true">+</span>
      </button>)}
    </div>
  </section>;
}
