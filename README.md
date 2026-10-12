# Kotak-Katik

A deaf-first visual computational-thinking game for elementary learners, built for the M-One Telkomsel Coding Competition 2026.

## M2B: Visual learning

`/` starts a fixed 16-stage curriculum: movement, sequencing, relative turns, combined paths, repetition, debugging, then mixed application. Short **Lihat contoh** demonstrations use the actual game, highlighting a command before the cat acts and holding its result. **Lewati** exits an example without awarding completion; **Ulang contoh** replays it. Guided tasks use prepared programs, insertion cues and contextual **Petunjuk**. Independent tasks fade procedural guidance while retaining orientation and execution feedback. **Lanjut** opens the next stage after real completion, or after explicitly skipping a demonstration. Progress lasts for the current session; refreshing starts the route again.

Preview an authored stage with `/?level=m2-right-together` or any stable ID in [M2A's curriculum report](docs/M2_WORKTREE_REPORT.md). The original Forward-only kernel remains at `/?fixture=kernel`. Open `/?fixture=turning` for Forward/Left/Right, or `/?fixture=loops` for those commands plus editable **Repeat 2×, 3×, 4×**. Explicit unknown level/fixture URLs retain the original fallback behavior. The scene retains the curated animated cat, enlarged default clownfish, and optional trout asset.

Tap the shared palette to add commands at the selected `+`. Tap a program block to select it: the palette replaces a primitive, while contextual controls insert before/after, reorder, or delete. Tap a Repeat header to change its count; its inner `+` selects the primitive-only body palette. Escape returns to the end of the outer program. The horizontal strip scrolls to the insertion target and active command without moving the page.

The action pair is Play and Step. Play runs the program and becomes Stop during execution; after failure or completion, Play starts the retained program from the original board. Touching a command card or editing the program resets the board and execution cursor while keeping the program. One Step advances exactly one primitive, including inside Repeat. The active block and numbered loop iteration stay visible. Hapus semua restores an empty `initialProgram`; stages with prepared programs show a reset arrow labeled Ulang (accessible name: Mulai ulang) to restore the starter and its hints. Berhenti cancels Run and preserves the result for inspection/Step continuation. Invalid movement keeps the cat in place and identifies the exact failing block. Debugging cues appear only after an observed attempt; Periksa satu per satu returns the cat to its start without changing the program. Completion is awarded only when a valid program ends with every fish collected.

Nested loops, obstacle mechanics, drag-and-drop, expedition, persistence, audio, and themes are deferred. See [M1 architecture](docs/M1_ARCHITECTURE.md) for interpreter contracts, [M1.1 interface](docs/M1_1_INTERFACE.md) for the retained GUI, and [M2B report](docs/M2B_VISUAL_LEARNING.md) for tutorial contracts and verification.

## Run and verify

```sh
bun install --frozen-lockfile
bun run dev
bun run test
bun run build
bun x playwright install chromium
bun run test:e2e
# Separate preview port when 4173 is occupied:
bun run test:e2e --config playwright.curriculum.config.ts
```

Browser smoke tests use the production build at port 4173. Rebuild after source changes. Exact package versions are recorded in `package.json` and `bun.lock`. No API keys are required.

## Boundaries

`src/game/` owns typed level/program data, authored lesson metadata, movement/turning, collection, validation, reset, and a live execution cursor. `src/stores/` owns command editing, 400 ms Run pacing, and the tutorial controller. Tutorials call the same public Step/Run/edit/reset actions as the learner. Run/Step share one pure primitive executor. `src/components/` edits/observes logical state. `src/scene/` renders that state with R3F; mesh transforms never decide game rules. Demand rendering sleeps when the scene settles. Reduced motion skips position/yaw interpolation and keeps static tutorial/execution cues.

## Design decisions

Following `.agents/design.md`: pastel toy diorama, ENERGY 2 / RHYTHM 2 / MOTION 2. The stable orthographic board is the focal point. One cream workbench keeps program and controls together; mobile stacks them. Chunky command edges repeat tile thickness and signal pressability. Fredoka warms brief headings; Inter keeps controls readable. Curated GLBs provide the cat/fish. Face and attached arrows show forward/left/right; thick command outlines and iteration text preserve execution/error state without audio. The 240 ms cat transition shows cause and effect before the next 400 ms action.

See [attribution](docs/ATTRIBUTIONS.md). No BISINDO media is integrated; validated material can later attach to level learning metadata without changing the engine.

## Current limits

WebGL is required. The JavaScript renderer bundle is about 344 kB gzip and triggers Vite's size advisory. Learner comprehension and physical-device behavior are not yet validated.
