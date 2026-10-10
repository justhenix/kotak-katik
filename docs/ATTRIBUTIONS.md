# Attribution

## Original visuals

The tile island, command SVG, direction arrows, and collection marker are created directly in this repository using primitive geometry. M0.5 renders the curated cat and fish GLBs below; the former procedural character and collectible have been replaced. Tree, rock, crate, and bush remain prepared for future levels. No reference-game art, stock images, BISINDO clips, or AI-generated raster assets are included.

## Curated 3D models (2026-10-10)

All selected models are under [CC0 1.0 Universal](https://creativecommons.org/publicdomain/zero/1.0/). The exact Kenney pack license is retained in `public/licenses/kenney-cube-pets.txt`. Each Quaternius model's own Poly Pizza page explicitly identifies Quaternius as creator and Public Domain (CC0) as its license. Those individual downloads contain no separate license file; these source links preserve that provenance. These third-party assets remain CC0 independently of the repository's code license.

| Runtime file | Original delivered file / mesh | Creator and original source | Modifications |
| --- | --- | --- | --- |
| `public/assets/models/cat.glb` | `Models/GLB format/animal-cat.glb`, Cube Pets **2.0** | Kenney, [Cube Pets](https://kenney.nl/assets/cube-pets); [exact ZIP](https://kenney.nl/media/pages/assets/cube-pets/44e58e945f-1774520254/kenney_cube-pets_1.0.zip) | Embedded supplied `Textures/colormap.png`; renamed scene to avoid Three.js animated-root name collision; added scale/grounding/facing wrappers; deduplicated resources and redundant keyframes with zero tolerance. All eight clips preserved. ZIP filename says 1.0, but its actual `License.txt` says 2.0, dated 2026-03-26. |
| `public/assets/models/fish.glb` | `6805b99c-5fd7-4aab-bf57-3bb645e1108a.glb`; mesh `ClownFish` | Quaternius, [Fish](https://poly.pizza/m/BEcU9rjiAq), [exact GLB](https://static.poly.pizza/6805b99c-5fd7-4aab-bf57-3bb645e1108a.glb) | Matte PBR response, scale/grounding/facing wrappers, resource/keyframe deduplication. Skeleton and `Armature\|Swim` clip preserved. Original colors retained. |
| `public/assets/models/tree.glb` | `920082db-1dc4-4314-a227-d59e2547d3a2.glb`; mesh `Tree_2` | Quaternius, [Tree](https://poly.pizza/m/ahBEW2RRgq), [exact GLB](https://static.poly.pizza/920082db-1dc4-4314-a227-d59e2547d3a2.glb) | Matte PBR response, scale/grounding wrappers, resource deduplication, lossless removal of ancillary PNG metadata. Embedded 32×32 `Atlas.png` pixels unchanged. |
| `public/assets/models/rock.glb` | `de15e8eb-53a1-4e7e-a4c5-fc2299f57158.glb`; mesh `Rock` | Quaternius, [Rock](https://poly.pizza/m/4MUaQTcDdc), [exact GLB](https://static.poly.pizza/de15e8eb-53a1-4e7e-a4c5-fc2299f57158.glb) | Matte PBR response, scale/grounding wrappers, resource deduplication. Geometry and color unchanged. |
| `public/assets/models/crate.glb` | `9b0c7d9b-344c-48d2-9a49-a59df0f4f838.glb`; mesh `Cube_Crate`; browser download named `Cube Crate by Quaternius - YAghI6GBls.glb` | Quaternius, [Cube Crate](https://poly.pizza/m/YAghI6GBls), [exact GLB](https://static.poly.pizza/9b0c7d9b-344c-48d2-9a49-a59df0f4f838.glb) | Matte PBR response, scale/grounding wrappers, resource deduplication. Geometry and colors unchanged. |
| `public/assets/models/bush.glb` | `57727111-0deb-4a85-9182-9f1371f6ca96.glb`; mesh `Bush_1` | Quaternius, [Bush](https://poly.pizza/m/92EytlU1El), [exact GLB](https://static.poly.pizza/57727111-0deb-4a85-9182-9f1371f6ca96.glb) | Matte PBR response, scale/grounding wrappers, resource deduplication. Geometry and colors unchanged. |

The primary [Cube World Kit](https://quaternius.com/packs/cubeworldkit.html) is CC0. Its [official Drive folder](https://drive.google.com/drive/folders/1Yyag0ibcOX6lOBY9a3m6iPnz8HwjwLFJ) was browsable, but attempted environment downloads returned Google Drive “Quota exceeded” HTML instead of model data. The downloaded CC0 Quaternius GLBs above are the authorized fallback. `Tree_2` matches a Cube World filename and the Poly Pizza upload is dated August 2023; binary equivalence to the unavailable Drive file is **not** claimed. The other props are substitutions from Quaternius's individual listings, not asserted to be Cube World exports.

Cube Pets `animal-fish.glb` was downloaded and inspected but rejected because its round pet silhouette was less readable as a small collectible. Optional `flower.glb` is omitted: the inspected Quaternius `Flowers` candidate had thin stems and cyan flowers that were less suitable for this board. Rejected models, full packs, archives, and loose textures are not in the runtime asset directory.

See `docs/ASSETS.md` for integration dimensions and the reproducible preparation procedure, and `docs/ASSET_VALIDATION.json` for hashes, geometry, textures, animations, and validation evidence.

## Fonts

- Fredoka, 500 Latin, via `@fontsource/fredoka` 5.3.0. Copyright 2016 The Fredoka Project Authors. SIL Open Font License 1.1. [Source](https://github.com/hafontia/Fredoka-One). Unmodified.
- Inter, 500/600/700 Latin, via `@fontsource/inter` 5.3.0. Copyright 2016 The Inter Project Authors. SIL Open Font License 1.1. [Source](https://github.com/rsms/inter). Unmodified.

The exact licenses shipped with the installed font packages are copied into `public/licenses/` and included in the production output.

## Packages

Exact versions and transitive dependencies are recorded in `package.json` and `bun.lock`. Production packages React, React DOM, Three.js, React Three Fiber, and Zustand use the MIT license. Package-supplied notices for bundled runtime dependencies are retained in `public/licenses/`.

Vite, its React plugin, TypeScript, Tailwind CSS and its Vite plugin, Vitest, Playwright, and type declarations are development/build/test tools. They are not gameplay services. Licenses remain available in their installed packages.

React 19 / Fiber 9 compatibility and the current Vite/Tailwind integrations were checked against official documentation on 2026-10-07. Registry versions and package peer ranges were checked during setup. This file does not grant a new license to third-party code or fonts.
