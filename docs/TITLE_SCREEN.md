# Title diorama, 2026-10-15

Implemented from the user's supplied 1672 × 941 title reference. The reference is used for visual comparison only; it is not bundled, loaded, or rendered by the application.

The title retains the existing start/resume/replay label, expedition action, progression, storage, and direct puzzle entries. Its scene is lazy-loaded separately from gameplay. No interpreter, curriculum, store, gameplay component, model binary, package, or lockfile was changed. The title's Fredoka 600/700 faces use a separate family alias to preserve gameplay typography.

## Visual decisions

The existing design read remains ENERGY 2 / RHYTHM 2 / MOTION 2: a calm toy diorama for elementary learners.

| Choice | Purpose |
| --- | --- |
| Turquoise water, pale lime grass, warm soil | Match the supplied reference and separate terrain from its surroundings. |
| Centered outlined Fredoka title and tactile yellow primary action | Preserve the reference's hierarchy and make the entrance clear. |
| Five equally sized, beveled tiles | Keep a continuous, readable route from the marked cat position to the fish. |
| Staggered desktop route | Match the reference's silhouette while maintaining shared edges; consecutive tile footprints share at least one unit of edge before beveling. This is scenery, not a playable level or a change to the integer gameplay grid. |
| Fixed tree/rock/flower islands and smaller isolated blocks | Reproduce the reference's arrangement without suggesting additional routes. |
| Reused cat idle and fish swim clips | Keep the actual game characters recognizable while preserving source geometry, materials, and animation tracks. |
| Separate mobile route and fitted camera | Keep both characters and all five tiles visible alongside full-size touch controls. Secondary islands and clouds are omitted at 600px and below. |

## Rendering and cost

`src/scene/title/Water.tsx` contains an original GLSL ShaderMaterial on one two-triangle plane. Low-frequency sine fields blend two linear-space aqua colors. Rounded-square signed distances form the union of 13 island footprints, preventing interior foam between connected tiles. Two narrow distance bands and a sparse mask create shore ripples. Slow phase changes provide calm motion. The shader uses no textures, render targets, displacement, ocean simulation, bloom, or screen-space reflections.

Lighting uses a hemisphere, ambient fill, a warm directional key, and a weaker fill. One 1024² variance shadow map is baked when the scene/models mount or composition changes. Analytic transparent contact patches ground props. Animation does not rebake shadows every frame. DPR is capped at 1.5. Reduced motion uses demand rendering and freezes the shader and both animation mixers.

Observed headless Chromium render counters: approximately 206 calls / 39,864 triangles at desktop composition and 81 calls / 13,470 triangles on mobile. These are scene-complexity measurements, not a physical-device frame-rate benchmark. The title chunk is 13.15 kB (4.66 kB gzip); two existing-package WOFF2 weights total 32.36 kB. No new dependencies or downloaded assets were added. The pre-existing main renderer bundle-size advisory remains.

The licensed cat and clownfish still come from the unchanged files documented in [ATTRIBUTIONS.md](ATTRIBUTIONS.md) and [ASSETS.md](ASSETS.md). Tiles, foliage, rocks, flowers, clouds, distant blocks, contact patches, and water are original procedural geometry/materials authored for this title implementation.

## Visual verification

Multiple browser captures were compared with the supplied reference while correcting camera, path shape, cat/fish placement, title width, control dimensions, foliage scale, cloud silhouettes, lighting, and shoreline accents. Final captures use the production build, Chromium, DPR 1, and reduced motion for a repeatable pose:

- [1672 × 941](evidence/title-screen/1672x941.png)
- [1440 × 900](evidence/title-screen/1440x900.png)
- [390 × 844](evidence/title-screen/390x844.png)
- [320 × 740](evidence/title-screen/320x740.png)

All four layouts have no horizontal overflow or overlapping controls; both buttons exceed 44 × 44 pixels. Normal-motion renders and reduced-motion screenshot equality are exercised in the browser tests. The visual result is recognizable but not pixel-identical: the existing GLB facial/fish details differ from the generated reference, tile joins follow valid geometry, and procedural clouds/materials/water have simpler shading and less photographic softness.

## Verification gate

- Build PASS: TypeScript and production Vite build.
- Unit PASS: 239 existing tests across 10 files.
- Layout PASS: four requested sizes inspected in the production browser; no overflow, loaded GLBs, or WebGL/runtime errors.
- Contrast PASS: title ink against the water endpoints and button surfaces measures 7.82:1 to 11.85:1 using WCAG relative luminance.
- Controls PASS: Tab reaches Mulai then Ekspedisi; Enter opens expedition; Space starts play; title canvas unmounts on exit.
- State PASS: existing journey checks cover Lanjutkan, storage restore/reset/corruption/denial, replay, and preview entries.
- Motion PASS: reduced-motion canvas screenshots remain identical after settling; normal-motion screenshots change.
- Scope PASS: existing model binaries, engine, curriculum, gameplay rendering, and prompt journal are unchanged.

The older journey assertion that the title contained zero canvases was updated to assert that gameplay and tutorial cues remain unmounted instead. During the first broad browser run, a simultaneous suite cleared a shared Playwright trace directory, producing an ENOENT teardown failure. The affected check was rerun with a separate output directory; it was a test-artifact collision, not an application error. Detailed final browser results are recorded in the development log.
