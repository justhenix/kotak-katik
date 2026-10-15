import type { CommandType } from '../../game/types';

export const commandLabels: Record<CommandType, string> = {
  forward: 'Maju',
  'turn-left': 'Kiri',
  'turn-right': 'Kanan',
  repeat: 'Ulangi',
};

export function CommandIcon({ type = 'forward' }: { type?: CommandType }) {
  return <svg className="command-icon" viewBox="0 0 48 48" fill="none" aria-hidden="true" focusable="false">
    {type === 'forward' ? <path d="M24 7 9 23h10v18h10V23h10Z" fill="currentColor" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
      : type === 'repeat' ? <g stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"><path d="M35 14a15 15 0 0 0-25 9M13 34a15 15 0 0 0 25-9M35 5v11H24M13 43V32h11" /></g>
      : <g transform={type === 'turn-right' ? 'translate(48 0) scale(-1 1)' : undefined} stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"><path d="M37 39V28q0-10-10-10H10M20 7 9 18l11 11" /></g>}
  </svg>;
}

