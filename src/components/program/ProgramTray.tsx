import { CommandIcon, commandLabels } from '../commands/CommandIcon';
import { CommandPalette } from '../commands/CommandPalette';
import { useGameStore } from '../../stores/game-store';
import type { PrimitiveCommand, RepeatCount } from '../../game/types';

function Reorder({ index, length, loopIndex }: { index: number; length: number; loopIndex?: number }) {
  const running = useGameStore((s) => s.simulation.status === 'running');
  const move = useGameStore((s) => s.moveCommand);
  const label = loopIndex === undefined ? `perintah ${index + 1}` : `perintah ${index + 1} di Ulangi ${loopIndex + 1}`;
  return <div className="reorder-controls">
    <button disabled={running || index === 0} aria-label={`Geser ${label} sebelumnya`} onClick={() => move(index, -1, loopIndex)}>←</button>
    <button disabled={running || index === length - 1} aria-label={`Geser ${label} berikutnya`} onClick={() => move(index, 1, loopIndex)}>→</button>
  </div>;
}

function PrimitiveBlock({ command, index, length, loopIndex }: {
  command: PrimitiveCommand; index: number; length: number; loopIndex?: number;
}) {
  const { status, activeCommandPath } = useGameStore((s) => s.simulation);
  const remove = useGameStore((s) => s.removeCommand);
  const active = loopIndex === undefined
    ? activeCommandPath?.length === 1 && activeCommandPath[0] === index
    : activeCommandPath?.[0] === loopIndex && activeCommandPath?.[1] === index;
  const label = loopIndex === undefined ? `perintah ${index + 1}` : `perintah ${index + 1} di Ulangi ${loopIndex + 1}`;
  return <li className="primitive-item">
    <button className={`command-block ${command.type} ${active ? 'active-command' : ''} ${active && status === 'failed' ? 'failed-command' : ''}`}
      disabled={status === 'running'} onClick={() => remove(index, loopIndex)}
      aria-label={`Hapus ${label}: ${commandLabels[command.type]}`} aria-current={active ? 'step' : undefined}
      data-command-path={loopIndex === undefined ? `${index}` : `${loopIndex}.${index}`}>
      <span className="command-number">{index + 1}</span><CommandIcon type={command.type} />
      <span>{commandLabels[command.type]}</span><span className="remove-mark" aria-hidden="true">×</span>
    </button>
    <Reorder index={index} length={length} loopIndex={loopIndex} />
  </li>;
}

export function ProgramTray() {
  const program = useGameStore((s) => s.program);
  const limit = useGameStore((s) => s.level.maxProgramSlots);
  const bodyLimit = useGameStore((s) => s.level.maxLoopBodySlots);
  const { status, activeCommandPath, loopIteration } = useGameStore((s) => s.simulation);
  const remove = useGameStore((s) => s.removeCommand);
  const setCount = useGameStore((s) => s.setRepeatCount);
  return <section aria-labelledby="program-title" className="program-area">
    <h2 id="program-title">Urutanmu{limit !== undefined && <span className="slot-count">{program.length} / {limit}</span>}</h2>
    {program.length === 0
      ? <div className="empty-program"><span className="empty-slot" aria-hidden="true">+</span><p>Ketuk perintah di bawah.</p></div>
      : <ol className="program-list" aria-label="Urutan perintah">
        {program.map((command, index) => command.type !== 'repeat'
          ? <PrimitiveBlock key={index} command={command} index={index} length={program.length} />
          : <li key={index} className={`repeat-item ${activeCommandPath?.[0] === index ? 'active-loop' : ''}`}>
            <div className="repeat-header">
              <h3><CommandIcon type="repeat" />{index + 1}. Ulangi</h3>
              <label className="repeat-count">Banyaknya
                <select aria-label={`Banyaknya Ulangi ${index + 1}`} value={command.count} disabled={status === 'running'}
                  onChange={(event) => setCount(index, Number(event.target.value) as RepeatCount)}>
                  {[2, 3, 4].map((count) => <option key={count} value={count}>{count}×</option>)}
                </select>
              </label>
              <Reorder index={index} length={program.length} />
              <button className="remove-loop" disabled={status === 'running'} onClick={() => remove(index)} aria-label={`Hapus Ulangi ${index + 1}`}>Hapus</button>
            </div>
            <p className="loop-progress" data-loop={index}>
              {activeCommandPath?.[0] === index && loopIteration !== null ? `Putaran ${loopIteration} dari ${command.count}` : `${command.count} kali`}
              {bodyLimit !== undefined && <span className="slot-count">{command.commands.length} / {bodyLimit}</span>}
            </p>
            {command.commands.length === 0 ? <p className="empty-loop">Isi perintah di dalam Ulangi.</p>
              : <ol className="program-list loop-body" aria-label={`Isi Ulangi ${index + 1}`}>
                {command.commands.map((child, bodyIndex) => <PrimitiveBlock key={bodyIndex} command={child} index={bodyIndex} length={command.commands.length} loopIndex={index} />)}
              </ol>}
            <CommandPalette loopIndex={index} />
          </li>)}
      </ol>}
    {program.length > 0 && <p className="tray-hint">Ketuk perintah untuk menghapus. Geser dengan ← →.</p>}
  </section>;
}
