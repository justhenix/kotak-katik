export type Position = Readonly<{ x: number; z: number }>;
export type Orientation = 'north' | 'east' | 'south' | 'west';
export type CommandType = 'forward';
export type Command = Readonly<{ type: CommandType }>;
export type Program = readonly Command[];
export type AvatarState = Readonly<{ position: Position; orientation: Orientation }>;

export type LevelDefinition = Readonly<{
  id: string;
  title: string;
  learning: {
    concept: 'movement';
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
}>;

export type Collision = Readonly<{
  position: Position;
  reason: 'invalid-tile';
}>;
export type GameEvent =
  | Readonly<{ type: 'moved'; from: Position; to: Position }>
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
  status: ExecutionStatus;
  objectiveSatisfied: boolean;
  completion: boolean;
  collision: Collision | null;
  events: readonly GameEvent[];
}>;
