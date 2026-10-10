# M0.5: 3D asset integration

Reviewed 2026-10-10. Cat and fish use the curated, self-contained GLBs through Fiber `useLoader` and Three.js GLTFLoader. Skeleton-aware clones separate mutable instance transforms/bones while sharing immutable cached geometry and materials. No package or asset binary changed. The existing processing pipeline and curation validation record are preserved.

## Changed files

| Files | Change |
| --- | --- |
| `src/scene/Cat/Cat.tsx`, `src/scene/Cat/playback.ts` | GLB character, orientation cues, demand-frame playback, interruptible visual sequencing and cleanup. |
| `src/scene/Collectibles/Fish.tsx` | Cloned GLB collectible, readable side angle, bounded pickup and reduced-motion state. |
| `src/scene/models.ts`, `src/scene/config.ts` | Existing Three.js loader/clone helpers, prepared-path registry, shared presentation timing and direction colors. |
| `src/scene/GameScene.tsx` | Suspense/readiness, model props, explicit percentage shadows. |
| `src/app/App.tsx`, `src/components/controls/RunControls.tsx` | Presentation readiness gates execution controls until models are available. |
| `src/scene/Cat/playback.test.ts`, `e2e/assets.spec.ts` | Focused playback and actual-render browser coverage; existing tests retained. |
| `docs/ATTRIBUTIONS.md`, `docs/ASSETS.md`, `docs/M0_5_VERIFICATION.md` | Current integration attribution, preserved curation baseline, and verification record. |
| `docs/PROMPT_LOG.md`, `docs/DEVELOPMENT_LOG.md` | Actual request and verified result; commit remains pending. |

## Presentation behavior

- The cat's outer group follows authoritative logical X/Z and orientation. The normalized model faces −Z; north/east/south/west map to the existing yaw table. Turns use the shortest angular path without translating the cat. Forward and opposing cyan-left/orange-right arrows rotate with that outer group and sit above the head so rear-facing views cannot hide them.
- Forward uses the existing 240 ms cubic ease-out interpolation and `walk`. At arrival, a collection plays `eat` (0.5 s); completion then plays `dance` once (0.5 s). Waiting plays `idle` for one cycle (1 s), then holds its final neutral pose. Crossfades take 100 ms. These are presentation timings, never conditions for interpreter advancement.
- Every new simulation action replaces pending visual reactions. Rapid Steps retarget from the current rendered position. Retry, program edits, Reset, and collision cancel queued reactions and restore the authoritative pose. Effect cleanup releases mixer bindings; subsequent setup obtains fresh action handles, including React StrictMode setup/cleanup/setup.
- Reduced motion sets the exact logical position/yaw and the model's `static` pose. Pickup becomes immediate disappearance plus the persistent collected marker. Idle, locomotion, and celebration do not request continuing frames. Toggling the preference during motion cancels the current visual sequence.
- Fish uses its existing neutral skinned pose, raised 0.2 units above the tile and rotated +π/4 around Y. That angle shows its broad side to the +X/+Y/+Z orthographic camera. Collection uses one 240 ms lift of 0.14 units, a slight size change (1 to 0.9), then disappearance; the green tile marker remains. No perpetual fish swim/bob is added.
- Fiber stays on `frameloop="demand"`. An action invalidates before its first zero-delta presentation frame, avoiding the accumulated idle-clock jump. Playback invalidates only until its bounded motion/reaction/idle sequence ends. No React state changes occur per frame. Canvas data attributes expose actual animation phase and start/settled pose for browser tests; they are hidden diagnostics, not an asset inspector or child-facing copy.
- The loading message remains until both GLBs commit inside Suspense. Run, Step, and Retry wait for that readiness; building/resetting a program remains available. Missing GLBs use the existing visual recovery state. Reset/retry command semantics and the 400 ms store execution pace are unchanged.

The primary teaching purpose of motion is showing command → movement → collection. Completion gets one short celebratory clip. Idle settles to keep the board calm and let rendering rest. Direction markers use shape and spatial placement as well as color. No props were added to the three-tile M0 fixture.

Implementation follows the official [Fiber demand-rendering guidance](https://r3f.docs.pmnd.rs/advanced/scaling-performance) and [Fiber hook guidance](https://r3f.docs.pmnd.rs/api/hooks), checked against the installed Fiber 9.8.1 / Three.js 0.186.1 APIs. The existing procedural board, pure interpreter, level definition, and Zustand simulation remain authoritative.

## Implementation checks (before checkpoint finalization)

| Check | Result / evidence |
| --- | --- |
| Unit tests | 25 pass: all 14 existing engine/store tests plus 11 cat presentation cases covering four facing vectors, reaction order, logical-state immutability, rapid interruption, reset/collision cancellation, shortest-path rotation, reduced motion, long frames, and effect cleanup. |
| Production build | Pass. Curated models ship at their original validated hashes. No new dependency or lockfile edits. |
| Playwright | 10 tests across 1440×1000 desktop and 390×844 touch-enabled mobile. Existing M0 smoke tests are preserved. Added GLB loading/network checks, phases and settled coordinates, pickup/dance cancellation, reduced-motion toggling, delayed loading, missing-model recovery, and demand-renderer rest checks. Mobile interaction checks use taps. |
| Actual render inspection | Desktop and mobile screenshots inspected for movement, fish side silhouette, eat/dance, completed marker, restored Retry flow, and reduced motion. All four orientations rendered with the actual Cat component in the development inspector. Arrows remain visible even when the face points away. |
| Demand rendering | Test-only WebGL draw-call instrumentation confirms counts stop increasing after idle settles and under reduced motion. Instrumentation is injected by Playwright and does not ship in the application. |
| Runtime errors | None in successful gameplay flows. The missing-model test deliberately injects a 404 and verifies the recovery UI instead of claiming that request succeeds. |
| Existing input/layout checks | Keyboard add, 44 px controls, no horizontal overflow, and 200% text-size checks remain in the M0 smoke tests. Mobile checks use an emulated touch viewport; physical-device and learner testing are not claimed. |
| Scope | Engine/interpreter/store, existing M0 tests, `.agents/` guidance, package files, curated GLBs, preparation tooling, and PROMPT_JOURNAL.md unchanged. No turning commands, loops, obstacles, or decorative props added. No commit or push. |

Screenshots are generated under ignored `.verification/`: `desktop-glb-step.png`, `desktop-glb-eat.png`, `desktop-glb-dance.png`, `mobile-glb-step.png`, `mobile-glb-eat.png`, `mobile-glb-dance.png`, and both `*-glb-reduced.png`, plus the original smoke-test initial/completion/collision/text-zoom screenshots. Retry restoration was also observed in the live development game. Reproduce with `bun run test`, `bun run build`, then `bun run test:e2e`.

## Development inspector

The four-facing inspector was used locally during implementation, guarded by `import.meta.env.DEV` and excluded from the production build. During checkpoint finalization it was moved to ignored `.verification/m05-checkpoint/asset-inspector.html`. It is excluded from Git as an unnecessary inspection tool; the normal game and committed tests do not depend on it. Screenshots and temporary inspection scripts also remain outside the checkpoint.

## Remaining limits

- The fish's two inherited glTF skin-transform warnings remain in the preparation record. They caused no missing geometry or skin deformation in gameplay, so the validated asset was not reprocessed.
- The existing large-renderer-bundle build advisory remains (about 1.20 MB raw / 330 kB gzip). Three.js emits a Clock deprecation warning from Fiber's internal clock in development; no clock migration or dependency upgrade was introduced. Percentage shadows are selected explicitly to avoid the removed soft-shadow mode warning.
- M0 still supports Forward only. Rotation presentation and four-facing visuals are ready for M1, but turning commands and loop gameplay have not been implemented or claimed as gameplay-tested.

## Checkpoint finalization (2026-10-10)

- Reviewed the tracked diff and every new shipping/test/documentation file. Selected only the M0.5 presentation implementation, six GLBs, supplied license, reproducible processing script, focused tests, and relevant documentation. The local inspector, screenshots, scratch scripts, source packs, archives, and unused models are excluded from Git.
- Rechecked the Kenney and five individual Quaternius source pages: all identify CC0. Original filenames, exact download URLs, creators, modifications, source hashes, and the supplied Kenney license remain recorded.
- Ran the preparation script against the retained original files and pinned toolchain in an isolated temporary directory. All six rebuilt GLBs match the workspace and recorded SHA-256 hashes byte-for-byte. Workspace binaries and the validation report were not regenerated. Validation: zero errors on all six; only the fish's two inherited warnings.
- Fresh unit run: 25 passing tests. Fresh production build: pass, with the existing bundle-size advisory. Initial E2E run: nine passed, one desktop assertion missed a 0.5-second dance during a 500 ms locator retry gap. Transient phase checks now poll on animation frames; final full E2E run: 10 passing tests. No gameplay implementation changes were necessary. Fresh desktop/mobile completion renders inspected.
- PROMPT_JOURNAL.md, engine/interpreter/store, existing M0 tests, dependencies, and lockfile remain unchanged. Prompt and development logs record the actual request, first-run failure, fix, and successful verification.
- Pending commit at verification time: `feat: integrate curated 3d game assets`, based on `ba9f490`; an ordinary push to `origin/main` is authorized after staging checks. This document is introduced by that checkpoint. Resolve its actual full hash with `git log -1 --format=%H -- docs/M0_5_VERIFICATION.md`; commit/push success is reported only after Git confirms it.
