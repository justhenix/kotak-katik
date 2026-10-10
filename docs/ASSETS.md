# Prepared models

Preparation baseline, reviewed 2026-10-10. The original curation sprint left game code, procedural tiles, dependencies, and package lockfile unchanged. Six selected standalone GLBs occupy **263,940 bytes (257.8 KiB)** in `public/assets/models/`. Optional `flower.glb` is intentionally omitted. Source attribution and fallback reasons are in [ATTRIBUTIONS.md](./ATTRIBUTIONS.md).

M0.5 now integrates the cat and fish in the gameplay scene. The prepared binaries and processing pipeline remain unchanged; runtime orientation cues, placement, and reactions belong to the presentation layer. See [M0.5 verification](./M0_5_VERIFICATION.md) for the integration behavior and checks. The validation section below records the earlier preparation sprint, not the newer gameplay checks.

The set follows the project's toy-diorama direction (energy/rhythm/motion 2/2/2): the cat is the focal character; block foliage echoes the raised tiles; rock and braced crate have distinct blocker silhouettes; the striped fish reads as a collectible. Matte surfaces and muted foliage keep scenery secondary. Original color pixels and geometry are preserved. Foliage must be placed sparsely off routes; the tree canopy is wider than one tile.

| Model | Bytes | KiB | Triangles | Draw primitives | Textures | Clips |
| --- | ---: | ---: | ---: | ---: | --- | --- |
| `cat.glb` | 107,484 | 105.0 | 684 | 7 | Embedded 512×512 PNG, 10,915 bytes | `static` 0.10s; `idle` 1.00s; `walk` 0.50s; `run` 0.25s; `eat` 0.50s; `dance` 0.50s; `gesture-positive` 0.25s; `gesture-negative` 0.25s |
| `fish.glb` | 79,136 | 77.3 | 686 | 3 | None | `Armature\|Swim` 1.2917s |
| `tree.glb` | 35,032 | 34.2 | 778 | 1 | Embedded 32×32 PNG, 597 bytes | None |
| `rock.glb` | 8,796 | 8.6 | 162 | 1 | None | None |
| `crate.glb` | 12,392 | 12.1 | 264 | 2 | None | None |
| `bush.glb` | 21,100 | 20.6 | 364 | 1 | None | None |

## Integration contract

All models are Y-up and supplied at scale 1 for the existing one-unit grid. Static-prop bases and the cat's neutral feet are at Y=0; X/Z are centered using source bounds. Grounding and orientation are separate nonanimated wrapper nodes, so original animated transforms remain intact. All materials use metallic 0 / roughness 1. There are no external buffer/image URIs, Draco, Meshopt, KTX2, or special decoder requirements. Cat/tree PNGs stay embedded and lossless.

| Model | Approximate rendered neutral size X × Y × Z (world units) | Facing / placement |
| --- | --- | --- |
| Cat | 0.623 × 0.852 × 0.900 | Faces −Z. Use the existing `orientationRotation` on an outer gameplay group. |
| Fish | 0.560 × 0.301 × 0.128 | Long axis X, face +X. Add a small presentation elevation (preview used +0.18) to keep it clear of the tile. Rest-pose skin bounds are slightly asymmetric; no gameplay collider should come from them. |
| Tree | 1.300 × 1.618 × 1.051 | Grounded; canopy extends beyond a tile. Use off the playable path. |
| Rock | 0.700 × 0.857 × 0.663 | Grounded; fits one tile. |
| Crate | 0.750 × 0.750 × 0.750 | Grounded; fits one tile. |
| Bush | 0.511 × 0.478 × 0.650 | Grounded; optional scenery. |

Cat motion uses rigid named parts: **no skin**, seven meshes, eight clips. `idle` and `walk` contain changing poses rather than placeholder names; `static` intentionally holds a neutral pose. The unique GLB scene name fixes the original `animal-cat` scene/root naming collision in Three.js. Play animations on the complete loaded scene, with the simulation position/yaw applied to a separate parent. Clone per instance before sharing mutable animation state. The fish has a six-joint skin; use a skeleton-aware clone if making animated instances. Its swimming is optional, and the model is readable without continuous motion. Retain a forward cue and cyan-left/orange-right cues during future cat integration; this preparation does not add them. The orange fish's source coloration is retained, so keep its reward feedback distinct from the orange turn-command cue.

## Verification

- PASS: Khronos glTF Validator 2.0.0-dev.3.10 reports **zero errors** on all six final models. Five have zero warnings. The fish retains source warnings `NODE_SKINNED_MESH_NON_ROOT` and `NODE_SKINNED_MESH_LOCAL_TRANSFORMS`; these concern the FBX export hierarchy, not missing data. They are not concealed or relabeled as a clean validator result.
- PASS: Three.js **0.186.1** GLTFLoader loaded every final GLB in Chrome with all palette textures present. Orthographic visual inspection covered neutral props, fish at small tile size, and cat idle/walk with front, side, and rear views. No final-page loader, material, or animation-binding errors occurred.
- PASS: AnimationMixer comparison against the actual original models sampled **41 times per clip**: 328 cat samples, 41 fish samples. Cat local TRS error was 0; fish maximum local TRS error was 1.79×10⁻⁷. Non-static clips changed pose; all names, durations, channel counts, geometry, and skin joints survived optimization. This is sampled preservation evidence, not a proof at every possible time.
- PASS: Prepared wrappers remained stable during cat playback and rotation. Fish skinning and swim poses rendered correctly despite the two inherited warnings. Three.js skinned-vertex bounds are recorded separately from glTF Transform's conservative unskinned accessor bounds.
- PASS: No game source or package files changed. No pack archives, unused candidates, or loose textures were added to `public/assets/models/`. No commit or push was made.
- PASS: A second preparation run produced identical SHA-256 output hashes for all six GLBs. `bun run build` passed and included the six assets in the production output; the existing renderer bundle-size advisory remains.

The machine-readable structural and sampled runtime results are in [ASSET_VALIDATION.json](./ASSET_VALIDATION.json). The temporary inspection scene and its images are outside shipping source. These checks do not claim that future R3F integration or gameplay accessibility has been implemented or tested.

## Reproduce

Conversion tools are isolated from the application's dependencies. No Blender/manual authoring, mesh simplification, lossy texture conversion, or decoder-based compression is used. The pipeline embeds resources, normalizes through wrapper nodes, sets matte materials, strips ancillary PNG metadata without touching pixel data, and runs glTF Transform `resample({ tolerance: 0 })` plus `dedup`. The cat's standalone prepared size is smaller than its original 165,164-byte GLB plus 10,915-byte external palette. Original files are never modified.

1. Create a scratch directory outside the repository, e.g. `$assetWork = Join-Path $env:TEMP 'kotak-katik-asset-tools'`. Run `bun init -y` there, then `bun add --exact @gltf-transform/core@4.5.1 @gltf-transform/extensions@4.5.1 @gltf-transform/functions@4.5.1 gltf-validator@2.0.0-dev.3.10`. These exact releases were verified against the live npm registry on the review date.
2. Download the exact Kenney ZIP linked in ATTRIBUTIONS.md. Expand it to `<sources>/cube-pets/`, preserving `Models/GLB format/animal-cat.glb` and `Models/GLB format/Textures/colormap.png` together. Check its actual `License.txt` (Cube Pets 2.0, CC0), despite the archive's 1.0 filename.
3. Download the exact Poly Pizza GLB URLs in ATTRIBUTIONS.md into `<sources>/poly/`, named `BEcU9rjiAq.glb`, `ahBEW2RRgq.glb`, `4MUaQTcDdc.glb`, `YAghI6GBls.glb`, and `92EytlU1El.glb`, respectively. Use a binary downloader such as `Invoke-WebRequest <exact-url> -OutFile <path>`; reject HTML instead of model data.
4. From the project root run `bun scripts/assets/prepare-models.mjs <sources> <toolchain-directory>`. Both arguments are absolute directories. The script checks exact SHA-256 source hashes, keeps all original clips, embeds resources, and fails on validation errors or external asset references. It overwrites only the six predictable prepared models and `docs/ASSET_VALIDATION.json`.
5. Compare the resulting output hashes against the recorded report and repeat runtime/visual validation if changing the pipeline. Regeneration produces structural results; the dated browser comparison in the report is separate evidence from this sprint and must be repeated rather than silently inferred.
