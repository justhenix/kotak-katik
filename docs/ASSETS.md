# Prepared models

Reviewed 2026-10-10. Seven standalone GLBs occupy **285,672 bytes (279.0 KiB)** in `public/assets/models/`: the original six curated assets, plus a trout alternate. The original clownfish is the default again, with its M0.5 binary restored byte-for-byte. Optional `flower.glb` is omitted. Source attribution is in [ATTRIBUTIONS.md](./ATTRIBUTIONS.md).

The normal game loads `fish.glb` (clownfish). `<Fish variant="trout" ... />` uses `fish-trout.glb`; the alternate is not loaded by the normal M0 scene. Both use a static **1.5× display wrapper**, outside the existing animated pickup transform, so collection and reset preserve their larger size. No settings UI or gameplay rule was added. See [M0.5 verification](./M0_5_VERIFICATION.md) for the original integration behavior and checks.

The set follows the project's toy-diorama direction (energy/rhythm/motion 2/2/2): the cat is the focal character; block foliage echoes the raised tiles; rock and braced crate have distinct blocker silhouettes; the striped fish reads as a collectible. Matte surfaces and muted foliage keep scenery secondary. Original color pixels and geometry are preserved. Foliage must be placed sparsely off routes; the tree canopy is wider than one tile.

| Model | Bytes | KiB | Triangles | Draw primitives | Textures | Clips |
| --- | ---: | ---: | ---: | ---: | --- | --- |
| `cat.glb` | 107,484 | 105.0 | 684 | 7 | Embedded 512×512 PNG, 10,915 bytes | `static` 0.10s; `idle` 1.00s; `walk` 0.50s; `run` 0.25s; `eat` 0.50s; `dance` 0.50s; `gesture-positive` 0.25s; `gesture-negative` 0.25s |
| `fish.glb` (default clownfish) | 79,136 | 77.3 | 686 | 3 | None | `Armature\|Swim` 1.2917s; neutral pose used in game |
| `fish-trout.glb` (alternate) | 21,732 | 21.2 | 268 | 1 | Embedded 32×32 PNG, 115 bytes | None; existing presentation pickup retained |
| `tree.glb` | 35,032 | 34.2 | 778 | 1 | Embedded 32×32 PNG, 597 bytes | None |
| `rock.glb` | 8,796 | 8.6 | 162 | 1 | None | None |
| `crate.glb` | 12,392 | 12.1 | 264 | 2 | None | None |
| `bush.glb` | 21,100 | 20.6 | 364 | 1 | None | None |

## Integration contract

All models are Y-up and supplied at scale 1 for the existing one-unit grid. Static-prop bases and the cat's neutral feet are at Y=0; X/Z are centered using source bounds. Grounding and orientation are separate nonanimated wrapper nodes, so original animated transforms remain intact. All materials use metallic 0 / roughness 1. There are no external buffer/image URIs, Draco, Meshopt, KTX2, or special decoder requirements. Cat/tree/trout PNGs stay embedded and lossless.

| Model | Approximate rendered neutral size X × Y × Z (world units) | Facing / placement |
| --- | --- | --- |
| Cat | 0.623 × 0.852 × 0.900 | Faces −Z. Use the existing `orientationRotation` on an outer gameplay group. |
| Clownfish | 0.560 × 0.301 × 0.128 | Displayed at 1.5×: about 0.84 × 0.45 × 0.19. |
| Trout | 0.700 × 0.260 × 0.139 | Displayed at 1.5×: about 1.05 × 0.39 × 0.21. |
| Tree | 1.300 × 1.618 × 1.051 | Grounded; canopy extends beyond a tile. Use off the playable path. |
| Rock | 0.700 × 0.857 × 0.663 | Grounded; fits one tile. |
| Crate | 0.750 × 0.750 × 0.750 | Grounded; fits one tile. |
| Bush | 0.511 × 0.478 × 0.650 | Grounded; optional scenery. |

Both fish have their long axis on X and face +X. Existing elevation +0.2 and yaw +π/4 remain; that yaw presents their sides and keeps the enlarged silhouettes within the tile's visible footprint. No model-derived gameplay collider is used.

Cat motion uses rigid named parts: no skin, seven meshes, eight clips. Play clips on the complete loaded scene while simulation position/yaw stays on a parent. The clownfish retains its six-joint skin and swim clip; the game uses its neutral pose. Trout is a static mesh without source clips. The shared Fish component supplies bounded pickup and reduced-motion behavior for both. Cat idle/walk/eat/dance and orientation cues are unchanged. Original fish colors remain; collection feedback stays green.

## Original curation verification (superseded clownfish)

- PASS: Khronos glTF Validator 2.0.0-dev.3.10 reports **zero errors** on all six final models. Five have zero warnings. The fish retains source warnings `NODE_SKINNED_MESH_NON_ROOT` and `NODE_SKINNED_MESH_LOCAL_TRANSFORMS`; these concern the FBX export hierarchy, not missing data. They are not concealed or relabeled as a clean validator result.
- PASS: Three.js **0.186.1** GLTFLoader loaded every final GLB in Chrome with all palette textures present. Orthographic visual inspection covered neutral props, fish at small tile size, and cat idle/walk with front, side, and rear views. No final-page loader, material, or animation-binding errors occurred.
- PASS: AnimationMixer comparison against the actual original models sampled **41 times per clip**: 328 cat samples, 41 fish samples. Cat local TRS error was 0; fish maximum local TRS error was 1.79×10⁻⁷. Non-static clips changed pose; all names, durations, channel counts, geometry, and skin joints survived optimization. This is sampled preservation evidence, not a proof at every possible time.
- PASS: Prepared wrappers remained stable during cat playback and rotation. Fish skinning and swim poses rendered correctly despite the two inherited warnings. Three.js skinned-vertex bounds are recorded separately from glTF Transform's conservative unskinned accessor bounds.
- PASS: No game source or package files changed. No pack archives, unused candidates, or loose textures were added to `public/assets/models/`. No commit or push was made.
- PASS: A second preparation run produced identical SHA-256 output hashes for all six GLBs. `bun run build` passed and included the six assets in the production output; the existing renderer bundle-size advisory remains.

The machine-readable structural and sampled runtime results are in [ASSET_VALIDATION.json](./ASSET_VALIDATION.json). The historical browser evidence explicitly refers to the original curation set, including the superseded clownfish. Current trout structural data and replacement checks are recorded separately. Temporary inspection scenes and images are outside shipping source.

## Reproduce

Conversion tools are isolated from the application's dependencies. No Blender/manual authoring, mesh simplification, lossy texture conversion, or decoder-based compression is used. The pipeline embeds resources, normalizes through wrapper nodes, sets matte materials, strips ancillary PNG metadata without touching pixel data, and runs glTF Transform `resample({ tolerance: 0 })` plus `dedup`. The cat's standalone prepared size is smaller than its original 165,164-byte GLB plus 10,915-byte external palette. Original files are never modified.

1. Create a scratch directory outside the repository, e.g. `$assetWork = Join-Path $env:TEMP 'kotak-katik-asset-tools'`. Run `bun init -y` there, then `bun add --exact @gltf-transform/core@4.5.1 @gltf-transform/extensions@4.5.1 @gltf-transform/functions@4.5.1 gltf-validator@2.0.0-dev.3.10`. These exact releases were verified against the live npm registry on the review date.
2. Download the exact Kenney ZIP linked in ATTRIBUTIONS.md. Expand it to `<sources>/cube-pets/`, preserving `Models/GLB format/animal-cat.glb` and `Models/GLB format/Textures/colormap.png` together. Check its actual `License.txt` (Cube Pets 2.0, CC0), despite the archive's 1.0 filename.
3. Download the exact Poly Pizza GLB URLs in ATTRIBUTIONS.md into `<sources>/poly/`, named `BEcU9rjiAq.glb` (clownfish), `2W2sKWYvk8k.glb` (trout), `ahBEW2RRgq.glb`, `4MUaQTcDdc.glb`, `YAghI6GBls.glb`, and `92EytlU1El.glb`. Use a binary downloader such as `Invoke-WebRequest <exact-url> -OutFile <path>`; reject HTML instead of model data. Retain the trout's CC BY 3.0 attribution when distributing derivatives.
4. From the project root run `bun scripts/assets/prepare-models.mjs <sources> <toolchain-directory>`. Both arguments are absolute directories. The script checks exact SHA-256 source hashes, keeps all original clips, embeds resources, and fails on validation errors or external asset references. It overwrites only the seven predictable prepared models and `docs/ASSET_VALIDATION.json`.
5. Compare the resulting output hashes against the recorded report and repeat runtime/visual validation if changing the pipeline. Regeneration produces structural results; the dated browser comparison in the report is separate evidence from this sprint and must be repeated rather than silently inferred.

For the current seven-model set, download both fish sources: clownfish to `<sources>/poly/BEcU9rjiAq.glb` and trout to `<sources>/poly/2W2sKWYvk8k.glb`. Append `fish` or `fish-trout` to the preparation command to process only that model. Targeted preparation updates or appends its structural report while preserving other assets and historical browser evidence. Runtime evidence must identify the binary it covers.

## Intermediate whole-trout replacement checks (2026-10-10)

These observations describe the earlier trout-only iteration; the current default and sizing are described above and checked below.

- The user allowed other ordinary whole fish after the salmon search. The final model is a trout, not a salmon. Its intact head, eyes, fins, pink flank, and forked tail are visible in a natural horizontal pose. The temporary red snapper was rejected for its squat gameplay silhouette and is not shipped.
- `fish.glb`: 21,712 bytes, 268 triangles, one matte opaque material, one embedded 32×32 PNG. Khronos validation: zero errors and zero warnings. No external resources, rig, or source clips. Existing collection motion and all cat animations remain in the unchanged presentation layer.
- Exact source position, normal, UV, and index arrays match the prepared file. PNG image-defining chunks match byte-for-byte. A second preparation in an isolated temporary directory produces the same output SHA-256. Cat/tree/rock/crate/bush hashes still match the M0.5 checkpoint.
- 25 unit tests pass; production build passes; all 10 desktop/mobile Playwright tests pass with the final trout. Verified movement, pickup, eat/dance, completion, Retry, Reset, collision, interruption, delayed/missing loading, demand-renderer rest, and reduced motion through existing coverage.
- Desktop 1440×1000 and touch-emulated mobile 390×844 renders inspected at gameplay size. Screenshots and candidate downloads remain ignored or outside the repository. Physical-device and learner testing are not claimed. The existing renderer bundle advisory remains.
- No game source, test, dependency, or lockfile changes. Attribution is present in the GLB, a shipped text notice, and ATTRIBUTIONS.md. PROMPT_JOURNAL.md is unchanged. No commit or push.

## Enlarged fish variants (2026-10-10)

- User requested keeping both fish and making clownfish the default. `fish.glb` is byte-identical to `a11484d`; the alternate is `fish-trout.glb`, 21,732 bytes. Original cat/scenery/default-fish hashes remain unchanged.
- Fish now accepts an optional `variant` prop, defaulting to `clownfish`; the alternate loads on demand. Shared `sceneConfig.fishScale = 1.5` enlarges both outside the pickup transform. Reset returns pickup scale to 1 without shrinking the display wrapper. Simulation, timings, and collected marker are unchanged.
- 25 unit tests, production build, and all 10 default-game desktop/mobile E2E tests pass. Additional local checks mounted both actual Fish variants on desktop and mobile, verified loading, 1.5× scale, normal/reduced-motion pickup and reset, and checked for runtime errors. Screenshots inspected for silhouettes and tile clearance. The local fixture and scripts remain ignored.
- Full seven-model preparation reproduced byte-for-byte in an isolated directory. Trout geometry/normal/UV/index data and PNG pixel-defining chunks remain unchanged. Trout validation has zero errors/warnings; default clownfish retains its two documented source skin warnings.
- Modified presentation files: Fish component, model registry, and scene configuration. No engine/store, command rules, test files, dependencies, lockfile, or PROMPT_JOURNAL.md changes. No commit or push.
