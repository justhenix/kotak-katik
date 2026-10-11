import { validateLevel } from '../engine/simulation';
import { kernelLevel } from './kernel';
import { curriculumLevels, findCurriculumLevel } from './curriculum';
import { validateCurriculum } from './validate-curriculum';
import type { LevelDefinition } from '../types';

// Explicit engineering fixtures; curriculum and progression are deferred.
export const turningLevel: LevelDefinition = {
  ...kernelLevel, id: 'mechanics-turning', title: 'Ambil semua ikan',
  learning: { ...kernelLevel.learning, concept: 'turning', learningGoal: 'Mengamati belokan relatif kucing.' },
  tiles: [[0, 0], [1, 0], [1, -1], [2, -1]].map(([x, z]) => ({ position: { x, z }, kind: 'floor' })),
  collectibles: [{ id: 'fish-corner', position: { x: 1, z: -1 } }],
  allowedCommands: ['forward', 'turn-left', 'turn-right'],
};

export const loopLevel: LevelDefinition = {
  ...kernelLevel, id: 'mechanics-loops', title: 'Ambil semua ikan',
  learning: { ...kernelLevel.learning, concept: 'loop', learningGoal: 'Menelusuri perintah dan putaran Ulangi.' },
  tiles: [[0, 0], [1, 0], [1, 1], [0, 1]].map(([x, z]) => ({ position: { x, z }, kind: 'floor' })),
  collectibles: [[1, 0], [1, 1], [0, 1]].map(([x, z], index) => ({ id: `fish-${index}`, position: { x, z } })),
  allowedCommands: ['forward', 'turn-left', 'turn-right', 'repeat'],
  maxProgramSlots: 4, maxLoopBodySlots: 3,
};

validateLevel(turningLevel);
validateLevel(loopLevel);
validateCurriculum(curriculumLevels);

export function selectFixture(search: string): LevelDefinition {
  const params = new URLSearchParams(search);
  const preview = findCurriculumLevel(params.get('level') ?? '');
  if (preview) return preview;
  const fixture = params.get('fixture');
  return fixture === 'turning' ? turningLevel : fixture === 'loops' ? loopLevel : kernelLevel;
}
