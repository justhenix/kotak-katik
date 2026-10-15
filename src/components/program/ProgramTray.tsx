import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Ellipsis, ListRestart, Pencil, Trash2, X } from 'lucide-react';
import { CommandIcon, commandLabels } from '../commands/CommandIcon';
import { CommandPalette } from '../commands/CommandPalette';
import { ControlIcon } from '../controls/ControlIcon';
import { RunControls } from '../controls/RunControls';
import { LessonScaffold } from '../learning/LessonScaffold';
import { RepeatCounter } from './RepeatCounter';
import { gameStore, useGameStore } from '../../stores/game-store';
import { demoPlaying, lessonStore, tutorialTarget, useLessonStore } from '../../stores/lesson-store';
import type { CommandType } from '../../game/types';
import { useCommandDrag } from './useCommandDrag';
import type { DragCommand, DropSlot } from './useCommandDrag';
import { canInteract } from '../../stores/interaction-policy';

type Selection = { kind: 'insert' | 'command'; index: number } | null;
type Tools = 'palette' | 'replace' | 'command' | 'repeat' | 'repeat-more' | null;
const path = (index: number, scope?: number) => scope === undefined ? `${index}` : `${scope}.${index}`;
const description = (index: number, scope?: number) => `perintah ${index + 1}${scope === undefined ? '' : ` di Ulangi ${scope + 1}`}`;

export function ProgramTray({ ready, onContinue, onFinish }: { ready: boolean; onContinue?: () => void; onFinish?: () => void }) {
  const { level, program, simulation } = useGameStore(state => state);
  const lesson = useLessonStore(state => state);
  const [scopeIndex, setScopeIndex] = useState<number>();
  const [selection, setSelection] = useState<Selection>(null);
  const [tools, setTools] = useState<Tools>(null);
  const dock = useRef<HTMLDivElement>(null);
  const strip = useRef<HTMLDivElement>(null);
  const row = useRef<HTMLDivElement>(null);
  const parent = scopeIndex === undefined ? undefined : program[scopeIndex];
  const body = parent?.type === 'repeat' ? parent : undefined;
  const scope = body?.commands ?? program;
  const selected = selection?.kind === 'command' ? scope[selection.index] : undefined;
  const watching = demoPlaying(lesson.demoPhase);
  const curriculum = level.learning.phase !== 'practice';
  const complete = simulation.completion || lesson.demoPhase === 'skipped';
  const running = simulation.status === 'running';
  const locked = running || watching || level.learning.phase === 'demonstration';
  const allows = (action: Parameters<typeof canInteract>[2]) => canInteract({ level, program, simulation }, lesson, action);
  const target = tutorialTarget(level, program, simulation, lesson);
  const limit = body ? level.maxLoopBodySlots : level.maxProgramSlots;
  const full = limit !== undefined && scope.length >= limit;
  const replacing = tools === 'replace';
  const canArrange = level.learning.phase !== 'demonstration';
  const activePath = simulation.activeCommandPath?.join('.');
  const guidedSlotPath = target?.type === 'slot' ? path(target.index, target.loopIndex) : target?.type === 'command' ? target.path.join('.') : undefined;
  const showControls = (!curriculum || !complete) && (watching ? ['run', 'step', 'restart'].includes(lesson.demoAction?.type ?? '') : allows({ type: 'run' }) || allows({ type: 'step' }) || running);
  const canRun = watching ? lesson.demoAction?.type === 'run' || running : allows({ type: 'run' }) || running;
  const canStep = watching ? ['step', 'restart'].includes(lesson.demoAction?.type ?? '') : allows({ type: 'step' });
  const choices = watching && lesson.demoAction?.type === 'add' ? [lesson.demoAction.command]
    : watching && lesson.demoAction?.type === 'replace' ? [lesson.demoAction.command]
    : level.allowedCommands.filter(command => allows({ type: replacing ? 'replace' : 'add', command, index: selection?.index ?? scope.length, loopIndex: scopeIndex }));
  const showTools = tools && !running && (!curriculum || !complete);

  const focusBlock = (index: number, owner: number | undefined, insertion = false) => requestAnimationFrame(() => {
    const selector = `[${insertion ? 'data-insert-path' : 'data-command-path'}="${path(index, owner)}"]`;
    const node = dock.current?.querySelector<HTMLButtonElement>(selector)
      ?? strip.current?.querySelector<HTMLButtonElement>('button:not(:disabled)');
    node?.focus({ preventScroll: true });
  });
  const close = () => {
    setTools(null);
    lesson.releaseGuideTarget();
    if (selection) focusBlock(selection.index, scopeIndex, selection.kind === 'insert');
    setSelection(null);
  };
  const enterBody = (index: number) => {
    if (!lesson.requestInteraction({ type: 'body', index })) return;
    setScopeIndex(index); setSelection(null); setTools(null);
    focusBlock(0, index, true);
  };
  const returnToProgram = () => {
    const index = scopeIndex ?? 0;
    setScopeIndex(undefined); setSelection(null); setTools(null);
    lesson.releaseGuideTarget();
    focusBlock(index, undefined);
  };
  const insert = (index: number) => {
    if (!lesson.requestInteraction({ type: 'insert', index, loopIndex: scopeIndex })) return;
    setSelection({ kind: 'insert', index }); setTools('palette');
    if (target?.type === 'slot' || target?.type === 'run') lessonStore.getState().chooseGuideTarget();
  };
  const select = (index: number) => {
    if (!lesson.requestInteraction({ type: 'select', index, loopIndex: scopeIndex })) return;
    setSelection({ kind: 'command', index }); setTools(scope[index].type === 'repeat' ? 'repeat' : 'command');
    if (target?.type === 'command' || target?.type === 'run' || simulation.status === 'failed') lessonStore.getState().chooseGuideTarget();
  };
  const choose = (type: CommandType) => {
    const store = gameStore.getState();
    const index = selection?.index ?? scope.length;
    if (!lessonStore.getState().requestInteraction({ type: replacing ? 'replace' : 'add', command: type, index, loopIndex: scopeIndex })) return;
    if (replacing && type !== 'repeat') store.replaceCommand(index, type, scopeIndex);
    else store.addCommand(type, scopeIndex, index);
    if (gameStore.getState().program === store.program && !(replacing && selected?.type === type)) return;
    const next = gameStore.getState();
    const nextParent = scopeIndex === undefined ? undefined : next.program[scopeIndex];
    const length = nextParent?.type === 'repeat' ? nextParent.commands.length : next.program.length;
    const nextTarget = tutorialTarget(next.level, next.program, next.simulation, lessonStore.getState());
    if (!replacing && type === 'repeat') {
      setSelection({ kind: 'command', index }); setTools('repeat');
    } else if (!replacing && (limit === undefined || length < limit) && nextTarget?.type !== 'run' && nextTarget?.type !== 'step') {
      if (nextTarget?.type === 'slot') lessonStore.getState().chooseGuideTarget();
      setSelection({ kind: 'insert', index: index + 1 }); setTools('palette');
    } else {
      lessonStore.getState().releaseGuideTarget();
      setTools(null); setSelection(null);
      if (level.learning.phase !== 'guided') focusBlock(index, scopeIndex);
    }
  };
  const move = (offset: -1 | 1) => {
    if (selection?.kind !== 'command') return;
    gameStore.getState().moveCommand(selection.index, offset, scopeIndex);
    setSelection({ kind: 'command', index: selection.index + offset });
    focusBlock(selection.index + offset, scopeIndex);
  };
  const remove = () => {
    if (!selection) return;
    gameStore.getState().removeCommand(selection.index, scopeIndex);
    setSelection(null); setTools(null);
    focusBlock(Math.min(selection.index, scope.length - 1), scopeIndex, true);
  };

  useEffect(() => {
    if (scopeIndex !== undefined && parent?.type !== 'repeat') { setScopeIndex(undefined); setTools(null); setSelection(null); }
  }, [parent, scopeIndex]);
  useEffect(() => {
    if (level.learning.phase !== 'guided') return;
    if (tools === 'repeat' && selection?.kind === 'command' && selected?.type === 'repeat' && allows({ type: 'count', index: selection.index, count: selected.count })) return;
    setSelection(null); setTools(null); setScopeIndex(undefined);
    const frame = requestAnimationFrame(() => {
      const next = dock.current?.querySelector<HTMLButtonElement>('.next-lesson')
        ?? dock.current?.querySelector<HTMLButtonElement>('button.instruction-focus:not(:disabled):not([aria-disabled="true"]), .instruction-focus button:not(:disabled):not([aria-disabled="true"])')
        ?? dock.current?.querySelector<HTMLButtonElement>('.insert-slot:not(:disabled)')
        ?? dock.current?.querySelector<HTMLButtonElement>('.run-button:not(:disabled)')
        ?? dock.current?.querySelector<HTMLButtonElement>('.command-block[aria-disabled="false"]');
      next?.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(frame);
  }, [lesson.guideIndex, level.id, level.learning.phase, target?.type === 'run']);
  useEffect(() => {
    if (selection && (selection.index > scope.length || selection.kind === 'command' && !scope[selection.index])) {
      setSelection(null); setTools(null);
    }
  }, [program, scope, selection]);
  useEffect(() => {
    const outside = (event: PointerEvent) => {
      if (!watching && event.target instanceof Node && !dock.current?.contains(event.target)) { setTools(null); setSelection(null); lessonStore.getState().releaseGuideTarget(); }
    };
    document.addEventListener('pointerdown', outside);
    return () => document.removeEventListener('pointerdown', outside);
  }, [watching]);
  useEffect(() => {
    if (running || complete || simulation.status === 'paused') { setTools(null); setSelection(null); }
    const active = simulation.activeCommandPath;
    if (active && ['running', 'paused', 'failed', 'completed'].includes(simulation.status)) setScopeIndex(active.length === 2 ? active[0] : undefined);
  }, [running, complete, activePath, simulation.status]);
  useEffect(() => {
    if (!watching) return;
    const action = lesson.demoAction;
    if (action?.type === 'add') {
      setScopeIndex(action.loopIndex); setSelection({ kind: 'insert', index: action.index });
      setTools(lesson.demoPhase === 'result' ? null : 'palette');
    } else if (action?.type === 'replace') {
      setScopeIndex(action.path.length === 2 ? action.path[0] : undefined);
      setSelection({ kind: 'command', index: action.path.at(-1)! }); setTools('replace');
    } else if (action?.type === 'select') {
      setScopeIndex(action.path.length === 2 ? action.path[0] : undefined);
      setSelection({ kind: 'command', index: action.path.at(-1)! }); setTools(null);
    } else { setTools(null); setSelection(null); }
  }, [watching, lesson.demoAction, lesson.demoPhase]);
  useEffect(() => {
    if (!showTools || watching) return;
    const frame = requestAnimationFrame(() => row.current?.querySelector<HTMLButtonElement>('button:not(:disabled)')?.focus({ preventScroll: true }));
    return () => cancelAnimationFrame(frame);
  }, [tools, watching, showTools]);
  useEffect(() => {
    const viewport = strip.current;
    const selectedPath = guidedSlotPath && tools !== 'palette' && !running ? guidedSlotPath
      : selection ? path(selection.kind === 'insert' && selection.index > 0 ? selection.index - 1 : selection.index, scopeIndex)
      : activePath && simulation.status !== 'idle' ? activePath : path(0, scopeIndex);
    const item = viewport?.querySelector<HTMLElement>(`[data-command-path="${selectedPath}"], [data-insert-path="${selectedPath}"]`);
    if (!viewport || !item) return;
    const area = viewport.getBoundingClientRect(), bounds = item.getBoundingClientRect();
    if (bounds.right > area.right - 12) viewport.scrollLeft += bounds.right - area.right + 12;
    if (bounds.left < area.left + 12) viewport.scrollLeft -= area.left - bounds.left + 12;
  }, [program, scopeIndex, selection, activePath, running, simulation.status, scope.length, guidedSlotPath, tools]);

  const resolveDrop = (x: number, y: number, item: DragCommand): DropSlot | null => {
    const hit = document.elementFromPoint(x, y)?.closest<HTMLElement>('[data-command-path], [data-insert-path]');
    if (!hit?.closest('.program-sequence')) return null;
    if (item.type === 'repeat' && scopeIndex !== undefined || item.index !== undefined && item.loopIndex !== scopeIndex || item.index === undefined && full) return null;
    const parts = (hit.dataset.insertPath ?? hit.dataset.commandPath)!.split('.').map(Number);
    let index = parts.at(-1)!;
    if (hit.dataset.commandPath && x > hit.getBoundingClientRect().x + hit.offsetWidth / 2) index++;
    if (!allows(item.index === undefined ? { type: 'add', command: item.type, index, loopIndex: scopeIndex } : { type: 'move', index: item.index, loopIndex: scopeIndex })) return null;
    return { index, loopIndex: scopeIndex };
  };
  const drag = useCommandDrag(resolveDrop, (item, destination) => {
    const store = gameStore.getState();
    if (item.index === undefined) {
      store.addCommand(item.type, destination.loopIndex, destination.index);
      setTools(null); setSelection(null);
    } else {
      const last = destination.index > item.index ? destination.index - 1 : destination.index;
      for (let index = item.index; index !== last;) { const offset = last > index ? 1 : -1; store.moveCommand(index, offset, scopeIndex); index += offset; }
      setSelection({ kind: 'command', index: last }); setTools(item.type === 'repeat' ? 'repeat' : 'command');
    }
  });
  const slot = (index: number) => !full && !(curriculum && complete) && (watching || allows({ type: 'insert', index, loopIndex: scopeIndex })) && <li className="slot-item" key={`slot-${index}`}><button className={`insert-slot ${index === (selection?.kind === 'insert' ? selection.index : scope.length) ? 'chosen-target' : ''}`}
    aria-label={`Tambah di posisi ${index + 1}${scopeIndex === undefined ? '' : ` dalam Ulangi ${scopeIndex + 1}`}`}
    aria-expanded={selection?.kind === 'insert' && selection.index === index && tools === 'palette'}
    data-insert-path={path(index, scopeIndex)} disabled={locked} onClick={() => insert(index)}><ControlIcon type="plus" /></button></li>;
  const placementIndex = selection?.index;
  return <div className="command-dock editor" ref={dock} data-scope={scopeIndex === undefined ? 'program' : `repeat-${scopeIndex}`} onPointerDownCapture={() => {
    if (watching) lesson.requestInteraction({ type: 'unrelated' });
  }} onKeyDown={event => {
    if (event.key === 'Escape') { event.stopPropagation(); if (tools) close(); else if (body) returnToProgram(); }
  }}>
    <div className="dock-main">
      {body && <button className="scope-back" aria-label="Kembali ke urutan" onClick={returnToProgram}><ArrowLeft aria-hidden="true" /><span>{simulation.activeCommandPath?.[0] === scopeIndex && simulation.loopIteration !== null ? `${simulation.loopIteration}/${body.count}` : `${body.count}×`}</span></button>}
      <section className="program-area" aria-label="Urutanmu">
        <div className="program-sequence" ref={strip} tabIndex={0} aria-label={body ? `Isi Ulangi ${scopeIndex! + 1}` : 'Geser urutan perintah'} onKeyDown={event => {
          if (event.target !== strip.current || !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
          event.preventDefault();
          if (event.key === 'Home') strip.current.scrollLeft = 0;
          else if (event.key === 'End') strip.current.scrollLeft = strip.current.scrollWidth;
          else strip.current.scrollLeft += event.key === 'ArrowRight' ? 120 : -120;
        }}>
          <ol className="program-list program-strip" aria-label={body ? `Isi Ulangi ${scopeIndex! + 1}` : 'Urutan perintah'}>
            {scope.flatMap((command, index) => {
              const current = activePath === path(index, scopeIndex) || command.type === 'repeat' && simulation.activeCommandPath?.[0] === index;
              const chosen = selection?.kind === 'command' && selection.index === index;
              const before = index === placementIndex && (tools === 'palette' || chosen && canArrange);
              const label = command.type === 'repeat' ? `Pilih Ulangi ${index + 1}` : `Pilih ${description(index, scopeIndex)}: ${commandLabels[command.type]}`;
              return [before && slot(index), <li className={command.type === 'repeat' ? 'repeat-wrapper' : 'primitive-item'} key={`command-${index}`}>
                <button className={`command-block puzzle-block ${command.type} ${command.type === 'repeat' ? 'repeat-select' : ''} ${current ? simulation.status === 'failed' ? 'failed-command' : complete ? 'completed-command' : 'active-command' : ''}`}
                  {...drag.bind({ type: command.type, index, loopIndex: scopeIndex }, locked || !canArrange || !allows({ type: 'move', index, loopIndex: scopeIndex }))} disabled={locked}
                  aria-disabled={!allows({ type: 'select', index, loopIndex: scopeIndex })} tabIndex={allows({ type: 'select', index, loopIndex: scopeIndex }) ? 0 : -1}
                  aria-label={label} aria-pressed={chosen} aria-current={current ? 'step' : undefined} data-command-path={path(index, scopeIndex)}
                  onClick={() => { if (!drag.consumeClick()) select(index); }}>
                  <CommandIcon type={command.type} />
                  {command.type === 'repeat' ? <span className="repeat-count">{command.count}×</span> : <span className="command-number" aria-hidden="true">{index + 1}</span>}
                  {current && <span className="block-state" aria-hidden="true">{simulation.status === 'failed' ? '!' : complete ? '✓' : '▶'}</span>}
                </button>
              </li>, chosen && canArrange && index + 1 < scope.length && slot(index + 1)];
            })}
            {slot(scope.length)}
          </ol>
        </div>
      </section>
      <div className="dock-primary">
        <LessonScaffold ready={ready} onContinue={onContinue} onFinish={onFinish} />
        {showControls && <RunControls ready={ready} watching={watching} showRun={canRun} showStep={canStep && (curriculum ? ['debugging', 'mixed-application'].includes(level.learning.concept) || lesson.observedAttempt || watching : scopeIndex === undefined || simulation.status !== 'idle')} />}
      </div>
    </div>
    {showTools && <div className="dock-context" ref={row} role="group" aria-label={tools === 'palette' ? 'Tambah perintah' : tools === 'replace' ? 'Ganti perintah' : 'Ubah perintah'}>
      {(tools === 'palette' || tools === 'replace') ? <CommandPalette loopIndex={scopeIndex} replacing={replacing} full={full} watching={watching} choices={choices} onChoose={choose} drag={drag} />
        : tools === 'repeat' && selected?.type === 'repeat' ? <>
          {allows({ type: 'count', index: selection!.index, count: selected.count }) && <RepeatCounter index={selection!.index} count={selected.count} disabled={locked} onChange={count => gameStore.getState().setRepeatCount(selection!.index, count)} />}
          {allows({ type: 'body', index: selection!.index }) && <button data-edit-body aria-label={`Edit isi Ulangi ${selection!.index + 1}`} onClick={() => enterBody(selection!.index)}><ListRestart aria-hidden="true" /><span className="tool-label" aria-hidden="true">Isi</span></button>}
          {allows({ type: 'remove', index: selection!.index, loopIndex: scopeIndex }) && <button aria-label="Pilihan Ulangi" onClick={() => setTools('repeat-more')}><Ellipsis aria-hidden="true" /></button>}
        </> : <>
          {canArrange && allows({ type: 'move', index: selection!.index, loopIndex: scopeIndex }) && <><button aria-label={`Geser ${description(selection!.index, scopeIndex)} sebelumnya`} disabled={locked || selection!.index === 0} onClick={() => move(-1)}><ArrowLeft aria-hidden="true" /></button>
          <button aria-label={`Geser ${description(selection!.index, scopeIndex)} berikutnya`} disabled={locked || selection!.index === scope.length - 1} onClick={() => move(1)}><ArrowRight aria-hidden="true" /></button></>}
          {selected?.type !== 'repeat' && level.allowedCommands.some(command => allows({ type: 'replace', command, index: selection!.index, loopIndex: scopeIndex })) && <button data-edit-action="replace" aria-label="Ganti perintah" onClick={() => setTools('replace')}><Pencil aria-hidden="true" /><span className="tool-label" aria-hidden="true">Ganti</span></button>}
          {allows({ type: 'remove', index: selection!.index, loopIndex: scopeIndex }) && <button className="delete-selected" aria-label={selected?.type === 'repeat' ? `Hapus Ulangi ${selection!.index + 1}` : `Hapus ${description(selection!.index, scopeIndex)}: ${selected ? commandLabels[selected.type] : ''}`} onClick={remove}><Trash2 aria-hidden="true" /></button>}
        </>}
      {!watching && <button className="close-tools" aria-label="Tutup pilihan" onClick={close}><X aria-hidden="true" /></button>}
    </div>}
    {body && simulation.activeCommandPath?.[0] === scopeIndex && simulation.loopIteration !== null && <span className="loop-progress sr-only" aria-label={`Putaran ${simulation.loopIteration} dari ${body.count}`}><span className="current-iteration">{simulation.loopIteration}</span>/{body.count}</span>}
    {drag.preview && <div className={`drag-preview puzzle-block ${drag.preview.item.type}`} style={{ left: drag.preview.x, top: drag.preview.y }} aria-hidden="true"><CommandIcon type={drag.preview.item.type} /></div>}
  </div>;
}
