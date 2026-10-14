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
