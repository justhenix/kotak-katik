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

## M3.4: MVP release gate passed

- Added a real new-player browser journey through all 16 stages using actual demonstrations and editor actions, then refresh/resume, final completion, map and replay. The targeted journey passed on desktop and touch mobile.
- Added 1440×900, 390×844 and 320×740 checks, 200% text, reduced motion, keyboard navigation, reset focus/Escape, and leaving a running puzzle.
- Initial targeted release run: five passed, one failed. The failed keyboard test exposed focus loss when reset confirmation replaces its button. Added focus handoff and verified its desktop/mobile repair.
- Visual inspection at 320 pixels then exposed the focused cancel button below the visible screen. Removed suppressed focus scrolling for reset/navigation and added a viewport assertion. Both repair checks passed. An in-progress full run (17 completed checks, no failures) was stopped to restart on this correction.
- Final production build passed (349.35 kB gzip renderer advisory); `bun run test`: 239 passed across ten files; `bun run test:e2e`: 98 passed across serial desktop/mobile projects (32.7 minutes), no skipped tests.
- The full run covers all authored stages on both viewports and an additional real all-16 player journey on each, including refresh/resume, final screen and replay. Tutorials, relative turns, Repeat Step/Run parity, visible failures, repair/reset, blocked assets, keyboard, zoom, reduced motion, touch and overflow checks passed.
- Strengthened the older mechanics test's final root visit to press Mulai and assert the first real board before checking its restricted palette. Its focused desktop/mobile rerun passed both checks (46.4 seconds), after the full final-app-code run. An auxiliary run initially hit the development server's occupied port; it was rerun on the standard free preview port. The subsequent build passed with the same runtime asset hash.
- The interpreter, simulation, 16 curriculum definitions, scene, game/lesson stores, dependencies and lockfile are unchanged from main.
- Inspected actual title/map/gameplay renders using Browser Computer Use at desktop, mobile and narrow widths. Operated Start, tutorial completion, guided placement/Run, expedition selection and reset confirmation. Read browser error logs in the inspected local flow: none.
- Contrast calculations: ink on locked nodes 9.10:1; ink on yellow 8.13:1; locked boundary 3.59:1; completed boundary 4.85:1; cream control boundary 5.08:1. Status uses text/icons in addition to color.
- Created/linked `justhenixs-projects/kotak-katik` with the existing GitHub repository. Frozen Bun install/Vite build/static output configured. Dry run excludes local environment files and development evidence. Production deployment and public browser checks passed after the local gate.
- Tracked-file credential-name/common-token-pattern checks found no matches. This is a focused check, not a comprehensive security audit. Local Vercel credentials/environment files are ignored and not recorded as evidence.

### Milestone commits

- M3.0: `186cd82`
- M3.1: `6c3fc6a`
- M3.2: `ad62072`
- M3.3: `4c22964`
- M3.4: `c4019a8` (release gate, pushed on the safe feature branch). Deployment evidence is recorded in the follow-up commit.

### Production release

- Game: [https://kotak-katik.vercel.app](https://kotak-katik.vercel.app).
- Vercel deployment: `dpl_En96JqGNhnCPzHXVHdDvrbA3kpe6`, production, READY. Cloud frozen install used Bun 1.4.1 and the unchanged lockfile; TypeScript/Vite build passed.
- Anonymous HTTP 200 with the game's actual title; the canonical production URL requires no login. Preview/deployment protection does not prevent public access through this URL.
- Deployed browser checks: ten passed (3.4 minutes) across desktop/mobile, covering start/demo exit/re-entry, persistent progress and reset, Forward/Step/Run/retry/collision, relative turns/all facings/reduced motion, and 3× Repeat Step/Run parity.
- Corrected the deployment test configuration to replace the local config's webServer instead of merging it. Inspected its resolved baseURL and empty webServer list, then ran two further desktop/mobile deployed entry checks: both passed (21.9 seconds), with no local server started. All twelve checks targeted the public HTTPS game.
- Browser Computer Use opened the public game, started the first tutorial and observed real collection/completion. Its inspected error log was empty.
- Local preview/dev helpers are temporary verification tools. Main integration proceeds after these release checks; no history rewriting or force push is used.

### Rendered evidence

The following captures come from actual production-build browser tests:

- [Desktop title, 1440×900](evidence/m3/m3-desktop-title-1440.png)
- [Mobile title, 390×844](evidence/m3/m3-mobile-title-390.png)
- [Unlocked expedition after two completed stages](evidence/m3/m3-desktop-unlocked.png)
- [Narrow map at 200% text](evidence/m3/m3-mobile-map-320-zoom.png)
- [Desktop completion after all 16 stages](evidence/m3/m3-desktop-final.png)
- [Mobile completion after all 16 stages](evidence/m3/m3-mobile-final.png)

The single-column route preserves teaching order and limits branching decisions. Raised cream/yellow controls reuse the game's tactile block vocabulary; Fredoka/Inter retain its existing heading and control roles.

### Submission actions and limits

- Repository visibility verified as private. The user must enable public visibility before judging.
- `PROMPT_JOURNAL.md` still contains five unselected placeholders. Only the user can select the actual prompts for curation; it remains untouched.
- Include the verified public game URL in the organizer submission and confirm its remaining required artifacts before the October 15, 2026 deadline (Asia/Jakarta).
- Physical devices and SDLB-B learner/teacher comprehension remain untested. Touch is browser-emulated. WebGL is required. No BISINDO material or audio dependency was added.
