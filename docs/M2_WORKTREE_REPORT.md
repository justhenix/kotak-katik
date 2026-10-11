# M2A: Educational Curriculum

Date: 2026-10-12 (Asia/Jakarta).

Worktree: `D:\Dev\Worktrees\Codex\c10b\KotakKatik`.
Branch: `henix/m2a-educational-curriculum`.
Starting checkpoint: `0deab43` (this worktree initially had a clean, detached HEAD).

## Scope and architecture

M2A authors 16 deterministic playable stages for the existing M1 interpreter and editor. The only existing source files changed are `src/game/types.ts` and `src/game/levels/mechanics.ts`. New files contain curriculum data, authoring validation, test-only solution witnesses, curriculum unit/store tests, browser tests, and this report. The separate Playwright configuration uses port 4175 because the existing port 4173 was already occupied.

No gameplay layout, CSS, command component, action control, Three.js rendering, asset, home menu, expedition map, shared development log, or curated prompt journal was edited. No framework, package version, lockfile, simulation rule, or store implementation was changed. No progression/persistence was implemented. No merge or push is part of this delivery.

Guidance consulted: root `AGENTS.md`, `.agents/pedagogy.md`, `.agents/gameplay.md`, `.agents/product.md`, relevant architecture/testing sections of `.agents/technical.md`, `.agents/accessibility.md`, `.agents/quality-bar.md`, `.agents/design.md`, `docs/M1_ARCHITECTURE.md`, and `docs/M1_1_INTERFACE.md`. Skill routing used KISS, the anti-slop core in DURING mode, Humanize for short Indonesian instructions, Webwright with the repository's Playwright tooling, and the project's surgical recovery guidance for verification failures.

`LevelDefinition.learning` now accepts the seven curriculum concepts and demonstration/guided/independent phases while preserving the existing `practice` fixtures. Instruction and visual-hint fields are optional for old levels. Curriculum levels additionally require these fields and an instructional order/prerequisite record. The existing `loop` concept identifier is retained for repetition; `turning` means relative turning. Prerequisites are descriptive data only.

The selector supports `?level=<stable-id>` without changing the store or application. A recognized level takes precedence over `fixture`; an absent, empty, or unknown ID falls back to the existing fixture selector. `/`, `?fixture=kernel`, `?fixture=turning`, `?fixture=loops`, and unknown-fixture behavior remain intact. Like the existing engineering fixture URLs, preview URLs are available in the production build; they are an engineering entry point, not a learner progression flow.

## Curriculum plan

Order is fixed: Movement -> Sequencing -> Relative Turning -> Combined Paths -> Repetition -> Debugging -> Mixed Application.

Notation: `F` = Maju, `L` = Kiri, `R` = Kanan, `n×[...]` = a single flat Ulangi block. Slot limits count top-level blocks. Body limits count primitives inside each Ulangi.

| # | Stable ID | Concept / phase | Tiles / fish | Start facing | Slots / body | Starter | Verified solution | Learning purpose |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `m2-move-watch` | Movement / demonstration | 2 / 1 | East | 2 / none | F | F | One command causes one tile of movement. |
| 2 | `m2-move-try` | Movement / guided | 2 / 1 | North | 2 / none | Empty | F | Place the single available command with a slot cue. |
| 3 | `m2-sequence-watch` | Sequencing / demonstration | 3 / 2 | East | 3 / none | FF | FF | Trace the first and next actions against two pickups. |
| 4 | `m2-sequence-build` | Sequencing / independent | 4 / 2 | West | 4 / none | Empty | FFF | Plan three actions with an intermediate fish and a gap. |
| 5 | `m2-left-watch` | Relative Turning / demonstration | 3 / 1 | East | 4 / none | FLF | FLF | Left changes facing without moving; Forward uses the new facing. |
| 6 | `m2-right-together` | Relative Turning / guided | 3 / 1 | North | 4 / none | F | FRF | Add the right turn and movement to a known prefix. |
| 7 | `m2-turn-alone` | Relative Turning / independent | 3 / 1 | South | 4 / none | Empty | FLF | Transfer relative left to a south-facing cat. |
| 8 | `m2-path-together` | Combined Paths / guided | 4 / 2 | East | 6 / none | FLF | FLFRF | Extend a demonstrated corner with the opposite turn. |
| 9 | `m2-path-alone` | Combined Paths / independent | 4 / 2 | West | 6 / none | Empty | FRFLF | Plan a mirrored two-corner route without procedural hints. |
| 10 | `m2-repeat-watch` | Repetition / demonstration | 3 / 2 | East | 1 / 1 | 2×[F] | 2×[F] | Revisit the exact two-step board from stage 3, compressed into one block. |
| 11 | `m2-repeat-together` | Repetition / guided | 4 / 1 | North | 1 / 1 | 2×[F] | 3×[F] | Choose a concrete repeat count from the visible distance. |
| 12 | `m2-repeat-alone` | Repetition / independent | 4 / 3 | East | 1 / 2 | Empty | 3×[FR] | Recognize a repeated move-and-turn pattern, not just repeated Forward. |
| 13 | `m2-debug-watch` | Debugging / demonstration | 3 / 1 | East | 4 / 2 | FRF | FLF | Observe a wrong turn, inspect, replace one command, and retry. |
| 14 | `m2-debug-together` | Debugging / guided | 4 / 2 | East | 5 / 2 | FFR | FFRF | Diagnose an incomplete program that finishes with an uncollected fish. |
| 15 | `m2-debug-alone` | Debugging / independent | 4 / 2 | West | 1 / 1 | 4×[F] | 3×[F] | Diagnose an overrun after collecting every fish; collection alone is not completion. |
| 16 | `m2-mixed-journey` | Mixed Application / independent | 5 / 2 | North | 3 / 1 | Empty | 2×[F], R, 2×[F] | Combine known repetition and a relative turn outside the repeat bodies. |

There are no filler or reward-only boards. The deliberate board reuse at stages 3/10 and 5/13 isolates the new concept against a familiar arrangement. Other stages vary facing, fish spacing, two-corner planning, repeat count versus repeated body, and the cause of a faulty result. Boards contain only two to five tiles and one to three fish; the longest witness executes six primitive actions.

Turning, repetition, and debugging each have an explicit I Do -> We Do -> You Do sequence. Foundational movement and sequencing share a compact release: demonstrate a single move, place it with guidance, observe two consecutive moves, then independently construct a three-move sequence. Combined paths extend the already demonstrated turn path in guided practice and then remove that support. Mixed application introduces no new mechanic. A right-turn cue introduces the second turn direction during guided turning, after the left-turn demonstration; no repeat block is available until repetition.

Only Forward is available for the first four stages. Stage 5 adds Left, stage 6 adds Right, and stage 10 adds Repeat. Commands stay unlocked after introduction. All four starting facings are represented. Early slot limits leave one spare block and do not force optimal compression. Repetition-stage limits have a verified purpose: no primitive-only legal solution fits them. The square accepts both 3×[FR] and 4×[FR]; a single witness is not an exact-answer constraint.

Sequencing initially teaches tracing rather than rearranging distinct commands because turning must come later. The effect of changing order is verified on the subsequent relative-turn stage. No screen-relative movement, collectible-order rule, finish tile, nested repeat, variable, obstacle mechanic, or punitive score is added.

## Hint and scaffolding contract for M2B

Hints are typed data, not DOM or mesh references. Cues can identify a board region, starter command path, insertable program slot with legal choices, relative-turn pose/direction, or repeat-count selector. Command paths use the existing `[top]` / `[top, body]` convention. Relative-turn positions and facings are checked against interpreter execution.

Reveals are `on-entry`, `after-action` with a path, `after-attempt`, or `on-request`. For M2B, `after-attempt` means the learner has observed a terminal attempted execution before the fault cue appears; preserve the current board and program for inspection. A repeated body path may recur; an `after-action` hint should first appear after its first matching action. Nothing should autoplay or reveal a repair as soon as a debugging board loads. Debugging hints never appear on entry. Independent stages contain no procedural hints.

Guided stages have a constrained palette, a prepared prefix, an editable repeat count, or a targeted completion cue. These cues recommend an interaction; they do not lock the prefix or disable normal editing. The M1 editor remains usable for alternate legal solutions. Demonstration starters are solved programs except the debugging demonstration, whose deliberately wrong program must be observed and repaired. M2B must stage that demonstration with Step/edit/retry rather than treat it as a solved autoplay.

## Verification

`validateCurriculum` runs at preview-selector module initialization. It checks old level structure, stable unique IDs, exact ordinal/prerequisite order, all seven concepts, gradual phase order, introduction flags, command unlocks, useful limits, connected tile arrangements, non-overlapping fish, usable hint references/choices, cue pose agreement, scaffold fading, unsolved guided tasks, solved non-debug demonstrations, and legal faulty debugging starters. It enforces the full three-phase progression for turning, repetition, and debugging.

Solutions are separate test-only witnesses in `src/game/levels/__tests__/solutions.ts`; the app does not import them. `verifySolution` checks program legality and executes every primitive through the existing interpreter until the program ends. The tests cover all 16 IDs, all fish, final cursor/completion, immutable data, repeat boundaries, constraint rejection before movement, unknown routes, every locked command, alternate legal loop solutions, and exhaustive primitive-only search within each repeat-stage budget.

The curriculum store tests use M1's real `createGameStore`, with fake timers advancing the exact 400 ms pace. They compare Run and Step after every primitive for every witness and every non-empty authored starter, including collisions and programs that stop short. They also cover editor construction, capacity, editing after inspection, Retry, Reset, starter restoration, deep cloning, and timer cancellation. No production store code was changed.

| Check | Command / evidence | Result |
| --- | --- | --- |
| Locked dependencies | `bun install --frozen-lockfile` | Passed; no lockfile change. |
| Unit tests | `bun run test` | 196 tests passed across 8 files. |
| TypeScript and production build | `bun run build` | Passed. Vite reports a large-chunk warning (about 1.23 MB uncompressed application JS). |
| Curriculum browsers | `bun run test:e2e --config playwright.curriculum.config.ts e2e/curriculum.spec.ts` | 36 cases passed: 18 desktop and 18 mobile, in 13.4 minutes. |
| Default-screen regression | `bun run test:e2e --config playwright.curriculum.config.ts e2e/kernel.spec.ts --timeout=120000`; desktop rerun with `--project=desktop` | Mobile passed on the first run; desktop passed on rerun. The original desktop failure is documented below. |
| Rendered-level review | All 32 initial-board screenshots and eight contact sheets were visually inspected. | Passed at desktop 1440×1000 and mobile 390×844 CSS pixels. Boards, fish, orientation cues, and controls remained readable. Decorative islets remain part of the existing renderer and can be clipped outside the board on mobile. |
| Source whitespace and scope | `git diff --cached --check`; staged file review | Passed; exactly 10 M2A files, with no shared logs, GUI files, assets, or dependency changes. |

Initial verification exposed an incorrect locked-command expectation in a new store test and a TypeScript narrowing issue in that test. Both were corrected in test code; production mechanics were unchanged. The first browser launch was rejected because port 4173 was occupied. The separate config corrects that environment collision without interrupting the other process.

The existing desktop `kernel.spec.ts` initially missed the brief disabled-control state after Retry (line 37). Its trace showed the preceding zero-fish assertion taking approximately 870 ms, longer than the two-action program's 800 ms execution window. The failure snapshot was already completed, with controls enabled. The unchanged desktop test passed on rerun; the mobile test passed initially. This is a timing limitation of the existing smoke assertion, not evidence of an altered fixture or a new execution rule. Curriculum Run/Step/store checks and all 36 new browser cases passed without retries. The two successful default regressions bring successful browser-case coverage to 38, with this one initial legacy failure explicitly retained in the verification record.

Browser tests operate the actual production-build editor using mouse clicks on desktop and taps on mobile, not injected store mutations. They render every preview, inspect the initial board, verify available commands and large controls, construct each witness, complete it with Step and Run, compare final visual feedback state, and restore the authored starter. Dedicated cases inspect/repair the wrong-turn starter and check fallback routing. Screenshots are local ignored evidence under `.verification/m2-*`.

## Remaining M2B work and limitations

M2A is curriculum authoring and verification, not a completed learner onboarding experience. The current GUI displays the level title, board, fish count, program, and execution feedback, but does not yet display the new instruction or visual-hint metadata. The debugging and guided programs are fully editable now; automatic demonstrations, ghost pointers, gated hint presentation, staged turn previews, and lesson transitions belong to M2B. No claims about independent child comprehension are made from automated tests.

M2B should:

1. Consume the learning phase, short instruction, and structured visual hints without changing interpreter semantics.
2. Teach the actual M1.1 placement, replacement, repeat-count, Step, Run, Retry, and Reset interactions through brief demonstrations and constrained completions.
3. Present fault cues only after observation and retain the evidence needed to reason about repairs.
4. Resolve starter reset wording: the existing `Hapus semua` restores a level's initial program, which is non-empty in several lessons. This behavior is deliberately retained here and is documented in M1.1.
5. Reconcile the selector/import boundary with Luna's final GUI commit when integrating this branch. Keep stable IDs and the tested fixture fallbacks.
6. Conduct SDLB-B teacher/learner review, especially relative direction, the move-and-turn repeat, debugging after complete fish collection, and fading of guidance. Test physical touch devices as well as browser emulation.
7. Add only validated BISINDO material if supplied. No signs or sign videos were invented; the short instruction/cue metadata provides an attachment point for later validated explanations.
8. Stabilize the existing default smoke test's transient Retry-lock assertion during test integration, using a controlled browser clock or a check synchronized to the start of execution. Preserve the game's 400 ms action pace.

M3 remains responsible for expedition unlocking and persistence. `curriculum.prerequisiteIds` must not be interpreted as implemented progress state. No public deployment, judging accessibility, competition eligibility, or main-branch integration was performed or claimed in this worktree task.

## Exact original task prompt

The following is the original implementation prompt, preserved verbatim. The subsequent steering message was: `if asked ANTISLOP use DURING MODE`.

```text
Kotak-Katik -> M2A: Educational Curriculum

You are the lead gameplay and educational systems engineer. Implement M2A autonomously in this separate Git worktree while another agent refines M1.1's GUI.

Read AGENTS.md, relevant .agents/*.md, and the existing M1 engine before coding.

Objective

Build 12–16 playable, pedagogically coherent levels for SDLB-B grades 1–3.

Follow the exact progression:

Movement -> Sequencing -> Relative Turning -> Combined Paths -> Repetition -> Debugging -> Mixed Application

Apply I Do -> We Do -> You Do scaffolding, one new concept at a time, and progressively unlock commands.

Implementation

Extend LevelDefinition and learning metadata as necessary, maintaining backward compatibility with existing fixtures.

Author deterministic TypeScript level data with stable IDs, meaningful tile arrangements, appropriate fish placement, command restrictions, and program limits.

Include demonstration, guided, and independent stages with suitable initial programs and structured visual-hint metadata.

Include debugging stages with deliberately incorrect but editable starter programs.

Add a non-invasive ?level=<id> development route for previewing individual stages. Preserve existing ?fixture= routes and the default screen.

Validate every level's structure, progression, and solvability using legal command sequences executed through the existing interpreter.

Add comprehensive automated tests, including Run/Step equivalence and meaningful program constraints.

Prioritize 12 excellent levels over 16 repetitive ones. No filler puzzles.

Parallel-work constraints

Luna owns M1.1's GUI. Do not modify:

Gameplay layout, CSS, command components, or action controls

Three.js scene rendering or existing assets

Home Menu or Expedition Map

Existing GUI worktree or main

Concentrate on src/game/, curriculum tests, and new M2 documentation.

Do not implement M3 progression or persistence yet. Do not overwrite Luna's commits or changes.

Verification

Run unit tests, production build, and relevant browser checks. Ensure every authored level has a verified valid solution. Inspect rendered levels where available.

Record the curriculum plan, exact original prompt, decisions, verification, and limitations in docs/M2_WORKTREE_REPORT.md. Leave shared development logs and the curated PROMPT_JOURNAL.md untouched until integration.

Delivery

Work until M2A is complete or a genuine blocker is documented. Make a scoped commit on your isolated feature branch only.

Do not merge or push to main.

Report the branch, commit SHA, level count, test results, and remaining M2B onboarding/integration work.

No unrelated refactoring. No false completion claims. Do not wait for user confirmation on routine implementation decisions.
```
