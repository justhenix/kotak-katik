import { useLayoutEffect, useState } from 'react';
import { useGameStore } from '../../stores/game-store';
import { tutorialSelector, tutorialTarget, useLessonStore } from '../../stores/lesson-store';
import { useReducedMotion } from '../../hooks/useReducedMotion';

export function GhostHand() {
  const game = useGameStore((state) => state);
  const lesson = useLessonStore((state) => state);
  const reduced = useReducedMotion();
  const target = tutorialTarget(game.level, game.program, game.simulation, lesson);
  const selector = tutorialSelector(target);
  const [point, setPoint] = useState<{ x: number; y: number } | null>(null);
  const [actualSelector, setActualSelector] = useState<string | null>(null);
  useLayoutEffect(() => {
    if (!selector) { setPoint(null); return; }
    let anchor: HTMLElement | null = null;
    let frame = 0;
    const measure = () => {
      let resolved = selector;
      if (target?.type === 'slot' && document.querySelector('.dock-context .palette-commands')) resolved = '.palette-commands';
      let next = document.querySelector<HTMLElement>(resolved);
      if (!next || !next.getBoundingClientRect().width) {
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
      setActualSelector(resolved);
      if (next !== anchor) {
        anchor?.classList.remove('instruction-focus');
        resize.disconnect(); anchor = next;
        if (anchor) { anchor.classList.add('instruction-focus'); resize.observe(anchor); }
        for (const layout of document.querySelectorAll('.workbench, .feedback')) resize.observe(layout);
      }
      const bounds = anchor?.getBoundingClientRect();
      const countTarget = resolved.startsWith('[data-count-index=');
      // Kenney's original 64px north-pointing hand has its fingertip at (29, 4).
      setPoint(bounds && bounds.width && bounds.height ? {
        x: Math.min(innerWidth - 54, Math.max(0, bounds.left + bounds.width * (resolved === '.palette-commands' || countTarget ? 0.5 : 0.76) - 29 / 64 * 52)),
        y: bounds.top + bounds.height * (countTarget ? 0.82 : 0.55) - 4 / 64 * 52,
      } : null);
    };
    const schedule = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(measure); };
    const resize = new ResizeObserver(schedule);
    const mutation = new MutationObserver(schedule);
    mutation.observe(document.querySelector('.editor') ?? document.body, { childList: true, subtree: true });
    window.addEventListener('resize', schedule);
    window.addEventListener('scroll', schedule, true);
    measure();
    return () => {
      cancelAnimationFrame(frame); resize.disconnect(); mutation.disconnect();
      window.removeEventListener('resize', schedule); window.removeEventListener('scroll', schedule, true);
      anchor?.classList.remove('instruction-focus');
    };
  }, [selector, target?.type]);
  if (!point || !selector) return null;
  return <div className={`ghost-hand ${lesson.demoPhase === 'action' ? 'ghost-tap' : ''} ${lesson.hintStrength > 0 ? 'ghost-suggest' : ''}`}
    aria-hidden="true" data-target={actualSelector} data-motion={reduced ? 'static' : 'animated'}
    style={{ transform: `translate3d(${point.x}px, ${point.y}px, 0)` }}>
    <img src="/assets/tutorial/hand-point.png" width="64" height="64" alt="" draggable={false} />
  </div>;
}
