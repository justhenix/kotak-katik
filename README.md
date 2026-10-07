# Kotak-Katik

A deaf-first visual computational-thinking game for elementary learners, built for the M-One Telkomsel Coding Competition 2026.

## M0: Playable Kernel

One tiny isometric level, placeholder geometry, and **Forward only**. Tap Maju to append a command; tap a placed command to remove it. Run and Step use the same deterministic pure engine. Collection, completion, basic invalid-tile stop, Retry, and Reset Program are included.

Run and Retry start from the original board with the existing program. Step advances one primitive. Editing after Step resets the board. Hapus semua restores `initialProgram`. An invalid movement keeps the cat in place and identifies the command. Completion is awarded only when a valid program ends with the fish collected.

Left/Right, obstacle mechanics, loops, drag/reordering, expedition, onboarding, persistence, audio, themes, real Quaternius/Kenney assets, and deployment are deferred. This fixture proves the architecture; it is not the first curriculum lesson.

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

`src/game/` owns typed level data, movement, collection, reset, and interpretation. `src/stores/` owns command editing and 400 ms Run pacing, including a visible reset before replay. `src/components/` edits/observes logical state. `src/scene/` renders that state with R3F; mesh transforms never decide game rules. Demand rendering sleeps when the scene settles. Reduced motion skips position interpolation.

## Design decisions

Following `.agents/design.md`: pastel toy diorama, ENERGY 2 / RHYTHM 2 / MOTION 2. The stable orthographic board is the focal point. One cream workbench keeps program and controls together; mobile stacks them. Chunky command edges repeat tile thickness and signal pressability. Fredoka warms brief headings; Inter keeps controls readable. The original geometric cat/fish are placeholders. The face and ground arrow show forward; thick command outlines preserve execution/error state without audio. The 240 ms cat transition shows cause and effect before the next 400 ms action.

See [attribution](docs/ATTRIBUTIONS.md). No BISINDO media is integrated; validated material can later attach to level learning metadata without changing the engine.

## Current limits

WebGL is required. The JavaScript renderer bundle is about 315 kB gzip and triggers Vite's size advisory. This is an architecture milestone; learner comprehension and public deployment are not yet validated.
