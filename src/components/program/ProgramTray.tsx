import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { CommandIcon, commandLabels } from '../commands/CommandIcon';
import { CommandPalette } from '../commands/CommandPalette';
import { ControlIcon } from '../controls/ControlIcon';
import { RunControls } from '../controls/RunControls';
import { RepeatCounter } from './RepeatCounter';
import { gameStore, useGameStore } from '../../stores/game-store';
import { demoPlaying, lessonStore, useLessonStore, tutorialTarget } from '../../stores/lesson-store';
import type { CommandType, PrimitiveCommand } from '../../game/types';
import { useCommandDrag } from './useCommandDrag';
import type { DragCommand, DropSlot } from './useCommandDrag';

type Target = { kind: 'insert' | 'select'; index: number; loopIndex?: number; manual?: boolean };
const pathFor = (index: number, loopIndex?: number) => loopIndex === undefined ? `${index}` : `${loopIndex}.${index}`;
const scopeLabel = (index: number, loopIndex?: number) => `perintah ${index + 1}${loopIndex === undefined ? '' : ` di Ulangi ${loopIndex + 1}`}`;

function editingBlock(viewport: HTMLDivElement | null, target: Target) {
  const block = viewport?.querySelector<HTMLElement>(`[${target.kind === 'insert' ? 'data-insert-path' : 'data-command-path'}="${pathFor(target.index, target.loopIndex)}"]`);
  // A full scope has no trailing insertion slot; keep its last block in view.
  return block ?? (target.kind === 'insert' && target.index > 0
    ? viewport?.querySelector<HTMLElement>(`[data-command-path="${pathFor(target.index - 1, target.loopIndex)}"]`) : null);
}

function reveal(viewport: HTMLDivElement | null, block: HTMLElement | null | undefined) {
  if (!viewport || !block) return;
  const bounds = viewport.getBoundingClientRect();
  const loop = block.closest<HTMLElement>('.repeat-item');
  const item = (loop && loop.offsetWidth <= viewport.clientWidth - 28 ? loop : block).getBoundingClientRect();
  // Follow the program horizontally without scrolling the board out of view.
  if (item.right > bounds.right - 14) viewport.scrollLeft += item.right - bounds.right + 14;
  if (item.left < bounds.left + 14) viewport.scrollLeft -= bounds.left - item.left + 14;
}

export function ProgramTray({ ready }: { ready: boolean }) {
  const program = useGameStore((s) => s.program);
  const level = useGameStore((s) => s.level);
  const resetProgram = useGameStore((s) => s.resetProgram);
  const { status, activeCommandPath, loopIteration } = useGameStore((s) => s.simulation);
  const [target, setTarget] = useState<Target>({ kind: 'insert', index: program.length });
  const strip = useRef<HTMLDivElement>(null);
  const editor = useRef<HTMLDivElement>(null);
  const [anchor, setAnchor] = useState(24);
  const [scrollEdges, setScrollEdges] = useState({ overflow: false, start: true, end: true });
  const running = status === 'running';
  const loop = target.loopIndex === undefined ? undefined : program[target.loopIndex];
  const scope = loop?.type === 'repeat' ? loop.commands : program;
  const selected = target.kind === 'select' ? scope[target.index] : undefined;
  const replacing = selected !== undefined && selected.type !== 'repeat';
  const limit = target.loopIndex === undefined ? level.maxProgramSlots : level.maxLoopBodySlots;
  const full = limit !== undefined && scope.length >= limit;
  const countOnly = level.learning.phase !== 'practice' && selected?.type === 'repeat' && full;
  const activePath = activeCommandPath?.join('.');
  const simulation = useGameStore((s) => s.simulation);
  const lesson = useLessonStore((s) => s);
  const watching = demoPlaying(lesson.demoPhase);
  const curriculum = level.learning.phase !== 'practice';
  const canArrange = !curriculum || !['movement', 'sequencing'].includes(level.learning.concept);
  const completed = simulation.completion || lesson.demoPhase === 'skipped';
  const locked = running || watching || level.learning.phase === 'demonstration';
  const focus = tutorialTarget(level, program, simulation, lesson);
  const guidance = level.learning.guidance?.[lesson.guideIndex];
  const preparedPrefix = program.length >= level.initialProgram.length && level.initialProgram.every((command, index) => program[index]?.type === command.type);
  const choices = watching && lesson.demoAction?.type === 'add' ? [lesson.demoAction.command]
    : !replacing && preparedPrefix && level.learning.phase === 'guided' && focus?.type === 'palette' && guidance?.complete.type === 'command' ? guidance.complete.choices : undefined;
  const showControls = !curriculum || !completed && (level.learning.phase === 'independent' || level.learning.concept === 'debugging'
    || focus?.type === 'run' || focus?.type === 'step' || running);
  const showPalette = !countOnly && (!curriculum || !completed && !running && (replacing || target.manual || focus?.type !== 'run' && focus?.type !== 'step')
    && (level.learning.phase !== 'demonstration' || lesson.demoAction?.type === 'add' || lesson.demoAction?.type === 'replace'));
  const resetLabel = level.initialProgram.length > 0 ? 'Mulai ulang' : 'Hapus semua';
  const wasWatching = useRef(false);
  useEffect(() => {
    if (running) setTarget(current => {
      if (current.kind !== 'select') return current;
      const parent = current.loopIndex === undefined ? undefined : program[current.loopIndex];
      return { kind: 'insert', index: parent?.type === 'repeat' ? parent.commands.length : program.length, loopIndex: current.loopIndex };
    });
  }, [running, program]);
  useEffect(() => {
    const action = lesson.demoAction;
    if (watching && (action?.type === 'replace' || action?.type === 'select' && simulation.status === 'idle')) {
      setTarget({ kind: 'select', index: action.path[action.path.length - 1], loopIndex: action.path.length === 2 ? action.path[0] : undefined });
    } else if (watching && action?.type === 'add') {
      setTarget({ kind: 'insert', index: action.index, loopIndex: action.loopIndex });
    } else if (wasWatching.current && !watching) setTarget({ kind: 'insert', index: program.length });
    wasWatching.current = watching;
  }, [watching, lesson.demoAction, program.length, simulation.status]);

  useEffect(() => {
    // Reset/Clear can originate outside the editor; discard stale scope pointers.
    if (program.length === 0 || (target.loopIndex !== undefined && loop?.type !== 'repeat')) {
      setTarget({ kind: 'insert', index: program.length });
    }
  }, [program, loop, target.loopIndex]);

  useEffect(() => {
    if (completed) strip.current?.scrollTo({ left: 0 });
    else reveal(strip.current, strip.current?.querySelector<HTMLElement>(`[data-command-path="${activePath}"]`));
  }, [activePath, loopIteration, completed]);

  useEffect(() => {
    if (!completed && !running) reveal(strip.current, editingBlock(strip.current, target));
  }, [target, program, completed, running]);

  useEffect(() => {
    const viewport = strip.current;
    const content = viewport?.firstElementChild;
    if (!viewport || !content) return;
    const measure = () => {
      const end = viewport.scrollWidth - viewport.clientWidth;
      setScrollEdges({ overflow: end > 1, start: viewport.scrollLeft < 1, end: viewport.scrollLeft >= end - 1 });
      const block = editingBlock(viewport, target)?.getBoundingClientRect();
      const area = viewport.closest('.program-area')?.getBoundingClientRect();
      if (block && area) setAnchor(Math.max(16, Math.min(area.width - 16, block.x + block.width / 2 - area.x)));
    };
    const resize = new ResizeObserver(() => {
      if (!completed) reveal(viewport, running ? viewport.querySelector<HTMLElement>(`[data-command-path="${activePath}"]`) : editingBlock(viewport, target));
      measure();
    });
    resize.observe(viewport); resize.observe(content);
    viewport.addEventListener('scroll', measure);
    measure();
    return () => { resize.disconnect(); viewport.removeEventListener('scroll', measure); };
  }, [target, activePath, running, completed]);

  const focusPath = (path: string, insertion = false) => requestAnimationFrame(() => {
    const slot = editor.current?.querySelector<HTMLButtonElement>(`[${insertion ? 'data-insert-path' : 'data-command-path'}="${path}"]`);
    const commands = insertion && !slot ? editor.current?.querySelectorAll<HTMLButtonElement>('.program-list button:not(:disabled)') : undefined;
    // Full scopes have no trailing slot; keep Escape inside the editor.
    (slot ?? commands?.[commands.length - 1])?.focus({ preventScroll: true });
  });
  const insertAt = (index: number, loopIndex?: number, manual = false) => {
    setTarget({ kind: 'insert', index, loopIndex, manual });
    if (manual && (focus?.type === 'slot' && focus.index === index && focus.loopIndex === loopIndex || focus?.type === 'run')) lessonStore.getState().chooseGuideTarget();
  };
  const select = (index: number, loopIndex?: number) => {
    gameStore.getState().resetSimulation();
    setTarget({ kind: 'select', index, loopIndex });
    if (focus?.type === 'command' && focus.path.join('.') === pathFor(index, loopIndex)
      || scope[index]?.type !== 'repeat' && (focus?.type === 'run' || focus?.type === 'slot' || status === 'failed')) lessonStore.getState().chooseGuideTarget();
  };
  const choose = (type: CommandType) => {
    const store = gameStore.getState();
    if (replacing && type !== 'repeat') {
      store.replaceCommand(target.index, type, target.loopIndex);
      if (level.learning.phase === 'guided' && gameStore.getState().program !== program) setTarget({ kind: 'insert', index: program.length });
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
    setTarget({ kind: 'select', index: target.index + offset, loopIndex: target.loopIndex });
    focusPath(pathFor(target.index + offset, target.loopIndex));
  };
  const remove = () => {
    gameStore.getState().removeCommand(target.index, target.loopIndex);
    insertAt(scope.length - 1, target.loopIndex);
    focusPath(pathFor(scope.length - 1, target.loopIndex), true);
  };
  const resolveDrop = (x: number, y: number, item: DragCommand): DropSlot | null => {
    const node = document.elementFromPoint(x, y);
    if (!node?.closest('.program-sequence')) return null;
    const block = node.closest<HTMLElement>('[data-insert-path], [data-command-path]');
    const path = block?.dataset.insertPath ?? block?.dataset.commandPath;
    const parts = path?.split('.').map(Number);
    const loopIndex = parts?.length === 2 ? parts[0] : !parts ? Number(node.closest<HTMLElement>('[data-loop-scope]')?.dataset.loopScope) : undefined;
    const scopeIndex = Number.isFinite(loopIndex) ? loopIndex : undefined;
    const parent = scopeIndex === undefined ? undefined : program[scopeIndex];
    const commands = parent?.type === 'repeat' ? parent.commands : program;
    const limit = scopeIndex === undefined ? level.maxProgramSlots : level.maxLoopBodySlots;
    if (item.type === 'repeat' && scopeIndex !== undefined || item.index !== undefined && item.loopIndex !== scopeIndex
      || item.index === undefined && limit !== undefined && commands.length >= limit) return null;
    let index = parts?.[parts.length - 1] ?? commands.length;
    if (block?.dataset.commandPath && x > block.getBoundingClientRect().x + block.getBoundingClientRect().width / 2) index++;
    return { index, loopIndex: scopeIndex };
  };
  const drop = (item: DragCommand, slot: DropSlot) => {
    const store = gameStore.getState();
    if (item.index === undefined) {
      store.addCommand(item.type, slot.loopIndex, slot.index);
      if (gameStore.getState().program === program) return;
      if (focus?.type === 'slot' || focus?.type === 'run') lessonStore.getState().chooseGuideTarget();
      insertAt(item.type === 'repeat' ? 0 : slot.index + 1, item.type === 'repeat' ? slot.index : slot.loopIndex, true);
    } else {
      const destination = slot.index > item.index ? slot.index - 1 : slot.index;
      let index = item.index;
      while (index !== destination) {
        const direction = destination > index ? 1 : -1;
        store.moveCommand(index, direction, slot.loopIndex);
        index += direction;
      }
      setTarget({ kind: 'select', index, loopIndex: slot.loopIndex });
      focusPath(pathFor(index, slot.loopIndex));
    }
  };
  const drag = useCommandDrag(resolveDrop, drop);
  const insertion = (index: number, loopIndex?: number, temporary = false) => {
    const insertionLoop = loopIndex === undefined ? undefined : program[loopIndex];
    const insertionScope = insertionLoop?.type === 'repeat' ? insertionLoop.commands : program;
    const insertionLimit = loopIndex === undefined ? level.maxProgramSlots : level.maxLoopBodySlots;
    const insertionFull = insertionLimit !== undefined && insertionScope.length >= insertionLimit;
    return curriculum && (completed || level.learning.phase === 'demonstration' && program.length > 0 || insertionFull && !temporary) ? null : <button
    className={`insert-slot ${target.kind === 'insert' && target.index === index && target.loopIndex === loopIndex ? 'chosen-target' : ''} ${temporary ? 'between-slot' : ''}`}
    data-insert-path={pathFor(index, loopIndex)} disabled={locked}
    data-drop-target={drag.preview?.slot?.index === index && drag.preview.slot.loopIndex === loopIndex || undefined}
    aria-label={loopIndex === undefined ? `Tambah di posisi ${index + 1}` : `Tambah di posisi ${index + 1} dalam Ulangi ${loopIndex + 1}`}
    aria-pressed={target.kind === 'insert' && target.index === index && target.loopIndex === loopIndex}
    onClick={() => insertAt(index, loopIndex, true)}><ControlIcon type="plus" /></button>;
  };
  const primitive = (command: PrimitiveCommand, index: number, loopIndex?: number) => {
    const active = activePath === pathFor(index, loopIndex);
    const isSelected = target.kind === 'select' && target.index === index && target.loopIndex === loopIndex;
    return <li className="primitive-item" key={index}>
      {target.kind === 'insert' && target.index === index && target.loopIndex === loopIndex && insertion(index, loopIndex, true)}
      <button className={`command-block puzzle-block ${command.type} ${active ? completed ? 'completed-command' : 'active-command' : ''} ${active && status === 'failed' ? 'failed-command' : ''} ${watching && lesson.demoAction?.type === 'add' && lesson.demoPhase !== 'command' && lesson.demoPath?.join('.') === pathFor(index, loopIndex) ? 'block-arrival' : ''}`}
        {...drag.bind({ type: command.type, index, loopIndex }, locked || !canArrange)}
        disabled={locked} onClick={() => { if (!drag.consumeClick()) select(index, loopIndex); }} aria-pressed={isSelected}
        aria-controls={isSelected ? 'command-actions' : undefined}
        aria-label={`Pilih ${scopeLabel(index, loopIndex)}: ${commandLabels[command.type]}`} aria-current={active ? 'step' : undefined}
        data-command-path={pathFor(index, loopIndex)}>
        <span className="command-number" aria-hidden="true">{index + 1}</span><CommandIcon type={command.type} />
        <span className="block-state" aria-hidden="true">{active ? status === 'failed' ? '!' : completed ? '✓' : '▶' : isSelected ? '✓' : ''}</span>
      </button>
    </li>;
  };
  return <div className="editor" ref={editor} onKeyDown={(event) => {
    if (event.key === 'Escape' && !locked) {
      insertAt(program.length, undefined, level.maxProgramSlots === undefined || program.length < level.maxProgramSlots);
      focusPath(String(program.length), true);
    }
  }}>
    <section aria-labelledby="program-title" className="program-area">
      <h2 id="program-title" className="sr-only">Urutanmu</h2>
      <div className="program-scroll">
        <div className="program-sequence" ref={strip} onFocusCapture={(event) => {
          if (event.target instanceof HTMLElement) reveal(strip.current, event.target);
        }}>
          <div className="program-strip">
          <ol className="program-list" aria-label="Urutan perintah">
            {program.map((command, index) => command.type !== 'repeat' ? primitive(command, index) : <li key={index} className="repeat-wrapper">
              {target.kind === 'insert' && target.index === index && target.loopIndex === undefined && insertion(index, undefined, true)}
              <div className={`repeat-item ${activeCommandPath?.[0] === index ? 'active-loop' : ''}`} data-loop-scope={index}>
                <div className="repeat-head">
                  <button className="repeat-select" {...drag.bind({ type: 'repeat', index }, locked || !canArrange)} disabled={locked} onClick={() => { if (!drag.consumeClick()) select(index); }}
                    aria-label={`Pilih Ulangi ${index + 1}`} data-command-path={String(index)}
                    aria-controls={target.kind === 'select' && target.index === index && target.loopIndex === undefined ? 'command-actions' : undefined}
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
          </div>
        </div>
      </div>
      {scrollEdges.overflow && <div className="program-navigation" role="group" aria-label="Geser urutan">
        <button disabled={scrollEdges.start} aria-label="Lihat awal urutan" onClick={() => strip.current?.scrollBy({ left: -strip.current.clientWidth * 0.8 })}><ControlIcon type="before" /></button>
        <span>Geser urutan</span>
        <button disabled={scrollEdges.end} aria-label="Lihat akhir urutan" onClick={() => strip.current?.scrollBy({ left: strip.current.clientWidth * 0.8 })}><ControlIcon type="after" /></button>
      </div>}
    {selected && !locked && (!curriculum || !completed) && <div id="command-actions" className={`selection-tools ${countOnly ? 'count-tools' : ''}`} role="group" aria-label={`Ubah ${scopeLabel(target.index, target.loopIndex)}`} style={{ '--command-anchor': `${anchor}px` } as CSSProperties}>
      <span className="selection-label"><CommandIcon type={selected.type} />{commandLabels[selected.type]} {target.index + 1}</span>
      <button className="delete-selected" disabled={locked} aria-label={selected.type === 'repeat' ? `Hapus Ulangi ${target.index + 1}` : `Hapus ${scopeLabel(target.index, target.loopIndex)}: ${commandLabels[selected.type]}`} onClick={remove}><ControlIcon type="delete" /><span>Hapus</span></button>
      {selected.type === 'repeat' && <RepeatCounter index={target.index} count={selected.count} disabled={locked}
        onChange={(count) => gameStore.getState().setRepeatCount(target.index, count)} />}
      {canArrange && <div className="command-placement">
      <button disabled={locked || target.index === 0} aria-label={`Geser ${scopeLabel(target.index, target.loopIndex)} sebelumnya`} onClick={() => move(-1)}><ControlIcon type="before" /></button>
      <button disabled={locked || target.index === scope.length - 1} aria-label={`Geser ${scopeLabel(target.index, target.loopIndex)} berikutnya`} onClick={() => move(1)}><ControlIcon type="after" /></button>
      <button disabled={locked || full} onClick={() => { insertAt(target.index, target.loopIndex, true); focusPath(pathFor(target.index, target.loopIndex), true); }}>+ Sebelum</button>
      <button disabled={locked || full} onClick={() => { insertAt(target.index + 1, target.loopIndex, true); focusPath(pathFor(target.index + 1, target.loopIndex), true); }}>+ Sesudah</button>
      </div>}
    </div>}
    </section>
    {showControls && <RunControls ready={ready} watching={watching} showStep={!curriculum || level.learning.concept === 'debugging' || level.learning.concept === 'mixed-application'}
      resetControl={!curriculum && <button className="delete-program-button clear-button" disabled={program.length === 0 || locked}
        aria-label={resetLabel} title={resetLabel} onClick={() => {
          resetProgram(); insertAt(level.initialProgram.length);
        }}><ControlIcon type={level.initialProgram.length > 0 ? 'reset' : 'delete'} /></button>} />}
    {showPalette && <CommandPalette loopIndex={target.loopIndex} replacing={replacing} full={full} watching={watching} choices={choices} onChoose={choose} drag={drag} />}
    {drag.preview && <div className={`drag-preview puzzle-block ${drag.preview.item.type}`} style={{ left: drag.preview.x, top: drag.preview.y }} aria-hidden="true"><CommandIcon type={drag.preview.item.type} /></div>}
  </div>;
}
