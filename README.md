# Kotak-Katik

A deaf-first visual computational-thinking game for elementary learners, built for the M-One Telkomsel Coding Competition 2026.

## M1: Core mechanics

The original Forward-only kernel remains at `/`. Open `/?fixture=turning` for Forward/Left/Right, or `/?fixture=loops` for those commands plus editable **Repeat 2×, 3×, 4×**. These small deterministic fixtures exercise mechanics; they are not the final curriculum. The scene retains the curated animated cat, enlarged default clownfish, and optional trout asset.

Tap commands to add/remove them. Use previous/next buttons to reorder top-level blocks or Repeat bodies; each Repeat has its own primitive palette and count selector. Run and Retry start from the original board with the existing program. One Step advances exactly one primitive, including inside Repeat. The active block and loop iteration stay visible. Editing after Step resets the board. Hapus semua restores `initialProgram`. Berhenti cancels Run and preserves the result for inspection/Step continuation. Invalid movement keeps the cat in place and identifies the exact failing block. Completion is awarded only when a valid program ends with every fish collected.

Nested loops, obstacle mechanics, drag-and-drop, expedition, curriculum, onboarding, persistence, audio, and themes are deferred. See [M1 architecture](docs/M1_ARCHITECTURE.md) for interpreter/editor contracts and fixture URLs.

## Run and verify

```sh
bun install --frozen-lockfile
bun run dev
bun run test
bun run build
bun x playwright install chromium
bun run test:e2e
```

Browser smoke tests use the production build at port 4173. Rebuild after source changes. Exact package versions are recorded in `package.json` and `bun.lock`. No API keys are required.

## Boundaries

`src/game/` owns typed level/program data, movement/turning, collection, validation, reset, and a live execution cursor. `src/stores/` owns command editing and 400 ms Run pacing, including a visible reset before replay and timer cancellation. Run/Step share one pure primitive executor. `src/components/` edits/observes logical state. `src/scene/` renders that state with R3F; mesh transforms never decide game rules. Demand rendering sleeps when the scene settles. Reduced motion skips position/yaw interpolation.

## Design decisions

Following `.agents/design.md`: pastel toy diorama, ENERGY 2 / RHYTHM 2 / MOTION 2. The stable orthographic board is the focal point. One cream workbench keeps program and controls together; mobile stacks them. Chunky command edges repeat tile thickness and signal pressability. Fredoka warms brief headings; Inter keeps controls readable. Curated GLBs provide the cat/fish. Face and attached arrows show forward/left/right; thick command outlines and iteration text preserve execution/error state without audio. The 240 ms cat transition shows cause and effect before the next 400 ms action.

See [attribution](docs/ATTRIBUTIONS.md). No BISINDO media is integrated; validated material can later attach to level learning metadata without changing the engine.

## Current limits

WebGL is required. The JavaScript renderer bundle is about 332 kB gzip and triggers Vite's size advisory. This is an architecture milestone; learner comprehension and physical-device behavior are not yet validated.
