# Development Log

Record meaningful work after verification and map it to real Git history. Use `Pending commit` until a commit exists. Never invent hashes or chronology.

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
