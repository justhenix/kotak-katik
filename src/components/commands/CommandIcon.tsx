import type { CommandType } from '../../game/types';

export const commandLabels: Record<CommandType, string> = {
  forward: 'Maju',
  'turn-left': 'Kiri',
  'turn-right': 'Kanan',
  repeat: 'Ulangi',
};

export function CommandIcon({ type = 'forward' }: { type?: CommandType }) {
  return <svg viewBox="0 0 48 48" aria-hidden="true" focusable="false" className="command-icon">
    {type === 'forward' ? <path d="M24 4a2 2 0 0 0-1.6.8L8.4 19.8a2 2 0 0 0 1.6 3.2H17v18a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V23h7a2 2 0 0 0 1.6-3.2L25.6 4.8A2 2 0 0 0 24 4Z" fill="currentColor" />
      : <g transform={type === 'turn-right' ? 'translate(48 0) scale(-1 1)' : undefined}>
        {type === 'repeat' ? <path d="M24 6a17 17 0 1 1-12 5l-4-4a1.5 1.5 0 0 0-2.6 1v15a1.5 1.5 0 0 0 1.5 1.5H22a1.5 1.5 0 0 0 1.1-2.6l-5.6-5.6A10.5 10.5 0 1 0 24 12.5a10.4 10.4 0 0 0-7.4 3.1 2 2 0 0 1-2.8-2.8A16.8 16.8 0 0 1 24 6Z" fill="currentColor" />
          : <path d="M7 18a2 2 0 0 1 0-2.8L19.5 5.5a2 2 0 0 1 3.5 1.4V13h6a10 10 0 0 1 10 10v16a2 2 0 0 1-2 2h-7a2 2 0 0 1-2-2V26a3 3 0 0 0-3-3h-2v6.1a2 2 0 0 1-3.5 1.4Z" fill="currentColor" />}
      </g>}
  </svg>;
}
