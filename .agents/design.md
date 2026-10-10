# Design: Kotak-Katik

## Design read

Kotak-Katik is a visual programming game for deaf-first elementary learners, presented as a small pastel low-poly toy diorama.

- **ENERGY 2:** playful and warm, never frantic.
- **RHYTHM 2:** stable visual rules with composition that changes to fit each screen.
- **MOTION 2:** short, purposeful motion that explains state and interaction.

The visual identity is the raised, chunky tile island. Repeat that physical language in the board, command blocks, and expedition nodes. Keep one clear focal point per screen.

## Visual direction

Make a small world the child can read at a glance: cat, tiles, fish, commands. Aim for playful, tactile, colorful, calm, readable, and slightly whimsical.

The world should feel like a miniature pastel low-poly diorama, not a realistic landscape, classroom worksheet, generic coding editor, corporate accessibility tool, dashboard, or mobile gacha game.

## Reference use

Use the supplied Google Coding Doodle screenshot for clarity: a legible board, visible collectibles, a distinct command area, large execution controls, and little interface chrome. Do not copy its characters, illustrations, exact palette, layout, or assets.

Use Quaternius for low-poly world character and prop references. Use Kenney as a source for simple structural assets. Use Cult of the Lamb only for the idea of a readable branching expedition map. Do not import its gothic palette, occult imagery, heavy outlines, or dense roguelike presentation.

The supplied screenshots and asset folders are references, not permission to copy another game's identity.

## World and shape language

- Keep the game board as the main focal area. A rough 60% board, 30% program and commands, 10% secondary controls relationship is a hierarchy guide, not a fixed layout.
- Use an orthographic isometric or axonometric view with a stable camera. Make tile boundaries and the cat's orientation clear without heavy grid lines.
- Give tiles visible thickness, softened edges, and clear top and side faces. Keep the play area small enough to read as a toy world.
- Build with chunky geometric forms: cubes, softly bevelled blocks, simple cylinders, stylized foliage, and compact buildings.
- Leave useful negative space. Props must not hide tiles, the cat, fish, routes, or command feedback.
- Prefer shape, color, lighting, and shadow for separation. Heavy black outlines are not the default.

## Palette

Use pastel color blocking with enough contrast to keep objects distinct. The world may use more colors than the interface; keep interface surfaces to a controlled palette.

### Day

Day is the default atmosphere: bright, fresh, and outdoorsy.

| Role | Starting color |
| --- | --- |
| Sky | `#A8E6E1` |
| Grass | `#A8D98F` |
| Cream | `#FFF3D6` |
| Yellow | `#F7D774` |
| Peach | `#F3AE8E` |
| Lavender | `#C8B8E8` |
| Aqua panel | `#82D6D0` |
| Dark ink | `#263D45` |

These are starting colors, not finished contrast tokens. Verify every text and control pairing before implementation. Use dark ink on light pastel surfaces; do not assume white text is readable on pastels.

### Night

Night is the same world at evening, not a generic dark mode. Keep terrain readable and use warm light locally.

| Role | Starting color |
| --- | --- |
| Sky | `#272B52` |
| Terrain | `#526A73` |
| Grass | `#56766A` |
| Panel | `#394566` |
| Lavender | `#7C739F` |
| Warm light | `#F2C66D` |
| Cream text | `#F7EDD8` |

If a day/night toggle ships, preserve shape, hierarchy, and semantic color meanings between themes. Verify both themes for readability and visible states. The transition should feel like the world changing time of day, not a separate product skin.

### Semantic color

Keep the established direction mapping: cyan indicates the cat's left; orange indicates its right. Pair color with arrow shape, icon direction, and character orientation. Do not reuse these colors for unrelated states when that would cause confusion.

Use a deliberate accent at important moments. Do not spread saturated accents, gradients, or glow over every control and surface.

## Materials, lighting, and effects

- Prefer matte surfaces, moderate roughness, low metallic response, and simple color. Geometry and palette carry the style.
- Use broad soft light and gentle fill. Shadows ground objects but must not obscure tile edges. Ambient occlusion stays subtle.
- Avoid realistic dirt, grunge, high-frequency textures, harsh cinematic contrast, glossy reflections, and photographic materials.
- A subtle sky gradient is acceptable when it supports atmosphere. Gradients are not the default treatment for buttons, panels, or cards.
- Use small effects only to explain an event, such as a tile ripple, brief sparkle on collection, or restrained selection pulse. No neon bloom, giant glow, constant confetti, or decorative particles.

## Interface composition

The visual relationship is **world ↔ program**. Keep the board dominant and the command area immediately legible.

- Use a few opaque, softly colored panels that feel part of the toy world. Give each surface one responsibility.
- Keep the program tray tactile and separate from the board while sharing its color and material language.
- Make command blocks large, chunky, and distinguishable by icon, direction, and semantic color. A slight extrusion and short shadow can make them feel pressable.
- Make Play and Step the clearest controls. Keep retry, reset, settings, audio, and theme controls quieter but readable.
- Use selective depth and moderate corner radii. Buttons may be round; not every panel, tray, and block should be a capsule.
- Show only the current interaction's necessary information. Do not add a conventional game HUD, persistent score meters, decorative badges, or nested cards.

The visual scan order during play is: **cat and board → objective → program → command choices → Play and Step → secondary controls**.

The title screen is an entrance to the game: title, a small world vignette, a clear `Mulai` action, and only essential secondary controls. Do not add a marketing hero, feature grid, testimonials, or a large website navbar.

## Type and interface text

Use two type roles:

- **Fredoka** or a similar rounded display sans for the title, short stage names, rewards, and brief headings. Its role is warmth and recognition.
- **Inter** or a similarly clear sans for controls, settings, accessibility options, and supporting information. Its role is legibility.

Keep headings short and in sentence or title case. Use medium to bold weights for essential labels. Do not use playful display type for long passages.

**Never add decorative kicker or eyebrow labels.** Do not add tiny uppercase overlines, wide tracking, or chapter metadata to make a screen feel designed. Avoid all-caps emphasis, generic marketing language, unnecessary helper copy, and text that repeats what a clear interaction already shows. Child-facing labels should be short, concrete, and in Indonesian when text is needed.

## Icons and objects

- Use one consistent icon weight and geometry for utility controls.
- Give movement commands a distinct, custom visual treatment. Generic icon-library styling must not define the core command language.
- Do not scatter emoji, stars, sparkles, lightning bolts, or decorative arrows through labels and buttons. Use an effect only when it explains a real game event.
- Keep the cat recognizable from the gameplay camera. Use a simple silhouette, clear face direction, visible ears and tail, and expressive but restrained animation.
- Keep cosmetics small. They must not hide the cat's ears, face direction, or left/right visual cues.
- Make fish immediately recognizable and visually distinct from scenery. Show collection by changing the fish in the world, not only by changing a counter.

## Environment and expedition map

Use a small, curated set of trees, flowers, rocks, fences, houses, signs, bushes, and lamps. Add a prop only when it supports composition, atmosphere, or world identity. Do not fill every empty tile.

The expedition map should feel like floating miniature islands connected by simple, readable paths. Give node types distinct silhouettes where useful. Show selected, available, completed, and locked states through more than color alone. Keep the visible map sparse; branches should not resemble a dense flowchart or roguelike route planner.

## Motion and interaction feel

Motion explains cause, orientation, state change, and feedback. Keep it short, soft, springy where physical movement benefits, and interruptible. Do not animate an element just to keep the screen active.

- Routine interface responses generally take about 150–220 ms. Larger world or theme transitions may take 220–450 ms when the change needs to be understood. Keep simulation execution timing in `gameplay.md`.
- Use a restrained ease-out for press feedback and a spring only for draggable objects whose movement benefits from physical continuity. Avoid repeated overshoot, elastic bounce, and stacked template animations.
- Pointer or touch presses may use a subtle response such as scale `0.97` with a reduced shadow. Keyboard actions should respond immediately without a movement animation.
- A draggable command should track the pointer without snapping harshly at boundaries. Do not animate entrances from scale zero.
- Keep idle motion sparse. Do not animate every prop, fish, and control at once.
- Keep gameplay camera movement stable. The cat turns; the world reference does not.
- Respect `prefers-reduced-motion`. Remove movement and position animation; retain only short opacity or color changes that help explain state. Use persistent borders, contrast, or direct state changes when motion is reduced.
- Apply hover motion only on hover-capable pointer devices. Every action needs a visible touch and keyboard equivalent.

## Responsive composition

Desktop and mobile are the same game with different composition. Reflow the screen; do not shrink the desktop layout into a miniature.

- On desktop, let the board occupy most of the play area. Place the program and commands below or beside it without a permanent enterprise-style sidebar.
- On mobile, stack the board, program tray, commands, and execution controls in that order. Preserve enough size to read tiles and commands.
- Keep direct touch targets at least 44 × 44 CSS pixels with clear spacing. Tap-to-add must work even when drag is available.
- Avoid horizontal overflow, clipped command trays, fixed-height layouts that hide controls, and sticky controls that cover the board. Respect device safe areas.
- Hover-only states need tap feedback. Text and controls must remain legible at narrow widths and at 200% text zoom.

## Accessible visual states

- Meet WCAG AA contrast: at least 4.5:1 for normal text and 3:1 for large text. Non-text control boundaries and state indicators should also remain distinguishable.
- Do not use color as the only signal for direction, selection, completion, errors, or locked states.
- Provide distinct visual states for rest, hover, focus, pressed, selected, disabled, running, paused, error, and success where relevant.
- Keep a clear visible keyboard focus indicator in both themes. Do not let focus, selection, and execution highlights look identical.
- Keep feedback visible long enough to understand. Reduced motion, muted audio, and narrow screens must preserve the same gameplay information.

## Anti-slop rules

These are hard defaults for Kotak-Katik:

- No decorative kickers or eyebrow labels.
- No generic SaaS hero, dashboard shell, stats cards, fake terminal, feature-card grid, or template section sequence.
- No invented numbers, testimonials, trust claims, or placeholder content presented as real.
- No generic blue-purple or rainbow gradient, neon dark mode, full-page glow, glass panels as the visual language, glow everywhere, or large shadow on every surface.
- No capsule badges, arbitrary chips, decorative left stripes, floating blobs, background dot grids, or cards nested inside cards.
- No uniform pill radius across every element. Use no more surfaces, decoration, or color than the screen needs.
- No clone of the reference game's layout, characters, art, or identity.

Any exception needs a specific written reason tied to readability, hierarchy, interaction, or Kotak-Katik's identity.

## Asset sources

Use these sources as references and select assets deliberately. Normalize scale, saturation, lighting, and material response so the final world feels authored as one set.

- **Quaternius Cube World Kit, August 2023:** [official pack page](https://quaternius.com/packs/cubeworldkit.html). The pack page lists this specific kit as CC0. User-provided working folder: https://drive.google.com/drive/folders/1Yyag0ibcOX6lOBY9a3m6iPnz8HwjwLFJ
- **Kenney Prototype Kit:** [official pack page](https://kenney.nl/assets/prototype-kit). The pack page lists Creative Commons CC0.

License pages checked on 2026-10-07. Verify the license file included with the exact downloaded pack before use. Do not assume one pack's license covers every asset from the same publisher. Record the assets and source in project attribution notes. Do not redistribute asset packs as standalone downloads.

## Design review

Before accepting a screen, check that:

1. the board or the screen's one primary action is the focal point;
2. the cat, tiles, objective, and command tray read immediately;
3. each major visual choice has a one-line purpose;
4. the palette, type, materials, and silhouette belong to the same world;
5. no kicker, eyebrow, decorative badge, or generic template section slipped in;
6. contrast, color redundancy, focus, touch size, and reduced-motion states hold up;
7. mobile composition reflows without clipping or shrinking the board into illegibility;
8. the design feels specific to Kotak-Katik if its name and logo are hidden.

The north star is a small, colorful toy world where the child can immediately see that the commands control what happens inside it.
