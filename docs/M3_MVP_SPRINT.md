# M3 MVP completion sprint

Execution date: 2026-10-14, Asia/Jakarta. Scope: GitHub issue #1.

## M3.0: protected baseline

- Inspected root guidance, relevant product, pedagogy, gameplay, design, accessibility, technical and quality guidance, issue #1, source, tests, status and worktrees.
- Created `henix/m3-mvp-completion` from main `57c88d3` with the existing uncommitted M2B visual fixes and their original evidence preserved. The current user instruction authorizes this sprint and milestone commits.
- `bun install --frozen-lockfile`: passed, lockfile unchanged.
- `bun run test`: 227 passed across nine files.
- `bun run build`: passed, including TypeScript. Existing renderer size advisory remains (346.30 kB gzip).
- Baseline browser visual regression suite: six passed on desktop/mobile, including the previously pending full-tray counter Escape regression.

No curriculum, engine, asset, dependency or prompt journal changes in this checkpoint.

## M3.1: entry and navigation

- Added a concise Indonesian title screen, immediate Mulai action, expedition entry and puzzle exit.
- Puzzle exit stops Run, cancels lesson timers and restores authored state. Engineering preview URLs retain their original behavior.
- Production build passed. Four targeted browser checks passed on desktop/mobile: start, demo exit/re-entry, and the original demonstration/guided/independent journey.
- Operated the title's Mulai action in Browser Computer Use and inspected the actual title render. Full responsive inspection remains part of M3.4.
- Design follows the existing cream/yellow raised controls and Fredoka/Inter roles. No new dependencies or assets.

## M3.2: expedition and unlocking

- Added all 16 authored stages in exact order, with explicit locked, available, current and completed labels/icons, large controls and mobile reflow.
- Kept progress separate from simulation. Actual success unlocks the next node; explicit demonstration skip unlocks without completion. Preview URLs do not award journey progress.
- Added final journey screen with accurate completion count and replay/map navigation. A skipped example is never described as completed.
- `bun run test`: 230 passed. Production build passed.
- Four journey browser checks passed on desktop/mobile, covering order, locks, demo cancellation, skip, success, replay and deterministic re-entry.
- Browser Computer Use inspection confirmed desktop route readability. Remaining responsive, full-route and final-screen checks continue at the release gate.

## M3.3: local persistence

- Added version 1 localStorage records for completion, allowed unlocks and selected/resume stage only. Cat state, programs, execution, effects and timers remain ephemeral.
- Restore filters stale IDs/duplicates, guards the authored route, and recovers malformed or unsupported data. Denied reads/writes preserve session play and show a visual saving notice.
- Added a secondary Progres disclosure with an explicit reset confirmation, cancel and Escape support. Reset survives refresh.
- `bun run test`: 239 passed; production build passed.
- Ten journey browser tests passed on desktop/mobile: refresh/resume, replay, skip versus completion, reset/cancel, corrupt storage, blocked storage and preview isolation, plus entry/navigation checks.
- Inspected actual mobile title and expedition renders using Browser Computer Use. Labels/icons remain distinct without color; controls reflow vertically.
