# Prompt Log

### 2026-10-12 09:45 - M2B Visual Learning Experience

**Prompt**

```text
# Kotak-Katik - M2B: Visual Learning Experience

Read `AGENTS.md`, relevant `.agents/*.md`, and M2A's curriculum report.

First, verify M2A's committed work and safely integrate it with the finalized M1.1 GUI. Preserve both implementations. Do not overwrite unfinished worktree changes.

Implement M2B:

1. Short, visual-first I Do demonstrations showing command → cat action → result.
2. We Do stages with partially prepared programs, obvious insertion targets, and contextual visual hints.
3. You Do stages with gradually reduced guidance.
4. Progressive command introduction, following the fixed curriculum.
5. Clear visual feedback for completion and mistakes, understandable without sound.
6. One reusable tutorial/scaffolding system driven by authored level metadata.

Keep the existing game mechanics, assets, and GUI hierarchy. No long tutorial paragraphs, mandatory audio, quiz screens, Home Menu, or Expedition Map.

Verify real beginner, turning, Repeat, and debugging stages on desktop/mobile. Test tutorial progression, skipping/replaying demonstrations, reduced motion, and gameplay regressions.

Document changes, run tests/build/E2E, and commit to a feature branch. Do not push or merge to `main` without confirming integration safety.

**Done when:** A first-time child can learn the controls through visual demonstration, complete guided stages, and transition into independent puzzles.
```

**Result**

- Verified M2A commit `b112789` is already an ancestor of the finalized GUI checkpoint `d9cd881`; started a clean feature branch without changing other worktrees.
- Added authored demonstrations, metadata-driven cues, guided/independent fading, and linear lesson transitions through the real game store/interpreter.
- Preserved M2A curriculum and M1.1 mechanics/assets/editor; explicit fixture URLs remain regression entry points.
- Verification and limitations are recorded in `docs/M2B_VISUAL_LEARNING.md` and `docs/DEVELOPMENT_LOG.md`. The curated `PROMPT_JOURNAL.md` remains untouched.

### 2026-10-07 17:38 — Set up AI-development logs

**Prompt**

`````text
````plaintext
Set up Kotak-Katik's competition AI-development logs.

Do not implement gameplay yet.

Create:

```txt
docs/
├── PROMPT_JOURNAL.md
├── PROMPT_LOG.md
└── DEVELOPMENT_LOG.md
````

## PROMPT_JOURNAL.md

This is the curated max-5 prompt journal for judging.

Sections:

1. Ide / PRD
2. Debugging
3. Audit & Optimasi
4. Finishing
5. Free

Important:

- Do NOT automatically select prompts.
- Only add a prompt to this journal when I explicitly tell you to curate/select it.
- Selected prompts must be copied verbatim from my real prompts.
- Never rewrite an old prompt to make it look better.
- Leave unselected sections as `Not selected yet`.

For now, leave every slot unselected.

---

## PROMPT_LOG.md

This is the full chronological raw prompt record.

Rules:

- append-only,
- never delete old entries,
- never rewrite old prompts,
- preserve prompts verbatim,
- preserve chronological order,
- corrections are new entries,
- never fabricate timestamps, models, or metadata.

Use:
````plaintext
### YYYY-MM-DD HH:MM — Short task name

**Prompt**

```text
<verbatim user prompt>
````

**Result**

- concise TLDR only
````plaintext

Do not dump long agent completion messages into the log.

A short factual result summary is enough because the raw prompt is the main
evidence.

---

## DEVELOPMENT_LOG.md

Map meaningful work to Git history.

Use:

```md
### YYYY-MM-DD — Task / Milestone

**Prompt:** PROMPT_LOG entry / timestamp

**Done**
- short TLDR
- max ~3 bullets

**Verified**
- tests/build/manual checks

**Commit**
- `<hash>` `<message>`

**Remaining**
- only if applicable
````

Never fabricate commit hashes.

Use `Pending commit` until a real commit exists.

---

## Workflow

For meaningful AI-assisted work:

1. append my exact prompt to `PROMPT_LOG.md`
2. agent does the work
3. record a short TLDR result
4. verify the result
5. commit normally
6. add/update the matching `DEVELOPMENT_LOG.md` entry

Only update `PROMPT_JOURNAL.md` when I explicitly say to select/curate a prompt.

---

## Integrity

- Prompt log is append-only for transparency.
- Never delete failed, weak, or superseded prompts.
- Never rewrite Git history to match the logs.
- Never fabricate prompt or commit chronology.
- Curated prompts must come from the real prompt log.

Keep everything simple Markdown.

Commit this setup as:

`docs: add AI development logging system`

Do not begin M0 yet.
````plaintext

And yes, I’d use this philosophy:

```text
PROMPT_LOG
= full user prompt + tiny result TLDR

DEVELOPMENT_LOG
= what changed + verification + commit

PROMPT_JOURNAL
= only the 5 prompts YOU explicitly choose
````

That keeps transparency without producing a 500-page log.




`````


**Result**

- Created the three requested AI-development log files and left all journal slots unselected. No gameplay code changed.

### 2026-10-07 17:51 - M0 Playable Kernel

**Prompt**

```text
Read `AGENTS.md` and all referenced `.agents/` docs first.

Then inspect the repo and start M0 - Playable Kernel following the documented architecture and quality bar.

Before work, append this prompt verbatim to `docs/PROMPT_LOG.md`. After work, add only a concise TLDR + verification + real commit to `docs/DEVELOPMENT_LOG.md`.

Do not touch `PROMPT_JOURNAL.md` unless I explicitly ask.

Keep scope strict. Do not implement M1+ features yet.
```

### 2026-10-07 18:02 - Clarify M0 boundary

**Prompt**

```text
Use this M0 boundary instead:

- one tiny isometric level
- placeholder primitives only
- Forward command only
- Run
- Step
- fish collection
- Retry
- Reset Program
- deterministic pure game engine + basic tests
- desktop/mobile smoke check
- bun run build passes

Defer:
- Left/Right
- collision complexity beyond basic invalid-tile stop
- loops
- expedition
- onboarding
- persistence
- audio
- themes
- real Quaternius/Kenney assets

M0 is only proving the architecture and end-to-end playable kernel.
Do not expand scope.
```

**Result**

- Implemented the clarified Forward-only M0 kernel; 14 tests, desktop/mobile smoke checks, and production build pass. No M1+ systems added.

### 2026-10-10 - Asset Curation Sprint

**Prompt**

```text
## Kotak-Katik: Asset Curation Sprint

You are a proffesional game asset designer, responsible for curating and downloading production-ready 3D assets for Kotak-Katik.

**Repository:** `justhenix/kotak-katik` [@Computer](plugin://computer-use@openai-bundled) [@Chrome](plugin://browser@openai-bundled?browserFamily=chrome)

Read `AGENTS.md`, `.agents/design.md`, `.agents/technical.md`, and `.agents/accessibility.md` before proceeding. Inspect the existing scene components.

### Asset sources

1. **Environment (primary):** Quaternius Cube World Kit
   - [https://drive.google.com/drive/folders/1Yyag0ibcOX6lOBY9a3m6iPnz8HwjwLFJ](https://drive.google.com/drive/folders/1Yyag0ibcOX6lOBY9a3m6iPnz8HwjwLFJ)
   - [https://quaternius.com/packs/cubeworldkit.html](https://quaternius.com/packs/cubeworldkit.html)
2. **Cat (primary):** Kenney Cube Pets
   - [https://kenney.nl/assets/cube-pets](https://kenney.nl/assets/cube-pets)
3. **Fish:** Check Cube Pets for a suitable fish first. Otherwise use:
   - [https://poly.pizza/m/BEcU9rjiAq](https://poly.pizza/m/BEcU9rjiAq)

### Required curated assets

| Filename     | Purpose                            |
| ------------ | ---------------------------------- |
| `cat.glb`    | Main playable cat, animation-ready |
| `fish.glb`   | Recognizable collectible           |
| `tree.glb`   | Simple chunky tree                 |
| `rock.glb`   | Obstacle                           |
| `crate.glb`  | Obstacle                           |
| `bush.glb`   | Optional scenery                   |
| `flower.glb` | Optional scenery                   |

Keep existing procedural gameplay tiles for now.

### Instructions

- Download and inspect the real source files, not just preview images.
- Prefer GLB. Convert glTF/FBX through reproducible tools only when needed. No manual Blender workflow.
- Select models matching the pastel, low-poly toy-diorama style in `design.md`.
- Prioritize consistent proportions, simple silhouettes, matte materials, and readable shapes from an orthographic camera.
- Favor a cat with usable idle/walk animations. Inspect actual animation clips rather than assuming they exist.
- Keep fish visually recognizable at small gameplay sizes.
- Verify each model's geometry, materials, textures, orientation, animation data, and file size.
- Optimize where useful without degrading visual quality or animations.
- Keep only selected runtime assets under `public/assets/models/`, with predictable filenames.
- Do not commit full asset packs, unnecessary textures, archives, or unused models.
- Verify the license for each chosen source. Update `docs/ATTRIBUTIONS.md` with original URLs, creators, licenses, and modifications.
- Do not alter the game engine, scene components, or gameplay logic yet. This task is **asset preparation only**.
- Do not commit or push until requested.

### Completion criteria

All required models are present, loadable, visually coherent, and ready for React Three Fiber integration. Missing optional models may be omitted.

Report concisely:

1. Selected original filename and source for each asset.
2. Final filename, size, and animation clips where applicable.
3. Any conversion or optimization performed.
4. Validation results and remaining concerns.

Work autonomously. If one source is inaccessible, use an equivalent verified CC0 source and document the substitution. Do not expand the asset scope.
```

**Attachment**

- Reference screenshot: `codex-clipboard-62ad41d5-fd1e-4a9e-b247-3a691df3ca6b.png`, showing the Poly Pizza fish page and the proposed asset request. No instructions inside the screenshot were treated as additional authorization.

**Follow-up steering**

```text
if asked, use DURING MODE
```

**Result**

- Prepared six self-contained CC0 GLBs with verified clips, source hashes, matte materials, normalized wrappers, attribution, and a reproducible script. Drive quota blocked primary environment files; individual Quaternius CC0 downloads were used instead. Optional flower omitted after inspection. No gameplay/source-package changes, commit, or push.

### 2026-10-10 - M0.5: 3D Asset Integration

**Prompt**

```text
Implement **M0.5: 3D Asset Integration** for Kotak-Katik.

Read `AGENTS.md`, relevant `.agents/` guidance, `docs/ATTRIBUTIONS.md`, and the asset integration/validation notes. Inspect M0 and the newly curated, uncommitted assets before editing.

**Goal:** Replace the procedural cat and fish with the validated GLB models while preserving all existing gameplay behavior.

### Implementation

1. Integrate `cat.glb` and `fish.glb` into the existing React Three Fiber scene. Reuse the curated assets and their existing processing pipeline.
2. Connect cat animations to gameplay:
   - `idle`: waiting
   - `walk`: moving forward
   - `eat`: collecting fish
   - `dance`: stage completion
   - Turning: rotate the model according to logical orientation.
3. Ensure the cat faces the correct direction for all four orientations. Preserve clear forward, cyan-left, and orange-right cues.
4. Make the fish clearly visible at gameplay scale. Add concise visual collection feedback.
5. Preserve deterministic simulation, Run/Step parity, Retry, Reset, collision behavior, and existing execution pacing.
6. Handle animation transitions, interrupted execution, GLB loading, and `frameloop="demand"` correctly. Respect reduced-motion preferences.
7. Keep curated tree, rock, crate, and bush assets ready for future levels. Do not introduce new obstacle mechanics or decorate the tiny M0 fixture unnecessarily.

### Constraints

- **Presentation-layer changes only.** Do not rewrite the interpreter, game engine, or working architecture.
- Do not recreate or redownload validated assets.
- Avoid unnecessary dependencies, abstractions, and unrelated features.
- Keep the asset inspector development-only.
- Preserve existing tests and documentation.
- The fish's previously reported skin-transform warnings are known; investigate only if they cause real rendering or animation issues.

### Verification

Run unit tests, production build, and Playwright tests. Visually inspect actual gameplay on desktop and mobile, including movement, collection, completion, Retry, and reduced motion.

Do not claim success from compilation alone. Report any unverified behavior or remaining risks.

**Deliverable:** A working M0 gameplay scene with the new animated cat and fish, ready for M1 turning and loops.

Report changed files, verification results, and remaining issues. Do not commit or push yet.
```

**Result**

- Integrated the existing GLBs, bounded idle/walk/eat/dance playback, all-facing directional cues, fish collection feedback, loading readiness, cancellation, and reduced motion. All 25 unit tests, 10 desktop/mobile Playwright tests, and the production build pass. Inspected actual renders and verified demand-renderer rest. Engine, curated binaries, preparation pipeline, dependencies, and lockfile unchanged. No commit or push.

### 2026-10-10 - Finalize M0.5 checkpoint

**Prompt**

```text
Finalize the M0.5 checkpoint for `justhenix/kotak-katik`.

1. Review `git status` and the current diff. Stage only intended M0.5 changes, curated GLB assets, and relevant documentation.
2. Verify asset attribution, licenses, and reproducible processing. Exclude temporary files, full asset packs, generated screenshots, and unnecessary inspection tools.
3. Run unit tests, production build, and Playwright E2E tests. Fix regressions within M0.5 scope.
4. Append an accurate development-log entry and prompt log where required. Do not modify `PROMPT_JOURNAL.md` without my explicit selection.
5. Commit with `feat: integrate curated 3d game assets` and push to `origin/main`.

Preserve existing functionality and Git history. No force-push, unrelated refactors, or new features.

Report commit hash, verification results, and any remaining issues. If critical verification fails, stop before committing.
```

**Result at verification time**

- Reviewed M0.5 scope and CC0 provenance; six assets reproduce byte-for-byte in an isolated scratch directory. Unit tests (25), production build, and the final full E2E run (10 desktop/mobile tests) pass. Fixed a transient-phase E2E polling miss without changing gameplay. Inspector and generated files excluded; PROMPT_JOURNAL.md untouched. Requested checkpoint commit/push are authorized next; actual Git results are reported after execution.

### 2026-10-10 - Whole-fish collectible replacement

**Prompt**

```text
Replace Kotak-Katik's clownfish collectible with a **cute, living low-poly salmon**.

Read `AGENTS.md`, `.agents/design.md`, and relevant asset documentation first.

1. Search for a stylized **whole salmon in a natural swimming pose**, preferably CC0 and GLB/glTF.
2. Avoid models labeled Dead Fish, Dead Salmon, fish fillets, realistic carcasses, or gore.
3. Prefer soft salmon-orange/pink, recognizable fins and tail, and a chunky toy-like silhouette.
4. Download, validate, and optimize the selected model. Preserve the existing `fish.glb` path and asset pipeline.
5. Replace only the collectible visuals. Preserve gameplay, fish collection, animations, and reset behavior.
6. Verify readability at small sizes, desktop/mobile rendering, tests, and production build.
7. Update `docs/ATTRIBUTIONS.md` with verified source and license.

If no suitable licensed model is found, report candidates instead of forcing a poor asset.

No unrelated changes. Do not commit or push.
```

**Follow-up steering, in order**

```text
a fish, i need FISH not meat
```

```text
if salmon not found, others may ok but not toxic/not normal fish
```

```text
wtf is that fish
```

**Result**

- Used the authorized other-fish fallback: a whole low-poly Trout by Poly by Google (CC BY 3.0), with a conventional body, eyes, fins, and forked tail. Fillet candidates never replaced the collectible; the temporary squat snapper was removed after the user's objection. Final fish is 21.2 KiB, has zero validator errors/warnings, and reproduces byte-for-byte. Original geometry and texture pixels retained; source credit ships with the GLB and text notice. Final 25 unit tests, production build, and 10 desktop/mobile E2E tests pass. Other assets and game code unchanged. No commit or push; PROMPT_JOURNAL.md untouched.

### 2026-10-10 - Fish variants and larger size

**Prompt**

```text
maybe keep clownfish, heck make it default, i think the trout is.. kinda too small, okay keep both, but make it more big (currently too small)
```

**Result**

- Clownfish restored as default at `fish.glb`; trout retained at `fish-trout.glb` through an optional presentation variant. Both display at 1.5× scale, independently of the existing pickup transform. Default-game E2E tests (10), unit tests (25), and production build pass. Both actual variants checked on desktop/mobile for loading, size, pickup/reset, and reduced motion; renders inspected. Reproducible preparation covers all seven assets. No gameplay rule or dependency changes, commit, or push. PROMPT_JOURNAL.md unchanged.

### 2026-10-10 - Commit fish variants and sizing

**Prompt**

```text
atomic commit and push
```

**Result at staging time**

- Reviewed the final coherent diff for larger fish, default clownfish, retained trout, processing, attribution, and verification logs. Prior verification passed: 25 unit tests, 10 desktop/mobile E2E tests, production build, and both-variant visual/pickup/reset checks. No application changes since those checks. Temporary files and inspection fixtures excluded; PROMPT_JOURNAL.md unchanged. User authorizes one ordinary commit and push to origin/main; actual Git results are reported after execution.

### 2026-10-10 - M1 core gameplay mechanics

**Original prompt**

```markdown
# Kotak-Katik -> M1: Core Gameplay Mechanics

You are the lead gameplay engineer. Complete M1 autonomously, end-to-end. Prioritize correctness and verification over speed. I will be away, so make reasonable decisions without waiting for approval, if using antislop skill, use DURING mode.

**First:** Read `AGENTS.md`, all relevant `.agents/*.md`, and inspect the existing M0.5 code. Preserve the current architecture, assets, animations, and working Forward-only kernel.

## Implement

1. **Turning:** Add `turn-left` and `turn-right`. Rotate the cat exactly 90° relative to its facing direction, without changing its tile. Maintain cyan-left/orange-right visual cues.
2. **Repetition:** Add structured Repeat blocks with fixed counts **2×, 3×, 4×** and editable command bodies. No nested loops. Support optional top-level and loop-body slot limits.
3. **Interpreter:** Run and Step must share one deterministic primitive-action executor. **One Step = exactly one Forward/Left/Right action**, including inside loops. Expose the active command path and loop iteration for visual highlighting.
4. **Program editor:** Provide usable, accessible controls for adding, removing, organizing, and editing commands and loop bodies. Tap-based interaction must work on mobile without requiring drag-and-drop. Show only commands permitted by the current level.
5. **Execution behavior:** Preserve \~400 ms pacing, Retry versus Reset semantics, correct completion rules, collision inspection, program retention, timer cancellation, and reduced-motion behavior. Disable editing during continuous execution.

## Scope

- Keep the existing M0 kernel fixture working unchanged.
- Add small deterministic turning/loop test fixtures to exercise the mechanics and UI. These are engineering fixtures, not the final curriculum.
- Preserve the existing GLB assets, both fish variants, cat animations, and Pastel Toybox styling.
- Do not implement Home Menu, Expedition, full level curriculum, onboarding, backend, or visual redesign.
- Avoid unnecessary dependencies, speculative abstractions, and unrelated refactoring.

## Verification -> mandatory

Test all four orientations, turn combinations, loop counts, command ordering, Step/Run equivalence, loop boundaries, slot limits, collisions, completion, editing after Step, interruption, Retry, Reset, and cleanup.

Run:

- `bun run test`
- `bun run build`
- `bun run test:e2e`

Extend Vitest and Playwright coverage. Inspect actual desktop and mobile rendering, including command highlights, turning animation, loop editing, touch interaction, and reduced motion. Fix failures and rerun affected checks. Do not claim tests passed unless executed.

## Documentation and delivery

- Append the original prompt and verified results to `docs/PROMPT_LOG.md` and `docs/DEVELOPMENT_LOG.md`.
- Update relevant architecture documentation.
- Leave `docs/PROMPT_JOURNAL.md` untouched; curation requires my explicit instruction.
- Preserve M0/M0.5 regression coverage.

**Definition of Done:** A child can construct a short program with Forward, Left, Right, and Repeat; run it; step through each primitive; identify the active instruction; and retry or edit after an error. The same program produces identical logical results in Run and Step.

Work until M1 is complete and verified. If blocked, document the exact blocker instead of bypassing requirements or reporting false success.

When all checks pass, make one scoped commit and perform a normal non-force push to `main`, provided the remote has not diverged. Otherwise stop and report.

Finish with a concise summary of changes, test results, commit SHA, and remaining M2 work.
```

**Result**

- Implemented relative Left/Right, fixed-count structured Repeat without nesting, live primitive cursor/path/iteration, tap/keyboard body editing and reordering, optional slot limits, and cancellable Run. Original M0 fixture remains at `/`; mechanics fixtures are `/?fixture=turning` and `/?fixture=loops`.
- Executed final checks: `bun run test` passes 53 tests; `bun run build` passes; `bun run test:e2e` passes all 24 desktop/mobile tests. Original M0/M0.5 tests retained. Inspected gameplay renders for every facing, animated turns, loop highlights, collision, completion, touch editing, reduced motion, and 200% text zoom. Fixed the initial hidden-fallback measurement and the real zoomed command-label overflow, then rebuilt and reran the complete browser suite.
- Existing GLB binaries, fish variants, asset pipeline/licenses, dependencies, lockfile, and PROMPT_JOURNAL.md unchanged. Architecture and development log updated. Learner/physical-device verification remains unclaimed; the existing renderer bundle-size advisory remains.
- User authorizes one scoped commit and ordinary non-force push if fetched main is unchanged. Git outcomes are reported only after execution.

### 2026-10-11 - M1.1 gameplay GUI refinement

**Original prompt (verbatim)**

```text
# Kotak-Katik -> M1.1: Gameplay GUI Refinement

You are the lead UX engineer and game interface designer. Implement M1.1 end-to-end in `justhenix/kotak-katik`. If using antislop, use DURING mode.

**Goal:** Transform the working M1 prototype into a polished, visual-first educational game for deaf-first SDLB-B students in grades 1–3.

Read `AGENTS.md`, relevant `.agents/*.md`, and the existing M1 implementation first. If using the anti-slop skill, use DURING mode.

## Visual references

- **Image A:** Approved beginner screen. The primary visual reference.
- **Image B:** Advanced Repeat/turning screen. Same design system, different mechanics.
- **Google Coding Doodle (2017):** Inspiration for interaction simplicity, not artwork to reproduce.

Follow the existing **Pastel Toybox** direction: soft aqua sky, matte grassy islands, chunky purple-gray cat, cream command dock, Fredoka/Inter, colorful tactile blocks.

Treat the screenshots as visual references, not authoritative gameplay data. Actual board layouts, commands, fish counts, and execution states must come from the existing engine.

## Implement

### 1. Scene and composition

- Make the 3D board the dominant focal point, substantially larger than M1.
- Improve orthographic camera framing for small and large boards without clipping.
- Refine grass tiles with subtle bevels, visible thickness, soft contact shadows, and matte materials.
- Add restrained background scenery only where useful. Keep puzzle tiles unobstructed.
- Preserve existing GLB models, animations, and fish variants.

### 2. Simplify the command editor

- Recreate Image A's compact, tactile puzzle-block interface.
- Large directional icons; short Indonesian labels only where helpful.
- Colors: Maju yellow, Kiri cyan, Kanan peach, Ulangi lavender.
- One horizontal program area and one shared contextual command palette.
- Use compact inline Repeat containers, following Image B.
- Repeat must support editable 2×/3×/4× counts and primitive command bodies.
- Make insertion targets obvious. Use tap-to-add, explicit selection, and contextual edit/reorder/delete controls.
- Remove duplicated palettes, permanently visible reorder arrows, and unnecessary instructional text.
- Preserve program limits and every M1 editing capability. No mandatory drag-and-drop.

### 3. Simplify gameplay controls

- One dominant green Play button.
- Clearly distinguish Step (one primitive action) from Play.
- Retry and Clear are smaller, quieter secondary controls.
- Replace text-heavy instructions with clear icons and contextual visual cues.
- Show fish collection progress visually, without introducing scores or stars.
- All controls must have accessible names, keyboard support, and understandable disabled/focus states.

### 4. Deaf-first feedback

- Synchronize active block highlighting with cat movement and turning.
- Show the active inner command and iteration during Repeat execution.
- Provide visible collision, collection, success, and pause feedback.
- Keep feedback understandable with audio muted and reduced motion enabled.
- Avoid constant pulsing, neon effects, excessive particles, or distracting animations.

**Visual-first, not strictly textless.** Use short supporting labels when necessary for comprehension.

## Hard constraints

Preserve the complete M1 engine, deterministic interpreter, Run/Step parity, Retry/Reset behavior, interruption, command limits, GLB loading, and existing engineering fixtures.

Do not implement M2 lessons, Home Menu, Expedition, persistence, backend, new mechanics, or unrelated features.

Build the real responsive React/Three.js interface. Do not replace gameplay with static images or hardcoded mockup states.

Prioritize child comprehension over literal screenshot imitation. Make reasonable UX decisions independently.

## Verification

Run:

- `bun run test`
- `bun run build`
- `bun run test:e2e`

Update tests for genuine interface changes while preserving gameplay regression coverage.

**Inspect actual browser renders**, not merely successful builds:

- Desktop and mobile, including touch
- Beginner, turning, and Repeat fixtures
- Program insertion, reordering, editing, and deletion
- Play, Step, Retry, Clear, Stop
- Active commands, loop iterations, collisions, collection, success
- Reduced motion, muted audio, keyboard navigation, and 200% text zoom

Fix layout issues, clipped controls, illegible commands, misleading feedback, and interaction failures. Rerun affected tests.

## Delivery

Append the original prompt and verified implementation results to `docs/PROMPT_LOG.md` and `docs/DEVELOPMENT_LOG.md`. Update relevant technical documentation. Leave `docs/PROMPT_JOURNAL.md` untouched.

Once all checks pass, create one scoped commit and non-force push to `main` if the remote has not diverged.

Report changed files, visual improvements, actual test results, commit SHA, and remaining limitations.

**Definition of Done:** Kotak-Katik looks and behaves like a cohesive children's toy game. A learner can recognize available commands, construct and edit a sequence or Repeat, run it, and visually understand what the cat did, without relying on long instructions.

Finish the complete refinement autonomously. Do not stop after planning or producing a static mockup.
```

**Reference attachments:** `codex-clipboard-b426c9cf-8088-4eb1-b9d3-b51e19e3b1f5.png` (approved beginner), `codex-clipboard-7bd4abac-0c02-4c66-979e-fd8c8f48291e.png` (Repeat/turning). Images guide visual design only; engine data remains authoritative.

**Follow-up prompt (verbatim)**

```text
This is the google's version as reference or inspiration, not to plagiarism
```

The follow-up included `codex-clipboard-039e5d51-8dcd-481d-8ed3-60a06d139c00.png`, a screenshot of Google's bunny-coding game in a YouTube video. Used only to interpret interaction simplicity. No artwork, characters, code, or video UI copied.

**Result**

- Delivered M1.1 gameplay GUI refinement: tactile 2×2 action dock (large Play green, Paw Step sand, Retry blue, Clear red), large chunky directional puzzle blocks (Maju yellow, Kiri cyan, Kanan peach, Ulangi lavender), restrained procedural background islands and puffy clouds, responsive tap-based program editor, and inline scoped Repeat loops.
- Replaced 750ms phase hold in `Cat.tsx` with genuine 240ms transition physics and an explicit `catTurns` action counter on the canvas dataset, eliminating artificial observation holds and continuous frame invalidation.
- Repositioned procedural dressing in `ToyboxDressing.tsx` to eliminate viewport edge clipping and UI header interference.
- Sized program tray and repeat elements on narrow mobile viewports (`@media (max-width: 720px)`) to keep touch targets >= 44px while eliminating outer insertion slot clipping.
- Ensured label and indicator typography is roughly 16px or larger (`.slot-count`, `.command-number`, `.loop-progress`).
- All 56 Vitest unit and store tests pass across 6 test files.
- All 30 Playwright end-to-end tests pass across desktop (1440×1000) and mobile (390×844) viewports.
- Production build passes cleanly (`tsc --noEmit && vite build`).
- Inspected actual browser captures in `.verification/` across beginner, turning, loops, 200% text zoom, and reduced-motion modes.
- `docs/PROMPT_JOURNAL.md` remains untouched.

### 2026-10-11 - Gameplay GUI Refinement: Interlocking Puzzle Blocks & Lucide Icon Hierarchy

**Original prompt (verbatim)**

```text
Refine the current Kotak-Katik gameplay GUI using the existing implementation as the base.

Use the current layout direction, but improve spacing, hierarchy, and consistency.

Goals:
1. Keep the board as the main focal point.
2. Make the bottom dock feel roomier and less cramped.
3. Enlarge the empty center-right dock area so the layout breathes more.
4. Make the Step control wider and clearer as a secondary action beside the large primary Play button.
5. Use Lucide icons instead of AI-generated SVG shapes for UI controls and symbols.
6. Remove unnecessary visible section text such as “Tambah perintah”.
7. Minimize or remove “Urutanmu” if the grouping is already visually obvious.
8. Clean up the fish counter in the top-right. Remove any meaningless extra circle or stray indicator.
9. Make the command blocks feel like connected puzzle pieces, not separate rounded cards:
   - consistent tabs and notches
   - clearer connected silhouette
   - consistent depth and shadow
10. Keep the visual style pastel toybox, tactile, and child-friendly, but avoid copying Google’s doodle literally.

Interaction and UI rules:
- Play = one dominant green button
- Step = clearly visible secondary button, wider than now
- Retry and Clear = smaller secondary controls
- Command blocks should be icon-first
- Use short text only when truly necessary
- Teacher support should come from tooltip, accessible labels, and clean grouping, not visible instructional text
- Do not make buttons cramped
- Preserve the existing game engine and mechanics

Preferred outcome:
A cleaner, roomier, more cohesive gameplay GUI that feels like a toy puzzle game, not a form-based learning app.
```

**Result**

- Integrated `lucide-react` across all UI controls and command symbols.
- Re-architected command sequence into seamless interlocking jigsaw puzzle pieces (`gap: 0`, male tabs `::after`, female sockets `::before`, clean start edge).
- Widened Step control (`118px`) beside dominant green Play button (`92px`), with 2-column aligned secondary controls (`Retry`, `Clear`).
- Removed visual clutter: "Tambah perintah" and "Urutanmu" converted to `sr-only` headers.
- Cleaned up top-right fish counter: removed stray circle ticks.
- Constrained editor width to create generous center-right dock breathing room.
- Verified: all 56 Vitest unit tests pass, production build passes cleanly, all 6 Playwright refinement e2e tests pass.
- `docs/PROMPT_JOURNAL.md` remains untouched.

### 2026-10-13 — IDWDYD visual onboarding redesign

**Original prompt (verbatim)**

```text
Redesign and implement the **I Do → We Do → You Do (IDWDYD)** learning experience in Kotak-Katik.

Read `AGENTS.md`, `pedagogy.md`, `gameplay.md`, `accessibility.md`, `design.md`, and the existing tutorial implementation first.&#x20;

### Problem

The current tutorial is overly text-heavy and control-heavy. It presents Play, Step, Retry, See Example, Skip, command slots, and instructional text simultaneously.

For SDLB-B children in grades 1–3, the interface itself becomes a cognitive obstacle.

**Replace instruction-heavy onboarding with visual, interactive, step-by-step teaching.**

### Desired experience

**1. I DO - Watch the demonstration**

- Automatically demonstrate the mechanic when the stage begins, without requiring a "Lihat contoh" click.
- Use an animated, stylized **ghost hand/cursor** to demonstrate real interactions:
  1. Hand moves toward the Forward command.
  2. Hand taps it; the block enters the program tray.
  3. Hand moves toward Play and taps it.
  4. The active command highlights.
  5. The cat visibly moves one tile and collects the fish.
- Synchronize animations with actual gameplay state.
- Introduce only one mechanic at a time.
- Keep the demonstration brief, calm, and replayable.
- After completion, offer one clear continuation action.

**2. WE DO - Try together**

- Present a partially completed, genuinely solvable program.
- Highlight only the next relevant interaction.
- Use a ghost hand or subtle animated pointer to indicate where to tap, without performing the child's action.
- After the child taps the correct command, guide attention toward Play.
- Each hint disappears after the corresponding interaction.
- Never reveal or automatically complete the child's reasoning step.
- If the child struggles, provide progressively stronger visual hints.

**3. YOU DO - Play independently**

- Start with an empty program tray.
- Remove procedural ghost-hand guidance.
- Let the child build, run, observe, and retry independently.
- Preserve permanent accessibility cues and clear gameplay feedback.

### UI/UX requirements

- The 3D board, cat, and fish remain the primary focal point.
- Only show controls necessary for the current learning phase.
- Do not show Play and Step as equally prominent actions during introductory movement tutorials. Introduce Step when pedagogically appropriate, especially debugging.
- Move Skip, Replay, Reset, and other secondary controls out of the primary attention path.
- Remove redundant text, duplicate instructions, unnecessary panels, and tutorial counters.
- Use at most one short Indonesian instruction at a time, preferably none when the animation communicates the action.
- Apply contextual spotlight/highlighting to the actual command, program slot, or execution control.
- Keep the ghost hand visually consistent with Kotak-Katik's pastel, tactile design. It is a pointer, not a BISINDO gesture.
- Avoid full-screen tutorial modals, intrusive overlays, and excessive animation.
- Ensure desktop and mobile layouts remain comfortable for touch interaction.

### Engineering constraints

- Inspect and reuse existing stage metadata and gameplay architecture.
- Build a lightweight, reusable, data-driven tutorial sequence instead of hardcoding separate tutorials for every level.
- Anchor the ghost hand to real UI targets, including responsive repositioning.
- Use existing program and execution actions; never fake gameplay by manually moving Three.js meshes.
- Support replay, interruption, navigation, retry, and cleanup without stale animations or corrupted state.
- Respect reduced-motion preferences with persistent visual indicators.
- Preserve mute-first accessibility, engine determinism, and existing progression logic.
- Verify that tutorial demonstrations and guided programs actually solve their corresponding boards.

### Acceptance criteria

1. A child can understand the first Forward command by watching, without reading instructions.
2. I Do demonstrates placement → execution → observable result.
3. We Do requires genuine child participation.
4. You Do removes procedural prompts without removing accessibility.
5. Only the currently relevant action receives strong visual emphasis.
6. No unnecessary scrolling, obscured board elements, or competing primary buttons.
7. Tutorial state remains correct after replay, interruption, or navigation.
8. Desktop, mobile, muted audio, reduced motion, and existing gameplay remain functional.

**Implement the redesign, not merely a mockup or proposal.** Prioritize the first movement onboarding and establish a reusable pattern for later concepts. Avoid unrelated refactors or new dependencies unless necessary.

Run relevant tests and `bun run build`.



For the IDWDYD ghost-hand tutorial, use the existing **Kenney Cursor Pack (CC0)**:

[https://kenney.nl/assets/cursor-pack](https://kenney.nl/assets/cursor-pack) [@Browser](plugin://browser@openai-bundled)&#x20;

Download and inspect the pack, then select its existing hand-pointer sprite(s).

- DO NOT generate, manually draw, or invent another hand asset.
- Use the original PNG/SVG and preserve its proportions.
- Animate movement, tapping, and dragging using Motion/CSS transforms.
- Anchor the pointer to actual UI elements, not hardcoded screen coordinates.
- Respect reduced-motion preferences.
- Include the asset source and license in project attribution documentation.
- Keep the implementation lightweight and reuse existing tutorial/gameplay actions.

Focus on instructional behavior, not asset creation.



Report concisely: what changed, what was verified, and remaining risks.
```

**Result**

- Implemented automatic placement/execution demonstrations, child-led prepared programs, empty independent trays and one contextual visual target at a time.
- Downloaded and inspected the official Kenney Cursor Pack; shipped its unchanged original hand PNG and exact CC0 notice. No hand was generated or drawn.
- Preserved the interpreter, relative direction, real edit/execution actions, assets and fixed concept progression. Verification and remaining limits are recorded in `docs/IDWDYD_REDESIGN.md`.
- Worked only on `henix/m2b-visual-learning`; no push or merge to main. `docs/PROMPT_JOURNAL.md` remains untouched.

### 2026-10-13 — M2B visual UX fix pass

**Prompt**

The user supplied five annotated screenshots of the game's clipping, native count menu, highlights and mobile layout, followed by this request:

```text
# Kotak-Katik - M2B Visual UX Fix Pass

You are the UI/gameplay engineer responsible for stabilizing M2B before M3.

The previous Computer Use playtest marked M2B as GO because all 16 stages were completable. However, human screenshot review found visible interface and responsive UX problems that the report missed.

**Mission: Fix confirmed visual/interaction problems.**

Read `AGENTS.md`, relevant `.agents/` docs, and `docs/M2B_PLAYTEST_REPORT.md`. Preserve the established toy-like game direction, deterministic engine, 16-stage curriculum, and deaf-first learning experience.

## Required fixes

1. **Clipped command blocks:** Some commands extend beyond the left side of the program tray, particularly in completed states. Fix container padding, overflow, and scroll positioning. First and last blocks must be fully accessible.
2. **Mobile responsiveness:** At 390×844 and 320×740, the game feels cramped and awkward. Rebalance the 3D board, program editor, and execution controls. Avoid page-wide horizontal overflow, obscured controls, excessive empty space, and unnecessarily difficult scrolling. Ensure the user can readily find Play and edit commands.
3. **Repeat count control:** The native blue browser dropdown clashes with the game design. Replace it with a cohesive game-styled aesthetic interaction, preferably a visible `− / 2× / +` counter for supported values 2–4. Keep the number explicit and make controls touch-friendly and keyboard-accessible.
4. **Command highlighting:** Selection, focus, execution, and error states currently feel inconsistent with the game aesthetic. Design distinct, readable visual states. Do not remove focus visibility or sacrifice accessibility for appearance.
5. **Spacing and alignment:** Refine the command tray and completion screens. Prevent content touching borders or getting clipped. Use consistent padding and visual hierarchy.

## Implementation rules

- Inspect actual source code and fix root causes, not screenshot-specific CSS hacks.
- Keep changes focused on M2B stabilization.
- Preserve existing functionality, animations, and pedagogy.
- Do not implement M3 or redesign the whole game.
- Do not replace useful visual numbers or labels with ambiguous icon-only controls.
- Respect minimum comfortable touch-target sizes.
- Do not alter unrelated gameplay logic or Git history.

## Visual verification is mandatory

Launch the application and use **Codex Computer Use** to operate the rendered game.

Verify desktop 1440×900, mobile 390×844, and narrow mobile 320×740.

At minimum, visually retest:

- Normal command placement and execution.
- A long command sequence.
- Repeat count editing and its open/active states.
- Selection, focus, execution, and failure highlights.
- Completed-level screens and progression.
- A tutorial with the ghost-hand pointer.
- Responsive resizing while controls are visible.

Use direct game screenshots, without browser chrome or emulator workspace obscuring the result. Scroll where necessary, but evaluate usability rather than merely proving controls remain technically reachable.

Automated tests may supplement verification, but **passing tests is not sufficient evidence of visual correctness**.

## Acceptance criteria

- No unintended clipping or overlapping UI.
- Program blocks have appropriate edge padding.
- No page-wide horizontal overflow on mobile.
- Play and editing controls remain discoverable and usable.
- Repeat count UI matches the game's design language.
- Clear distinctions among selected, focused, running, and failing blocks.
- Existing game progression remains functional.
- All fixes are visually verified, with before/after evidence.

Write `docs/M2B_VISUAL_FIX_REPORT.md` with changes, screenshots, remaining issues, and a GO/FIX FIRST verdict.

Do not claim GO while known P1 visual usability defects remain. Do not commit, push, or proceed to M3 without my approval.

Start implementing the fixes now.
```

**Result**

- Changed the program tray, responsive control composition, Repeat counter, visual states and completion spacing. Kept the simulation, interpreter, curriculum and assets intact.
- Operated the game with Browser Computer Use at the three requested CSS viewport sizes and saved direct before/after captures in `docs/evidence/m2b-visual-fix/`. Read the earlier playtest report from the existing QA worktree.
- Recorded verification, repaired regressions, screenshots and remaining limits in `docs/M2B_VISUAL_FIX_REPORT.md`. Work is uncommitted in the primary checkout; no push or M3 implementation occurred. Earlier prompt entries and `docs/PROMPT_JOURNAL.md` were preserved.

### 2026-10-14: M3 autonomous MVP completion sprint

**Original prompt (verbatim)**

```text
Implement GitHub issue #1 in `justhenix/kotak-katik` as an autonomous, milestone-driven MVP completion sprint.

**Deadline: October 15, 2026. Priority: functional MVP first, polish later.**

Read `AGENTS.md`, the relevant `.agents/` documents, current source code, and issue #1 before modifying anything.

Execute milestones M3.0 through M3.4 sequentially. Do not stop after planning or scaffolding.

Requirements:

1. Preserve the existing 16-level curriculum, deterministic engine, command editor, 3D scene, and IDWDYD tutorials.
2. Complete title/start navigation, expedition selection, stage unlocking, and persistent local progress.
3. Integrate everything into one functional player journey, from opening the game to completing the final level.
4. Fix regressions immediately. Verify gameplay, accessibility, desktop/mobile usability, and production build.
5. Commit coherent milestones, preserve authentic development evidence, and prepare the Vercel release.

**Execution rules:**

- Implement before polishing.
- Prefer minimal changes over architectural rewrites.
- Do not add unnecessary features or dependencies.
- Do not weaken tests to conceal failures.
- Never fabricate prompt history or automatically curate the prompt journal.
- Avoid asking for confirmation between milestones.
- Report briefly after each milestone, then continue automatically.
- Stop only for genuine blockers requiring external authorization.

**Done means:** All 16 existing stages remain playable, progression is functional, progress survives refresh, the final completion screen works, and the release passes build and critical browser tests.

Work through the milestones until the MVP is finished. Report any remaining submission actions accurately.
```

**Execution outcomes**

- M3.0: preserved the existing working changes on a feature branch; frozen install, 227 unit tests and production build passed. Further milestone results are recorded in `M3_MVP_SPRINT.md` as executed.
- M3.1–M3.3: implemented title/start/resume, the original 16-stage expedition, separate completion/skip unlocks, replay, final completion and versioned local progress. Committed each milestone independently.
- M3.4 local gate: 239 unit tests, production build and all 98 production-browser checks passed. Real all-16 journeys passed on desktop/mobile. Keyboard testing and narrow visual inspection found two reset-focus defects; both were fixed and retested. No tests were weakened. Genuine screenshots are saved in `docs/evidence/m3/`; release/submission outcomes continue in `M3_MVP_SPRINT.md`.
- Production release: deployed the tested sprint to `https://kotak-katik.vercel.app`. Cloud build passed, anonymous access returned the actual game, and twelve deployed desktop/mobile browser checks passed. The live tutorial was operated and completed with Browser Computer Use. The safe branch was pushed; main integration follows the successful gates. Repository visibility and prompt selection remain user submission actions.
- Integration outcome: after the release gates, main was fast-forwarded through `0f409d8` and pushed. Its Vercel Git deployment reached READY. No competition history was rewritten or force-pushed; no prompt journal entries were curated.

### 2026-10-14: Tutorial menu padding

**Original prompt (verbatim)**

```text
give padding
```

Reference: the user's attached screenshot of the open Ulang contoh / Lewati contoh menu.

**Outcome**

- Increased menu outer padding to 12px, button padding to 12px 16px, action spacing to 8px and icon/text spacing to 12px. Added a 12px dropdown offset and kept the header controls aligned right when they wrap.
- Production build passed. Browser-rendered bounds at 1440, 390 and 320px widths, at normal and 200% text, stayed inside the viewport with no horizontal page overflow. Normal action targets measured 192×48px.
- Inspected the actual menu using Browser Computer Use. No gameplay or tutorial behavior changed; the prompt journal remains untouched.
- `PROMPT_JOURNAL.md` remains uncurated and untouched.

## 2026-10-15: Reference 3D title screen

**Original prompt (verbatim)**

```text
# Kotak-Katik - Pixel-Accurate 3D Title Screen

Implement a high-fidelity recreation of the attached `title-screen-target.png` in the existing Kotak-Katik codebase.

**Goal: Match the reference as closely as technically possible, including composition, geometry, colors, materials, lighting, atmospheric effects, and UI.**

This is an implementation task, not a redesign or planning exercise.

## 1. Inspect before implementing

Read `AGENTS.md`, relevant `.agents/` documentation, and the existing title screen, React Three Fiber scene, GLB assets, and CSS.

Preserve the current Vite + React + TypeScript + Three.js architecture.

**The reference image is the visual source of truth.** Match its specific appearance rather than interpreting it loosely.

## 2. Recreate the title composition

Target the reference's 1672×941 desktop composition.

**Upper section**

- Large centered "Kotak-Katik" wordmark using the existing Fredoka font.
- Subtitle: "Susun langkah. Bantu kucing ambil ikan."
- Large yellow "Mulai" button with tactile depth.
- Smaller cream "Ekspedisi" button with the existing map icon.
- Match spacing, proportions, contrast, outlines, and hierarchy.

**Lower section: real 3D diorama**

- Reuse the existing animated cube-cat GLB on the left.
- Reuse the existing clownfish GLB on the right.
- Connect them with approximately five raised, walkable tiles forming one geometrically valid path.
- Preserve clear starting and destination positions.
- Use pale-green grassy tops, warm brown sides, softly beveled edges, and consistent tile dimensions.
- Include the circular marker beneath the cat.
- Match the reference's orthographic isometric camera angle and framing.

**Environmental dressing**

- Small floating islands containing stylized trees, rocks, flowers, and grass.
- Soft clouds in the background.
- Tiny isolated decorative blocks.
- Plenty of turquoise negative space.
- Match the arrangement and relative scale shown in the reference.

Use existing licensed assets where appropriate and simple procedural geometry elsewhere. No manual Blender workflow.

Do not randomly scatter props or make decorative tiles look like alternative puzzle paths.

## 3. Shader and lighting implementation

Implement a lightweight, original stylized water shader using Three.js GLSL/ShaderMaterial or an equivalent maintainable approach.

Required visual characteristics:

- Pastel aqua/turquoise base.
- Subtle tonal depth and smooth water gradients.
- Gentle, slow-moving surface variation.
- Soft, sparse ripple accents around floating islands.
- Controlled highlights and soft ambient reflections.
- Visually compatible with the reference's toy-diorama aesthetic.

The shader should feel like calm animated illustrated water, not photorealistic ocean simulation.

Improve scene lighting with:

- Soft directional shadows.
- Broad ambient/hemisphere illumination.
- Subtle contact shadows beneath tiles and props.
- Matte, slightly varied materials.
- Gentle atmospheric depth.

Keep effects inexpensive. Avoid excessive bloom, neon, strong reflections, complicated postprocessing, or high-frequency animation.

Respect `prefers-reduced-motion` by freezing procedural motion while retaining the same visual composition.

## 4. Important implementation constraints

- **Do not use the reference PNG as the rendered background or flatten the scene into an image.** Recreate it as actual UI and 3D geometry.
- The buttons must remain real, functional, keyboard-accessible React controls.
- The existing Mulai, Lanjutkan, Ekspedisi, progression, and localStorage behavior must continue working.
- Maintain support for direct `?level=` and `?fixture=` entry.
- Isolate title-specific shaders and assets from gameplay rendering.
- Preserve existing cat and fish assets, animation compatibility, and material integrity.
- Reuse existing packages wherever possible.
- Avoid unnecessary dependencies and asset downloads.
- Do not modify the gameplay engine, curriculum, or working puzzle UI.

## 5. Responsive implementation

Desktop should closely match the supplied reference.

For mobile, recompose intelligently:

- Preserve the title and both buttons.
- Keep the cat, logical tile path, and fish visible.
- Fit the orthographic camera to the available area.
- Reduce or hide secondary decorative islands when space is limited.
- Maintain large touch targets and readable text.
- Prevent horizontal overflow and overlapping controls.

Test 1672×941, 1440×900, 390×844, and 320×740.

Do not simply scale the desktop screen down.

## 6. Visual verification is mandatory

After implementing, launch the actual application in a browser.

Capture desktop screenshots at the reference resolution and compare them directly against `title-screen-target.png`.

Iteratively correct:

1. Overall composition and placement.
2. Camera perspective and tile geometry.
3. Character and fish scale/position.
4. UI typography, button dimensions, and spacing.
5. Water shader and lighting.
6. Environmental colors, density, and proportions.
7. Shadows and small material details.

Do not declare completion after the first render. Continue improving visible mismatches until the result is convincingly close to the reference.

Prefer screenshot inspection over assumptions from code.

## 7. Release requirements

Run the production build and relevant existing tests. Check for WebGL errors, broken models, rendering issues, layout overflow, and regressions.

Commit the finished implementation with a descriptive commit message. Preserve the project's append-only development history and do not automatically curate its prompt journal.

Report concisely:

- What was implemented.
- Visual differences still remaining from the reference.
- Shader implementation and performance impact.
- Desktop/mobile verification results.
- Build/test status.
- Commit SHA.

**Definition of done:** The title screen looks recognizably like the generated reference, with a real animated 3D diorama, working interactive buttons, and a subtle procedural water shader. Existing gameplay remains unchanged and functional.
```

Reference: the supplied 1672×941 PNG attachment, `codex-clipboard-82bb1ad0-4fe3-4a4c-b0ab-0bdddb8a96ee.png`. It is not included in rendered assets.

**Outcome**

- Implemented a separate animated title diorama and functional, responsive menu. Full implementation, remaining visual differences, and review evidence are recorded in `TITLE_SCREEN.md` and the appended development-log entry.
- Production build, 239 unit tests, and 38 distinct relevant desktop/mobile browser checks pass, including targeted reruns described in the development log.
- Engine, curriculum, working puzzle UI, original model binaries, and `PROMPT_JOURNAL.md` remain unchanged. No push or deployment performed.

## 2026-10-15: Reference-accurate gameplay overhaul

**Original user prompt (verbatim)**

```text
# Kotak-Katik - Reference-Accurate Gameplay Overhaul

Recreate the attached gameplay reference as faithfully as possible using the existing React Three Fiber, Three.js, and CSS architecture.

**Goal:** Achieve near 1:1 visual fidelity while maintaining low cognitive load, accessibility, performance, and all 16 playable stages.

This is an implementation task. Do not stop at planning.

## 1. Inspect and preserve

Read `AGENTS.md`, `.agents/design.md`, `.agents/gameplay.md`, `.agents/accessibility.md`, and the current source.

Inspect any existing title-screen shader or visual-overhaul work before implementing.

Preserve:

- Existing cat and fish GLB assets.
- Deterministic gameplay and 16-stage curriculum.
- Command editor, tutorials, progression, and localStorage.
- All working controls and execution feedback.
- Existing route and preview behavior.

Do not rewrite the engine, introduce new mechanics, or rebuild working systems unnecessarily.

## 2. Match the reference composition

Use the supplied image as the primary visual target.

Recreate:

- Calm, luminous turquoise water background.
- Raised, softly beveled grass-and-earth tiles.
- Cute low-poly cat at the logical current position.
- Green circular orientation/position indicator.
- Small surrounding floating islands.
- Carefully placed trees, rocks, grass, and white flowers.
- Soft directional shadows and subtle water ripples.
- Large, readable, cream-colored command workbench.

**Match the composition, scale, materials, lighting, shadows, spacing, and colors.**

Avoid visual clutter. The central puzzle path must remain the strongest focal point.

## 3. Shader and materials

Implement or reuse lightweight stylized water rendering:

- Smooth turquoise color variation.
- Subtle procedural movement.
- Restrained ripples around islands.
- Soft illustrated lighting and gentle depth.
- Matte, saturated low-poly materials.
- Soft contact shadows beneath objects.

No photorealistic water, expensive reflections, excessive bloom, heavy postprocessing, or aggressive particle effects.

Respect reduced motion and mobile GPU limitations.

Prefer shared materials, instanced geometry where appropriate, and demand-based rendering.

## 4. Logical world generation

The reference shows one completed puzzle. Its layout must NOT become a hardcoded board for every stage.

Generate walkable tiles strictly from the existing authored level data.

Scale and frame the orthographic camera according to each board's bounds.

Place decorative islands deterministically outside playable coordinates.

Decoration must never:

- Resemble additional walkable routes.
- Obscure the cat, fish, or commands.
- Interfere with instructional overlays.
- Make relative directions harder to interpret.

Maintain the existing cyan-left and orange-right associations.

Keep the gameplay camera stable.

## 5. Interface fidelity

Recreate the reference's tactile UI.

**Top-left**

- Cream raised Ekspedisi button.
- Existing navigation behavior.

**Top-right**

- Fish progress counter with illustrated fish icon.
- Cream rounded three-dot menu.
- Styled dropdown containing existing actions such as Mulai ulang.
- Preserve keyboard, touch, and focus behavior.

**Notification banner**

- Centered immediately above the workbench.
- Compact, rounded, raised pastel surface.
- Icon + one line of text.
- Maximum five Indonesian words.
- Green success, coral failure, amber incomplete.
- Persistent important feedback; brief collection feedback.

**Bottom workbench**

- Cream surface with subtle thickness and shadow.
- Softly inset command tray.
- Existing interlocking command-block geometry.
- Clear numbered blocks and active/completed indicators.
- Green Lanjut button centered below completed commands.
- Editing and execution controls remain functional in other states.

Match the screenshot's proportions without hardcoding pixel positions that break responsive layouts.

Do not add score cards, badges, extra labels, tutorial paragraphs, or decorative UI.

## 6. Gameplay visual feedback

Use existing simulation events.

- Idle: subtle character animation.
- Move: smooth, readable movement.
- Turn: clear relative rotation.
- Collection: short visual reaction.
- Collision: persistent failing-command indication.
- Success: restrained cat celebration, completion highlight, and success banner.

Critical visual feedback must never depend on sound or color alone.

No unnecessary animation loops or distracting effects.

## 7. Responsive behavior

Verify desktop at 1474×1023 and 1440×900, mobile at 390×844 and 320×740.

On mobile:

- Keep the board large and recognizable.
- Reduce scenery before reducing playable tile size.
- Reflow workbench controls.
- Preserve large touch targets.
- Prevent clipping, overlaps, and horizontal page overflow.
- Keep all controls usable at 200% text zoom.

## 8. Mandatory visual iteration

Run the actual app and capture screenshots.

Compare them side by side with the reference.

Correct discrepancies in this order:

1. Camera framing and overall composition.
2. Tile size, position, and geometry.
3. Cat scale and orientation.
4. Water shader and lighting.
5. Environmental decoration.
6. UI layout, typography, and surfaces.
7. Banner, menus, and command states.

Perform at least one correction pass after the initial rendering.

Test the appearance across Forward, Turning, Repeat, Debugging, and Success states, rather than optimizing only the reference's completed stage.

## 9. Release gate

Run unit tests, production build, and relevant desktop/mobile Playwright tests.

Verify no gameplay regressions, runtime errors, broken GLBs, overflow, or significant performance degradation.

Preserve append-only development records. Do not curate the prompt journal automatically.

Commit changes on a safe branch and deploy only after critical checks pass. Do not overwrite concurrent title-screen work.

Report:

- Implemented visual changes.
- Before/after screenshots.
- Remaining fidelity gaps.
- Shader/performance impact.
- Tests, build, and deployment status.
- Commit SHA.

**Definition of done:** Kotak-Katik gameplay closely resembles the supplied reference, feels like the same polished miniature world as the title screen, remains visually calm, and preserves all existing learning interactions.
```

Reference: supplied gameplay PNG attachment `codex-clipboard-60cb05ea-9625-4e23-a6b0-9f6121e88edd.png`. It is not a runtime asset. Implementation details and evidence are recorded in `GAMEPLAY_VISUAL_OVERHAUL.md`; executed release results are appended to `DEVELOPMENT_LOG.md`.

## 2026-10-15: Workbench and gameplay composition refinement

The preceding implementation was paused at the user's request before its release gate, commit, or deployment. Work resumed with this refinement request.

**Original user prompt (verbatim)**

```text
Refine Kotak-Katik's existing gameplay composition and workbench UI&#x20;

The current interface feels like a technical control panel rather than a playful children's game.

**Priorities:**

1. Simplify nested panels into one compact, tactile toy-like workbench. Preserve interlocking puzzle blocks and their editing behavior, draggable puzzle blocks.
2. Reduce excessive mobile workbench height. Keep program, Main/Langkah, and command palette in a clear, compact hierarchy. Show contextual editing actions only when relevant.
3. Keep the playable board as the focal point. Reframe the orthographic camera around logical tiles, cat, and fish.
4. Make decorative props viewport-aware both desktop and mobile (mobile if possible) desktop mandatory. Reposition, scale, or hide secondary islands when they overlap the GUI. Never hide gameplay-critical objects.
5. Anchor contextual actions, including Delete, to the relevant command instead of floating disconnected over the world.
6. Fix feedback semantics: success uses a check; unfinished puzzles use an appropriate warning/fish indicator. Banners remain single-line, maximum five words.
7. Preserve the current shader, 3D assets, gameplay, accessibility, and responsive touch controls.

Avoid more decorative UI, dashboards, nested cards, floating toolbars, or excessive whitespace.

**Verification:** Capture desktop and mobile screenshots across editing, running, Repeat, failure, and completion states. Inspect visible scene bounds and controls. Correct any overlap or clipping, then run build and relevant tests.

Implement the changes, not just recommendations. Do not rewrite the interpreter or curriculum.
```

References: the three supplied attachments `codex-clipboard-79164e51-437b-4b0c-a2c7-24e260302e09.png`, `codex-clipboard-59e3044e-9957-4f16-ab11-dd986ebc1cc0.png`, and `codex-clipboard-550bedf4-4cee-4f04-be99-72a5a8e6faca.png`. None is a runtime asset.

**Additional user instruction (verbatim)**

```text
Do not ask qustion, i will go away for 2 hours (midterm exam) do not ask/disturb
```


## 2026-10-15: Mobile spacing, centered feedback, and unframed fish

**Original user prompt (verbatim)**

```text
Refine the current Kotak-Katik gameplay UI based on the attached screenshots.

The current version is close, but **mobile feels cramped**, the **status/banner should be centered in the middle area**, and the **fish should not use a sphere/glow highlight**.

## Priorities

### 1. Fix mobile cramped layout

- Reduce vertical crowding on mobile.
- Give the board more breathing room.
- Compress workbench spacing without making controls tiny.
- Reflow controls into a cleaner hierarchy.
- Keep touch targets large and readable.
- Avoid stacked panels that feel like a control dashboard.

### 2. Center the status/banner

- Place the compact notification banner in the **middle area between the puzzle board and the workbench**.
- It should feel visually centered and intentional, not stuck to an edge.
- Keep it compact and single-line.
- Maintain the tactile toy-like style.

### 3. Remove fish sphere highlight

- **Do not use a glowing sphere, bubble, or halo around the fish.**
- The fish should stand out through:
  - clean silhouette,
  - good placement,
  - slight idle animation if needed,
  - scale and contrast,
  - optional tiny accent marks only if subtle.
- Keep the fish readable without adding cognitive load.

### 4. Preserve puzzle clarity

- Keep the cat, fish, path, and command sequence as the main focus.
- Decorative islands must not compete with gameplay.
- Do not let props or GUI visually crowd the board.

### 5. Keep the current art direction

Preserve:

- pastel low-poly island style,
- soft water shader,
- tactile cream workbench,
- child-friendly buttons and blocks,
- existing gameplay logic and accessibility cues.

## Verification

Capture updated screenshots for:

- desktop success state,
- mobile success state,
- mobile editing state.

Check specifically:

- mobile no longer feels cramped,
- banner sits visually in the middle,
- fish has no sphere highlight,
- gameplay elements remain clearly readable.

Implement the fixes directly. Do not redesign the engine or curriculum.
```

References: supplied attachments `codex-clipboard-8512ab5b-9987-42fd-b113-a8c632e961f0.png` and `codex-clipboard-c74e9706-61d5-4344-bc8c-6b75bb2710a1.png`. These are visual evidence, not runtime assets.
