import { CommandIcon, commandLabels } from './CommandIcon';
import { useGameStore } from '../../stores/game-store';
import type { CommandType } from '../../game/types';

export function CommandPalette({ loopIndex, replacing, full, watching = false, choices, onChoose }: {
  loopIndex?: number; replacing: boolean; full: boolean; watching?: boolean; choices?: readonly CommandType[]; onChoose: (type: CommandType) => void;
}) {
  const allowed = useGameStore((s) => s.level.allowedCommands);
  const running = useGameStore((s) => s.simulation.status === 'running');
  const title = replacing ? 'Ganti perintah' : loopIndex === undefined ? 'Tambah perintah' : `Isi Ulangi ${loopIndex + 1}`;
  return <section aria-labelledby="palette-title" className="palette-area">
    <h2 id="palette-title" className="sr-only">{title}</h2>
    <div className="palette-commands">
      {allowed.filter((type) => (!choices || choices.includes(type)) && ((loopIndex === undefined && !replacing) || type !== 'repeat')).map((type) => <button key={type} data-type={type}
        className={`palette-command puzzle-block ${type}`} disabled={running || watching || (!replacing && full)}
        aria-label={replacing ? `Ganti dengan ${commandLabels[type]}` : `Tambah ${commandLabels[type]}${loopIndex === undefined ? '' : ` ke Ulangi ${loopIndex + 1}`}`}
        onClick={() => onChoose(type)}>
        <CommandIcon type={type} /><span>{commandLabels[type]}</span>
      </button>)}
    </div>
    {!replacing && full && <p className="palette-note" role="status">{loopIndex === undefined ? 'Urutan penuh.' : 'Ulangi penuh.'}</p>}
  </section>;
}
