# Gameplay reference implementation — 2026-10-15

The supplied gameplay PNG is the visual target, used only for inspection. It is not loaded, bundled, or rendered by the game. The implementation uses React controls, existing GLBs, and real Three.js geometry.

## Composition and behavior

- A full-screen aqua world, pale grass, warm raised earth, softly beveled edges, matte foliage, white flowers, soft directional shadows, and restrained shoreline accents reproduce the reference's miniature-world composition.
- The cream header controls, illustrated fish count, inset command tray, numbered interlocking blocks, green Continue action, and compact feedback surfaces retain existing editor and navigation behavior. The menu supports touch, outside dismissal, Escape, and focus return.
- Feedback uses short Indonesian messages with shape/icon cues: green completion, coral collision, amber incomplete. Important outcomes persist; collection feedback lasts 1.2 seconds. Relative directions retain cyan-left/orange-right.
- Every playable tile comes directly from authored level data. Camera fitting uses the complete tile/cat travel envelope. It retains its angle and frame while the available world area is constant; when controls reflow or close, it refits that area rather than leaving the board stranded above unused space. Scenery uses deterministic screen anchors, world-coordinate clearance, and projected exclusion of every tile, cat position, and direction cue. Actual header, workbench, banner, and open-menu bounds also exclude props. Candidates reposition or shrink before being omitted. Mobile can retain two much smaller flower islands when space permits.
- Text-size and editing-layout changes refit the board. At 200% text size, controls reflow and vertical scrolling is allowed. Feedback remains a single line using shorter mobile copy; loop iteration stays on the Repeat block instead of duplicating it in the banner.

## Workbench refinement

The follow-up reference exposed excessive mobile dock height and a disconnected Delete control. The workbench now has one inset command rail, a compact execution row, and the command palette. The complete-program Clear action sits beside Main/Langkah. Per-command Delete, insertion, reordering, and Repeat count controls appear only after selecting their associated command, directly below the rail with a connecting stem and command label. Unusable full-scope palette choices are hidden; the short full-scope notice remains. The debugging inspection action joins the execution controls.

At both 390 × 844 and 320 × 740, a Repeat containing Forward and Right measures approximately 284 px tall, including controls and palette. Narrow Repeat blocks retain at least 44 px targets and fit this common sequence without a separate navigation row, recovering 47 px for the board at 320 px width. Selecting a primitive places its label/Delete together above the placement actions, saving one row. Longer programs retain horizontal scrolling, accessible navigation buttons, complete edge padding, and keyboard focus. Large text may increase height to preserve readable labels.

The final spacing pass places the banner halfway between the projected board's lower edge and the workbench's top, centered horizontally. Camera fitting reserves that middle gap instead of pinning feedback to the dock. The illustrated fish icon has no circular background; world fish use the original bare model without a sphere, glow, bubble, or halo. Collected positions retain their ground rings. The water shader and model files are unchanged by this final refinement.

Mouse and touch dragging add palette blocks to insertion positions and reorder existing commands within their current scope. Repeat bodies accept primitive blocks; nested loops and cross-scope reordering are rejected. All mutations call the existing store's add/move actions; no interpreter or curriculum changes are involved. Tap insertion/replacement, keyboard editing, explicit reordering buttons, and all count choices remain available. A short movement threshold distinguishes a drag from a tap; pointer cancellation and Escape clear the drag preview.

Completion alone uses a check. Incomplete results use the fish indicator and amber surface; collision uses an exclamation mark and coral surface. Collection feedback uses a fish indicator and expires after 1.2 seconds.

The interpreter, level data, 16-stage curriculum, stores, tutorial sequencing, persistence, routes, and original model binaries are unchanged. The title scene and title styles are unchanged. Gameplay reuses existing procedural island/contact primitives without editing their title implementation. No packages or downloaded assets were added.

## Shader and rendering cost

`src/scene/Environment/GameWater.tsx` is a separate gameplay ShaderMaterial. A 32 × 32 subdivision plane interpolates low-frequency aqua gradients from its vertices. A single texture lookup per water fragment supplies distance bands, sparse foam, and a soft ambient halo. `shore.ts` bakes the union of the authored tile/scenery footprints into a 256 × 256 RGBA field (256 KiB) when the layout changes. Connected tile interiors have no shoreline seams. The field is disposed when replaced.

Water advances only on already requested gameplay frames; it adds no independent redraw loop. Reduced motion freezes procedural changes. Materials/geometries are shared; petals and grass blades are instanced. A 1024² variance shadow map refreshes for static layout changes. The moving cat has a following analytic contact patch; collected fish leave no stale cached shadow.

Gameplay DPR is capped at 1.25. Sustained slow frames lower only 3D sampling, to a floor of 0.65, and omit secondary scenery. DOM text, controls, camera scale, and logical tiles retain their size. The water uses no reflection or off-screen render targets; there is no bloom or postprocessing pipeline.

Two sequential headless Chromium/software-WebGL comparisons against title commit `c24c58e` measured warm single-step activity averaging 2,094 ms versus 1,831 ms (about 14% higher); cold scene activity averaged 2,023 ms versus 1,579 ms. Median observed draw gaps were 36 ms versus 37–40 ms. These are instrumented software-renderer observations, not physical-device FPS. The initial field/model upload and adaptive sampling add cold-start work. The resting scene returns to demand-rendered inactivity. The final CSS/camera/banner refinement adds no shader work or independent redraw loop. Raw observations are in `evidence/gameplay-overhaul/performance.json`.

## Visual review

Initial and corrected screenshots were compared directly with the supplied references. Corrections included orthographic fitting, terrain height/color, cat scale and framing, more faceted foliage, the upper-right island placement, banner/workbench spacing, menu width, a desktop-to-mobile uniform resize error, and large-text board/banner overlap. Follow-up review removed the floating Clear control, shortened the mobile workbench, attached selection actions to their command, prevented clipped execution labels at 200% text size, and added explicit open-menu observation for prop exclusion.

Final production-build evidence:

- Before/after the overall overhaul, from title commit `c24c58e`: [desktop before](evidence/gameplay-overhaul/before-desktop.png), [desktop after](evidence/gameplay-overhaul/1474x1023-success.png); [mobile before](evidence/gameplay-overhaul/before-mobile.png), [mobile after](evidence/gameplay-overhaul/390x844-success.png).
- Other requested viewports: [1440 × 900](evidence/gameplay-overhaul/1440x900-success.png), [320 × 740](evidence/gameplay-overhaul/320x740-success.png).
- Learning states: [Forward](evidence/gameplay-overhaul/1474x1023-forward.png), [Turning](evidence/gameplay-overhaul/1474-turning.png), [Repeat](evidence/gameplay-overhaul/1474-repeat.png), [Debugging](evidence/gameplay-overhaul/1474-debugging.png), [collision](evidence/gameplay-overhaul/320-collision.png), [200% text](evidence/gameplay-overhaul/320-zoom.png).
- Workbench states: [desktop editing](evidence/gameplay-overhaul/desktop-editing.png), [mobile editing](evidence/gameplay-overhaul/mobile-editing.png), [mobile running](evidence/gameplay-overhaul/mobile-running.png), [mobile incomplete](evidence/gameplay-overhaul/mobile-unfinished.png), [mobile completion](evidence/gameplay-overhaul/mobile-complete.png).
- Final requested spacing review: [desktop success](evidence/gameplay-overhaul/desktop-complete.png), [mobile success](evidence/gameplay-overhaul/mobile-complete.png), [mobile editing](evidence/gameplay-overhaul/mobile-editing.png), [selected mobile command](evidence/gameplay-overhaul/mobile-selected.png), [320 px editing](evidence/gameplay-overhaul/320-editing.png), [320 px selected command](evidence/gameplay-overhaul/320-selected.png). Expanded selection actions can use vertical scrolling at the shortest width. [Reference comparison](evidence/gameplay-overhaul/reference-comparison.png).

Remaining fidelity differences: the preserved GLBs differ from the generated reference's character details; procedural foliage, water, and shadows are simpler and less painterly. Scenery shifts or disappears where it would overlap a playable tile/cat/cue. The small rock platform touching the reference path is omitted because it could suggest a walkable branch. Mobile deliberately keeps the authored board and controls instead of scaling down the desktop scenery. Physical-device performance and learner comprehension still need real-device/classroom testing.

## Release verification

Final test/build/deployment results are appended after execution in `DEVELOPMENT_LOG.md`. Historical entries and `PROMPT_JOURNAL.md` are not rewritten. The implementation is developed on `henix/gameplay-reference`; the existing user-owned `screenshots/` directory is excluded from the commit and deployment.

## Verified production release

Implementation: `b47bbaeb3ac7623db7afdc4bca6fbdbed7facbf2` on `henix/gameplay-reference`. A clean committed-source archive was deployed to [kotak-katik.vercel.app](https://kotak-katik.vercel.app), deployment `dpl_EupmuwWZRUeUe4jC5HRfEBMnW9ot`, READY. Anonymous HTTP 200, frozen install, cloud production build, and 12 deployed desktop/mobile browser checks passed. The append-only development log records local verification, repaired failures, evidence, and the deployment details. No main-branch integration or Git push was performed.
