import type { CommandType } from '../../game/types';

export const commandLabels: Record<CommandType, string> = {
  forward: 'Maju',
  'turn-left': 'Kiri',
  'turn-right': 'Kanan',
  repeat: 'Ulangi',
};

export function CommandIcon({ type = 'forward' }: { type?: CommandType }) {
  return <svg viewBox="0 0 48 48" aria-hidden="true" focusable="false" className="command-icon">
    {type === 'forward' ? <path d="M24 5 7 23h10v20h14V23h10Z" fill="currentColor" />
      : <g transform={type === 'turn-right' ? 'translate(48 0) scale(-1 1)' : undefined}>
        <path d={type === 'repeat'
          ? 'M14 12a16 16 0 1 1-5 19l8-3a8 8 0 1 0 4-10v9L4 16 21 5v9Z'
          : 'M20 5 3 21l17 16V26h7a7 7 0 0 1 7 7v10h10V33a17 17 0 0 0-17-17h-7Z'} fill="currentColor" />
      </g>}
  </svg>;
}
