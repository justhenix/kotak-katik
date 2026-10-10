# Technical Architecture — Kotak-Katik

## 1. Purpose

This document defines the technical architecture and engineering constraints for
Kotak-Katik.

It covers:

- application stack,
- project structure,
- game-engine boundaries,
- execution model,
- React / Three.js responsibilities,
- state management,
- level data,
- asset loading,
- audio,
- persistence,
- testing,
- performance,
- deployment.

Product behavior is defined elsewhere:

- `product.md`
- `gameplay.md`
- `pedagogy.md`
- `accessibility.md`
- `design.md`

Do not duplicate product rules here unless they directly affect architecture.

---

# 2. Stack

Use:

```txt
Runtime / tooling
Bun

Application
Vite
React
TypeScript

3D
three
@react-three/fiber
@react-three/drei

State
zustand

Interaction
@dnd-kit/react

Styling
Tailwind CSS

DOM animation
Motion

Testing
Vitest
Playwright

Persistence
localStorage

Deployment
Vercel
```

Keep the dependency surface small.

Do not add frameworks or infrastructure without a concrete need.

Do not put version pins in this document. Choose compatible stable releases during setup, record exact versions in package.json and bun.lock, and check current official compatibility guidance before updating related packages. In particular, keep React, Three.js, and React Three Fiber versions compatible.

---

# 3. Runtime Philosophy

Kotak-Katik is primarily a client-side interactive game.

It does not require:

- SSR,
- server components,
- API routes,
- authentication,
- database infrastructure,
- backend game state,
- multiplayer synchronization.

Prefer a static frontend application deployed through Vercel.

---

# 4. Package Manager

Use **Bun**.

Expected commands should resemble:

```bash
bun install
bun run dev
bun run build
bun run test
```

Use one project lockfile:

```txt
bun.lock
```

Do not introduce:

```txt
package-lock.json
pnpm-lock.yaml
yarn.lock
```

alongside Bun.

---

# 5. Vite

Use Vite as the application build tool.

Reasons:

- fast development startup,
- simple client-side application model,
- minimal framework overhead,
- straightforward static deployment,
- good fit for React + Three.js.

Do not migrate to Next.js unless a future requirement genuinely requires
server-side architecture.

---

# 6. Core Architectural Rule

The most important technical rule is:

> **The game engine decides what happened. Three.js only shows what happened.**

Do not let visual objects become authoritative gameplay state.

Correct:

```txt
Program
   ↓
Game Engine
   ↓
Logical State
   ↓
Animation / Rendering
```

Incorrect:

```txt
Three.js mesh moved
   ↓
therefore game state changed
```

---

# 7. Architecture Overview

Use this conceptual architecture:

```txt
Typed Level Data
       │
       ▼
Pure Game Engine
       │
       ▼
Game State / Zustand
      / \
     /   \
    ▼     ▼
React UI  R3F Scene
```

Responsibilities must remain separated.

---

# 8. Game Engine

The game engine should be written primarily as plain TypeScript.

It should not depend on:

- React,
- React Three Fiber,
- DOM nodes,
- Three.js meshes,
- browser animation,
- visual component refs.

The engine owns:

- coordinates,
- orientation,
- movement rules,
- collision,
- collectibles,
- objectives,
- command execution,
- loop state,
- completion state.

This makes the game logic testable independently from rendering.

---

# 9. Rendering Layer

React Three Fiber / Three.js owns presentation.

It may render:

- tiles,
- cat,
- fish,
- environment,
- effects,
- lighting,
- camera,
- visual transitions.

It does not decide:

- whether movement is legal,
- whether fish was collected,
- whether a level is complete,
- which command executes next.

Those decisions belong to the game engine.

---

# 10. UI Layer

React owns DOM-based interface elements such as:

- program tray,
- command palette,
- Play,
- Step,
- Retry,
- Reset,
- settings,
- expedition UI,
- instructional overlays.

React UI reads and modifies logical game/program state through defined actions.

Do not manipulate Three.js objects directly from command buttons.

---

# 11. State Ownership

Use Zustand for shared runtime state.

Keep logical and presentation state clearly distinguishable.

Possible domains:

```txt
game
program
execution
progress
settings
ui
```

Do not create one giant unstructured store.

---

# 12. Suggested Store Shape

Conceptually:

```ts
type GameStore = {
  levelId: string | null;

  avatar: {
    position: Position;
    orientation: Orientation;
  };

  collectedIds: string[];

  program: Command[];

  execution: {
    status:
      | "idle"
      | "running"
      | "paused"
      | "failed"
      | "completed";

    activeCommandPath: number[] | null;
  };
};
```

Exact implementation may evolve.

Keep state explicit.

---

# 13. Do Not Store Three.js Objects in Zustand

Avoid storing:

```ts
THREE.Mesh
THREE.Group
THREE.Object3D
THREE.Scene
THREE.AnimationMixer
```

inside the gameplay store.

These belong to the rendering layer.

Zustand should store serializable logical data whenever possible.

---

# 14. Logical Coordinates

The gameplay grid should use simple integer coordinates.

Example:

```ts
type Position = {
  x: number;
  z: number;
};
```

Do not use rendered world coordinates as the primary puzzle representation.

The scene may translate logical coordinates into Three.js positions.

Example:

```txt
logical:
{x: 2, z: 1}

render:
Vector3(2 * TILE_SIZE, elevation, 1 * TILE_SIZE)
```

The conversion belongs in the presentation layer.

---

# 15. Orientation

Represent orientation logically.

Example:

```ts
type Orientation =
  | "north"
  | "east"
  | "south"
  | "west";
```

Rotation should be determined from orientation.

Do not determine orientation by reading:

```ts
mesh.rotation.y
```

The mesh follows state.

State does not follow the mesh.

---

# 16. Movement

Forward movement should use a deterministic orientation map.

Conceptually:

```ts
const directionVectors = {
  north: { x: 0, z: -1 },
  east:  { x: 1, z: 0 },
  south: { x: 0, z: 1 },
  west:  { x: -1, z: 0 },
};
```

Exact world-axis orientation may differ depending on scene construction.

Keep one canonical mapping.

Do not scatter directional math across components.

---

# 17. Turning

Turning should use logical transitions.

Example:

```txt
north
right → east
right → south
right → west
right → north
```

and:

```txt
north
left → west
left → south
left → east
left → north
```

Keep this logic in the engine.

Do not calculate turns through arbitrary mesh angles.

---

# 18. Command Model

Commands should be typed domain data.

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

UI is only an editor for this data.

---

# 19. Program

A program is:

```ts
type Program = Command[];
```

Keep program representation independent from:

- rendered command components,
- DOM ordering,
- drag-and-drop metadata.

The UI may derive presentation from the program.

Never derive the program from the DOM.

---

# 20. Execution Model

Kotak-Katik uses a **live deterministic interpreter**.

The engine processes one primitive action at a time.

Conceptually:

```txt
read command
    ↓
calculate result
    ↓
update logical state
    ↓
animate result
    ↓
advance execution
```

---

# 21. Run and Step Share the Same Engine

Do not create separate logic for:

```txt
Run
```

and:

```txt
Step
```

Both must use the same primitive execution function.

Conceptually:

```ts
executeNextAction()
```

Step:

```txt
user taps
→ executeNextAction()
```

Run:

```txt
executeNextAction()
→ wait
→ executeNextAction()
→ wait
→ ...
```

This prevents behavioral divergence.

---

# 22. Primitive Actions

The runtime interpreter should eventually reduce execution to primitive actions:

```txt
forward
turn-left
turn-right
```

A loop controls which primitive action comes next.

The renderer should animate primitive actions rather than trying to animate an
entire program simultaneously.

---

# 23. Loop Execution

Do not require loops to be fully flattened before execution.

Maintain interpreter context.

For example:

```txt
↻ 3x {
  ⬆
}
```

should logically execute:

```txt
iteration 1 → forward
iteration 2 → forward
iteration 3 → forward
```

Step mode must advance one primitive action at a time.

---

# 24. Interpreter State

The interpreter may maintain an execution cursor or stack.

Conceptually:

```ts
type ExecutionFrame = {
  commands: Command[];
  index: number;
  iteration?: number;
  repeatCount?: number;
};
```

A stack can represent nested command context even if nested loops are not
required by the MVP.

Keep the implementation as simple as the current feature set allows.

---

# 25. Do Not Overengineer an AST

Commands already form a small structured program.

Do not introduce:

- parser generators,
- bytecode,
- virtual machines,
- compiler architecture,
- unnecessary AST transformations.

The game needs a small interpreter, not a programming language platform.

---

# 26. Execution Timing

Run mode should use controlled pacing.

Initial target:

```txt
~400 ms per primitive action
```

Do not tightly couple engine state changes to a raw interval without accounting
for animation completion.

Prefer an execution loop conceptually like:

```txt
calculate action
    ↓
update logical state
    ↓
await presentation timing
    ↓
continue
```

Exact implementation may use promises, timers, or controlled transitions.

Keep it deterministic.

---

# 27. Simulation vs Animation

When a command executes:

```txt
engine determines:
position A → position B
```

Then the renderer animates:

```txt
visual A → visual B
```

The animation does not determine where the cat ends.

If the animation is skipped or interrupted, the logical state remains correct.

---

# 28. Animation Completion

Do not scatter:

```ts
setTimeout(...)
```

across arbitrary components to control game logic.

Centralize execution pacing.

Individual visual components should receive clear target state.

Game progression should not depend on fragile component-local timers.

---

# 29. Collision

Before movement:

```txt
current position
+
direction
→ candidate position
```

Then verify:

- tile exists,
- tile is traversable,
- tile is not blocked.

If invalid:

```txt
logical position does not change
execution becomes failed/paused
collision event is emitted
```

Presentation responds to the event.

---

# 30. Gameplay Events

It may be useful for the engine to expose lightweight semantic events.

Examples:

```ts
type GameEvent =
  | { type: "moved"; from: Position; to: Position }
  | { type: "turned"; direction: "left" | "right" }
  | { type: "collected"; collectibleId: string }
  | { type: "collision"; position: Position }
  | { type: "completed" };
```

Events are useful for:

- animation,
- SFX,
- visual feedback.

Do not make event history the authoritative world state.

---

# 31. Audio Follows Events

Audio should respond to semantic gameplay events.

Example:

```txt
moved
→ optional footstep

collected
→ optional pickup SFX

collision
→ optional collision SFX

completed
→ optional success cue
```

Audio must never drive engine decisions.

---

# 32. Editing During Execution

Program editing should be locked while continuous execution is active.

Reason:

```txt
program changing
+
execution cursor changing
=
unnecessary complexity
```

Once stopped/failed/completed, editing may resume.

---

# 33. Editing After Step

If program structure changes while the level is in a partially stepped state,
reset logical simulation to the starting state.

Do not attempt hot-edit continuation.

Keep the mental model simple:

```txt
edit program
→ simulation restarts
```

---

# 34. Level Reset

Every level must be able to recreate its initial logical state.

Provide a pure reset path.

Conceptually:

```ts
createInitialState(level)
```

Avoid manually reversing previous actions.

Reset should rebuild state from level data.

---

# 35. Level Data

Levels should be plain typed TypeScript data.

Prefer:

```txt
src/game/levels/
```

Example:

```ts
export const level01: LevelDefinition = {
  id: "movement-01",

  learning: {
    concept: "movement",
    phase: "i-do",
  },

  avatar: {
    position: { x: 0, z: 0 },
    orientation: "east",
  },

  tiles: [
    { x: 0, z: 0 },
    { x: 1, z: 0 },
    { x: 2, z: 0 },
  ],

  collectibles: [
    {
      id: "fish-1",
      position: { x: 2, z: 0 },
    },
  ],

  objective: {
    type: "collect-all",
  },

  allowedCommands: ["forward"],
};
```

---

# 36. Why Typed TS Instead of JSON

Typed TypeScript gives:

- autocomplete,
- compile-time validation,
- easier authoring,
- easier refactoring,
- no separate schema pipeline required initially.

Do not build a visual level editor for MVP.

---

# 37. Level Validation

Provide development-time validation where useful.

Examples:

- duplicate tile coordinates,
- collectible placed outside board,
- start position invalid,
- goal missing,
- unsupported command,
- impossible loop setting.

Do not let malformed levels fail silently.

---

# 38. Level IDs

Use stable semantic IDs.

Prefer:

```txt
movement-01
movement-02
sequence-01
turning-01
loop-01
debug-01
```

Avoid using array position as identity.

Progress persistence depends on stable IDs.

---

# 39. Expedition Data

Keep expedition progression as authored data.

Conceptually:

```ts
type ExpeditionNode = {
  id: string;
  levelId?: string;
  type:
    | "path"
    | "loop"
    | "debug"
    | "rest"
    | "milestone";

  next: string[];
};
```

Do not procedurally generate the curriculum map for MVP.

---

# 40. Project Structure

Recommended structure:

```txt
src/
├── app/
│   ├── App.tsx
│   └── routes/
│
├── game/
│   ├── engine/
│   │   ├── movement.ts
│   │   ├── collision.ts
│   │   ├── objectives.ts
│   │   ├── reset.ts
│   │   └── events.ts
│   │
│   ├── interpreter/
│   │   ├── interpreter.ts
│   │   ├── execution-stack.ts
│   │   └── types.ts
│   │
│   ├── levels/
│   │   ├── movement/
│   │   ├── sequence/
│   │   ├── turning/
│   │   ├── loop/
│   │   ├── debug/
│   │   └── index.ts
│   │
│   ├── expedition/
│   │   └── map.ts
│   │
│   └── types/
│       ├── commands.ts
│       ├── level.ts
│       └── state.ts
│
├── scene/
│   ├── GameScene.tsx
│   ├── Board/
│   ├── Cat/
│   ├── Collectibles/
│   ├── Environment/
│   ├── Lighting/
│   └── Effects/
│
├── components/
│   ├── commands/
│   ├── program/
│   ├── controls/
│   ├── panels/
│   └── ui/
│
├── screens/
│   ├── TitleScreen/
│   ├── ExpeditionScreen/
│   └── PuzzleScreen/
│
├── stores/
│   ├── game-store.ts
│   ├── progress-store.ts
│   └── settings-store.ts
│
├── audio/
│   ├── audio-manager.ts
│   └── sounds.ts
│
├── hooks/
├── lib/
├── styles/
└── test/
```

Adapt if the repository already has a coherent structure.

Do not restructure the entire project unnecessarily.

---

# 41. React Three Fiber

Use React Three Fiber as the React integration layer for Three.js.

Typical scene composition:

```tsx
<GameScene>
  <Board />
  <Cat />
  <Collectibles />
  <Environment />
  <Lighting />
</GameScene>
```

Use declarative scene composition where it improves readability.

---

# 42. Drei

Use `@react-three/drei` selectively.

Useful helpers may include:

- GLTF loading,
- orthographic camera helpers,
- preloading,
- simple scene utilities.

Do not import Drei abstractions merely because they exist.

Check compatibility with the selected React Three Fiber version.

Keep the rendered scene understandable.

---

# 43. Camera

Gameplay uses an orthographic camera.

Target visual direction:

```txt
azimuth ≈ 45°
elevation ≈ 35.264°
```

Exact scene values may be tuned visually.

Do not expose free camera orbit during normal puzzle gameplay.

Stable orientation is intentional.

---

# 44. Camera Fitting

Board sizes may vary.

Prefer automatically fitting the orthographic camera to the logical board
bounds while preserving the same viewing angle.

Do not manually tune a unique camera position for every level unless necessary.

---

# 45. Three.js Rendering Loop

Avoid unnecessary per-frame work.

Do not place gameplay calculations inside:

```ts
useFrame(...)
```

unless they are strictly presentation-related.

Appropriate `useFrame` uses:

- interpolation,
- subtle idle animation,
- visual effects.

Inappropriate:

- collision detection for tile movement,
- level completion,
- command advancement.

---

# 46. React Re-Renders

Do not cause the entire React application to rerender every animation frame.

Use targeted store selectors.

Example:

```ts
useGameStore((state) => state.avatar.position)
```

instead of subscribing to the entire store.

---

# 47. DnD

Use the current React adapter, `@dnd-kit/react`, for command manipulation where useful. Its API differs from the legacy `@dnd-kit/core` packages; follow the current React docs when implementing.

Supported interactions may include:

- reorder commands,
- place commands into loops,
- move commands between slots.

But drag-and-drop is not the only command input.

Tap-to-add remains supported.

---

# 48. DnD State

The drag UI edits the logical Program data.

Do not use DOM element position as the source of program order.

After a valid drop:

```txt
DnD result
   ↓
program data changes
   ↓
UI rerenders
```

---

# 49. Tailwind

Use Tailwind for styling DOM-based UI.

Use it for:

- spacing,
- layout,
- typography,
- responsive composition,
- state styling.

Do not rely on generic component-library aesthetics.

The design system should remain custom to Kotak-Katik.

Use the current Tailwind CSS Vite integration documented by Tailwind. Do not copy setup instructions from an older major release.

---

# 50. No Shadcn by Default

Do not install shadcn as a default dependency.

Reason:

Kotak-Katik requires custom game-like controls and colored panels.

Generic dashboard primitives may encourage visual drift.

Small utility primitives may be built directly when needed.

---

# 51. Motion

Use Motion for DOM/UI transitions.

Appropriate:

- panel entrance,
- map node transition,
- button feedback,
- reward reveal,
- theme transition.

Do not use Motion as the gameplay simulation engine.

For React, use the current motion package and import path from the official Motion docs. Do not assume older Framer Motion setup examples use the same package entry point.

---

# 52. Three.js Animation

3D animation should remain inside the R3F/Three.js layer.

Examples:

- cat moving between tiles,
- cat rotating,
- fish pickup,
- ear reaction,
- tile ripple.

Logical state still remains authoritative.

---

# 53. No Blender Dependency

The project must not assume manual Blender expertise.

Do not create a workflow requiring the developer to:

- manually retopologize,
- rebuild rigs,
- fix materials by hand,
- repair UVs,
- edit animation timelines,
- perform complex exports.

The intended asset pipeline is developer-friendly and code-driven.

---

# 54. Preferred Runtime Asset Format

Prefer:

```txt
GLB / glTF
```

for runtime 3D assets.

Reasons:

- browser-friendly,
- supported by Three.js,
- compact,
- carries materials and hierarchy,
- easy to load through `useGLTF`.

---

# 55. Asset Selection Rule

When multiple assets are available, prefer the one requiring less manual
processing.

Priority:

```txt
usable GLB/glTF
    ↓
simple format convertible through CLI
    ↓
asset requiring minor code-side adjustment
    ↓
avoid asset requiring manual 3D repair
```

Do not choose technically inconvenient assets purely because they look slightly
better.

---

# 56. Asset Sources

Primary:

Quaternius:

```txt
https://drive.google.com/drive/folders/1Yyag0ibcOX6lOBY9a3m6iPnz8HwjwLFJ
```

Secondary:

Kenney Prototype Kit:

```txt
https://kenney.nl/assets/prototype-kit
```

Follow `design.md` for visual selection.

Follow attribution documentation for asset provenance.

---

# 57. Asset Processing

Prefer code-side adjustments such as:

- scale,
- position,
- material color,
- roughness,
- rotation.

Example:

```tsx
<primitive
  object={scene}
  scale={0.8}
  rotation={[0, Math.PI / 2, 0]}
/>
```

Do not permanently mutate imported source files unless necessary.

---

# 58. Asset Conversion

If a source asset requires conversion, prefer a reproducible CLI/script.

If no reliable automated conversion path exists and Blender would be required,
consider another asset first.

Do not make manual conversion a recurring development dependency.

---

# 59. Asset Organization

Recommended:

```txt
public/
└── assets/
    ├── models/
    │   ├── cat/
    │   ├── terrain/
    │   ├── props/
    │   └── collectibles/
    ├── audio/
    │   ├── bgm/
    │   └── sfx/
    ├── bisindo/
    └── images/
```

Use predictable names.

Avoid:

```txt
final.glb
final2.glb
cat-new.glb
cat-final-real.glb
```

---

# 60. Asset Registry

Prefer a central asset registry where helpful.

Example:

```ts
export const models = {
  cat: "/assets/models/cat/cat.glb",
  fish: "/assets/models/collectibles/fish.glb",
  tree: "/assets/models/props/tree.glb",
};
```

This prevents path strings from being scattered throughout components.

---

# 61. Asset Loading

Preload gameplay-critical assets where useful.

Critical:

- cat,
- board tiles,
- fish,
- primary UI.

Lazy-load:

- cosmetics,
- distant environment props,
- BISINDO clips not immediately needed,
- optional audio.

Do not block the first playable screen on non-critical assets.

---

# 62. Loading Failure

Optional asset failure must degrade gracefully.

Example:

If decorative tree fails:

```txt
game still works
```

If BISINDO clip fails:

```txt
core gameplay still works
```

If cat model fails:

provide a controlled fallback/error rather than silently crashing the app.

---

# 63. Audio

Start with a lightweight audio implementation.

Required concepts:

```txt
BGM
SFX
mute
volume
```

Do not add a large audio engine unless necessary.

A small browser-audio manager is sufficient initially.

---

# 64. Audio Manager

Centralize audio behavior.

Conceptually:

```ts
audio.playSfx("step");
audio.playSfx("pickup");
audio.playSfx("collision");

audio.playBgm("day");
audio.setMuted(true);
```

Do not instantiate random audio objects across components.

---

# 65. Audio Settings

Persist:

- BGM enabled,
- SFX enabled,
- volume where implemented.

The visual game must remain complete with all audio disabled.

---

# 66. Persistence

Use local persistence only.

No backend database for MVP.

Persist:

- completed level IDs,
- unlocked node IDs,
- cosmetics,
- selected cosmetic,
- day/night theme,
- audio settings,
- accessibility preferences where applicable.

---

# 67. Zustand Persistence

`zustand/middleware` persistence is acceptable.

Keep persisted state separate from ephemeral execution state.

Persist:

```txt
progress
settings
```

Do not persist:

```txt
active command
partial animation
current collision effect
temporary runtime refs
```

---

# 68. Persistence Versioning

Provide a simple persistence version.

Example:

```ts
{
  version: 1,
  completedLevelIds: [...]
}
```

If the schema changes later, migration should be possible.

Do not assume localStorage data will always match the newest code.

---

# 69. Reset Progress

Provide a deliberate development/debug path to reset local progress.

User-facing reset may exist in settings if useful.

Avoid requiring developers to manually inspect localStorage during normal
testing.

---

# 70. Theme

Day/Night theme should affect both:

- DOM UI,
- Three.js scene.

Use one logical theme value.

Example:

```ts
type ThemeMode = "day" | "night";
```

Do not create independent world-theme and UI-theme state unless a future feature
requires it.

---

# 71. Theme Rendering

DOM:

```txt
CSS variables / Tailwind classes
```

Three.js:

```txt
lighting
background
material tokens
environment values
```

Both derive from the same semantic theme.

---

# 72. Design Tokens

Prefer semantic tokens.

Example:

```css
--color-panel-primary
--color-panel-secondary
--color-text
--color-left
--color-right
```

Avoid scattering arbitrary hex values through components.

The exact palette belongs to `design.md`.

---

# 73. Semantic Direction Colors

Cyan/left and orange/right are semantic gameplay colors.

Keep them separate from general theme colors.

They must remain recognizable in:

- Day,
- Night,
- hover,
- active,
- reduced-motion states.

---

# 74. Responsive Architecture

Do not duplicate gameplay logic for mobile.

Use the same:

- engine,
- program,
- levels,
- simulation.

Only presentation changes.

Example:

```txt
desktop:
board + side/bottom controls

mobile:
board
↓
program
↓
commands
```

---

# 75. Routing

Keep routing simple.

Possible screens:

```txt
/
title

/expedition
map

/play/:levelId
puzzle
```

Do not add unnecessary page architecture.

A lightweight router may be used if it simplifies navigation.

---

# 76. URL State

Do not encode the entire program/game state into the URL.

Level identity may appear in route state.

Runtime simulation stays in application state.

---

# 77. Error Boundaries

Use reasonable error boundaries around large rendering areas when appropriate.

Especially protect against:

- WebGL scene failure,
- asset-loading failure.

Do not display raw stack traces to child-facing UI.

Developer console may retain diagnostics.

---

# 78. WebGL Fallback

The primary gameplay requires WebGL.

If WebGL cannot initialize:

- show a concise friendly unsupported-state message,
- do not render a broken blank canvas.

A full non-WebGL gameplay implementation is not required for MVP.

---

# 79. Testing Philosophy

Invest testing effort primarily in deterministic game logic.

The engine is much easier and more valuable to test than every visual detail.

Priority:

```txt
engine logic
> interpreter
> progression
> key UI flows
> visual micro-details
```

---

# 80. Vitest

Use Vitest for unit tests.

At minimum test:

### Movement

```txt
forward north
forward east
forward south
forward west
```

### Turning

```txt
left rotation
right rotation
4 right turns = original orientation
4 left turns = original orientation
```

### Collision

```txt
blocked tile
void
outside board
```

### Collectibles

```txt
enter fish tile
fish becomes collected
duplicate collection does not occur
```

### Objectives

```txt
collect-all
collect-all-and-reach-goal
```

### Interpreter

```txt
sequential commands
loop execution
step progression
execution completion
```

### Reset

```txt
state returns to exact initial configuration
```

---

# 81. Engine Test Style

Prefer tests such as:

```ts
expect(
  moveForward(
    { position: { x: 0, z: 0 }, orientation: "east" },
    level,
  )
).toEqual(...)
```

The tests should not require:

- React rendering,
- DOM,
- Canvas,
- WebGL.

---

# 82. Determinism Test

Important invariant:

```txt
same level
+
same program
=
same result
```

Add tests where useful to prevent accidental nondeterministic behavior.

---

# 83. Playwright

Use Playwright for a small number of high-value browser flows.

Examples:

```txt
open title screen
→ Start
→ expedition loads
```

```txt
open simple level
→ add Forward
→ Run
→ fish collected
→ stage completes
```

```txt
mobile viewport
→ controls remain accessible
```

Do not try to test every visual animation through Playwright.

With Bun, invoke Vitest through the project script (bun run test) so Bun does not select its own test runner.

---

# 84. Three.js Testing

Do not overinvest in unit-testing Three.js rendering details.

Test rendering through:

- manual inspection,
- focused browser smoke tests,
- screenshots where useful.

Prioritize logical correctness.

---

# 85. TypeScript

Keep strict typing enabled.

Avoid using:

```ts
any
```

as a shortcut around domain-model problems.

Prefer:

- explicit unions,
- discriminated commands,
- stable domain types.

---

# 86. Domain Types

Centralize important domain definitions.

Examples:

```txt
Position
Orientation
Command
Program
LevelDefinition
GameState
Objective
GameEvent
ExpeditionNode
```

Do not redefine slightly different variants in separate components.

---

# 87. Components

Components should have focused responsibilities.

Good:

```txt
<CommandBlock />
<ProgramTray />
<RunControls />
<Board />
<Cat />
```

Avoid giant:

```txt
<GameEverything />
```

components containing:

- state,
- rendering,
- engine logic,
- UI,
- audio,
- persistence.

---

# 88. Hooks

Use hooks for reusable React integration concerns.

Examples:

```txt
useExecutionController
useGameAudio
useTheme
useLevel
```

Do not move pure game logic into hooks merely because React is available.

Pure logic belongs in `game/`.

---

# 89. No Premature Generic Framework

Do not create highly generic systems for hypothetical future games.

Avoid:

```txt
UniversalEntitySystem
GenericGameFramework
DynamicRuleEngine
PluginArchitecture
```

unless current product requirements genuinely demand them.

Build Kotak-Katik.

---

# 90. Performance Goals

The game should feel responsive on ordinary modern phones and laptops.

Prioritize:

- stable interaction,
- fast initial load,
- smooth simple animations,
- reasonable memory use.

Do not chase extreme rendering complexity.

---

# 91. Scene Complexity

Prefer:

- low-poly geometry,
- small boards,
- limited dynamic objects,
- few real-time lights,
- controlled shadows.

The visual style already supports performance-friendly design.

---

# 92. Geometry Reuse

Reuse geometry/materials where objects repeat.

Examples:

- board tiles,
- repeated trees,
- repeated rocks.

Instancing may be used when it provides meaningful benefit.

Do not prematurely optimize tiny scenes.

---

# 93. Shadows

Use shadows selectively.

Primary candidates:

- cat,
- major props,
- board.

Do not enable expensive high-resolution shadows for every object.

Visual softness matters more than physically perfect shadows.

---

# 94. Device Pixel Ratio

Cap rendering pixel ratio where appropriate.

Do not blindly render at extremely high mobile DPR.

Example strategy:

```txt
min(devicePixelRatio, reasonable cap)
```

Tune based on visual testing.

---

# 95. Asset Compression

Optimize assets before final submission if bundle size becomes meaningful.

Possible optimizations:

- GLB compression,
- geometry simplification,
- texture compression,
- image conversion,
- audio compression.

Do not introduce complicated optimization tooling before measuring actual need.

---

# 96. No Draco by Default

Do not add Draco immediately.

First inspect:

- model sizes,
- network transfer,
- initial load.

Add compression only if it provides clear benefit without complicating the
pipeline unnecessarily.

---

# 97. Images

Prefer modern web image formats where appropriate.

Examples:

```txt
WebP
AVIF
```

Do not ship unnecessarily large PNG/JPEG assets.

---

# 98. Audio Files

Compress audio appropriately.

BGM should not dominate page weight.

Prefer short looping tracks and compact SFX.

---

# 99. BISINDO Video

Follow `accessibility.md`.

Technically:

- lazy-load where possible,
- do not block gameplay,
- preserve sign clarity,
- avoid excessive source resolution,
- use browser-friendly formats.

---

# 100. Lazy Loading

Lazy-load screens or heavy assets where useful.

Potential:

```txt
Expedition scene
Puzzle scene
BISINDO clips
cosmetics
noncritical environment themes
```

Do not lazy-load tiny components purely for architectural cleverness.

---

# 101. Code Splitting

Use Vite/React code splitting where it materially helps.

Do not aggressively fragment the application into dozens of tiny chunks.

Keep debugging straightforward.

---

# 102. Deployment

Deploy to **Vercel**.

The production application should build from:

```bash
bun run build
```

Ensure SPA routing works correctly if routes are used.

---

# 103. Environment Variables

Avoid requiring secrets for the core application.

The MVP should ideally build without external API keys.

If environment variables become necessary:

- document them,
- provide `.env.example`,
- never commit actual secrets.

---

# 104. No Runtime AI Dependency

Kotak-Katik does not require an LLM/API call during gameplay.

Do not introduce:

- OpenAI,
- Gemini,
- Claude,
- AI tutor APIs,

into the runtime MVP without explicit product approval.

The competition may involve AI-assisted development.

The finished product does not therefore require AI inference.

---

# 105. Offline Tolerance

Full offline/PWA support is not required.

However, avoid unnecessary runtime dependencies on external services.

Core game state should be local.

Once assets are loaded, normal puzzle execution should not depend on network
requests.

---

# 106. Third-Party CDN

Prefer bundling application dependencies normally through the build.

Avoid unnecessary runtime CDN dependencies that can break the game if an
external service fails.

---

# 107. Logging

Developer logging is allowed during development.

Avoid leaving noisy debug logs in production.

Do not log every frame or every render.

Useful development logs may include:

```txt
level loaded
execution started
collision detected
stage completed
```

Remove or gate verbose tracing before submission.

---

# 108. Error Handling

Handle expected failures explicitly.

Examples:

- invalid level,
- missing asset,
- localStorage parse failure,
- unsupported command.

Do not silently swallow important errors.

For child-facing UI, show a simple recovery path.

For developers, preserve useful diagnostics.

---

# 109. LocalStorage Failure

If localStorage is unavailable or corrupted:

- game should still run,
- fall back to temporary in-memory state,
- avoid crashing the application.

Persistence is useful.

It is not required for one puzzle session to function.

---

# 110. Accessibility Preferences

Where applicable, initialize motion preference from:

```css
prefers-reduced-motion
```

Allow product settings to respect or override appropriately.

Do not hardcode full animation for all users.

---

# 111. Development Workflow

Before implementing a feature:

1. identify the domain rule,
2. implement/test engine behavior if required,
3. expose state/action,
4. build UI,
5. build 3D presentation,
6. verify audio independence,
7. test responsive behavior.

Do not begin from animation and reverse-engineer the game state afterward.

---

# 112. Gameplay Feature Order

For a new gameplay mechanic, prefer:

```txt
types
↓
pure logic
↓
unit tests
↓
store integration
↓
UI controls
↓
scene animation
↓
polish
```

This keeps visual complexity from hiding logical bugs.

---

# 113. Build Verification

Before meaningful commits or submission:

```bash
bun run build
```

must succeed.

Also run relevant tests.

Do not consider:

```txt
works in my dev tab
```

sufficient verification.

---

# 114. Linting / Formatting

Use lightweight linting/formatting appropriate to the project.

Do not spend significant competition time tuning stylistic tooling.

Consistency matters.

Tooling complexity does not earn product value.

---

# 115. Commit Discipline

Commits should correspond to real milestones.

Examples:

```txt
feat: implement turtle movement engine
feat: add live command interpreter
feat: add single-step execution
feat: add fish collection objective
feat: render isometric board with r3f
feat: add command drag reordering
fix: stop execution on invalid movement
```

Avoid giant undifferentiated commits.

---

# 116. No History Rewriting

Competition development history must remain auditable.

Do not:

- force-push to clean history,
- fabricate earlier commits,
- squash everything merely for appearance,
- alter timestamps.

Correct mistakes with new commits.

---

# 117. AI Agent Technical Rules

Agents working on the project must:

1. inspect current architecture before editing,
2. use existing domain types,
3. preserve engine/render separation,
4. avoid unnecessary dependencies,
5. run relevant tests,
6. build successfully,
7. report unresolved technical risk.

Agents must not silently rewrite architecture.

---

# 118. Dependency Rule

Before adding a package ask:

> Is implementing this ourselves more complex or risky than the dependency?

Then:

> Does the package solve an actual current requirement?

Good dependency:

```txt
@dnd-kit/react
```

because drag/reorder interaction is nontrivial.

Bad dependency:

```txt
large game engine abstraction
```

for functionality already handled by Three.js/R3F.

---

# 119. Three.js Escape Hatch

React Three Fiber is preferred.

Direct Three.js APIs are allowed when R3F does not provide a clean solution.

Do not force everything into declarative React if an imperative Three.js call is
clearly simpler.

But keep the escape hatch localized.

---

# 120. Manual 3D Skill Assumption

Do not write instructions that assume the developer can:

- model,
- rig,
- UV unwrap,
- weight paint,
- animate professionally in 3D software.

The developer may make visual/art-direction decisions.

Technical asset workflows must remain reproducible without specialist 3D
authoring knowledge.

---

# 121. Visual Judgment vs Technical Asset Work

The developer may reasonably tune:

- composition,
- camera framing,
- palette,
- lighting taste,
- prop placement,
- animation pacing.

Do not confuse these design decisions with manual 3D production requirements.

Prefer exposing these choices through code/configuration.

---

# 122. Configurable Visual Values

Where practical, centralize tuneable visual constants.

Examples:

```ts
export const sceneConfig = {
  tileSize: 1,
  movementDuration: 0.35,
  rotationDuration: 0.25,
};
```

and theme/light configuration.

This makes visual iteration possible without editing complex mesh internals.

---

# 123. Do Not Magic-Number Gameplay Logic

Important gameplay constants should be named.

Bad:

```ts
rotation += 1.5708;
```

Better:

```ts
const QUARTER_TURN = Math.PI / 2;
```

Even better:

logical orientation transitions where rendering converts orientation to radians.

---

# 124. Source of Truth Hierarchy

For technical implementation:

```txt
gameplay.md
    ↓
technical.md
    ↓
typed game engine
    ↓
Zustand
    ↓
UI / rendering
```

If UI behavior conflicts with game-engine rules, fix the UI.

Do not alter engine semantics to accommodate an accidental animation behavior.

---

# 125. Technical Definition of Done

A gameplay feature is technically complete when:

- domain types are clear,
- logical behavior is deterministic,
- engine behavior is tested,
- Run and Step share behavior,
- state and rendering remain separated,
- UI works on pointer/touch where required,
- visual state follows engine state,
- mute does not break comprehension,
- reset works,
- build succeeds,
- no obvious console/runtime error remains.

---

# 126. Architecture Smell Checklist

Stop and reconsider if any of these appear:

```txt
mesh position used as game position
```

```txt
React component decides collision rules
```

```txt
Run and Step use different execution code
```

```txt
setTimeout scattered across gameplay components
```

```txt
Three.js objects stored throughout Zustand
```

```txt
level rules hard-coded into screen components
```

```txt
command order inferred from DOM
```

```txt
manual Blender repair required for routine asset integration
```

```txt
database introduced for local progress
```

```txt
large dependency added for one trivial helper
```

These indicate architectural drift.

---

# 127. Technical North Star

Kotak-Katik should have a small, deterministic core:

```txt
LEVEL
  +
PROGRAM
  ↓
ENGINE
  ↓
STATE CHANGE
  ↓
VISUAL RESULT
```

Everything else exists to make that relationship:

- readable,
- responsive,
- delightful,
- accessible.

Keep the engine boring.

Keep rendering replaceable.

Keep level data editable.

Keep the build simple.

Spend complexity on the experience, not the architecture.

---

# 128. Current Official References

These references were checked on 2026-10-07. Recheck them when creating the project or updating a dependency. This document describes architecture choices, not package versions.

- Bun: https://bun.com/docs
- Vite: https://vite.dev/guide/
- React: https://react.dev/learn
- Zustand: https://github.com/pmndrs/zustand
- React Three Fiber compatibility and installation: https://r3f.docs.pmnd.rs/getting-started/installation
- Drei: https://drei.docs.pmnd.rs/getting-started/introduction
- dnd-kit React adapter: https://dndkit.com/react/quickstart/
- Tailwind CSS with Vite: https://tailwindcss.com/docs/installation/using-vite
- Motion for React: https://motion.dev/docs/react-installation
- Vitest: https://vitest.dev/guide/
- Playwright: https://playwright.dev/docs/intro
- Vercel with Vite: https://vercel.com/docs/frameworks/frontend/vite
