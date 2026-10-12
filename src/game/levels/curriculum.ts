import type { CommandType, LearningConcept, LearningMetadata, LevelDefinition, Orientation, PrimitiveCommand, Program, RepeatCount } from '../types';

export const CURRICULUM_CONCEPTS = [
  'movement', 'sequencing', 'turning', 'combined-paths', 'loop', 'debugging', 'mixed-application',
] as const satisfies readonly LearningConcept[];

export type CurriculumLevel = LevelDefinition & Readonly<{
  learning: LearningMetadata & Readonly<{
    concept: typeof CURRICULUM_CONCEPTS[number];
    phase: 'demonstration' | 'guided' | 'independent';
    instruction: string;
    visualHints: NonNullable<LearningMetadata['visualHints']>;
  }>;
  curriculum: Readonly<{ order: number; prerequisiteIds: readonly string[] }>;
}>;

type Coordinate = readonly [number, number];
const floor = (coordinates: readonly Coordinate[]): LevelDefinition['tiles'] =>
  coordinates.map(([x, z]) => ({ position: { x, z }, kind: 'floor' }));
const fish = (coordinates: readonly Coordinate[]): LevelDefinition['collectibles'] =>
  coordinates.map(([x, z], index) => ({ id: `fish-${index + 1}`, position: { x, z } }));
const facing = (x: number, z: number, orientation: Orientation) => ({ position: { x, z }, orientation });
const F: PrimitiveCommand = { type: 'forward' };
const L: PrimitiveCommand = { type: 'turn-left' };
const R: PrimitiveCommand = { type: 'turn-right' };
const repeat = (count: RepeatCount, ...commands: PrimitiveCommand[]): Program => [{ type: 'repeat', count, commands }];
const MOVE: readonly CommandType[] = ['forward'];
const LEFT: readonly CommandType[] = ['forward', 'turn-left'];
const TURN: readonly CommandType[] = ['forward', 'turn-left', 'turn-right'];
const ALL: readonly CommandType[] = [...TURN, 'repeat'];

type Stage = Omit<CurriculumLevel, 'objective' | 'curriculum'>;

// Explicit coordinates keep the authored boards independent of a solution or renderer.
const stages: readonly Stage[] = [
  {
    id: 'm2-move-watch', title: 'Satu langkah',
    learning: {
      concept: 'movement', phase: 'demonstration', introducesNewConcept: true,
      learningGoal: 'Maju memindahkan kucing satu petak sesuai arah hadapnya.',
      instruction: 'Tekan satu langkah. Lihat kucing maju.',
      demonstrationFromEmpty: true,
      demonstration: [{ type: 'add', command: 'forward', index: 0 }, { type: 'run' }],
      visualHints: [{ id: 'one-tile', text: 'Satu Maju, satu petak.', reveal: { when: 'on-entry' },
        cue: { type: 'board-region', positions: [{ x: 0, z: 0 }, { x: 1, z: 0 }] } }],
    },
    tiles: floor([[0, 0], [1, 0]]), avatar: facing(0, 0, 'east'), collectibles: fish([[1, 0]]),
    allowedCommands: MOVE, initialProgram: [F], maxProgramSlots: 2,
  },
  {
    id: 'm2-move-try', title: 'Maju ke ikan',
    learning: {
      concept: 'movement', phase: 'guided', introducesNewConcept: false,
      learningGoal: 'Memilih Maju untuk mencapai ikan di depan kucing.',
      instruction: 'Tambahkan Maju. Ambil ikan.',
      guidance: [
        { target: { type: 'palette', command: 'forward' }, complete: { type: 'command', path: [1], choices: ['forward'] } },
        { target: { type: 'run' }, complete: { type: 'attempt' } },
      ],
      visualHints: [{ id: 'add-forward', text: 'Taruh Maju di sini.', reveal: { when: 'on-entry' },
        cue: { type: 'program-slot', index: 1, choices: ['forward'] } }],
    },
    tiles: floor([[0, 0], [0, -1], [0, -2]]), avatar: facing(0, 0, 'north'), collectibles: fish([[0, -2]]),
    allowedCommands: MOVE, initialProgram: [F], maxProgramSlots: 3,
  },
  {
    id: 'm2-sequence-watch', title: 'Ikan satu, ikan dua',
    learning: {
      concept: 'sequencing', phase: 'demonstration', introducesNewConcept: true,
      learningGoal: 'Menelusuri perintah pertama lalu perintah berikutnya.',
      instruction: 'Tekan satu langkah dua kali. Lihat urutannya.',
      demonstrationFromEmpty: true,
      demonstration: [{ type: 'add', command: 'forward', index: 0 }, { type: 'add', command: 'forward', index: 1 }, { type: 'run' }],
      visualHints: [{ id: 'next-fish', text: 'Lalu ambil ikan berikutnya.', reveal: { when: 'after-action', path: [0] },
        cue: { type: 'command', path: [1] } }],
    },
    tiles: floor([[0, 0], [1, 0], [2, 0]]), avatar: facing(0, 0, 'east'), collectibles: fish([[1, 0], [2, 0]]),
    allowedCommands: MOVE, initialProgram: [F, F], maxProgramSlots: 3,
  },
  {
    id: 'm2-sequence-build', title: 'Susun langkahmu',
    learning: {
      concept: 'sequencing', phase: 'independent', introducesNewConcept: false,
      learningGoal: 'Menyusun dan menghitung tiga langkah menuju dua ikan.',
      instruction: 'Susun Maju. Ambil kedua ikan.', visualHints: [],
    },
    tiles: floor([[1, 0], [0, 0], [-1, 0], [-2, 0]]), avatar: facing(1, 0, 'west'), collectibles: fish([[0, 0], [-2, 0]]),
    allowedCommands: MOVE, initialProgram: [], maxProgramSlots: 4,
  },
  {
    id: 'm2-left-watch', title: 'Kiri kucing',
    learning: {
      concept: 'turning', phase: 'demonstration', introducesNewConcept: true,
      learningGoal: 'Kiri mengubah arah hadap tanpa berpindah petak.',
      instruction: 'Lihat kucing berbelok, lalu maju.',
      demonstrationFromEmpty: true,
      demonstration: [{ type: 'add', command: 'forward', index: 0 }, { type: 'add', command: 'turn-left', index: 1 }, { type: 'add', command: 'forward', index: 2 }, { type: 'run' }],
      visualHints: [{ id: 'cat-left', text: 'Kiri mengikuti arah kucing.', reveal: { when: 'after-action', path: [0] },
        cue: { type: 'relative-turn', position: { x: 1, z: 0 }, orientation: 'east', direction: 'left' } }],
    },
    tiles: floor([[0, 0], [1, 0], [1, -1]]), avatar: facing(0, 0, 'east'), collectibles: fish([[1, -1]]),
    allowedCommands: LEFT, initialProgram: [F, L, F], maxProgramSlots: 4,
  },
  {
    id: 'm2-right-together', title: 'Kanan kucing',
    learning: {
      concept: 'turning', phase: 'guided', introducesNewConcept: false,
      learningGoal: 'Memilih Kanan dari arah hadap yang berbeda.',
      instruction: 'Lanjutkan: belok ke ikan, lalu maju.',
      guidance: [
        { target: { type: 'slot', index: 1 }, complete: { type: 'command', path: [1], choices: ['turn-left', 'turn-right'] } },
        { target: { type: 'palette', command: 'forward' }, complete: { type: 'command', path: [2], choices: ['forward'] } },
        { target: { type: 'run' }, complete: { type: 'attempt' } },
      ],
      visualHints: [
        { id: 'cat-right', text: 'Lihat sisi kanan kucing.', reveal: { when: 'after-action', path: [0] },
          cue: { type: 'relative-turn', position: { x: 0, z: 0 }, orientation: 'north', direction: 'right' } },
        { id: 'continue-turn', text: 'Tambahkan belokan di sini.', reveal: { when: 'on-request' },
          cue: { type: 'program-slot', index: 1, choices: ['turn-left', 'turn-right'] } },
      ],
    },
    tiles: floor([[0, 1], [0, 0], [1, 0]]), avatar: facing(0, 1, 'north'), collectibles: fish([[1, 0]]),
    allowedCommands: TURN, initialProgram: [F], maxProgramSlots: 4,
  },
  {
    id: 'm2-turn-alone', title: 'Hadap ke ikan',
    learning: {
      concept: 'turning', phase: 'independent', introducesNewConcept: false,
      learningGoal: 'Memilih belokan relatif saat kucing menghadap ke selatan.',
      instruction: 'Belok dan ambil ikan.', visualHints: [],
    },
    tiles: floor([[0, 0], [0, 1], [1, 1]]), avatar: facing(0, 0, 'south'), collectibles: fish([[1, 1]]),
    allowedCommands: TURN, initialProgram: [], maxProgramSlots: 4,
  },
  {
    id: 'm2-path-together', title: 'Dua belokan',
    learning: {
      concept: 'combined-paths', phase: 'guided', introducesNewConcept: true,
      learningGoal: 'Menggabungkan Maju, Kiri, dan Kanan untuk melewati dua sudut.',
      instruction: 'Lanjutkan jalan ke kedua ikan.',
      guidance: [
        { target: { type: 'slot', index: 3 }, complete: { type: 'command', path: [3], choices: ['turn-left', 'turn-right'] } },
        { target: { type: 'palette', command: 'forward' }, complete: { type: 'command', path: [4], choices: ['forward'] } },
        { target: { type: 'run' }, complete: { type: 'attempt' } },
      ],
      visualHints: [{ id: 'second-corner', text: 'Lihat jalan setelah ikan pertama.', reveal: { when: 'on-request' },
        cue: { type: 'board-region', positions: [{ x: 1, z: -1 }, { x: 2, z: -1 }] } }],
    },
    tiles: floor([[0, 0], [1, 0], [1, -1], [2, -1]]), avatar: facing(0, 0, 'east'), collectibles: fish([[1, -1], [2, -1]]),
    allowedCommands: TURN, initialProgram: [F, L, F], maxProgramSlots: 6,
  },
  {
    id: 'm2-path-alone', title: 'Jalan berbalik',
    learning: {
      concept: 'combined-paths', phase: 'independent', introducesNewConcept: false,
      learningGoal: 'Merencanakan dua belokan berbeda dengan arah awal ke barat.',
      instruction: 'Rencanakan jalan. Ambil kedua ikan.', visualHints: [],
    },
    tiles: floor([[1, 1], [0, 1], [0, 0], [-1, 0]]), avatar: facing(1, 1, 'west'), collectibles: fish([[0, 1], [-1, 0]]),
    allowedCommands: TURN, initialProgram: [], maxProgramSlots: 6,
  },
  {
    id: 'm2-repeat-watch', title: 'Maju berulang',
    learning: {
      concept: 'loop', phase: 'demonstration', introducesNewConcept: true,
      learningGoal: 'Dua Maju yang sudah dikenal dapat dikelompokkan dalam Ulangi.',
      instruction: 'Lihat Maju berjalan dua kali.',
      demonstrationFromEmpty: true,
      demonstration: [{ type: 'add', command: 'repeat', index: 0 }, { type: 'add', command: 'forward', index: 0, loopIndex: 0 }, { type: 'run' }],
      visualHints: [{ id: 'repeat-body', text: 'Maju yang sama berjalan lagi.', reveal: { when: 'after-action', path: [0, 0] },
        cue: { type: 'command', path: [0, 0] } }],
    },
    tiles: floor([[0, 0], [1, 0], [2, 0]]), avatar: facing(0, 0, 'east'), collectibles: fish([[1, 0], [2, 0]]),
    allowedCommands: ALL, initialProgram: repeat(2, F), maxProgramSlots: 1, maxLoopBodySlots: 1,
  },
  {
    id: 'm2-repeat-together', title: 'Berapa kali maju?',
    learning: {
      concept: 'loop', phase: 'guided', introducesNewConcept: false,
      learningGoal: 'Menyesuaikan banyak pengulangan dengan tiga petak di depan.',
      instruction: 'Ubah banyaknya Ulangi. Ambil ikan.',
      guidance: [
        { target: { type: 'command', path: [0] }, complete: { type: 'count', index: 0, differentFrom: 2 } },
        { target: { type: 'run' }, complete: { type: 'attempt' } },
      ],
      visualHints: [{ id: 'count-tiles', text: 'Hitung petak menuju ikan.', reveal: { when: 'on-request' },
        cue: { type: 'repeat-count', commandIndex: 0, choices: [2, 3, 4] } }],
    },
    tiles: floor([[0, 0], [0, -1], [0, -2], [0, -3]]), avatar: facing(0, 0, 'north'), collectibles: fish([[0, -3]]),
    allowedCommands: ALL, initialProgram: repeat(2, F), maxProgramSlots: 1, maxLoopBodySlots: 1,
  },
  {
    id: 'm2-repeat-alone', title: 'Pola mengelilingi',
    learning: {
      concept: 'loop', phase: 'independent', introducesNewConcept: false,
      learningGoal: 'Mengenali pola Maju dan Kanan yang berulang di tiga sisi persegi.',
      instruction: 'Ulangi pola. Ambil ketiga ikan.', visualHints: [],
    },
    tiles: floor([[0, 0], [1, 0], [1, 1], [0, 1]]), avatar: facing(0, 0, 'east'), collectibles: fish([[1, 0], [1, 1], [0, 1]]),
    allowedCommands: ALL, initialProgram: [], maxProgramSlots: 1, maxLoopBodySlots: 2,
  },
  {
    id: 'm2-debug-watch', title: 'Lihat, ubah, coba',
    learning: {
      concept: 'debugging', phase: 'demonstration', introducesNewConcept: true,
      learningGoal: 'Menelusuri salah belok, mengubah satu perintah, dan mencoba lagi.',
      instruction: 'Jalankan. Lihat belokan. Ubah dan coba lagi.',
      demonstration: [
        { type: 'run' }, { type: 'restart' }, { type: 'step' }, { type: 'step' },
        { type: 'select', path: [1] }, { type: 'replace', path: [1], command: 'turn-left' }, { type: 'run' },
      ],
      visualHints: [
        { id: 'observe-route', text: 'Lihat kucing dan jalan ke ikan.', reveal: { when: 'after-attempt' },
          cue: { type: 'board-region', positions: [{ x: 1, z: 0 }, { x: 1, z: -1 }] } },
        { id: 'inspect-turn', text: 'Coba satu langkah. Lihat belokan ini.', reveal: { when: 'after-attempt' },
          cue: { type: 'command', path: [1] } },
      ],
    },
    tiles: floor([[0, 0], [1, 0], [1, -1]]), avatar: facing(0, 0, 'east'), collectibles: fish([[1, -1]]),
    allowedCommands: ALL, initialProgram: [F, R, F], maxProgramSlots: 4, maxLoopBodySlots: 2,
  },
  {
    id: 'm2-debug-together', title: 'Ikan masih menunggu',
    learning: {
      concept: 'debugging', phase: 'guided', introducesNewConcept: false,
      learningGoal: 'Menemukan perintah yang hilang saat kucing berhenti sebelum ikan.',
      instruction: 'Jalankan. Lihat ikan yang belum diambil.',
      guidance: [
        { target: { type: 'run' }, complete: { type: 'attempt' } },
        { target: { type: 'slot', index: 3 }, complete: { type: 'command', path: [3], choices: ['forward', 'turn-left', 'turn-right'] } },
        { target: { type: 'run' }, complete: { type: 'attempt' } },
      ],
      visualHints: [
        { id: 'uncollected-fish', text: 'Masih ada satu petak ke ikan.', reveal: { when: 'after-attempt' },
          cue: { type: 'board-region', positions: [{ x: 2, z: 0 }, { x: 2, z: 1 }] } },
        { id: 'append-step', text: 'Lanjutkan urutan di sini.', reveal: { when: 'after-attempt' },
          cue: { type: 'program-slot', index: 3, choices: ['forward', 'turn-left', 'turn-right'] } },
      ],
    },
    tiles: floor([[0, 0], [1, 0], [2, 0], [2, 1]]), avatar: facing(0, 0, 'east'), collectibles: fish([[1, 0], [2, 1]]),
    allowedCommands: ALL, initialProgram: [F, F, R], maxProgramSlots: 5, maxLoopBodySlots: 2,
  },
  {
    id: 'm2-debug-alone', title: 'Periksa Ulangi',
    learning: {
      concept: 'debugging', phase: 'independent', introducesNewConcept: false,
      learningGoal: 'Menyusun pengulangan dan memeriksa sendiri jika hasilnya melewati ikan.',
      instruction: 'Periksa Ulangi. Ubah dan coba lagi.', visualHints: [],
    },
    tiles: floor([[0, 0], [-1, 0], [-2, 0], [-3, 0]]), avatar: facing(0, 0, 'west'), collectibles: fish([[-1, 0], [-3, 0]]),
    allowedCommands: ALL, initialProgram: [], maxProgramSlots: 1, maxLoopBodySlots: 1,
  },
  {
    id: 'm2-mixed-journey', title: 'Pola dan belokan',
    learning: {
      concept: 'mixed-application', phase: 'independent', introducesNewConcept: false,
      learningGoal: 'Menggabungkan pengulangan langkah dengan belokan relatif di luar Ulangi.',
      instruction: 'Pakai Ulangi dan belokan. Ambil kedua ikan.', visualHints: [],
    },
    tiles: floor([[0, 0], [0, -1], [0, -2], [1, -2], [2, -2]]), avatar: facing(0, 0, 'north'), collectibles: fish([[0, -2], [2, -2]]),
    allowedCommands: ALL, initialProgram: [], maxProgramSlots: 3, maxLoopBodySlots: 1,
  },
];

// Stable IDs and prerequisites also drive the linear lesson flow.
export const curriculumLevels: readonly CurriculumLevel[] = stages.map((stage, index) => ({
  ...stage, objective: { type: 'collect-all' },
  curriculum: { order: index + 1, prerequisiteIds: index === 0 ? [] : [stages[index - 1].id] },
}));

export function findCurriculumLevel(id: string): CurriculumLevel | undefined {
  return curriculumLevels.find((level) => level.id === id);
}
