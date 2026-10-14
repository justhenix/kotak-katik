import type { RepeatCount } from '../../game/types';

export function RepeatCounter({ index, count, disabled, onChange }: {
  index: number; count: RepeatCount; disabled: boolean; onChange: (count: RepeatCount) => void;
}) {
  const change = (next: number) => {
    if (!disabled && (next === 2 || next === 3 || next === 4)) onChange(next);
  };
  return <div className="repeat-counter" data-count-index={index} role="group" aria-label={`Banyaknya Ulangi ${index + 1}`}
    onKeyDown={(event) => {
      const next = event.key === 'ArrowLeft' || event.key === 'ArrowDown' ? count - 1
        : event.key === 'ArrowRight' || event.key === 'ArrowUp' ? count + 1
        : event.key === 'Home' ? 2 : event.key === 'End' ? 4 : null;
      if (next === null || disabled) return;
      event.preventDefault();
      change(next);
    }}>
    <button type="button" disabled={disabled} aria-disabled={disabled || count === 2} aria-label={`Kurangi banyaknya Ulangi ${index + 1}`} onClick={() => change(count - 1)}>−</button>
    <output aria-live="polite" aria-label={`${count} kali`}>{count}×</output>
    <button type="button" disabled={disabled} aria-disabled={disabled || count === 4} aria-label={`Tambah banyaknya Ulangi ${index + 1}`} onClick={() => change(count + 1)}>+</button>
  </div>;
}
