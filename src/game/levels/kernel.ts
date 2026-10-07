import { validateLevel } from '../engine/simulation';
import type { LevelDefinition } from '../types';

// A kernel fixture, not the first curriculum lesson. Onboarding belongs to a later milestone.
export const kernelLevel: LevelDefinition = {
  id: 'kernel-path', title: 'Ambil semua ikan',
  learning: {
    concept: 'movement', phase: 'practice', introducesNewConcept: false,
    learningGoal: 'Mengamati hubungan perintah maju dengan satu langkah kucing.',
  },
  tiles: [
    { position: { x: 0, z: 0 }, kind: 'floor' },
    { position: { x: 1, z: 0 }, kind: 'floor' },
    { position: { x: 2, z: 0 }, kind: 'floor' },
  ],
  avatar: { position: { x: 0, z: 0 }, orientation: 'east' },
  collectibles: [
    { id: 'fish-end', position: { x: 2, z: 0 } },
  ],
  objective: { type: 'collect-all' },
  allowedCommands: ['forward'],
  initialProgram: [],
};

validateLevel(kernelLevel);
