import { ArrowUp, CornerUpLeft, CornerUpRight, Repeat } from 'lucide-react';
import type { CommandType } from '../../game/types';

export const commandLabels: Record<CommandType, string> = {
  forward: 'Maju',
  'turn-left': 'Kiri',
  'turn-right': 'Kanan',
  repeat: 'Ulangi',
};

export function CommandIcon({ type = 'forward' }: { type?: CommandType }) {
  switch (type) {
    case 'forward':
      return <ArrowUp className="command-icon" strokeWidth={3.5} aria-hidden="true" focusable="false" />;
    case 'turn-left':
      return <CornerUpLeft className="command-icon" strokeWidth={3.5} aria-hidden="true" focusable="false" />;
    case 'turn-right':
      return <CornerUpRight className="command-icon" strokeWidth={3.5} aria-hidden="true" focusable="false" />;
    case 'repeat':
      return <Repeat className="command-icon" strokeWidth={3.2} aria-hidden="true" focusable="false" />;
    default:
      return null;
  }
}

