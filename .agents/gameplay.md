# Gameplay — Kotak-Katik

## 1. Gameplay Summary

Kotak-Katik is a visual programming puzzle game.

The player builds a sequence of commands that controls a cat moving through a
small isometric tile world.

The normal gameplay loop is:

```txt
inspect board
    ↓
build commands
    ↓
run / step
    ↓
watch the cat
    ↓
collect all required fish
    ↓
revise if necessary
    ↓
complete stage
```

The game should remain visually understandable with minimal text.

Mechanical inspiration may come from simple visual coding games such as
Google's Coding for Carrots Doodle:

- small readable boards,
- visible collectibles,
- obvious command tray,
- one clear execution action,
- complexity introduced through spatial patterns.

Kotak-Katik extends this foundation with:

- character-relative movement,
- left/right spatial scaffolding,
- loops,
- single-step debugging,
- deaf-first visual feedback,
- guided learning,
- debugging stages,
- expedition-map progression.

Do not copy another game's visual identity.

---

# 2. Core Objective

The default puzzle objective is:

> Collect every required fish on the board.

A stage does not normally require the cat to reach an arbitrary finish tile.

This keeps the goal spatially obvious:

```txt
🐱 → 🐟 → 🐟
```

The child can visually infer:

> "The cat needs to get the fish."

Special milestone stages may additionally require reaching a destination after
collecting the required objects.

Possible objective types:

```ts
type Objective =
  | { type: "collect-all" }
  | { type: "collect-all-and-reach-goal" };
```

`collect-all` should be the dominant objective in the MVP.

---

# 3. Board Model

Each puzzle takes place on a finite orthogonal tile grid.

The underlying simulation is 2D even though the world is rendered in 3D.

Conceptually:

```txt
z
↑
│  □ □ □
│  □ □ □
│  □ □ □
└────────→ x
```

The camera must not influence game coordinates.

A tile coordinate may be represented as:

```ts
type Position = {
  x: number;
  z: number;
};
```

Do not use rendered screen position as gameplay state.

---

# 4. Tile Types

The MVP should keep board vocabulary small.

Supported environmental states:

### Floor

Traversable tile.

### Blocked Tile

Visible object or barrier occupies the space.

The cat cannot move onto it.

Examples:

- rock,
- tree,
- crate,
- wall.

### Void

No traversable tile exists.

The cat cannot move into it.

Examples visually may include:

- empty space,
- water,
- cliff edge.

The exact environment can vary without changing simulation rules.

### Goal

Optional destination tile used only by stages whose objective requires it.

Goal state must remain visually distinguishable.

---

# 5. Collectibles

The primary collectible is a **fish**.

Fish are used because their relationship with the cat is immediately legible
without explanation.

A collectible:

- occupies a traversable tile,
- is collected when the cat enters that tile,
- disappears or visibly changes state after collection,
- produces strong visual feedback,
- may optionally produce SFX.

Collectibles are usually unordered.

The player may collect them in any order unless the stage explicitly introduces
a different rule.

The MVP should not introduce collectible ordering.

---

# 6. Avatar State

The cat has:

```ts
type AvatarState = {
  position: Position;
  orientation: Orientation;
};
```

Supported orientations:

```ts
type Orientation =
  | "north"
  | "east"
  | "south"
  | "west";
```

Orientation belongs to simulation state.

Do not infer orientation from:

- mesh rotation,
- animation state,
- camera position,
- sprite direction.

Rendering follows state.

State does not follow rendering.

---

# 7. Command Set

The MVP has four conceptual command types.

## Forward

```txt
⬆
```

Move one tile in the direction the cat currently faces.

Forward is relative to the cat.

It is never screen-relative.

---

## Turn Left

```txt
↶
```

Rotate the cat exactly 90° counter-clockwise.

The cat remains on the same tile.

Left uses the established **cyan** visual association.

---

## Turn Right

```txt
↷
```

Rotate the cat exactly 90° clockwise.

The cat remains on the same tile.

Right uses the established **orange** visual association.

---

## Repeat

```txt
↻ 2x
↻ 3x
↻ 4x
```

Repeat the contained command sequence a fixed number of times.

For the MVP, use explicit fixed repetition counts.

Do not introduce:

- variables,
- conditions,
- infinite loops,
- while loops,
- custom functions,
- recursion.

---

# 8. Command Representation

Commands should exist as domain data.

Example:

```ts
type Command =
  | {
      type: "forward";
    }
  | {
      type: "turn-left";
    }
  | {
      type: "turn-right";
    }
  | {
      type: "loop";
      count: 2 | 3 | 4;
      commands: Command[];
    };
```

The UI constructs this data.

The interpreter executes this data.

Do not make UI buttons directly mutate the Three.js scene.

---

# 9. Loop Scope

Loops contain a small sequence of commands.

Example:

```txt
↻ 4x
┌──────────────┐
│ ⬆    ↷      │
└──────────────┘
```

Equivalent conceptual execution:

```txt
forward
turn-right
forward
turn-right
forward
turn-right
forward
turn-right
```

For the MVP:

- fixed iteration counts only,
- maximum iteration count should remain small,
- loop body should remain visually compact.

Nested loops are **not required for MVP**.

Avoid introducing nested loops unless the existing stage set genuinely needs
them.

---

# 10. Program Structure

The player's command sequence is the **program**.

Example:

```txt
[ ⬆ ] [ ⬆ ] [ ↷ ] [ ⬆ ]
```

Execution always begins from the first command.

Commands execute deterministically from left to right.

A loop temporarily enters its body and returns to the next command after its
final iteration.

---

# 11. Program Slots

Some levels may limit available program space.

Slot constraints are pedagogical.

They should be used to create the realization:

> "I am repeating the same thing. Maybe I can use Repeat."

They should not exist merely to make a puzzle frustrating.

Example:

Without constraint:

```txt
⬆ ⬆ ⬆ ⬆
```

With limited top-level space:

```txt
↻ 4x
 └─ ⬆
```

---

# 12. Slot Counting

Use two related limits when needed.

```ts
maxProgramSlots
maxLoopBodySlots
```

### Program slots

Count top-level commands.

A loop container occupies one top-level slot.

Example:

```txt
[ ↻ 4x { ⬆ ↷ } ]
```

uses one top-level program slot.

### Loop-body slots

Limit the commands allowed inside a loop.

For example:

```txt
maxProgramSlots: 3
maxLoopBodySlots: 2
```

This keeps loop puzzles constrained without creating arbitrarily large hidden
programs.

Not every level needs a slot limit.

---

# 13. Execution Semantics

Execution happens as a sequence of primitive actions.

Primitive actions are:

```txt
forward
turn-left
turn-right
```

A loop expands logically into repeated primitive actions.

The interpreter should expose execution state such as:

```ts
type ExecutionState = {
  status: "idle" | "running" | "paused" | "failed" | "completed";
  commandPath: number[];
  loopIteration?: number;
};
```

The exact implementation may differ.

The important requirement is that the system can identify:

> Which instruction is currently responsible for the visible action?

---

# 14. Run Mode

The primary execution control is:

```txt
▶
```

Run executes the program continuously.

Default pacing should be approximately:

```txt
~400 ms per primitive action
```

This value may be tuned during playtesting.

Execution must remain slow enough that the child can follow:

```txt
command
→ movement
→ next command
```

Do not execute the entire program instantly.

---

# 15. Step Mode

The secondary execution control is single-step execution.

Conceptually:

```txt
⏯
```

One tap executes **one primitive action**.

Example program:

```txt
↻ 3x
 └─ ⬆
```

Step behavior:

```txt
tap 1 → forward, iteration 1
tap 2 → forward, iteration 2
tap 3 → forward, iteration 3
```

The loop must not execute all iterations from one Step tap.

This mode exists to teach tracing and debugging.

It is not merely a developer feature.

---

# 16. Execution Pointer

The active command must be visibly identifiable.

During execution:

- current command highlights,
- loop iteration is visually understandable,
- corresponding board action occurs,
- highlight then advances.

The player should be able to visually follow:

```txt
THIS BLOCK
    ↓
THIS ACTION
```

The active block may use:

- thick border,
- pulse,
- elevation,
- subtle scale change.

Avoid excessive glowing or distracting animation.

---

# 17. Editing During Execution

Program editing is disabled while continuous execution is running.

The player should not be able to mutate the command tree mid-action.

After execution:

- the program remains editable,
- collected state can be reset,
- commands remain visible.

If the player edits the program after partial stepping, simulation returns to
the level's starting state.

This avoids unclear combinations of:

```txt
old simulation state + new program
```

---

# 18. Starting Execution

Starting a new Run from idle always resets the simulation to the level's initial
state before executing.

Therefore:

```txt
Run
```

is deterministic.

The same program always starts from:

- original cat position,
- original orientation,
- restored collectibles,
- original environmental state.

---

# 19. Collision

A forward command is invalid when the destination is:

- blocked,
- outside the board,
- void,
- otherwise non-traversable.

On collision:

1. the cat does not move,
2. the invalid command remains highlighted,
3. execution immediately pauses/stops,
4. visual collision feedback plays,
5. the player enters inspection state.

Do **not** continue executing the rest of the program.

Continuing after an invalid movement creates confusing downstream behavior.

---

# 20. Collision Feedback

Collision feedback must work without audio.

Use a restrained combination of:

- barrier flash,
- destination-tile feedback,
- cat reaction,
- ear droop,
- small board/screen nudge,
- active command warning state.

Optional SFX may reinforce the event.

Avoid:

- large red error screens,
- harsh alarm effects,
- full-page failure dialogs.

The player should remain visually connected to the mistake.

---

# 21. Failure State

Kotak-Katik should avoid a conventional punitive "Game Over".

Instead:

```txt
program stops
    ↓
problem remains visible
    ↓
player inspects command
    ↓
player edits
    ↓
tries again
```

Failure is a debugging state.

Do not use:

- lives,
- health,
- retry currency,
- negative scores,
- countdown penalties.

---

# 22. Completion Rule

For a normal `collect-all` stage:

```txt
stage objective is satisfied when all required fish have been collected
```

However, successful execution should remain valid until the current program
finishes or is safely stopped.

Extra valid commands do not automatically fail a stage.

The game does not grade command minimality unless a specific slot constraint is
part of the puzzle.

For:

```txt
collect-all-and-reach-goal
```

completion requires both:

- all required fish collected,
- cat ending on the goal state.

---

# 23. No Hidden Optimality Requirement

Do not secretly require the shortest possible solution.

If:

```txt
⬆ ⬆ ↷ ⬆
```

solves the puzzle, it is valid even if another valid program uses fewer blocks.

Efficiency becomes a learning objective only when explicitly communicated
through:

- slot limits,
- loop challenges,
- specific stage structure.

Do not punish experimentation.

---

# 24. Retry

Retry means:

> Execute the current program again from the beginning.

Retry resets:

- cat position,
- orientation,
- collectibles,
- execution pointer,
- temporary effects.

Retry does **not** delete the player's program.

---

# 25. Reset Program

Reset Program means:

> Restore the stage's initial command configuration.

For independent stages:

```txt
program → empty
```

For guided stages:

```txt
program → original partially-filled program
```

For debug stages:

```txt
program → original buggy program
```

Retry and Reset Program must remain conceptually different.

---

# 26. Command Input

The command interface should support both touch and pointer input.

Preferred behavior:

### Tap to add

Tap a palette command to append it to the next available program position.

This provides an easy mobile interaction.

### Drag to reorder

Commands may be dragged to rearrange their sequence.

### Drag into loop

Commands may be placed into a loop container.

### Remove

Commands must have a simple removal interaction.

Avoid making precise drag-and-drop the only way to construct a program.

Young children and touch devices should not depend on fine pointer accuracy.

---

# 27. Command Palette

Only commands relevant to the current concept should appear.

Early stage:

```txt
⬆
```

Later:

```txt
⬆  ↶  ↷
```

Loop introduction:

```txt
⬆  ↶  ↷  ↻
```

Do not expose the full command vocabulary immediately.

Palette restriction is instructional scaffolding.

---

# 28. Spatial Guardrails

Relative movement is intentionally part of the learning mechanic.

Therefore orientation must remain visually obvious.

Required cues:

### Forward

The cat must visibly face a direction.

A subtle gaze or forward-facing ground cue may show the next tile.

### Left

Use cyan association.

Examples:

- left ear accent,
- left side accent,
- left-turn command color.

### Right

Use orange association.

Examples:

- right ear accent,
- right side accent,
- right-turn command color.

These colors are associations, not the sole indicator.

Do not rely only on color.

---

# 29. Turn Preview

When the player interacts with a turn command, a subtle preview may show how the
cat would rotate.

For example:

```txt
current cat
    +
transparent ghost orientation
```

Preview is especially useful during:

- early turn tutorials,
- drag placement,
- guided stages.

Do not preview the entire solved route.

Scaffolding should clarify the mechanic without solving the puzzle.

---

# 30. Movement Feedback

Each successful forward step should communicate movement rhythm visually.

Possible combination:

- active command pulse,
- cat movement,
- destination tile ripple,
- subtle landing response.

Optional footstep SFX may reinforce this.

The visual sequence must remain sufficient by itself.

---

# 31. Collect Feedback

When the cat enters a fish tile:

1. fish reacts,
2. fish disappears or enters collected state,
3. tile provides brief feedback,
4. progression toward completion becomes visually apparent.

Optional sound may accompany collection.

Do not rely on a numerical counter alone.

The world itself should show that the fish is gone.

---

# 32. Success Feedback

Success should feel positive but concise.

Possible sequence:

```txt
final objective completed
    ↓
cat reaction
    ↓
world celebration
    ↓
next progression becomes available
```

Possible visual feedback:

- cat hop,
- tail motion,
- star/spark effect,
- expedition path illumination.

Avoid prolonged victory screens after every tiny stage.

The child should be able to continue quickly.

---

# 33. Audio

Audio may include:

- BGM,
- footsteps,
- command tick,
- fish pickup,
- collision,
- success cue,
- UI feedback.

But:

> Audio must never communicate unique gameplay information.

Muting the game must not increase puzzle difficulty.

BGM is atmosphere only.

---

# 34. Guided Learning Modes

Stages may use one of four teaching modes.

```ts
type LearningMode =
  | "demo"
  | "guided"
  | "independent"
  | "debug";
```

---

# 35. Demo / I Do

The system demonstrates the mechanic.

Possible behavior:

1. command appears,
2. ghost hand or similar visual indicator places it,
3. relevant control highlights,
4. execution runs,
5. child watches result.

Keep demonstrations short.

The player should interact quickly.

Do not turn tutorials into videos.

---

# 36. Guided / We Do

The program begins partially completed.

Example:

```txt
[ ⬆ ] [ ___ ] [ ⬆ ]
```

The palette may contain only the relevant missing command.

Use guided stages to isolate one concept.

Do not artificially create many empty slots when teaching one action.

---

# 37. Independent / You Do

The command tray begins empty.

The player constructs the solution.

Scaffolding may still remain through:

- visible board goal,
- spatial color associations,
- command palette,
- slot limits.

Independent does not mean removing accessibility cues.

---

# 38. Debug Mode

A Debug stage begins with a program that contains a mistake.

Example:

```txt
⬆  ⬆  ↶  ⬆
```

when:

```txt
⬆  ⬆  ↷  ⬆
```

would follow the intended route.

The player should:

```txt
run
→ observe
→ step
→ find mismatch
→ edit
→ retry
```

Do not highlight the incorrect command before the child has an opportunity to
observe the program.

The system may highlight the active failing command after execution reaches the
problem.

---

# 39. Debugging Philosophy

The player should learn that:

> Programs can be inspected rather than guessed.

Debug stages must reward tracing.

Do not turn debugging into:

- spot-the-red-block,
- random command replacement,
- trial-and-error guessing.

The single-step control is central to this mode.

---

# 40. Difficulty Progression

Difficulty should increase through concepts rather than interface complexity.

Recommended progression:

```txt
single forward
    ↓
multiple forward commands
    ↓
one turn
    ↓
multiple turns
    ↓
combined paths
    ↓
recognizable repetition
    ↓
loop constraint
    ↓
debugging
    ↓
mixed concepts
```

---

# 41. Board Complexity

Early boards should be tiny.

Example:

```txt
🐱 □ 🐟
```

Then:

```txt
🐱 □ 🐟 □ 🐟
```

Then:

```txt
        🐟
         □
🐱 □ 🐟
```

Only increase board size when the child already understands the mechanics.

A larger board is not automatically a better puzzle.

---

# 42. Path Readability

Fish placement should often help communicate the intended route.

Example:

```txt
🐱 → 🐟 → 🐟
```

or:

```txt
        🐟
        ↑
🐱 → 🐟
```

Avoid boards where decorative geometry obscures where the cat is expected to
travel.

The child should primarily reason about commands, not hunt for the objective.

---

# 43. Loop Introduction

Do not begin by explaining:

> "A loop repeats instructions."

Prefer letting the player encounter repetition first.

Example sequence:

```txt
Stage A
⬆ ⬆

Stage B
⬆ ⬆ ⬆

Stage C
same pattern but fewer available program slots
```

Then reveal:

```txt
↻
```

The mechanic should feel like a solution to a problem the player already
understands.

---

# 44. Loop Challenge Design

Good loop puzzles contain visible repetition.

Examples:

### Straight repetition

```txt
🐱 □ 🐟 □ 🐟 □ 🐟
```

### Repeated turn pattern

```txt
⬆ ↷
⬆ ↷
⬆ ↷
```

Avoid requiring loops merely because the designer arbitrarily reduced command
slots.

The repeated structure should be visually meaningful.

---

# 45. Stage Types

The MVP may include these stage categories.

## Path Node

Standard sequencing/navigation puzzle.

Primary concepts:

- forward,
- ordering,
- turns.

## Loop Node

Pattern-recognition puzzle.

Primary concepts:

- repetition,
- command compression.

## Debug Node

Pre-filled faulty program.

Primary concepts:

- tracing,
- correction.

## Rest Node

No difficult puzzle.

Purpose:

- pacing,
- cosmetic reward,
- small celebration.

## Milestone Node

Combines previously learned concepts.

Do not introduce unrelated new mechanics during milestone stages.

---

# 46. Expedition Map

The level map is a small directed progression graph.

Conceptually:

```txt
        ○
        │
        ○
       / \
      ○   ○
       \ /
        ◎
```

The map should communicate:

- current node,
- completed nodes,
- available choices,
- locked future nodes,
- node type.

---

# 47. Branching Rules

Branching should remain simple.

Recommended rules:

- maximum two choices at most forks,
- branches remain short,
- branches usually merge again,
- no complex route optimization,
- no permanent punishment for choosing one path.

The purpose of branching is:

- curiosity,
- agency,
- pacing variety.

It is not strategic roguelike optimization.

---

# 48. Map Node States

A node may be:

```ts
type NodeState =
  | "locked"
  | "available"
  | "current"
  | "completed";
```

These states must remain visually distinct without relying exclusively on color.

---

# 49. Map Generation

The competition MVP does not require procedural map generation.

Prefer a fixed or deterministic map authored specifically for the curriculum.

This provides:

- predictable pedagogy,
- easier testing,
- better visual composition,
- lower technical risk.

Procedural complexity is not inherently valuable.

---

# 50. Stage Data

Stages should be data-driven rather than hard-coded into components.

Conceptually:

```ts
type LevelDefinition = {
  id: string;
  title?: string;

  learningMode:
    | "demo"
    | "guided"
    | "independent"
    | "debug";

  board: TileDefinition[];

  avatar: {
    startPosition: Position;
    startOrientation: Orientation;
  };

  collectibles: {
    id: string;
    position: Position;
  }[];

  objective:
    | { type: "collect-all" }
    | {
        type: "collect-all-and-reach-goal";
        goal: Position;
      };

  allowedCommands: CommandType[];

  initialProgram?: Command[];

  maxProgramSlots?: number;
  maxLoopBodySlots?: number;

  concept:
    | "movement"
    | "sequence"
    | "turning"
    | "loop"
    | "debug"
    | "mixed";
};
```

Exact TypeScript shape may evolve.

The principle should not.

---

# 51. Separation of Level and Presentation

A level definition describes logical gameplay.

It should not depend on:

- mesh UUIDs,
- Three.js object references,
- DOM nodes,
- pixel coordinates.

Visual properties may reference stable asset identifiers.

Example:

```ts
visualTheme: "grass-island"
```

rather than direct renderer state.

---

# 52. Deterministic Simulation

Given:

```txt
same level
+
same program
```

the result must always be identical.

No gameplay-critical randomness.

Randomness may be used for purely cosmetic details such as:

- idle animation variation,
- ambient particles,
- decoration.

Cosmetic randomness must not affect puzzle solvability.

---

# 53. Cosmetic Rewards

Rest or milestone nodes may unlock lightweight cat cosmetics.

Examples:

- hat,
- scarf,
- ribbon,
- yarn accessory,
- small color variation.

Rewards exist for delight and pacing.

Do not turn them into:

- inventory management,
- stat systems,
- shops,
- currencies.

For MVP, unlocking is sufficient.

---

# 54. Progression Persistence

Local storage is sufficient.

Possible stored state:

```ts
type ProgressState = {
  completedLevelIds: string[];
  unlockedNodeIds: string[];
  unlockedCosmeticIds: string[];
  selectedCosmeticId?: string;
};
```

Do not require a backend for core progression.

---

# 55. No Scoring by Default

The core game should not require:

- stars,
- grades,
- speed ratings,
- accuracy percentages,
- leaderboards.

Completion is sufficient.

When efficient programs matter, teach efficiency through puzzle constraints
rather than external scoring.

---

# 56. No Time Pressure

Do not use countdown timers for normal gameplay.

Computational reasoning should happen at the player's pace.

Animation timing exists for comprehension.

It is not a reaction-speed challenge.

---

# 57. No Enemies

The MVP should not introduce enemies or combat.

Avoid:

- moving hazards,
- enemy AI,
- damage,
- health,
- chase mechanics.

These increase implementation complexity without strengthening the core learning
objective.

---

# 58. MVP Environmental Vocabulary

Prefer a small world vocabulary:

```txt
floor
blocked object
void / water
fish
optional goal
```

Do not add:

- switches,
- keys,
- doors,
- teleporters,
- moving platforms,
- pressure plates,

unless the core curriculum later demonstrates a clear need.

---

# 59. Responsive Gameplay

Desktop and mobile should share the same rules.

Do not create simplified puzzle logic for mobile.

Layouts may reorganize.

Example desktop:

```txt
┌──────────────────────┬───────────────┐
│                      │ command       │
│      3D board        │ palette       │
│                      │               │
│                      │ program tray  │
└──────────────────────┴───────────────┘
```

Example mobile:

```txt
┌──────────────────────┐
│       3D board       │
│                      │
├──────────────────────┤
│    program tray      │
├──────────────────────┤
│  command palette     │
└──────────────────────┘
```

Board readability takes priority.

---

# 60. Touch Targets

Primary controls must remain large enough for children and touch interaction.

Avoid:

- tiny drag handles,
- precision-only controls,
- hover-required functionality.

Hover may provide enhancement on desktop.

It must not be required.

---

# 61. Gameplay Animation Rules

Animations should explain state changes.

Useful animation:

```txt
command highlight
→ cat rotates
→ orientation visibly settles
```

Unhelpful animation:

```txt
random bouncing UI
```

Motion should support:

- causality,
- orientation,
- success,
- error,
- pacing.

Avoid motion that competes with the puzzle.

---

# 62. Camera During Gameplay

Camera position should remain stable during command execution.

Do not:

- rotate the camera when the cat turns,
- dynamically orbit around the cat,
- zoom aggressively during movement.

Changing the camera can destroy the child's spatial reference frame.

The cat rotates.

The world reference remains stable.

---

# 63. Camera and Direction Logic

Never implement direction based on screen direction.

For example:

```txt
cat faces south
```

then:

```txt
turn-right
```

must rotate according to the cat's orientation, even if this visually appears
like a leftward screen movement from the player's perspective.

This cognitive distinction is intentional.

Use visual scaffolding instead of changing the rule.

---

# 64. Gameplay Accessibility Check

For every stage verify:

### Goal

Can the child visually identify what they need to collect?

### Orientation

Can the child identify where the cat is facing?

### Commands

Can command differences be recognized without reading paragraphs?

### Execution

Can the child identify which command is active?

### Error

Can the child see where execution failed?

### Audio independence

Does muting the game preserve all required information?

If not, the stage is not complete.

---

# 65. Stage Quality Test

Before accepting a level, ask:

1. What concept is this stage teaching?
2. What new reasoning does it require?
3. Is that reasoning visible in the board geometry?
4. Is the objective obvious?
5. Are unrelated mechanics competing for attention?
6. Does failure teach something?
7. Can the player inspect the result?
8. Is the stage still understandable without sound?
9. Does the stage need this many tiles?
10. Could the same concept be taught more clearly with a smaller board?

---

# 66. Stage Design Rule

Each early stage should have one primary teaching purpose.

Bad:

> Introduce turning, loops, debugging, and collectibles simultaneously.

Better:

```txt
Stage 1 → movement
Stage 2 → sequencing
Stage 3 → first turn
Stage 4 → multiple turns
Stage 5 → recognize repetition
Stage 6 → loop
```

Mixed challenges belong later.

---

# 67. Gameplay North Star

Every puzzle should preserve a visible causal chain:

```txt
I PLACED THIS
      ↓
THE GAME EXECUTED THIS
      ↓
THE CAT DID THIS
      ↓
NOW I UNDERSTAND WHY
```

If a mechanic weakens that relationship, reconsider it.

The core gameplay is not about making the cat reach somewhere.

It is about helping the child understand:

> **My instructions caused this result.**
