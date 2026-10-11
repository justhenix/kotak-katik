import { useEffect, useRef, useState } from 'react';
import { CommandIcon, commandLabels } from '../commands/CommandIcon';
import { CommandPalette } from '../commands/CommandPalette';
import { ControlIcon } from '../controls/ControlIcon';
import { gameStore, useGameStore } from '../../stores/game-store';
import type { CommandType, PrimitiveCommand, RepeatCount } from '../../game/types';

type Target = { kind: 'insert' | 'select'; index: number; loopIndex?: number };
const pathFor = (index: number, loopIndex?: number) => loopIndex === undefined ? `${index}` : `${loopIndex}.${index}`;
const scopeLabel = (index: number, loopIndex?: number) => `perintah ${index + 1}${loopIndex === undefined ? '' : ` di Ulangi ${loopIndex + 1}`}`;

function reveal(viewport: HTMLDivElement | null, selector: string) {
  const block = viewport?.querySelector<HTMLElement>(selector);
  if (!viewport || !block) return;
  const bounds = viewport.getBoundingClientRect(), item = block.getBoundingClientRect();
  // Follow the program horizontally without scrolling the board out of view.
  if (item.right > bounds.right - 18) viewport.scrollLeft += item.right - bounds.right + 18;
  if (item.left < bounds.left + 18) viewport.scrollLeft -= bounds.left - item.left + 18;
}

export function ProgramTray() {
  const program = useGameStore((s) => s.program);
  const level = useGameStore((s) => s.level);
  const { status, activeCommandPath, loopIteration } = useGameStore((s) => s.simulation);
  const [target, setTarget] = useState<Target>({ kind: 'insert', index: program.length });
  const strip = useRef<HTMLDivElement>(null);
  const editor = useRef<HTMLDivElement>(null);
  const running = status === 'running';
  const loop = target.loopIndex === undefined ? undefined : program[target.loopIndex];
  const scope = loop?.type === 'repeat' ? loop.commands : program;
  const selected = target.kind === 'select' ? scope[target.index] : undefined;
  const replacing = selected !== undefined && selected.type !== 'repeat';
  const limit = target.loopIndex === undefined ? level.maxProgramSlots : level.maxLoopBodySlots;
  const full = limit !== undefined && scope.length >= limit;
  const activePath = activeCommandPath?.join('.');

  useEffect(() => {
    // Reset/Clear can originate outside the editor; discard stale scope pointers.
    if (program.length === 0 || (target.loopIndex !== undefined && loop?.type !== 'repeat')) {
      setTarget({ kind: 'insert', index: program.length });
    }
  }, [program, loop, target.loopIndex]);

  useEffect(() => {
    reveal(strip.current, `[data-command-path="${activePath}"]`);
  }, [activePath, loopIteration]);

  useEffect(() => {
    reveal(strip.current, `[${target.kind === 'insert' ? 'data-insert-path' : 'data-command-path'}="${pathFor(target.index, target.loopIndex)}"]`);
  }, [target, program]);

  const focusPath = (path: string, insertion = false) => requestAnimationFrame(() => {
    editor.current?.querySelector<HTMLButtonElement>(`[${insertion ? 'data-insert-path' : 'data-command-path'}="${path}"]`)?.focus({ preventScroll: true });
  });
  const insertAt = (index: number, loopIndex?: number) => setTarget({ kind: 'insert', index, loopIndex });
  const select = (index: number, loopIndex?: number) => setTarget({ kind: 'select', index, loopIndex });
  const choose = (type: CommandType) => {
    const store = gameStore.getState();
    if (replacing && type !== 'repeat') {
      store.replaceCommand(target.index, type, target.loopIndex);
      return;
    }
    const index = selected ? target.index + 1 : Math.min(target.index, scope.length);
    store.addCommand(type, target.loopIndex, index);
    if (gameStore.getState().program === program) return;
    if (type === 'repeat') {
      insertAt(0, index);
      focusPath(`${index}.0`, true);
    } else insertAt(index + 1, target.loopIndex);
  };
  const move = (offset: -1 | 1) => {
    gameStore.getState().moveCommand(target.index, offset, target.loopIndex);
    select(target.index + offset, target.loopIndex);
    focusPath(pathFor(target.index + offset, target.loopIndex));
  };
  const remove = () => {
    gameStore.getState().removeCommand(target.index, target.loopIndex);
    insertAt(scope.length - 1, target.loopIndex);
    focusPath(pathFor(scope.length - 1, target.loopIndex), true);
  };
  const insertion = (index: number, loopIndex?: number, temporary = false) => <button
    className={`insert-slot ${target.kind === 'insert' && target.index === index && target.loopIndex === loopIndex ? 'chosen-target' : ''} ${temporary ? 'between-slot' : ''}`}
    data-insert-path={pathFor(index, loopIndex)} disabled={running}
    aria-label={loopIndex === undefined ? `Tambah di posisi ${index + 1}` : `Tambah di posisi ${index + 1} dalam Ulangi ${loopIndex + 1}`}
    aria-pressed={target.kind === 'insert' && target.index === index && target.loopIndex === loopIndex}
    onClick={() => insertAt(index, loopIndex)}><ControlIcon type="plus" /></button>;
  const primitive = (command: PrimitiveCommand, index: number, loopIndex?: number) => {
    const active = activePath === pathFor(index, loopIndex);
    const isSelected = target.kind === 'select' && target.index === index && target.loopIndex === loopIndex;
    return <li className="primitive-item" key={index}>
      {target.kind === 'insert' && target.index === index && target.loopIndex === loopIndex && insertion(index, loopIndex, true)}
      <button className={`command-block puzzle-block ${command.type} ${active ? 'active-command' : ''} ${active && status === 'failed' ? 'failed-command' : ''}`}
        disabled={running} onClick={() => select(index, loopIndex)} aria-pressed={isSelected}
        aria-label={`Pilih ${scopeLabel(index, loopIndex)}: ${commandLabels[command.type]}`} aria-current={active ? 'step' : undefined}
        data-command-path={pathFor(index, loopIndex)}>
        <span className="command-number" aria-hidden="true">{index + 1}</span><CommandIcon type={command.type} />
        <span className="block-state" aria-hidden="true">{active ? status === 'failed' ? '!' : '▶' : isSelected ? '✓' : ''}</span>
      </button>
    </li>;
  };
  return <div className="editor" ref={editor} onKeyDown={(event) => {
    if (event.key === 'Escape' && !running) { insertAt(program.length); focusPath(String(program.length), true); }
  }}>
    <section aria-labelledby="program-title" className="program-area">
      <div className="program-heading"><h2 id="program-title">Urutanmu</h2>
        {level.maxProgramSlots !== undefined && <span className="slot-count" aria-label={`${program.length} dari ${level.maxProgramSlots} tempat terisi`}>{program.length} / {level.maxProgramSlots}</span>}
      </div>
      <div className="program-scroll" ref={strip}>
        <ol className="program-list" aria-label="Urutan perintah">
          {program.map((command, index) => command.type !== 'repeat' ? primitive(command, index) : <li key={index} className="repeat-wrapper">
            {target.kind === 'insert' && target.index === index && target.loopIndex === undefined && insertion(index, undefined, true)}
            <div className={`repeat-item ${activeCommandPath?.[0] === index ? 'active-loop' : ''}`}>
              <div className="repeat-head">
                <button className="repeat-select" disabled={running} onClick={() => select(index)}
                  aria-label={`Pilih Ulangi ${index + 1}`} data-command-path={String(index)}
                  aria-pressed={target.kind === 'select' && target.index === index && target.loopIndex === undefined}>
                  <CommandIcon type="repeat" /><span>{command.count}×</span>
                </button>
              </div>
              <ol className="program-list loop-body" aria-label={`Isi Ulangi ${index + 1}`}>
                {command.commands.map((child, bodyIndex) => primitive(child, bodyIndex, index))}
              </ol>
              {insertion(command.commands.length, index)}
              <span className="loop-progress" data-loop={index} aria-label={activeCommandPath?.[0] === index && loopIteration !== null ? `Putaran ${loopIteration} dari ${command.count}` : `${command.count} kali`}>
                {Array.from({ length: command.count }, (_, iteration) => <span key={iteration} className={activeCommandPath?.[0] === index && loopIteration === iteration + 1 ? 'current-iteration' : ''}>{iteration + 1}</span>)}
              </span>
            </div>
          </li>)}
        </ol>
        {insertion(program.length)}
        {program.length === 0 && <p className="empty-hint">Ketuk perintah di bawah.</p>}
      </div>
    </section>
    {selected && <div className="selection-tools" role="group" aria-label={`Ubah ${scopeLabel(target.index, target.loopIndex)}`}>
      <span className="selection-label">{commandLabels[selected.type]} {target.index + 1}</span>
      {selected.type === 'repeat' && <select aria-label={`Banyaknya Ulangi ${target.index + 1}`} value={selected.count} disabled={running}
        onChange={(event) => gameStore.getState().setRepeatCount(target.index, Number(event.target.value) as RepeatCount)}>
        {[2, 3, 4].map((count) => <option key={count} value={count}>{count}×</option>)}
      </select>}
      <button disabled={running || target.index === 0} aria-label={`Geser ${scopeLabel(target.index, target.loopIndex)} sebelumnya`} onClick={() => move(-1)}><ControlIcon type="before" /></button>
      <button disabled={running || target.index === scope.length - 1} aria-label={`Geser ${scopeLabel(target.index, target.loopIndex)} berikutnya`} onClick={() => move(1)}><ControlIcon type="after" /></button>
      <button disabled={running || full} onClick={() => { insertAt(target.index, target.loopIndex); focusPath(pathFor(target.index, target.loopIndex), true); }}>+ Sebelum</button>
      <button disabled={running || full} onClick={() => { insertAt(target.index + 1, target.loopIndex); focusPath(pathFor(target.index + 1, target.loopIndex), true); }}>+ Sesudah</button>
      <button className="delete-selected" disabled={running} aria-label={selected.type === 'repeat' ? `Hapus Ulangi ${target.index + 1}` : `Hapus ${scopeLabel(target.index, target.loopIndex)}: ${commandLabels[selected.type]}`} onClick={remove}><ControlIcon type="delete" /><span>Hapus</span></button>
    </div>}
    <CommandPalette loopIndex={target.loopIndex} replacing={replacing} full={full} onChoose={choose} />
  </div>;
}
