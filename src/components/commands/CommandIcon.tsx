import type { CommandType } from '../../game/types';

export const commandLabels: Record<CommandType, string> = {
  forward: 'Maju',
};

export function CommandIcon() {
  return <svg viewBox="0 0 48 48" aria-hidden="true" focusable="false" className="command-icon">
    <path d="M24 5 7 23h10v20h14V23h10Z" fill="currentColor" />
  </svg>;
}
