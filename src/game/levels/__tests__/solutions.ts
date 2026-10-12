import type { PrimitiveCommand, Program } from '../../types';

const F: PrimitiveCommand = { type: 'forward' };
const L: PrimitiveCommand = { type: 'turn-left' };
const R: PrimitiveCommand = { type: 'turn-right' };

// Verification witnesses stay out of the app's imports and child-facing hint metadata.
export const curriculumSolutions: Readonly<Record<string, Program>> = {
  'm2-move-watch': [F],
  'm2-move-try': [F, F],
  'm2-sequence-watch': [F, F],
  'm2-sequence-build': [F, F, F],
  'm2-left-watch': [F, L, F],
  'm2-right-together': [F, R, F],
  'm2-turn-alone': [F, L, F],
  'm2-path-together': [F, L, F, R, F],
  'm2-path-alone': [F, R, F, L, F],
  'm2-repeat-watch': [{ type: 'repeat', count: 2, commands: [F] }],
  'm2-repeat-together': [{ type: 'repeat', count: 3, commands: [F] }],
  'm2-repeat-alone': [{ type: 'repeat', count: 3, commands: [F, R] }],
  'm2-debug-watch': [F, L, F],
  'm2-debug-together': [F, F, R, F],
  'm2-debug-alone': [{ type: 'repeat', count: 3, commands: [F] }],
  'm2-mixed-journey': [{ type: 'repeat', count: 2, commands: [F] }, R, { type: 'repeat', count: 2, commands: [F] }],
};
