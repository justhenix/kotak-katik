# Prompt Log

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
- All 56 Vitest unit and store tests pass across 6 test files.
- All 30 Playwright end-to-end tests pass across desktop (1440×1000) and mobile (390×844) viewports. Turn animation phase hold (750ms) ensures deterministic observation under full suite load.
- Production build passes cleanly (`tsc --noEmit && vite build`).
- Inspected actual browser captures in `.verification/` across beginner, turning, loops, 200% text zoom, and reduced-motion modes.
- `docs/PROMPT_JOURNAL.md` remains untouched.

