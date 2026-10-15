import { useEffect, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import type { CommandType } from '../../game/types';

export type DragCommand = { type: CommandType; index?: number; loopIndex?: number };
export type DropSlot = { index: number; loopIndex?: number };
type Gesture = { item: DragCommand; x: number; y: number; pointer: number; active: boolean };

export function useCommandDrag(resolve: (x: number, y: number, item: DragCommand) => DropSlot | null,
  drop: (item: DragCommand, target: DropSlot) => void) {
  const gesture = useRef<Gesture | null>(null);
  const clickedAfterDrag = useRef(false);
  const [preview, setPreview] = useState<{ item: DragCommand; x: number; y: number; slot: DropSlot | null } | null>(null);
  useEffect(() => {
    const cancel = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || !gesture.current?.active) return;
      clickedAfterDrag.current = true;
      gesture.current = null;
      setPreview(null);
    };
    document.addEventListener('keydown', cancel);
    return () => document.removeEventListener('keydown', cancel);
  }, []);
  const bind = (item: DragCommand, disabled: boolean) => ({
    'data-draggable': !disabled,
    onPointerDown: (event: ReactPointerEvent<HTMLButtonElement>) => {
      if (disabled || !event.isPrimary || event.button !== 0) return;
      clickedAfterDrag.current = false;
      gesture.current = { item, x: event.clientX, y: event.clientY, pointer: event.pointerId, active: false };
      event.currentTarget.setPointerCapture(event.pointerId);
    },
    onPointerMove: (event: ReactPointerEvent<HTMLButtonElement>) => {
      const current = gesture.current;
      if (!current || current.pointer !== event.pointerId) return;
      if (!current.active && Math.hypot(event.clientX - current.x, event.clientY - current.y) < 9) return;
      current.active = true;
      event.preventDefault();
      setPreview({ item: current.item, x: event.clientX, y: event.clientY, slot: resolve(event.clientX, event.clientY, current.item) });
    },
    onPointerUp: (event: ReactPointerEvent<HTMLButtonElement>) => {
      const current = gesture.current;
      if (!current || current.pointer !== event.pointerId) return;
      if (current.active) {
        clickedAfterDrag.current = true;
        const target = resolve(event.clientX, event.clientY, current.item);
        if (target) drop(current.item, target);
      }
      gesture.current = null;
      setPreview(null);
    },
    onPointerCancel: () => { gesture.current = null; setPreview(null); },
    onLostPointerCapture: () => { gesture.current = null; setPreview(null); },
  });
  return { bind, preview, consumeClick: () => {
    const consumed = clickedAfterDrag.current;
    clickedAfterDrag.current = false;
    return consumed;
  } };
}
