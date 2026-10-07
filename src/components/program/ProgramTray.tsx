import { CommandIcon, commandLabels } from '../commands/CommandIcon';
import { useGameStore } from '../../stores/game-store';

export function ProgramTray() {
  const program = useGameStore((s) => s.program);
  const status = useGameStore((s) => s.simulation.status);
  const active = useGameStore((s) => s.simulation.activeCommandIndex);
  const remove = useGameStore((s) => s.removeCommand);
  return <section aria-labelledby="program-title" className="program-area">
    <h2 id="program-title">Urutanmu</h2>
    {program.length === 0
      ? <div className="empty-program"><span className="empty-slot" aria-hidden="true">+</span><p>Ketuk perintah di bawah.</p></div>
      : <ol className="program-list" aria-label="Urutan perintah">
        {program.map((command, index) => <li key={index}>
          <button
            className={`command-block ${command.type} ${index === active ? 'active-command' : ''} ${index === active && status === 'failed' ? 'failed-command' : ''}`}
            disabled={status === 'running'} onClick={() => remove(index)}
            aria-label={`Hapus perintah ${index + 1}: ${commandLabels[command.type]}`}
            aria-current={index === active ? 'step' : undefined}
          >
            <span className="command-number">{index + 1}</span>
            <CommandIcon />
            <span>{commandLabels[command.type]}</span>
            <span className="remove-mark" aria-hidden="true">×</span>
          </button>
        </li>)}
      </ol>}
    {program.length > 0 && <p className="tray-hint">Ketuk perintah untuk menghapus.</p>}
  </section>;
}
