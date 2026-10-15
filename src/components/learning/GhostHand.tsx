import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { useGameStore } from '../../stores/game-store';
import { demoPlaying, tutorialSelector, tutorialTarget, useLessonStore } from '../../stores/lesson-store';
import { useReducedMotion } from '../../hooks/useReducedMotion';

type Bounds = { x: number; y: number; width: number; height: number };
type Anchor = { selector: string | null; box: Bounds | null; hand: Bounds | null; control: string | null; width: number; height: number };

export function GhostHand() {
  const game = useGameStore(state => state);
  const lesson = useLessonStore(state => state);
  const reduced = useReducedMotion();
  const target = tutorialTarget(game.level, game.program, game.simulation, lesson);
  const selector = tutorialSelector(target);
  const observing = demoPlaying(lesson.demoPhase);
  const guided = game.level.learning.phase === 'guided' && !game.simulation.completion;
  const active = observing || guided;
  const [anchor, setAnchor] = useState<Anchor | null>(null);
  const element = useRef<HTMLElement | null>(null);
  const maskId = `tutorial-${useId().replace(/[^a-zA-Z0-9-]/g, '')}`;

  useLayoutEffect(() => {
    if (!active) { setAnchor(null); return; }
    let frame = 0;
    const measure = () => {
      let resolved = selector;
      if (target?.type === 'slot' && document.querySelector('.dock-context .palette-commands')) resolved = '.palette-commands';
      let next = resolved ? document.querySelector<HTMLElement>(resolved) : null;
      if (resolved && (!next || !next.getBoundingClientRect().width)) {
        const returnTarget = document.querySelector('.scope-back') && (target?.type === 'count' || target?.type === 'command' && target.path.length === 1 || target?.type === 'slot' && target.loopIndex === undefined);
        if (returnTarget) resolved = '.scope-back';
        else if (target?.type === 'palette') {
          const owner = target.loopIndex;
          resolved = document.querySelector('[data-edit-action="replace"]') ? '[data-edit-action="replace"]'
            : owner !== undefined && document.querySelector(`.editor[data-scope="program"] [data-command-path="${owner}"]`) ? document.querySelector('[data-edit-body]') ? '[data-edit-body]' : `.editor [data-command-path="${owner}"]`
            : '.editor .insert-slot.chosen-target';
        } else if (target?.type === 'command' && target.path.length === 2) {
          resolved = document.querySelector('[data-edit-body]') ? '[data-edit-body]' : `.editor [data-command-path="${target.path[0]}"]`;
        } else if (target?.type === 'slot' && target.loopIndex !== undefined) {
          resolved = document.querySelector('[data-edit-body]') ? '[data-edit-body]' : `.editor [data-command-path="${target.loopIndex}"]`;
        } else if (target?.type === 'count') resolved = `.editor [data-command-path="${target.index}"]`;
        next = document.querySelector<HTMLElement>(resolved);
      }
      if (next !== element.current) {
        element.current?.classList.remove('instruction-focus', 'tutorial-nudge');
        resize.disconnect(); element.current = next;
        if (next) { next.classList.add('instruction-focus'); resize.observe(next); }
        for (const layout of document.querySelectorAll('.workbench, .feedback, .world-area')) resize.observe(layout);
      }
      let bounds = next?.getBoundingClientRect();
      if (resolved === '.palette-commands' && next) {
        const choices = [...next.querySelectorAll('button')].map(button => button.getBoundingClientRect());
        if (choices.length) {
          const x = Math.min(...choices.map(box => box.left)), y = Math.min(...choices.map(box => box.top));
          bounds = DOMRect.fromRect({ x, y, width: Math.max(...choices.map(box => box.right)) - x, height: Math.max(...choices.map(box => box.bottom)) - y });
        }
      }
      const rail = next?.closest('.program-sequence, .dock-context')?.getBoundingClientRect();
      const buttons = next ? [...next.querySelectorAll<HTMLButtonElement>('button:not(:disabled):not([aria-disabled="true"])')] : [];
      const button = buttons.find(button => {
        const box = button.getBoundingClientRect();
        return box.left >= (rail?.left ?? 0) && box.right <= (rail?.right ?? innerWidth);
      });
      const hand = button?.getBoundingClientRect() ?? bounds;
      const control = button?.dataset.type ? `.palette-command[data-type="${button.dataset.type}"]`
        : button && next?.dataset.countIndex ? `[data-count-index="${next.dataset.countIndex}"] button:nth-of-type(${[...next.querySelectorAll('button')].indexOf(button) + 1})` : resolved;
      const x = Math.max(0, bounds?.left ?? 0, rail?.left ?? 0);
      const right = Math.min(innerWidth, bounds?.right ?? 0, rail?.right ?? innerWidth);
      setAnchor({ selector: resolved, box: bounds?.height && right > x ? { x, y: bounds.y, width: right - x, height: bounds.height } : null,
        hand: hand ? { x: hand.x, y: hand.y, width: hand.width, height: hand.height } : null, control,
        width: innerWidth, height: innerHeight });
    };
    const schedule = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(measure); };
    const resize = new ResizeObserver(schedule);
    const mutation = new MutationObserver(schedule);
    mutation.observe(document.querySelector('.editor') ?? document.body, { childList: true, subtree: true });
    window.addEventListener('resize', schedule); window.addEventListener('scroll', schedule, true);
    measure();
    return () => {
      cancelAnimationFrame(frame); resize.disconnect(); mutation.disconnect();
      window.removeEventListener('resize', schedule); window.removeEventListener('scroll', schedule, true);
      element.current?.classList.remove('instruction-focus', 'tutorial-nudge'); element.current = null;
    };
  }, [selector, target?.type, active]);

  useEffect(() => {
    if (!active || !lesson.blockedInteraction) return;
    const node = element.current;
    node?.classList.add('tutorial-nudge');
    const timer = setTimeout(() => node?.classList.remove('tutorial-nudge'), 200);
    return () => { clearTimeout(timer); node?.classList.remove('tutorial-nudge'); };
  }, [active, lesson.blockedInteraction]);

  if (!active || !anchor) return null;
  const box = anchor.box;
  const hand = anchor.hand;
  const countTarget = anchor.selector?.startsWith('[data-count-index=');
  // Kenney's original 64px hand has its fingertip at (29, 4).
  const point = hand && box && {
    x: Math.min(anchor.width - 54, Math.max(0, hand.x + hand.width * (countTarget ? .5 : .76) - 29 / 64 * 52)),
    y: Math.min(anchor.height - 53, hand.y + hand.height * .55 - 4 / 64 * 52),
  };
  return <>
    <svg className="tutorial-spotlight" aria-hidden="true" data-phase={observing ? 'watch' : 'guided'} data-target={anchor.selector ?? '.world-area'} viewBox={`0 0 ${anchor.width} ${anchor.height}`}>
      <defs><mask id={maskId}>
        <rect width="100%" height="100%" fill="white" />
        {box && <rect x={box.x - 6} y={box.y - 6} width={box.width + 12} height={box.height + 12} rx="16" fill="black" />}
      </mask></defs>
      <rect width="100%" height="100%" fill="#123e45" opacity={observing ? .14 : .07} mask={`url(#${maskId})`} />
      {box && <rect className="spotlight-ring" x={box.x - 6} y={box.y - 6} width={box.width + 12} height={box.height + 12} rx="16" />}
    </svg>
    {point && selector && <div className={`ghost-hand ${lesson.demoPhase === 'action' ? 'ghost-tap' : ''}`} aria-hidden="true" data-target={anchor.selector} data-control={anchor.control} data-motion={reduced ? 'static' : 'animated'}
      style={{ transform: `translate3d(${point.x}px, ${point.y}px, 0)` }}>
      <img src="/assets/tutorial/hand-point.png" width="64" height="64" alt="" draggable={false} />
    </div>}
    <p className="sr-only" role="status" aria-live="polite">{observing ? 'Lihat contoh.' : 'Ikuti petunjuk.'}</p>
    {lesson.blockedInteraction > 0 && <p className="sr-only" role="status" key={lesson.blockedInteraction} data-nudge={lesson.blockedInteraction}>Coba yang ditunjuk.</p>}
  </>;
}
