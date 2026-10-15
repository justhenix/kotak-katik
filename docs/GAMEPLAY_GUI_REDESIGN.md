# Gameplay dock rebuild

15 October 2026. The supplied desktop and mobile images establish the composition: a large readable world, a small floating HUD, and one cream command dock. Their illustrated paths and models do not replace the authored levels or existing GLBs. This report summarizes implementation and verification; it does not reconstruct or curate the prompt journal.

## R1 — Replace the interface architecture

The first redesign attempt retained an expansive command editor and a large Repeat popover. The user rejected it. That hierarchy and its CSS were removed. The replacement has one program strip, one primary-action group, and at most one contextual row inside the same dock. Ordinary command editing never opens a dialog or overlays the board.

- Mobile HUD: one row with map, fish progress, and overflow. Desktop adds the short Ekspedisi label.
- Normal mobile dock: approximately 107 px; an active contextual row increases it to approximately 172 px. Desktop uses larger pieces and more horizontal breathing room.
- The world occupies the remaining grid region. Camera fitting uses the authored playable tile and character envelope between the HUD and feedback. Existing scenery, shaders, lighting, orthographic perspective, and models remain intact.
- Feedback is one short Indonesian line above the dock, with distinct success, unfinished, and failure symbols. Terminal outcomes persist for inspection.

## R2 — Progressive interaction

- Tap a real `+` slot to open one compact palette. Following the user's annotated follow-up, choosing a primitive advances to the next slot and keeps that palette open for repeated taps. Selecting a block, starting execution, closing the row, reaching a full sequence, or completing a guided addition closes it. Replacement still closes after one choice.
- Selecting a primitive shows one row with move, Ganti, delete, and close. Before/after insertion reuses the actual `+` slots around the selected piece. There is one delete action.
- Selecting Repeat shows inline minus/count/plus, Isi, overflow, and close. The overflow replaces that row with secondary move/delete actions.
- Isi replaces the outer sequence with the Repeat body in the same strip. A persistent back button returns to the outer program. No second program panel or nested editing card is created.
- Play becomes Stop while running. Step remains available in the curriculum contexts that require it. In debugging, the same Step control offers Periksa satu per satu after an unsuccessful run. Completion presents Lanjut or Selesai.
- Selecting a failed command preserves the simulation pose and evidence. An actual edit uses the existing reset behavior. Execution follows the active Repeat body and primitive path, returns to the outer strip for top-level actions, and shows the current iteration in the existing back control.
- Tutorial highlights and the ghost hand resolve to mounted controls: insertion slot, palette choice, replacement, Repeat body entry/back, count, Play, or Step. Restart/replay resets the editor scope as well as the existing lesson state.
- Keyboard focus, Escape, named native controls, count keyboard input, optional drag, and touch remain supported. Quick swipes scroll a long program; a deliberate touch hold starts optional dragging. Tapping plus/contextual actions is sufficient for every edit.

The interpreter, simulation rules, authored 16 stages and solutions, relative turning, progress storage, expedition navigation, preview routes, and title screen are preserved. No dependencies, decorative assets, shaders, or gameplay mechanics were added.

## R3 — Actual browser review

Required states are captured from the real production application at actual CSS viewport dimensions, with reduced motion for stable inspection. Geometry assertions check the complete authored board envelope against HUD, feedback, and viewport bounds. Acceptance also checks one HUD row, no editing dialogs, one contextual row, no horizontal page overflow, a dock at most 28% of viewport height, and a world region at least 55% of viewport height.

Visual corrections after inspecting actual renders included removing the old Repeat hierarchy entirely, recovering mobile space by hiding practice-only Step during idle Repeat-body editing, making Isi/Ganti readable, revealing the actual guided insertion slot, and returning the editor to the outer program on lesson restart. The final interaction review also repaired focus after moving to a sequence edge and ensured execution returns from a Repeat body to top-level actions. The touch swipe and hold-to-drag distinction was verified separately before the final browser gate.

| Required state | Capture |
| --- | --- |
| Mobile idle, 390×844 | [image](evidence/dock-rebuild/390-idle.png) |
| Mobile adding, 390×844 | [image](evidence/dock-rebuild/390-adding.png) |
| Mobile Repeat selected, 390×844 | [image](evidence/dock-rebuild/390-repeat-selected.png) |
| Mobile Repeat body, 320×740 | [image](evidence/dock-rebuild/320-repeat-body.png) |
| Mobile debugging, 390×844 | [image](evidence/dock-rebuild/390-debugging.png) |
| Mobile completion, 390×844 | [image](evidence/dock-rebuild/390-completion.png) |
| Mobile collision, 390×844 | [image](evidence/dock-rebuild/390-failure.png) |
| Desktop editing, 1440×900 | [image](evidence/dock-rebuild/1440-editing.png) |
| Desktop Repeat, 1440×900 | [image](evidence/dock-rebuild/1440-repeat.png) |
| Desktop success, 1440×900 | [image](evidence/dock-rebuild/1440-success.png) |
| Desktop 200% text | [image](evidence/dock-rebuild/1440-zoom.png) |
| Mobile 200% text, 390px | [image](evidence/dock-rebuild/390-zoom.png) |
| Mobile 200% text, 320px | [image](evidence/dock-rebuild/320-zoom.png) |

## Verification and scope

Final executed results are appended to [the development log](DEVELOPMENT_LOG.md). The production Playwright gate covers all 16 stage witnesses on desktop and mobile, complete real player journeys, Repeat/body operations, tutorial targets, debugging, Stop, Step, retry/reset, GLB loading and animation, reduced-motion rest, title navigation, progress recovery, keyboard focus, touch input, and the required visual states. The new GUI suite checks the replacement interaction structure. Existing curriculum, journey, asset, and release tests use real insertion slots while retaining their authored puzzle and simulation assertions.

Historical UI-specific suites still describe the removed permanent palette and editing-panel structure; the executed browser command is recorded explicitly rather than claiming the entire historical suite passed. Long programs scroll within the dock. Enlarged text can scroll the single contextual row horizontally without page overflow.

Existing art remains simpler than the illustrative reference, and existing logical tiles and cat/fish models intentionally differ. Physical-device performance and comprehension with SDLB-B learners still require device/classroom testing. The pre-existing renderer bundle-size advisory remains. The append-only development history is preserved, the prompt journal is untouched, and the user's pre-existing untracked screenshots are excluded from the commit.
