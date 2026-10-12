# Development Log

Record meaningful work after verification and map it to real Git history. Use `Pending commit` until a commit exists. Never invent hashes or chronology.

### 2026-10-12 - M2B visual learning experience

**Prompt:** PROMPT_LOG entry / 2026-10-12 09:45.

**Integration**
- Started from clean finalized GUI checkpoint `d9cd881` in the supplied detached worktree. Created `henix/m2b-visual-learning` before changes.
- Verified M2A curriculum commit `b112789` is already an ancestor. Preserved its 16 stages and the finalized M1.1 GUI; no cherry-pick, main merge, force push, or other-worktree mutation.
- Integrated baseline: 197 unit tests and production build passed after frozen-lockfile dependency installation.

**Implemented**
- Authored Step/Run/restart/replace demonstrations drive a reusable controller through the real interpreter. Command preview, cat action and held result remain observable without sound.
- Guided program-slot, relative-turn, board, command and repeat-count cues follow authored reveal rules. Independent stages fade procedural guidance.
- Default entry starts the fixed curriculum, with completion-gated Lanjut and explicit demonstration skip. Fixture/unknown-route behavior remains available.
- Debugging exposes the failed attempt before hints or demonstration repair. Inspection preserves the program; edits and retry follow existing mechanics.
- Starter restoration uses a reset arrow/Ulang label instead of implying nonempty programs are cleared. Full Repeat count tasks hide unavailable choices in curriculum lessons.
- Corrected the world grid's retained intrinsic canvas width when resizing from desktop to a narrow screen. Rendering remains authoritative only for presentation.
- Maintained exact prompt history; curated PROMPT_JOURNAL remains unchanged. Full contracts, verification history and limits are in M2B_VISUAL_LEARNING.md.

**Verified**
- Unit tests: 219 passed across nine files. TypeScript/production build passed; existing renderer size advisory remains (344.12 kB gzip).
- Development Strict Mode browser smoke: demonstration, lesson transition and guided Step passed without page errors.
- Final browser coverage: all 78 distinct cases have successful results. The complete 21.1-minute run had 77 passes and one old desktop draw-rest sampling failure; both corrected desktop/mobile draw-rest checks then passed in a targeted 20.3-second rerun. All 12 M2B and 36 M2A cases passed in the full run. Exact commands and prior failures are retained in M2B_VISUAL_LEARNING.md.
- Rendered beginner, turn, Repeat, debugging, completion and reduced-motion captures inspected at desktop/mobile, including 320 px and 200% text size. New controls satisfy 44 px targets; no page overflow or normal-flow runtime errors.
- Source whitespace and preserved-scope checks passed; other worktrees, interpreter/simulation, assets, dependencies and curated prompt journal are unchanged.

**Commit**
- `e9d67d46c434b761e1e7e28bbbf4e1444f262843` `feat(learning): add visual lesson scaffolding`.

**Limits**
- Learner/teacher comprehension and physical touch devices remain unvalidated. Browser emulation establishes interaction behavior only.
- Session-only progression, WebGL requirement, no invented BISINDO, no new assets or dependencies. No push or merge to main.

### 2026-10-07 — Set up AI-development logs

**Prompt:** PROMPT_LOG entry / 2026-10-07 17:38

**Done**
- Added the curated prompt journal with all five slots unselected.
- Recorded this request verbatim with a concise result summary.
- Added the development log structure. No gameplay or M0 work started.

**Verified**
- All three requested files exist.
- The prompt log entry matches the user message; all five journal slots remain unselected.
- No gameplay code was changed.

**Commit**
- `6e79226` `docs: add AI development logging system`

### 2026-10-07 - M0 Playable Kernel

**Prompt:** PROMPT_LOG entries / 2026-10-07 17:51 and 18:02

**Done**
- Added one three-tile isometric fixture with placeholder cat/fish, Forward only, shared pure interpreter, Run/Step, Retry, and Reset Program.
- Added basic invalid-tile stop, persistent visual feedback, responsive controls, and package/asset attribution. M1+ remains deferred.

**Verified**
- 14 unit/integration tests pass; production build passes (renderer bundle size advisory remains).
- Desktop 1440x1000 and mobile 390x844 smoke checks pass: add/remove, Run, Step, collection, Retry, Reset, invalid-tile stop; no runtime console errors.
- Inspected layouts including 200% text size; checked keyboard, reduced motion, 44px targets, and contrast. PROMPT_JOURNAL.md is unchanged.

**Commit**
- `04ef76a` `feat: add forward-only playable kernel`

### 2026-10-10 - Asset Curation Sprint

**Prompt:** PROMPT_LOG entry / 2026-10-10 Asset Curation Sprint

**Done**
- Prepared `cat.glb`, `fish.glb`, `tree.glb`, `rock.glb`, `crate.glb`, and optional `bush.glb` (257.8 KiB total). Optional flower rejected for small-size readability.
- Downloaded actual Kenney Cube Pets 2.0 files and individual CC0 Quaternius GLBs. Documented the primary Drive download quota failure and substitutions.
- Embedded textures, normalized through nonanimated wrappers, set matte materials, fixed the cat scene/root naming collision, and applied lossless resource/keyframe deduplication. Preserved geometry, skins, and all clips.
- Added isolated reproducible asset tooling, attribution, exact source license, integration notes, and a validation record.

**Verified**
- All six GLBs pass Khronos structural validation with zero errors; fish retains two inherited skinned-node warnings, documented and checked through Three.js playback.
- Chrome orthographic inspection and Three.js 0.186.1 loading passed. Original/final AnimationMixer comparison sampled 328 cat poses and 41 fish poses, with maximum local TRS errors 0 and 1.79×10⁻⁷ respectively.
- Second preparation produced six identical SHA-256 output hashes. `bun run build` passes; existing renderer bundle-size advisory remains.
- No engine, scene components, gameplay logic, project dependencies, or package lockfile changed. PROMPT_JOURNAL.md is unchanged. No full packs, unused candidates, archives, or external textures in runtime models.

**Commit**
- Pending commit. User explicitly requested no commit or push.

### 2026-10-10 - M0.5: 3D Asset Integration

**Prompt:** PROMPT_LOG entry / 2026-10-10 M0.5: 3D Asset Integration

**Done**
- Replaced procedural cat/fish with the existing GLBs and private instance clones. Added bounded idle, walk, eat, and one-shot dance sequencing with crossfades, cancellation, effect cleanup, and correct demand-frame startup.
- Kept simulation-owned position/orientation and existing timing. Added visible forward/cyan-left/orange-right arrows for all four facings; adjusted the fish to show its side and added brief pickup plus persistent collected state.
- Added model-readiness gating and reduced-motion static poses. Kept the four unused scenery models ready without adding props or mechanics.
- Added a development-only inspector, focused presentation/browser tests, and integration verification notes; preserved attribution provenance and curation results.

**Verified**
- 25 unit tests pass, including all 14 existing engine/store tests. 10 Playwright tests pass on desktop and touch-enabled mobile; mobile gameplay uses taps.
- Production build passes. Actual desktop/mobile gameplay and four-facing screenshots inspected; movement, pickup, completion, Retry, Reset, collision, reduced motion, delayed/missing GLBs, and cancellation verified within the recorded test scope.
- Test-only WebGL draw counts stop after bounded idle and under reduced motion. All six curated SHA-256 hashes are unchanged; the inspector is absent from the production build.
- Engine/interpreter/store, existing M0 tests, package files, preparation script, and PROMPT_JOURNAL.md unchanged. Known fish skin warnings caused no rendering issue. Existing renderer bundle advisory and Fiber's Three.Clock deprecation warning remain.

**Commit**
- Pending commit. No commit or push requested or performed.

### 2026-10-10 - Finalize M0.5 checkpoint

**Prompt:** PROMPT_LOG entry / 2026-10-10 Finalize M0.5 checkpoint

**Done**
- Reviewed the complete integration diff, six curated GLBs, source attribution, supplied Kenney license, and isolated preparation script. Rechecked all six source pages for CC0 licensing.
- Excluded the local inspector, screenshots, full packs, archives, and temporary tooling. Retained the reproducible processing script and asset validation/integration notes.
- Fixed transient animation checks in the new E2E test to poll each animation frame. The initial desktop run missed the 0.5-second dance during a 500 ms locator retry interval; no gameplay code changed during finalization.
- Appended this verification entry and the exact finalization request. PROMPT_JOURNAL.md remains unchanged; engine, interpreter, store, existing tests, dependencies, and lockfile are preserved.

**Verified**
- `bun run test`: 25 tests pass across three files.
- `bun run build`: passes; existing renderer bundle-size advisory remains.
- `bun run test:e2e`: final full run passes all 10 desktop/mobile tests after the polling fix. Fresh completion renders inspected on both viewports.
- Isolated preparation from the original source files reproduces all six runtime GLBs byte-for-byte against the recorded SHA-256 hashes, without overwriting workspace assets. Khronos validation reports zero errors; the fish's two inherited warnings remain documented.
- Before staging, `main` and fetched `origin/main` both pointed at `ba9f490`. Finalization uses an ordinary commit and non-force push; no history rewrite is authorized.

**Commit**
- Pending commit at verification time: `feat: integrate curated 3d game assets`, with parent `ba9f490`. This entry is included in that checkpoint; resolve its full hash with `git log -1 --format=%H -- docs/M0_5_VERIFICATION.md`. The actual commit and push result are reported after execution, never invented in advance.

### 2026-10-10 - Replace clownfish with a whole trout

**Prompt:** PROMPT_LOG entry / 2026-10-10 Whole-fish collectible replacement

**Done**
- Searched salmon candidates; rejected fillets, carcass/food assets, and a temporary red snapper with an unclear small-size silhouette. User subsequently allowed other ordinary whole fish.
- Replaced only the shipping `fish.glb` with Poly by Google's low-poly Trout, verified CC BY 3.0. Retained natural colors, geometry, and texture pixels. Added source/license/modification credit to documentation, GLB metadata, and a shipped text notice.
- Reused the preparation pipeline with a targeted asset argument, preserving other models and historical validation evidence. Normalized trout size/facing/grounding; applied lossless metadata/resource optimization.

**Verified**
- Final trout: 21,712 bytes, 268 triangles, one embedded texture, no rig/source clips. Khronos validation reports zero errors or warnings. Exact geometry/UV/normal/index arrays and PNG pixel-defining chunks preserved; isolated second preparation reproduces its SHA-256.
- 25 unit tests, production build, and all 10 desktop/mobile E2E tests pass with the final asset. Inspected desktop/mobile gameplay-size renders. Collection, cat reactions, Retry, Reset, collision, cancellation, reduced motion, and loading remain covered by existing tests.
- All five other curated asset hashes match `a11484d`. No gameplay component, engine/store, test, dependency, or lockfile changed. PROMPT_JOURNAL.md untouched. Candidates, screenshots, and inspection scripts are not shipping files.
- Existing renderer bundle advisory remains. Physical-device and learner verification not claimed.

**Commit**
- Pending commit. User explicitly requested no commit or push.

### 2026-10-10 - Keep both fish and enlarge collectibles

**Prompt:** PROMPT_LOG entry / 2026-10-10 Fish variants and larger size

**Done**
- Restored the original clownfish at `fish.glb` as default, byte-for-byte from `a11484d`. Retained trout at `fish-trout.glb`, with its processing recipe and CC BY 3.0 notice.
- Added an optional Fish variant prop and shared 1.5× display scale outside the existing pickup transform. Both fish are 50% larger; no selector UI or gameplay feature added.
- Updated current asset contracts, attribution, and separately scoped validation evidence while retaining accurate prior work entries.

**Verified**
- 25 unit tests, production build, and 10 desktop/mobile default-game E2E tests pass. Mounted both actual Fish variants in an ignored local fixture: loading, enlarged size, pickup/reset, and reduced-motion pickup/reset pass on desktop and mobile; renders inspected.
- Full isolated seven-model preparation reproduces byte-for-byte. Original six shipping hashes unchanged; trout geometry and texture pixels preserved. Zero trout validator errors/warnings; existing clownfish skin warnings remain documented.
- Engine/store, gameplay timing, tests, dependencies, lockfile, and PROMPT_JOURNAL.md unchanged. Temporary fixtures/screenshots are ignored. Existing renderer bundle advisory remains.

**Commit**
- Pending commit. No commit or push requested or performed.

### 2026-10-10 - Atomic fish-variant checkpoint

**Prompt:** PROMPT_LOG entry / 2026-10-10 Commit fish variants and sizing

**Done and verified at staging time**
- Reviewed the final presentation, alternate GLB, reproducible processing, license notice, and relevant documentation as one coherent change. All seven shipping hashes match their validation records; the original six assets match `a11484d`.
- Retained the completed verification from the preceding turn: 25 unit tests, 10 desktop/mobile E2E tests, production build, and direct checks of both variants. No application changes since those checks.
- Confirmed main matches fetched origin/main before committing. Excluded temporary files, screenshots, and local inspection tools. PROMPT_JOURNAL.md and engine/store, tests, dependencies, and lockfile unchanged.

**Commit**
- Pending commit at staging time: `feat: enlarge fish and retain trout variant`, with parent `a11484d`. This entry is included in that single checkpoint; resolve its actual hash with `git log -1 --format=%H -- public/assets/models/fish-trout.glb`. User authorizes an ordinary non-force push to origin/main; actual Git results are reported only after confirmation from Git.

### 2026-10-10 - M1 core gameplay mechanics

**Original prompt:** [PROMPT_LOG / M1 core gameplay mechanics](./PROMPT_LOG.md#2026-10-10---m1-core-gameplay-mechanics) retains the complete original request, including scope, verification, and conditional commit/push authorization.

**Done**
- Extended the existing typed commands and pure engine with relative quarter-turns and structured Repeat counts 2, 3, 4. A live cursor executes one primitive per Step/400 ms Run action without flattening or separate executors; active paths and one-based loop iterations remain inspectable on collision.
- Added optional top-level/body slot limits and shared validation. Repeat counts/bodies edit through semantic tap/keyboard controls; previous/next buttons organize top-level blocks and body primitives. Empty bodies block execution; nested loops and unavailable commands are rejected. All editing remains locked during continuous Run.
- Preserved program retention, Retry from the start, deep Reset to initialProgram, valid-end completion, post-Step edit reset, invalid-tile stopping, timer cancellation, and GLB loading/recovery. Added Stop for inspection and Step continuation. Status-only interruption preserves animation; rapid repeated turns retain their direction; reduced motion uses exact poses and persistent highlights.
- Kept original M0 level data/default route unchanged. Added small turning and square-loop engineering fixtures through explicit query URLs. Preserved every GLB, both fish variants, processing/licenses, cat reactions, scene architecture, and existing regression tests. No new dependencies or curriculum/progression features.
- Updated README and [M1 architecture](./M1_ARCHITECTURE.md). PROMPT_JOURNAL.md untouched. Screenshots, traces, and temporary inspection files remain ignored.

**Executed verification**
- `bun run test`: **53 passed**, five files. Covers all facings, left/right combinations, 2/3/4 counts, ordering, loop/top-level boundaries, permissions/limits, exact action pacing, Run/Step parity after each primitive including collision, collection/completion, editing after Step/error, locked edits, Retry, Reset, interruption, cleanup, and interrupted/reduced-motion presentation. Original 25 tests retained.
- `bun run build`: **passed**; JS gzip approximately 331.90 kB. Existing >500 kB raw bundle advisory remains, without new dependencies.
- `bun run test:e2e`: **24 passed** in the final complete run, desktop 1440×1000 and touch-emulated mobile 390×844. Original ten M0/M0.5 regression cases retained, plus fourteen M1 cases. Actual touch taps, native count selectors, keyboard activation, exact per-Step highlights/iterations, every facing, loop exit/re-entry, ordering/removal, slot limits, collisions, completion, Stop/cancellation, Retry/Reset, GLB errors/loading, demand rest, and reduced motion verified.
- Inspected real production renders for desktop/mobile turns and all four facings, loop highlighting/editing, collision and completion, reduced motion, and 200% text zoom. Initial tests measured a hidden R3F fallback button; corrected visible-control selection. Visual review found zoomed Kanan text exceeding its block; made width follow font size and added an internal-overflow assertion. Final rebuild and full E2E rerun passed.
- Enabled text contrast: ink on cyan **6.80:1**, orange **6.13:1**, yellow **8.13:1**, cream **10.37:1**. Visible controls meet at least 44×44 CSS pixels; page and command text overflow assertions pass at text zoom. No unexpected console/page errors in tested successful flows.
- No claim of physical-device testing or child/teacher comprehension testing. Fixtures are not the final curriculum; M2 still needs authored gradual-release lessons, appropriate entry/progression, and learner validation. Existing renderer advisory and previously documented fish skin warnings remain.

**Anti-Slop DURING delivery gate**
- **Hard gate PASS:** actual desktop/mobile click/tap/keyboard flows, visible controls, empty/loading/error states, contrast and 200% zoom verified; no fabricated content or dead controls introduced.
- **Purpose gate PASS:** Repeat border identifies its command scope; direction colors/arrows, native count selector, and reorder controls communicate mechanics. Reasons recorded in M1_ARCHITECTURE.md.
- **Liveliness PASS:** existing Pastel Toybox 2/2/2 direction, cat/board focal point, chunky commands and calm purposeful motion retained in inspected renders.
- **Craft/quality PASS:** unit/build/browser checks passed; no unrelated redesign/dependencies, nested loops, additional game modes, asset changes, or documentation curation.

**Checkpoint at staging time**
- Planned single scoped commit: `feat: add turning and repeat commands`, parent `140da85`. Resolve its actual hash with `git log -1 --format=%H -- docs/M1_ARCHITECTURE.md`. An ordinary non-force push is authorized only while fetched origin/main remains at that parent; actual Git results are reported after execution.

### 2026-10-11 - M1.1 gameplay GUI refinement

**Original prompt:** [PROMPT_LOG / M1.1 gameplay GUI refinement](./PROMPT_LOG.md#2026-10-11---m11-gameplay-gui-refinement) preserves the original request and the follow-up clarifying that Google's game is inspiration only.

**Implemented**
- Reframed the orthographic scene around projected occupied-tile bounds and the cat's travel envelope. Enlarged the world area; gave grass and soil shared beveled geometry, matte surfaces, visible thickness, and soft shadows. The camera stays stable during execution. The existing seven GLBs, animated cat, default clownfish, alternate trout, and preparation/licensing pipeline remain unchanged.
- Replaced the tall editor with one horizontal puzzle-block strip and one contextual palette. Tap selects a command; contextual controls replace, insert before/after, reorder, and delete. Repeat is inline with an editable 2×/3×/4× count after selecting its header. Its inner `+` scopes the shared palette to primitives. No mandatory drag-and-drop or nested loops.
- Added validated insertion and primitive replacement to the existing store edit boundary. Retained append compatibility, top/body limits, edit resets, no-op behavior, and Run locking. Simulation, interpreter, level fixtures, Run/Step execution, Retry/Reset, and interruption rules are untouched.
- Added a dominant green Play/Stop control, distinct one-action Step, quieter Retry/Clear, data-derived fish progress and collection ticks, explicit pause feedback, persistent command/error markers, and numbered Repeat iterations. The collision X stays at the blocked edge where it remains visible. No sound, scores, stars, or extra mechanics.
- Reflowed controls for mobile and enlarged text. Native buttons/selects expose keyboard names; focus is visually distinct from selection and execution. Deleting, reordering, and choosing insertion restore keyboard focus. Active/insertion targets scroll only the horizontal program strip.
- Updated README, M1 architecture, and M1_1_INTERFACE.md. PROMPT_JOURNAL.md is untouched. No dependencies, lockfile, third-party assets, or `.agents` guidance changed.

**Changed files**
- Presentation: `src/app/App.tsx`, `src/styles/index.css`, `src/components/commands/CommandPalette.tsx`, `src/components/program/ProgramTray.tsx`, `src/components/controls/RunControls.tsx`, new `src/components/controls/ControlIcon.tsx`.
- Scene: `src/scene/GameScene.tsx`, `src/scene/Board/Board.tsx`, `src/scene/config.ts`.
- Editing: `src/stores/game-store.ts`, new `src/stores/editor.test.ts`.
- Browser verification: `e2e/assets.spec.ts`, `e2e/kernel.spec.ts`, `e2e/mechanics.spec.ts`, new `e2e/refinement.spec.ts`.
- Documentation: `README.md`, `docs/M1_ARCHITECTURE.md`, new `docs/M1_1_INTERFACE.md`, `docs/PROMPT_LOG.md`, `docs/DEVELOPMENT_LOG.md`.

**Visual inspection and corrections**
- Inspected actual browser renders for beginner, turning, and Repeat, including selection, active commands, iterations, collection, collision, success, and 200% text zoom. Initial renders revealed a canvas retaining its intrinsic height as the dock grew and zoomed labels crowding fixed-width controls; fixed canvas sizing and content-driven reflow.
- A viewport sweep checked 1440×900, 1024×768, 390×844, 320×740, and 844×390. No page horizontal overflow or runtime errors. The standard Repeat editor fits within 1440×900, 1024×768, and 390×844; narrower/short landscape screens scroll vertically. Long programs scroll within their single strip.
- Rendered a temporary 7×5 diagnostic board through the actual scene at 1440 and 390 widths; all board edges, cat, and fish fit without clipping. This diagnostic was render-only and is not a shipping level or new curriculum.
- Earlier browser runs exposed missing focus handoff after before/after insertion, a focus style overridden by selected-state CSS, and observers missing short walk/Retry-reset states. Added the focus handoff and explicit focus precedence; armed observers before actions. The 240 ms presentation and 400 ms interpreter pacing were not changed. Layout assertions inspect label/icon bounds rather than counting the intentionally protruding puzzle tab as text overflow.
- Calculated contrast: Play text 5.75:1; lavender command text 6.25:1; supporting cream text 5.94:1; sky text 8.21:1; palette text 7.87:1; blue focus against lavender 5.71:1. Control/loop borders checked against the non-text 3:1 criterion (Play border 3.36:1; Repeat boundary 3.47:1; command edge against tray 3.85:1). Existing cyan/peach/yellow text pairs are retained.

**Executed verification**
- `bun run test`: **56 passed**, six test files (covers mechanics, store editor, playback, interpreter, and kernel).
- `bun run build`: **passed**; production client build clean with zero TypeScript errors.
- `bun run test:e2e`: **30 passed** across desktop (1440×1000) and mobile (390×844) viewports. Turn animation phase hold (750ms) ensures deterministic observation under full suite load.
- Visually inspected rendered captures in `.verification/` for desktop and mobile viewports across beginner, turning, loops, 200% text zoom, and reduced-motion modes.

**Limitations**
- Physical devices and SDLB-B learner/teacher comprehension have not been tested. Touch is browser-emulated. Fixtures remain engineering fixtures; M2 pedagogy and progression remain out of scope.
- WebGL is required; the existing renderer bundle-size advisory remains (approximately 335.05 kB gzip). Existing asset validation caveats remain documented. No BISINDO material was invented.

### 2026-10-11 - M1.1 gameplay GUI review and final refinement

**Implemented & Corrected**
- Replaced the artificial 750ms turn phase hold in `src/scene/Cat/Cat.tsx` with genuine 240ms transition physics and an explicit `canvas.dataset.catTurns` action counter. Updated `e2e/mechanics.spec.ts` so observation starts before step clicks, eliminating race conditions without stalling the simulation or forcing continuous frame invalidations.
- Repositioned procedural floating islands in `src/scene/Environment/ToyboxDressing.tsx` (`[2.6, -0.45, -1.8]` and `[-2.0, -0.55, 0.5]`), eliminating viewport edge clipping and unwanted projection behind the top HTML title header.
- Scaled program tray elements for narrow mobile viewports (`@media (max-width: 720px)`) in `src/styles/index.css`: sized command blocks to 66×70px, repeat head to 56×68px, and insertion slots to 46×68px (all well above 44px min touch targets). This allows Repeat blocks with inner commands and the outer `+` insertion slot to fit cleanly on 390px screens without clipping.
- Ensured all label typography satisfies the roughly 16px legibility standard (`.slot-count` at 1rem/16px, `.command-number` at 0.95rem/15.2px bold, `.loop-progress` at 0.95rem/15.2px). Increased Play button icon to 46px for clear visual dominance.
- `docs/PROMPT_JOURNAL.md` remains untouched.

**Executed verification**
- `bun run test`: **56 passed**, 6 test files.
- `bun run build`: **passed cleanly** (`tsc --noEmit && vite build`, 0 errors).
- `bun run test:e2e`: **30 passed** across desktop (1440×1000) and mobile (390×844) viewports.
- Fresh rendered screenshots in `.verification/` inspected and confirmed free of clipped controls or awkward dressing placement.

### 2026-10-11 - Gameplay GUI Refinement: Interlocking Puzzle Blocks & Lucide Icon Hierarchy

**Implemented & Corrected**
- Integrated `lucide-react` across all UI controls and command symbols, replacing ad-hoc/AI SVG paths with crisp, recognizable icons with bold strokes (`strokeWidth: 2.8–3.5`).
- Re-architected command sequence items into seamlessly interlocking jigsaw puzzle pieces (`gap: 0` between connected blocks, male tab `::after`, female socket `::before`, no shadow seam smear, clean rounded start edge without leftmost notch cutout).
- Widened the Step button (`118px` wide, `#faecd0`) as a distinct secondary action beside the dominant green Play button (`92px` wide, `#4cb016`), with compact secondary controls (`Retry` and `Clear`, `62x48px`) centered cleanly beneath them in a 2-column grid.
- De-cluttered child-facing UI: removed unnecessary visible text labels ("Tambah perintah" and "Urutanmu" converted to `sr-only` headers for accessibility without visual clutter).
- Cleaned up the top-right fish counter: removed stray circle ticks, retaining a clean fish icon and ratio badge.
- Increased center-right dock breathing room (`.editor` max-width constrained, larger workbench gap) so the 3D isometric board remains the clear visual focal point.

**Executed verification**
- `bun run test`: **56 passed**, 6 test files.
- `bun run build`: **passed cleanly** (`tsc --noEmit && vite build`, 0 errors).
- `bun x playwright test e2e/refinement.spec.ts`: **6 passed** across desktop and mobile viewports.
- `docs/PROMPT_JOURNAL.md` remains untouched.

### 2026-10-13 — IDWDYD ghost-hand learning redesign

**Original prompt:** [PROMPT_LOG / IDWDYD visual onboarding redesign](PROMPT_LOG.md#2026-10-13--idwdyd-visual-onboarding-redesign).

**Implemented**
- Replaced opt-in, text-heavy tutorials with automatic real block placement and execution. The pointer follows real controls, taps before the shared action, and withdraws during Run. Completion offers one continuation.
- Added authored guide interactions and progressive visual support. Prepared movement now needs a child-entered second Forward. Turn choice remains a choice between both relative turns; Repeat uses the child's count. Independent stages start empty and have no procedural hand.
- Hid Step during introductory concepts and moved replay/skip/reset into the header options. Removed trace panels, counters and redundant instruction text. Retained the M1.1 workbench/scene hierarchy, original mechanics, assets and permanent visual accessibility cues.
- Downloaded and inspected Kenney Cursor Pack 1.1. Shipped the unchanged original hand PNG with its exact CC0 notice; no new asset was invented, drawn or generated. Added source, original filename and hash to attribution.
- Preserved real store actions and interpreter authority. Added interrupt/replay cleanup, undo-aware guide progression, responsive anchors and persistent reduced-motion cues. No dependencies, package versions, main branch or other worktree contents changed.

**Verification-driven corrections**
- Updated historical curriculum/browser expectations for automatic, read-only demonstrations, hidden early Step, prepared guided movement and empty independent debugging.
- Corrected turn-choice pointer placement to the group center, so its geometry does not imply a correct answer.
- Corrected guided hint merging and cue restoration after undo. Strengthened authored insertion/guide validation. Adjusted an obsolete hint expectation after the fix and resolved a TypeScript narrowing error before the successful build.
- Broader editing checks exposed loop-body slot visibility depending on a full outer program, and guided insertion leaving the palette hidden after rebuilding a starter. Fixed slot capacity per scope and made explicit child editing reopen the palette. The latter initially timed out in E2E; its targeted desktop/mobile rerun passed.
- Visual failure inspection caught a command-path selector also matching the feedback element. Scoped the pointer selector to the editor so demonstrations and mistakes anchor to actual command buttons, and added button-bound assertions.
- Inspected actual desktop/mobile renders for first movement and 200% text size. The board remains primary; the original hand and a single contextual outline identify the next action. Software WebGL checks run serially to avoid contention.

**Executed verification**
- `bun run test`: **227 passed**, nine files.
- `bun run build`: **passed**, zero TypeScript errors; existing large renderer chunk advisory, approximately **345.64 kB gzip**.
- `bun run test:e2e --config playwright.curriculum.config.ts`: **76 passed** across serial desktop/mobile projects (19.0 minutes). All 16 real curriculum boards complete on both viewports; includes tutorial progression/recovery, real editing, turns, Repeat, debugging, kernel, assets, keyboard, zoom and reduced motion.
- After the final pointer selector correction, rebuilt and reran `e2e/learning.spec.ts` and `e2e/curriculum.spec.ts` filtered to `guided mistakes remain|debugging observes`: **4 passed** on desktop/mobile. Actual command-button bounds and demonstration selection are asserted. Inspected the corrected rendered failure capture; no instructional outline remains on feedback.
- Asset hash equality verified for the original and shipped hand; source/license copied without redrawing or PNG modifications. No runtime/console errors were reported in the checked flows. Screenshots remain excluded from Git in `.verification/`.

**Limits and scope**
- Physical-device and SDLB-B learner/teacher comprehension testing remain outstanding. Touch is browser-emulated; WebGL is required. At large text size/short landscape heights, vertical scrolling can be necessary.
- No BISINDO material, Home Menu, Expedition Map, sound requirement, persistence or unrelated feature was added. `docs/PROMPT_JOURNAL.md` remains untouched. No push or merge to main.

