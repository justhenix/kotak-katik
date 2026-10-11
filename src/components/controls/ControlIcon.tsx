export type ControlSymbol = 'play' | 'step' | 'stop' | 'retry' | 'delete' | 'before' | 'after' | 'plus' | 'check' | 'pause';

export function ControlIcon({ type }: { type: ControlSymbol }) {
  return <svg viewBox="0 0 32 32" className="control-icon" aria-hidden="true" focusable="false">
    {type === 'play' && <path d="M10 6a2 2 0 0 1 3.1-1.6l15 9.5a2 2 0 0 1 0 3.2l-15 9.5A2 2 0 0 1 10 25Z" fill="currentColor" />}
    {type === 'step' && <g fill="currentColor">
      <ellipse cx="9" cy="18" rx="3.8" ry="3" />
      <circle cx="5.5" cy="12.5" r="1.6" />
      <circle cx="8" cy="9.8" r="1.6" />
      <circle cx="11.5" cy="10.2" r="1.6" />
      <circle cx="13.5" cy="13.5" r="1.4" />
      <path d="M18 9a1.5 1.5 0 0 1 2.3-1.3l8 6a1.5 1.5 0 0 1 0 2.4l-8 6A1.5 1.5 0 0 1 18 21Z" />
      <rect x="27.5" y="8" width="2.5" height="15" rx="1.2" />
    </g>}
    {type === 'stop' && <rect x="7" y="7" width="18" height="18" rx="4" fill="currentColor" />}
    {type === 'pause' && <g fill="currentColor"><rect x="8" y="6" width="5" height="20" rx="2" /><rect x="19" y="6" width="5" height="20" rx="2" /></g>}
    {type === 'retry' && <g fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M25 13a9.5 9.5 0 1 0 1.5 8.5" /><path d="M26 5v8h-8" />
    </g>}
    {type === 'delete' && <g fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 9h20M12 9V5.5a1.5 1.5 0 0 1 1.5-1.5h5a1.5 1.5 0 0 1 1.5 1.5V9" />
      <path d="M8.5 9l1.2 16.5a2 2 0 0 0 2 1.5h8.6a2 2 0 0 0 2-1.5L23.5 9" />
      <path d="M13 14v8M19 14v8" />
    </g>}
    {(type === 'before' || type === 'after') && <path transform={type === 'after' ? 'translate(32 0) scale(-1 1)' : undefined} d="M14 5 3 16l11 11v-7h15v-8H14Z" fill="currentColor" />}
    {type === 'plus' && <path d="M16 6v20M6 16h20" stroke="currentColor" strokeWidth="3.6" strokeLinecap="round" />}
    {type === 'check' && <path d="m6 16.5 7 7L26 8.5" fill="none" stroke="currentColor" strokeWidth="3.8" strokeLinecap="round" strokeLinejoin="round" />}
  </svg>;
}
