# M1.1 gameplay interface

The existing M1 engine, fixture data, execution cursor, 400 ms pacing, GLBs, asset preparation, and fish variants are retained. This milestone changes presentation and program editing. No lessons, menu, progression, persistence, audio, or new mechanics are added.

## Composition and scene

- Aqua sky and a larger board establish one focal point. The opaque cream dock separates the program from the world without adding panels around each command.
- Orthographic fitting projects the occupied tiles and the cat's travel envelope, centers the projected bounds, and fits both viewport dimensions. It does not rotate or follow the cat during execution. The canvas can shrink when the dock grows, avoiding stale intrinsic canvas height.
- Shared, lightly beveled soil and grass geometries give tiles thickness. Matte materials, directional shadows, and a transparent shadow receiver ground the cat and islands. No scenery is added: the small fixtures benefit from unobstructed space.
- RoundedBoxGeometry comes from the installed Three.js addon, checked against its source and [official documentation](https://threejs.org/docs/pages/RoundedBoxGeometry.html). No package or asset is added.

## Editing contract

`ProgramTray` owns a presentation-only target `{ kind: 'insert' | 'select', index, loopIndex? }`. It never advances the simulation. Selecting a block does not delete it or reset the board.

| Interaction | Result |
| --- | --- |
| Tap the palette | Insert at the selected `+`; continue inserting after the new block |
| Add Repeat | Insert an empty 2× Repeat and select its inner `+`; execution stays disabled until filled |
| Tap a primitive | Select it; the shared palette offers replacement primitives |
| Tap a Repeat header | Select the container; reveal its 2×/3×/4× native selector |
| Previous / next | Move the selected block within its scope; retain selection and keyboard focus |
| Before / after | Show a visible insertion target at that exact position |
| Delete | Remove only the selected command; focus the scope's final `+` |
| Outer `+` / Escape | Return to insertion in the outer program |
| Clear | Restore the level's original program and simulation, matching M1 Reset |

`addCommand(type, loopIndex?, atIndex?)` retains the old append API when the index is omitted. Invalid indices, full scopes, forbidden commands, and nested Repeat are rejected. `replaceCommand` changes only a primitive; it works when the scope is full because it does not consume another slot. Both pass through the existing edit validation/reset boundary and remain locked during Run. No-op replacement retains the current simulation.

The palette exists once. Repeat body context excludes Repeat. Existing top-level and body limits remain authoritative in the store. Selection, count controls, and scope routing are UI state; the program remains typed domain data.

## Execution and visual feedback

The green Play button changes to a square Stop control in the same location. Step has a triangle-and-bar icon and the visible label `Satu langkah`. Retry and Clear use smaller neutral controls. Run/Retry still restart, Stop preserves the current cursor, and Step continues that cursor.

Active command paths come directly from the interpreter. A solid outline and a small play marker identify the active primitive; a dashed outline/check identifies selection. Failure adds a persistent exclamation marker, warning outline, red cat ring, and an X at the blocked board edge. The edge marker stays near the cat instead of being lost beyond the board bounds. It does not change the collision coordinates or rules.

Repeat shows numbered iteration markers; the current iteration is filled and the feedback row repeats `current / total`, including when the header is outside the scrolled strip. Fish progress derives from actual collected IDs; ticks, world pickup/removal, the retained cat reaction, and short feedback communicate collection. Success keeps a check and completion message. Pause is explicit in the feedback row. Reduced motion preserves all these static signals.

## Responsive and accessible behavior

The program is intentionally one horizontal strip, with contained scrolling for longer programs and loops. Insertion, keyboard focus, and execution reveal the relevant block. Execution scrolling changes only the strip's horizontal offset so the board stays in view. The page itself must not scroll horizontally.

Desktop places the program and palette beside execution controls. Narrow layouts and larger text move the controls below. Text can wrap and controls can grow; the canvas yields height when the dock needs it. Mobile retains a readable board and at least 44×44 CSS pixel targets. Safe-area padding keeps the bottom row reachable.

All actions use native buttons/selects with accessible names and keyboard operation. Focus uses a blue solid outline distinct from selection and active execution. No action requires hovering or dragging. No audio is loaded or required; validated BISINDO remains an integration point rather than invented material.

## Design rationale

Anti-Slop DURING: **ENERGY 2 / RHYTHM 2 / MOTION 2**, inherited from `.agents/design.md` and the approved screenshots. Google Coding Doodle is an interaction reference only; no Google artwork or code is copied.

- Yellow Maju, cyan Kiri, peach Kanan, and lavender Ulangi encode command meaning, with redundant arrow geometry.
- Puzzle tabs and short extrusion repeat the tile language and make commands look tangible.
- Green is reserved for the dominant execution control; secondary actions use cream.
- Fredoka gives the wordmark and brief headings warmth; Inter keeps controls legible.
- Contextual editing removes always-visible reorder controls while preserving each action.
- Purposeful cat motion remains interruptible; no perpetual UI animation or decorative particles are introduced.

Verified results and remaining limitations are recorded in DEVELOPMENT_LOG.md. Engineering fixtures do not establish child comprehension; SDLB-B learner/teacher validation and physical-device testing remain future work.
