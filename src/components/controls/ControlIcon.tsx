import {
  Play,
  StepForward,
  Square,
  Pause,
  RotateCcw,
  Trash2,
  ArrowLeft,
  ArrowRight,
  Plus,
  Check,
} from 'lucide-react';

export type ControlSymbol = 'play' | 'step' | 'stop' | 'retry' | 'delete' | 'before' | 'after' | 'plus' | 'check' | 'pause';

export function ControlIcon({ type }: { type: ControlSymbol }) {
  switch (type) {
    case 'play':
      return <Play className="control-icon" fill="currentColor" strokeWidth={0} aria-hidden="true" focusable="false" />;
    case 'step':
      return <StepForward className="control-icon" strokeWidth={2.8} aria-hidden="true" focusable="false" />;
    case 'stop':
      return <Square className="control-icon" fill="currentColor" strokeWidth={0} aria-hidden="true" focusable="false" />;
    case 'pause':
      return <Pause className="control-icon" fill="currentColor" strokeWidth={0} aria-hidden="true" focusable="false" />;
    case 'retry':
      return <RotateCcw className="control-icon" strokeWidth={2.8} aria-hidden="true" focusable="false" />;
    case 'delete':
      return <Trash2 className="control-icon" strokeWidth={2.5} aria-hidden="true" focusable="false" />;
    case 'before':
      return <ArrowLeft className="control-icon" strokeWidth={2.8} aria-hidden="true" focusable="false" />;
    case 'after':
      return <ArrowRight className="control-icon" strokeWidth={2.8} aria-hidden="true" focusable="false" />;
    case 'plus':
      return <Plus className="control-icon" strokeWidth={3} aria-hidden="true" focusable="false" />;
    case 'check':
      return <Check className="control-icon" strokeWidth={3.2} aria-hidden="true" focusable="false" />;
    default:
      return null;
  }
}

