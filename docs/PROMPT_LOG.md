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
