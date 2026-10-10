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

export type LevelDefinition = Readonly<{
  id: string;
  title: string;
  learning: {
    concept: 'movement' | 'turning' | 'loop';
    phase: 'practice';
    introducesNewConcept: false;
    learningGoal: string;
  };
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
