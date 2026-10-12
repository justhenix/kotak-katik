# M2B: Visual Learning Experience

Date: 2026-10-12 (Asia/Jakarta).
Branch: `henix/m2b-visual-learning`.
Starting checkpoint: `d9cd881`.

## Integration safety

The supplied worktree started clean at detached HEAD `d9cd881`. A new feature branch was created before edits. `git merge-base --is-ancestor b112789 HEAD` confirms M2A's committed curriculum is already part of this checkpoint. Its parent is the GUI checkpoint `0deab43`; the final GUI refinement `d9cd881` follows it. No cherry-pick, overwrite, rebase, merge, or history rewrite is needed.

The M2A worktree (`c10b`, branch `henix/m2a-educational-curriculum`) and primary checkout were inspected read-only and initially clean. All changes are confined to this worktree. Existing M2A IDs, boards, prerequisites, hints, command unlocks, constraints, starter programs, test-only solution witnesses and fixture selector are retained. Existing M1.1 assets, orthographic camera, dock hierarchy, editor actions, relative movement, simulation and 400 ms Run pacing are retained. No dependencies or asset files were added.

Baseline on the integrated checkpoint: 197 unit tests passed; TypeScript/production build passed. This worktree needed `bun install --frozen-lockfile` before those commands could run. The lockfile was not changed.

## Learning behavior

- `/` enters the first authored lesson immediately. Explicit `?level=<id>` previews and `?fixture=kernel|turning|loops` remain available; explicit unknown IDs retain M2A's fallback. Linear advancement implements only the transition needed for this learning loop, with no menu, map, persistence, account or progression economy.
- I Do: **Lihat contoh** starts a brief, interruptible example. A command/control highlight precedes the real action, then the result is held before advancing. The compact trace connects command, the actual cat on the board, and result. Examples are opt-in; debugging never autoplays or identifies a faulty turn on entry.
- We Do: authored prepared programs remain editable. Empty insertion targets show **Di sini** when cued. On-request hints outline the relevant slot, Repeat header/count selector, board region or character-relative turn. Cues disappear when filled, repaired, completed or no longer at the authored pose. Ordinary editing remains available for alternate legal solutions.
- You Do: authored independent stages have an empty tray (except deliberate debugging starters), no procedural hint highlights and no Petunjuk button. Orientation, active command, loop iteration, collision and fish cues remain visible.
- Forward alone is available for the first four stages; Left appears at stage 5, Right at stage 6, Repeat at stage 10. The interpreter remains authoritative for legal commands and program capacity.
- **Lanjut** appears after genuine completion. Explicitly skipping a demonstration also permits the next practice stage, without awarding fish or completion. Guided and independent puzzles cannot be skipped. The last puzzle shows **Semua tahap selesai!** in the same dock.
- **Lewati** cancels pending tutorial and Run actions and restores the demonstration starter. **Ulang contoh** restores the authored example before replay. The editor is locked only while the demonstration plays; skip stays available.
- **Ulang** uses a reset arrow and accessible name **Mulai ulang** for nonempty starters. It restores both the authored program and lesson cues. Empty-starter stages retain **Hapus semua**. This resolves the earlier misleading trash-only reset for prepared programs.

## Debugging and feedback

The debugging demonstration uses authored Run, restart, Step, Step, replace, Run actions. It first exposes the wrong-turn collision, preserves the board/program evidence, restarts for inspection, highlights the actual turn, shows the editor's replacement palette, changes that one command and retries. Repairs are validated to occur after observing a fault. This example has authored instructional data; no test-only solution witness is imported by the application.

For the child's attempts, `after-attempt` hints appear only after a terminal execution. No repair is automatic. **Periksa satu per satu** resets the cat/cursor, retains the child's program and revealed evidence, then focuses Step. Selecting/editing a block retains M1.1's reset-to-start behavior. A failing Repeat can collect all fish without completing; the failing command, iteration and blocked-edge X remain visible. The next lesson stays unavailable until the program ends validly.

No sound is loaded or required. Static outlines, directional arrows, iteration numbers, result icons and concise Indonesian text carry the information. No BISINDO signs were invented; the existing future validated-media integration boundary is preserved.

## Architecture and authoring

`LearningMetadata.demonstration` stores typed instructional actions alongside M2A's visual hints. `validateDemonstration` executes them with the real pure interpreter and rejects missing, unfinished or prematurely repaired examples. M2A's validation order and original constraints remain intact.

`createLessonStore` is a reusable controller attached to a game store. It tracks reveal IDs, observed attempts, current demonstration action/path and presentation phase. It schedules 700 ms command preview, 350 ms action settling and 1000 ms result inspection. Run retains the existing game timer and resumes the tutorial through terminal-state observation. These are presentation delays, not simulation rules. Skip, reset, replay, level change and disposal cancel obsolete work. React's development Strict Mode cleanup cancels work without destroying the singleton controller subscription.

`gameStore.loadLevel` validates, cancels execution, deep-clones the new starter and initializes the new simulation. Store actions read the current level instead of retaining a closure over the first one. `ProgramTray` is keyed by level ID so editing scope and selection cannot leak between lessons. Its tutorial selection state follows the authored replacement action; it does not execute gameplay. Scene cues only render metadata and current state.

`LessonScaffold`, `ProgramTray`, `CommandPalette`, `RunControls` and `LearningCues` consume the same metadata/controller. There are no level-ID-specific tutorial branches. Independent fading follows authored phases and empty hint arrays.

## Design rationale and audit

Anti-Slop DURING, inherited **ENERGY 2 / RHYTHM 2 / MOTION 2**. The approved pastel diorama and interlocking puzzle blocks remain the identity. A short row in the existing cream dock keeps the board visible; no modal tutorial, extra panel hierarchy or long paragraphs are introduced. Navy static outlines guide attention, while cyan Left and orange Right retain their directional meaning. Eye, Step, reset, edit and arrow icons depict real actions. Existing Fredoka/Inter typography and palette are reused. Purposeful cat movement explains commands; the tutorial introduces no looping decorative animation. Reduced motion retains the timing and every static signal.

Native buttons/selects preserve keyboard/touch operation. New controls have at least 44 px targets, visible focus and wrapping labels. Lesson transitions focus the new instruction without scrolling the board away. The program keeps contained horizontal scrolling; the page must fit at mobile widths and 200% text size.

In curriculum lessons, selecting a Repeat header in a full outer tray shows its count and enabled editing actions without the unavailable add-command palette or disabled toolbar actions. This keeps the guided count task compact on mobile. Selecting its inner insertion point returns the shared body palette. Engineering fixtures retain the finalized M1.1 presentation.

## Verification

Final coverage: **219 unit tests and all 78 distinct browser cases have successful results**, with browser coverage completed across a full run and the targeted draw-rest rerun described below. New tests exercise the real rendered production editor with desktop clicks, mobile taps and keyboard controls. Coverage includes the first-time entry flow, progressive commands, replay/skip/cancellation, relative turns, Repeat iteration/count/body editing, debugging observation/inspection/repair, independent overrun, final mixed puzzle, reduced motion and 320 px / 200% text size. Existing curriculum tests still build every test-only witness, compare Step with Run and restore starters.

| Check | Executed evidence | Result |
| --- | --- | --- |
| Locked dependencies | `bun install --frozen-lockfile` | Passed; package/lockfile unchanged. |
| Unit tests | `bun run test` | 219 passed across 9 files. |
| TypeScript / production | `bun run build`; `bun x tsc --noEmit` after the test timing fix | Passed. Final JS: 1247.71 kB, 344.12 kB gzip; existing Vite size advisory remains. |
| Complete browser run | `bun run test:e2e --config playwright.curriculum.config.ts` | 77 passed, 1 old desktop draw-rest timing assertion failed; 21.1 minutes. This run started before that test was corrected. All 12 M2B cases passed, as did all 36 M2A curriculum cases. |
| Corrected draw-rest check | `bun run test:e2e e2e/assets.spec.ts --grep 'demand rendering' --output .verification/demand-results` | Both desktop and mobile passed, 20.3 seconds. All 78 distinct cases therefore have a successful final result; no application failure remains unresolved. The full suite was not rerun a further time after this isolated test-only change. |
| Development Strict Mode | `.verification/dev-smoke.ts`, against the Vite development server | Demonstration, next lesson, guided Step and page-error check passed. |
| Responsive / visual review | Final `.verification/m2b-*` captures, desktop 1440×1000, mobile 390×844 and 320 px / 200% text size | Visually inspected beginner, relative direction, Repeat count/body, debugging evidence, completion and reduced-motion layouts. No page overflow; program scrolling remains contained. |
| Integration / whitespace | `git diff --check`; read-only worktree status and ancestry checks | Passed. Main and M2A worktrees remain unchanged. No interpreter, simulation, cat/fish asset, dependency or curated-journal diff. |

Frontend audit: **PASS** for inherited design direction and meaningful visual cues (documented rationale and rendered review); **PASS** for functional controls (real mouse/touch/keyboard browser flows); **PASS** for responsive/accessibility behavior (44 px targets, focus, reduced motion, no page overflow and 200% text size); **PASS** for evidence integrity (real completion, no fabricated child-validation claim, unchanged assets/prompt journal). New text contrasts measured 9.48:1 navy/cream, 10.37:1 ink/cream, 7.45:1 white/next-button green and 9.00:1 reset ink/surface. The board's navy region outlines measure 5.85:1 against grass. Normal tested flows report no page or console errors; deliberately missing models retain the tested recovery screen.

Initial learning browser run: 10/12 passed. Both failures retained the old canvas width after a viewport change (1392 px from desktop; 374 px from mobile). An initial standalone check started directly at 320 px and passed; adding a wait to the test did not resolve the resize-from-desktop failure. Reproducing that exact transition exposed the cause: the world's implicit CSS grid column retained the canvas's old intrinsic width. The world now uses an explicit `minmax(0, 1fr)` column and a zero minimum width on the board container. A development-browser reproduction confirms both canvas and document shrink correctly to 304 and 320 px respectively. The layout assertion still waits for asynchronous canvas resize; no overflow clipping or weakened limit was added. The initial full-suite run was stopped after reproducing this failure so the final build could be tested from scratch. Visual inspection also prompted the clearer starter-reset icon/label, visible demonstration replacement palette and compact count controls before the final run.

One initial unit failure was a diagnostic-order conflict: the new demonstration validator ran before M2A's unsolved-starter check. Validation now preserves the original checks first, then validates the instructional actions. All 219 unit tests subsequently passed.

A two-worker browser attempt increased interaction times substantially and exposed a demand-render assertion and a short-demo skip timeout. It was stopped and the repository's one-worker configuration restored. Skip also remains available during the example's result phase, even after the interpreter has collected the final fish. No application pacing was changed to accommodate the concurrency attempt.

The demand-render assertion also reproduced with one worker. A frame-count probe recorded the finite idle clip increasing to exactly 1623 draw calls, then staying unchanged across ten consecutive samples. The original fixed 1300 ms sleep sampled 1574 calls one frame before rest; slow WebGL stretches the finite clip because its frame delta is clamped. The regression test now waits for a quiet 300 ms window (bounded to 10 seconds), then retains the separate assertion that draw calls remain identical. It performs the same check after reduced motion. This tests actual demand-render rest without changing the renderer, animation or simulation.

## Limits

Automated and visual checks establish working interactions, not measured child comprehension. SDLB-B teacher/learner review and physical touch-device validation remain necessary. Touch here is browser emulation. Refreshing resets the session; saving/resuming progression belongs to later work. The existing WebGL requirement and Vite renderer-size advisory remain. No push or merge to main is authorized by this delivery.
