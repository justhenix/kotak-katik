export type Position = Readonly<{ x: number; z: number }>;
export type Orientation = 'north' | 'east' | 'south' | 'west';
export type PrimitiveType = 'forward' | 'turn-left' | 'turn-right';
export type CommandType = PrimitiveType | 'repeat';
export type PrimitiveCommand = Readonly<{ type: PrimitiveType }>;
export type RepeatCount = 2 | 3 | 4;
export type Command = PrimitiveCommand | Readonly<{
  type: 'repeat'; count: RepeatCount; commands: readonly PrimitiveCommand[];
}>;
export type Program = readonly Command[];
export type CommandPath = readonly [number] | readonly [number, number];
export type ExecutionCursor = Readonly<{ commandIndex: number; bodyIndex: number; iteration: number }>;
export type AvatarState = Readonly<{ position: Position; orientation: Orientation }>;

export type LearningConcept = 'movement' | 'sequencing' | 'turning' | 'combined-paths' | 'loop' | 'debugging' | 'mixed-application';
export type LearningPhase = 'practice' | 'demonstration' | 'guided' | 'independent';
export type HintCue =
  | Readonly<{ type: 'board-region'; positions: readonly Position[] }>
  | Readonly<{ type: 'command'; path: CommandPath }>
  | Readonly<{ type: 'program-slot'; index: number; loopIndex?: number; choices: readonly CommandType[] }>
  | Readonly<{ type: 'relative-turn'; position: Position; orientation: Orientation; direction: 'left' | 'right' }>
  | Readonly<{ type: 'repeat-count'; commandIndex: number; choices: readonly RepeatCount[] }>;
export type VisualHint = Readonly<{
  id: string;
  text: string;
  reveal: Readonly<{ when: 'on-entry' | 'after-attempt' | 'on-request' }>
    | Readonly<{ when: 'after-action'; path: CommandPath }>;
  cue: HintCue;
}>;
export type DemonstrationAction =
  | Readonly<{ type: 'step' | 'run' | 'restart' }>
  | Readonly<{ type: 'replace'; path: CommandPath; command: PrimitiveType }>;
export type LearningMetadata = Readonly<{
  concept: LearningConcept;
  phase: LearningPhase;
  introducesNewConcept: boolean;
  learningGoal: string;
  instruction?: string;
  visualHints?: readonly VisualHint[];
  demonstration?: readonly DemonstrationAction[];
}>;

export type LevelDefinition = Readonly<{
  id: string;
  title: string;
  learning: LearningMetadata;
  tiles: readonly Readonly<{ position: Position; kind: 'floor' }>[];
  avatar: AvatarState;
  collectibles: readonly Readonly<{ id: string; position: Position }>[];
  objective: Readonly<{ type: 'collect-all' }>;
  allowedCommands: readonly CommandType[];
  initialProgram: Program;
  maxProgramSlots?: number;
  maxLoopBodySlots?: number;
}>;

export type Collision = Readonly<{
  position: Position;
  reason: 'invalid-tile';
}>;
export type GameEvent =
  | Readonly<{ type: 'moved'; from: Position; to: Position }>
  | Readonly<{ type: 'turned'; direction: 'left' | 'right'; from: Orientation; to: Orientation }>
  | Readonly<{ type: 'collected'; id: string }>
  | Readonly<{ type: 'collision'; collision: Collision }>
  | Readonly<{ type: 'completed' }>;

export type ExecutionStatus = 'idle' | 'running' | 'paused' | 'failed' | 'finished' | 'completed';
export type GameState = Readonly<{
  levelId: string;
  avatar: AvatarState;
  collectedIds: readonly string[];
  nextCommandIndex: number;
  activeCommandIndex: number | null;
  cursor: ExecutionCursor;
  activeCommandPath: CommandPath | null;
  loopIteration: number | null;
  status: ExecutionStatus;
  objectiveSatisfied: boolean;
  completion: boolean;
  collision: Collision | null;
  events: readonly GameEvent[];
}>;
