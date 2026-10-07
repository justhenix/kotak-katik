# M0 attribution

## Original visuals

The tile island, placeholder geometric cat, fish, and command SVG are created directly in this repository using primitive geometry. No downloaded model pack, reference-game art, stock images, BISINDO clips, or AI-generated raster assets are included.

## Fonts

- Fredoka, 500 Latin, via `@fontsource/fredoka` 5.3.0. Copyright 2016 The Fredoka Project Authors. SIL Open Font License 1.1. [Source](https://github.com/hafontia/Fredoka-One). Unmodified.
- Inter, 500/600/700 Latin, via `@fontsource/inter` 5.3.0. Copyright 2016 The Inter Project Authors. SIL Open Font License 1.1. [Source](https://github.com/rsms/inter). Unmodified.

The exact licenses shipped with the installed font packages are copied into `public/licenses/` and included in the production output.

## Packages

Exact versions and transitive dependencies are recorded in `package.json` and `bun.lock`. Production packages React, React DOM, Three.js, React Three Fiber, and Zustand use the MIT license. Package-supplied notices for bundled runtime dependencies are retained in `public/licenses/`.

Vite, its React plugin, TypeScript, Tailwind CSS and its Vite plugin, Vitest, Playwright, and type declarations are development/build/test tools. They are not gameplay services. Licenses remain available in their installed packages.

React 19 / Fiber 9 compatibility and the current Vite/Tailwind integrations were checked against official documentation on 2026-10-07. Registry versions and package peer ranges were checked during setup. This file does not grant a new license to third-party code or fonts.
