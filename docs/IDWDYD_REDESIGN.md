# IDWDYD visual onboarding — 2026-10-13

The first movement lesson now automatically shows **placement → Play → active block → cat movement → fish collected**. The board remains the focal point. The earlier M2A curriculum and M1.1 editor/renderer are retained on `henix/m2b-visual-learning`; this change replaces the text-heavy M2B scaffolding above them.

## Learning behavior

- **I Do:** starts when the scene is ready, builds the authored demonstration with real editor actions, then executes it. Editing is locked during observation. The original Kenney pointer moves to the real command/control bounds and taps before the corresponding action. A newly placed block appears in the tray; the hand withdraws during execution so the active command and cat carry attention. The result is held, then one **Lanjut** action appears.
- **We Do:** starts with a prepared, unsolved program. Only the next interaction receives the instructional outline and pointer. Movement requires the child to add the missing Forward; turn stages offer both Left and Right; Repeat requires the child to choose a count. The controller observes edits and attempts, never supplies them. Removing a completed edit restores its cue. After 8 seconds of inactivity the pointer taps twice and one short hint appears; after another 14 seconds authored board/direction cues become available. An unsuccessful attempt also strengthens support.
- **You Do:** every independent stage begins with an empty tray, including debugging. There is no procedural pointer or authored solution hint. Permanent orientation arrows, relative-turn colors and shapes, fish progress, active commands, loop iterations, collision marks and completion feedback remain.
- Play appears when relevant during guided introductions. Step appears for debugging/mixed stages and remains available in engineering fixtures. Introductory movement/sequencing selection offers replacement/deletion without the later reorder/insertion toolbar. Replay, Skip and Reset live under the quiet header **⋯**. No tutorial counter, trace panel, paragraph or full-screen modal remains.

## Metadata and state

`LearningMetadata.demonstration` now supports `add` and `select` alongside Run, Step, restart and replacement. `demonstrationFromEmpty` lets a placement lesson build its program while retaining the original authored witness/starter. `guidance` pairs one typed UI target with a completion condition: an entered command from a choice set, a changed repeat count, or an observed terminal attempt.

`lesson-store.ts` owns demonstration pacing and guide progress. It calls the existing game-store edit, Run, Step, Stop and reset actions. Run completion comes from the simulation subscription; mesh animation never advances the sequence. Tutorial targets derive from current program/execution state. Solution witnesses stay in test-only code. Validation runs the demonstrations through the authoritative interpreter and rejects invalid insertion indices, premature repairs, unavailable guide choices, invalid targets and pre-completed child edits.

Replay cancels prior work and restores the authored sequence. Skip cancels tutorial/game timers, restores the starter when skipping active observation, and never awards completion. Level changes cancel old timers and reset guide state. Hiding the document interrupts a demonstration, retains its observed state and offers replay. Effects, observers and timers clean up on navigation/unmount. Reset restores the prepared program and its cues. Invalid/incomplete child programs remain editable and can be retried.

The guided movement board now has three tiles with one prepared Forward and a missing second Forward, so it requires real participation. It has one spare program slot, allowing a useful overshoot mistake. Independent debugging begins empty as requested: learners inspect their own authored program; the overrun/repair mechanic remains covered by tests. The fixed 16-stage concept order and progressively unlocked command set are unchanged.

## Pointer and motion

The original 64×64 `PNG/Outline/Double/hand_point_n.png` from Kenney Cursor Pack 1.1 is shipped unchanged and displayed at 52×52. It is a UI pointer, not a sign-language gesture. [Attribution and exact source/license](ATTRIBUTIONS.md#tutorial-pointer-2026-10-13).

`GhostHand` anchors the sprite's original fingertip to `getBoundingClientRect()` of the real palette button/group, insertion slot, command, count selector or execution button. A ResizeObserver, editor MutationObserver and resize/scroll listeners reposition it; animation frames coalesce measurements. Turn-choice groups use their center so pointer placement does not suggest a particular answer. The hand is non-interactive and never covers a board element.

Purposeful motion uses CSS transforms/opacity: 700 ms pointer travel with `cubic-bezier(0.77, 0, 0.175, 1)`, a 140 ms tap with `cubic-bezier(0.23, 1, 0.32, 1)`, and 200 ms block arrival. Demonstrations hold the result for 1 second and preserve the existing 400 ms interpreter pacing/240 ms cat presentation. Reduced motion removes travel, tap and block-arrival animations while preserving a static hand, the contextual outline, command execution and all result cues. There is no mandatory or optional audio dependency.

## Verification

- `bun run test`: **227 passed** in nine files. Includes deterministic movement/relative turns, Repeat, stepping/Run parity, collisions, editing/reset, all curriculum solution witnesses, complete demonstrations, guide participation, undo, interruption and progression.
- `bun run build`: **passed**, zero TypeScript errors. Existing bundle advisory: JavaScript **345.64 kB gzip**.
- `bun run test:e2e --config playwright.curriculum.config.ts`: **76 passed**, serial desktop (1440×1000) and mobile touch (390×844). All 16 real stages complete on both viewports. Covers automatic placement/Play and independent transition, replay/skip cancellation, guided repair, Repeat/counts, debugging/Step, reset, keyboard editing, reduced motion, 200% text size, a 320px pointer reflow, original kernel/mechanics, GLB loading/recovery and idle demand rendering.
- Visual inspection then identified a selector also matching the feedback element. After scoping it to the editor, **four targeted desktop/mobile E2E checks passed** on the rebuilt final source. These verify the debugging demonstration focuses its real command button and the failure hand's fingertip stays within the actual failing button bounds; feedback receives no instructional outline.
- Inspected actual desktop/mobile captures for movement, prepared input, turn choice, independent completion, reduced motion/zoom and mistakes. No runtime/console errors were reported in the checked flows. Control bounds are at least 44×44 and page horizontal overflow is checked. Ordinary first movement captures fit the viewport; at large text size, content remains reachable.

Screenshots are local evidence in `.verification/`, not runtime assets. The full pack/ZIP are also local verification material, excluded by Git. SHA-256 equality confirms the shipped PNG matches Kenney's original bytes. The feature work starts from `f1d3151` on `henix/m2b-visual-learning`; main and the M2A/M1.1 worktrees are preserved. No push or merge was performed.

## Remaining limits

Physical devices and comprehension with SDLB-B children/teachers have not been tested. Browser mobile touch is emulated. At 200% text size or short landscape viewports, vertical scrolling can be necessary; the ordinary first movement layout fits desktop/mobile without page overflow. WebGL is required, and the existing renderer bundle advisory remains (about 346 kB gzip). Progress is session-only; no new persistence, dependency, Home Menu, Expedition Map or BISINDO media was added.
