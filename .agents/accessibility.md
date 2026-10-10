# Accessibility — Kotak-Katik

## 1. Purpose

Kotak-Katik is a **deaf-first** visual computational-thinking game.

Accessibility is not an optional mode, plugin, or post-processing layer.

It is part of the default interaction architecture.

This document defines accessibility rules for:

- audio and visual information parity,
- deaf-first feedback,
- spatial orientation,
- color usage,
- motion,
- reduced motion,
- BISINDO,
- text,
- touch and pointer interaction,
- responsive layouts,
- cognitive load,
- testing and verification.

Gameplay rules are defined in `gameplay.md`.

Learning progression is defined in `pedagogy.md`.

---

# 2. Accessibility Promise

Kotak-Katik follows this principle:

> A player who cannot hear must receive all information required to understand,
> solve, debug, and complete the game.

Hearing players may receive additional atmosphere through:

- BGM,
- footsteps,
- pickup sounds,
- button sounds,
- collision sounds,
- success jingles.

They must not receive additional gameplay information.

---

# 3. Deaf-First, Not Deaf-Exclusive

Kotak-Katik is designed primarily around deaf accessibility.

It is still intended to be enjoyable for hearing children.

There is no separate:

```txt
Deaf Mode
```

required for normal gameplay.

The default game should already provide:

- visual execution timing,
- visible command state,
- visible character orientation,
- visual collision feedback,
- visual collectible feedback,
- visual completion feedback.

Sound is an enhancement layered on top.

---

# 4. Experience Parity

Use this rule:

> Audio may reinforce information, but must never carry unique information.

Examples:

| Event | Required Visual Feedback | Optional Audio |
| --- | --- | --- |
| Forward step | command pulse + cat movement + tile response | footstep |
| Turn | command pulse + visible rotation | soft turn cue |
| Fish pickup | fish animation + disappearance/state change | pickup sound |
| Collision | barrier flash + cat reaction + command warning | bump |
| Success | visual celebration + progression update | success jingle |
| UI action | visible pressed/selected state | click |
| Execution pacing | active command progression | rhythmic tick |

If muting the browser changes the player's ability to understand the puzzle,
the implementation is incomplete.

---

# 5. Do Not Patch Audio-First Design

Do not design an audio interaction and then add subtitles as an accessibility
patch.

Bad:

```txt
sound indicates error
+
caption says "error"
```

Better:

```txt
visible command error
+
board reaction
+
character reaction
+
optional sound
```

Subtitles cannot replace missing visual state.

Design visual communication first.

Add audio afterward.

---

# 6. Audio Categories

Audio may be divided into:

### Atmosphere

Examples:

- BGM,
- ambient environment,
- wind,
- water.

Atmosphere must never contain required information.

### Reinforcement

Examples:

- footsteps,
- fish pickup,
- collision sound,
- success cue.

These must duplicate information already communicated visually.

### Instruction

Do not require spoken instruction for core gameplay.

If spoken material is ever added, equivalent visual/text information must exist.

---

# 7. Mute Test

Every major gameplay feature must pass:

> Can this interaction still be understood with system audio completely muted?

Test at minimum:

- level objective,
- movement,
- turning,
- loop execution,
- collision,
- collectible pickup,
- success,
- debugging,
- stage progression.

Muted gameplay must remain fully functional and understandable.

---

# 8. Visual Feedback Hierarchy

Gameplay-critical state should use multiple visual channels when practical.

Possible channels:

```txt
position
shape
icon
motion
border
contrast
color
character reaction
```

Do not rely on one transient cue.

For important states, prefer at least two distinguishable indicators.

Example:

```txt
active command
=
thick border
+
slight elevation
+
controlled pulse
```

not:

```txt
active command
=
color shift only
```

---

# 9. Persistence of Important Feedback

Critical feedback must remain visible long enough to understand.

Avoid feedback that:

- flashes for an extremely short duration,
- disappears before the player can inspect it,
- only exists during animation,
- requires perfect attention at one moment.

For debugging especially, preserve relevant state after execution pauses.

Example:

```txt
collision
    ↓
invalid command stays highlighted
    ↓
board remains visible
    ↓
player can inspect
```

---

# 10. Spatial Orientation

Understanding the cat's orientation is gameplay-critical.

The child should always be able to identify:

```txt
forward
left
right
```

relative to the cat.

Do not rely only on sprite facing direction if that direction is visually
ambiguous.

Use redundant cues.

---

# 11. Forward Cue

The cat's forward direction should remain readable.

Possible indicators:

- visible face direction,
- body orientation,
- subtle gaze cone,
- small ground projection,
- animation anticipation.

The cue should be subtle enough not to reveal the entire route.

Its purpose is orientation clarity.

Not solution guidance.

---

# 12. Left / Right Association

Kotak-Katik uses:

```txt
CYAN   → cat's left
ORANGE → cat's right
```

This association may appear in:

- cat ear accents,
- cat flank accents,
- turn command blocks,
- orientation demonstrations,
- relevant tutorial highlights.

Keep these meanings consistent.

---

# 13. Color Must Not Be the Only Signal

Cyan and orange are supporting associations.

They must not be the only distinction between left and right.

Also use:

- arrow direction,
- icon geometry,
- spatial placement where appropriate,
- cat orientation,
- turn animation.

The player should still distinguish the commands if color perception is reduced
or display conditions are poor.

---

# 14. Do Not Reuse Direction Colors Arbitrarily

Once:

```txt
cyan = left
orange = right
```

is established, do not reuse those colors for unrelated high-priority meanings.

Avoid situations such as:

```txt
orange = right
orange = error
orange = reward
orange = selected stage
```

when those states appear together.

Semantic consistency reduces cognitive load.

---

# 15. Collision Feedback

Collision must be understandable without sound.

Recommended feedback combination:

1. cat attempts movement,
2. destination/barrier responds,
3. active command enters warning state,
4. cat reacts,
5. execution pauses.

Possible effects:

- barrier flash,
- tile edge response,
- small horizontal nudge,
- ear droop,
- brief command shake.

Avoid aggressive effects.

---

# 16. Screen Shake

Screen shake should be extremely restrained.

Default collision response should use:

```txt
~2 px visual displacement
```

or an equivalently subtle effect.

Do not use:

- large camera shake,
- repeated shaking,
- prolonged vibration-like animation.

The board should remain spatially stable.

---

# 17. Collectible Feedback

Fish pickup should communicate clearly through visual state.

Required:

```txt
fish present
    ↓
cat enters tile
    ↓
fish reacts
    ↓
fish disappears / changes to collected state
```

Optional:

- sparkle,
- small bounce,
- pickup SFX.

Do not communicate collection solely through a counter.

The world itself should show the change.

---

# 18. Success Feedback

Success should be visible through multiple cues.

Possible combination:

- final fish collection,
- cat celebration,
- board response,
- expedition path illumination,
- next node becoming available.

Optional success audio may reinforce this.

A player should never need to hear a jingle to know they completed the stage.

---

# 19. Execution Feedback

Every executing primitive command should have a visible relationship with the
resulting action.

Preferred sequence:

```txt
command highlights
      ↓
corresponding action begins
      ↓
action settles
      ↓
highlight advances
```

Do not let command execution happen invisibly.

---

# 20. Step Mode Accessibility

Single-step execution is an accessibility and learning feature.

One Step action should execute one primitive command.

The player should be able to inspect:

```txt
command
    ↓
visible effect
    ↓
new state
```

at their own pace.

Never automatically rush Step mode.

---

# 21. Execution Pace

Continuous execution should be slow enough to visually track.

Initial target:

```txt
~400 ms per primitive action
```

This may be adjusted after playtesting.

Do not optimize execution for speed.

Optimize for comprehensibility.

---

# 22. Motion Purpose

Motion should communicate:

- cause and effect,
- orientation,
- state change,
- error,
- collection,
- success,
- interaction availability.

Motion should not exist merely to make the UI feel active.

Avoid:

- constant floating controls,
- excessive bouncing,
- decorative parallax during puzzles,
- unrelated particle motion,
- continuously pulsing multiple elements.

---

# 23. Reduced Motion

Support reduced-motion preferences where technically practical.

Use:

```css
prefers-reduced-motion
```

or equivalent platform behavior.

Reduced motion must not remove information.

Instead:

```txt
animated pulse
```

may become:

```txt
persistent border / contrast state
```

and:

```txt
large transition
```

may become:

```txt
short fade / direct state change
```

Accessibility information must survive motion reduction.

---

# 24. Reduced Motion Examples

Normal:

```txt
active block pulses repeatedly
```

Reduced:

```txt
active block receives persistent thick border
```

Normal:

```txt
fish bounces and dissolves
```

Reduced:

```txt
fish changes to collected state with short fade
```

Normal:

```txt
expedition route animates forward
```

Reduced:

```txt
route immediately changes to unlocked state
```

---

# 25. Flashing

Avoid rapid flashing.

Do not use strobe-like effects.

Gameplay feedback should use:

- controlled fades,
- single pulses,
- border transitions,
- restrained brightness changes.

No important mechanic should depend on rapid flashing.

---

# 26. Camera Stability

The isometric/axonometric camera is part of the player's spatial reference.

During gameplay:

- keep camera orientation stable,
- do not rotate when the cat turns,
- avoid unnecessary cinematic movement,
- avoid abrupt zoom.

The cat moves relative to a stable world.

This is especially important when teaching relative direction.

---

# 27. Perspective Stability

Use the intended orthographic camera for gameplay.

Perspective distortion should not make:

- tile sizes,
- direction,
- distance,
- path relationships

harder to interpret.

Visual spectacle is secondary to spatial clarity.

---

# 28. Board Contrast

Important gameplay objects must remain distinct from the environment.

The child should easily identify:

- traversable tiles,
- non-traversable space,
- cat,
- fish,
- obstacles,
- optional goal.

Do not use background props that visually compete with these elements.

---

# 29. Decoration Rules

Decorative objects must not resemble:

- collectibles,
- command icons,
- goals,
- interactive objects,
- blockers,

unless they actually have that gameplay role.

Example:

If a decorative fish appears in scenery, it may be confused with a collectible.

Avoid that ambiguity.

---

# 30. Iconography

Icons should be recognizable by:

- shape,
- direction,
- spatial meaning.

Primary commands should not require written labels.

Examples:

```txt
⬆
↶
↷
↻
```

Use text as optional reinforcement where necessary.

---

# 31. Text Is Supportive

Kotak-Katik is visual-first.

It is not absolutely text-free.

Use text when it prevents ambiguity.

Child-facing text should be:

- short,
- concrete,
- familiar,
- Indonesian,
- visually secondary to the interaction.

Examples:

```txt
Mulai
Ulangi
Coba lagi
Lanjut
2x
3x
```

Avoid instructional paragraphs during puzzles.

---

# 32. Do Not Hide Meaning Behind Tooltips

Tooltips may assist desktop users.

They must not be required to understand controls.

Touch devices do not have reliable hover.

Core interaction meaning must exist without hover.

---

# 33. Touch-First Compatibility

All primary interactions must work with touch.

Do not require:

- hover,
- right-click,
- tiny drag handles,
- mouse wheel,
- precision pointer movement.

Supported patterns should include:

- tap,
- large buttons,
- simple drag,
- obvious reorder interaction.

---

# 34. Tap-to-Add

Command construction should support tap-to-add.

Pure drag-and-drop is not sufficient.

Reason:

- mobile screens,
- motor precision,
- young users,
- accidental drag failure.

Drag may enhance interaction.

It should not be the only path.

---

# 35. Touch Target Size

Controls intended for direct interaction should be comfortably large.

Avoid tightly packed small targets.

Especially protect:

- Play,
- Step,
- Retry,
- command blocks,
- remove action,
- map nodes.

Do not prioritize fitting more controls over touch usability.

---

# 36. Destructive Actions

Actions such as clearing the entire program should not be positioned where they
are easily triggered accidentally.

Prefer:

- spatial separation,
- clear icon,
- reversible state where practical.

Do not require confirmation dialogs for every small action.

Use interface design to prevent accidental activation first.

---

# 37. Keyboard Support

Where practical, standard web controls should remain keyboard reachable.

At minimum:

- interactive UI should use semantic buttons/controls,
- focus should not become trapped,
- visible focus should remain present,
- custom components should not destroy basic keyboard navigation.

Keyboard support is secondary to child-facing touch/pointer usability but should
not be unnecessarily broken.

---

# 38. Semantic HTML

Use semantic web elements for DOM-based UI.

Prefer:

```html
<button>
<nav>
<main>
```

over generic clickable containers when equivalent semantics exist.

The Three.js world may not map directly to DOM semantics.

Surrounding controls still should.

---

# 39. Focus Visibility

Keyboard-focus state must remain visible.

Do not remove default focus indicators without providing an equally clear
replacement.

Focus appearance should not conflict with:

- active command state,
- selected command state,
- error state.

---

# 40. Responsive Accessibility

Responsive design must preserve comprehension.

Mobile layouts may reorganize.

They must not:

- shrink the board until orientation becomes unclear,
- reduce command targets excessively,
- hide Step mode,
- create horizontal overflow,
- require tiny controls.

---

# 41. Mobile Priority

On narrow screens, prioritize:

1. board readability,
2. program visibility,
3. execution controls,
4. command palette,
5. secondary UI.

Do not keep desktop layout proportions merely for visual consistency.

---

# 42. Cognitive Accessibility

A child should not need to remember multiple hidden rules at once.

Use:

- consistent command meaning,
- persistent orientation cues,
- predictable control placement,
- clear visual states,
- limited choices.

Do not redesign control meaning between stages.

---

# 43. Recognition Over Recall

Prefer:

> recognize the command visually

over:

> remember what an unexplained control did previously.

Examples:

- keep icons consistent,
- preserve cyan/orange mapping,
- maintain stable Play/Step placement where practical,
- keep fish meaning consistent.

---

# 44. One Primary Task

Each gameplay screen should have one obvious primary activity:

> Build and test the program.

Avoid competing elements such as:

- news panels,
- achievements feeds,
- multiple dialogs,
- promotional UI,
- unrelated menus.

The player's attention should stay on:

```txt
board ↔ program
```

---

# 45. Instruction Priority

When confusion occurs, improve communication in this order:

```txt
1. world clarity
2. visual state
3. animation
4. interaction affordance
5. iconography
6. short text
7. additional explanation
```

Do not immediately solve confusing interaction by adding prose.

---

# 46. Accessibility vs Tutorial Scaffolding

Tutorial scaffolding may fade.

Accessibility support must not.

May fade:

- ghost hand,
- isolated command palette,
- pre-filled command,
- explicit turn preview,
- tutorial spotlight.

Must remain:

- readable orientation,
- left/right redundancy,
- active command feedback,
- visual collision feedback,
- visual success feedback,
- audio independence.

---

# 47. BISINDO Role

BISINDO is optional instructional reinforcement.

It is not the sole communication system for gameplay.

Possible uses:

- introduction to a concept,
- onboarding,
- brief contextual guidance,
- replayable instructional support.

Core puzzles must remain understandable even if a BISINDO clip is unavailable.

---

# 48. BISINDO Is Not Decoration

Do not use BISINDO simply to make the project appear inclusive.

Every included sign should:

- have instructional purpose,
- be linguistically validated,
- come from a legitimate source,
- have clear reuse rights.

A small number of correct signs is better than broad uncertain coverage.

---

# 49. BISINDO Accuracy

Never invent or approximate BISINDO.

Do not derive signs from:

- ASL,
- SIBI,
- unrelated sign languages,
- generic sign-language clipart,
- AI-generated hand gestures,
- visual imitation by a developer unfamiliar with BISINDO.

The project developer does not need to personally perform BISINDO.

Prefer validated existing material.

---

# 50. BISINDO Asset Priority

Use BISINDO assets in this order:

```txt
1. explicitly licensed reusable BISINDO dataset
2. validated source with written redistribution permission
3. custom recording validated by competent BISINDO signer / educator
4. omit the sign
```

Never lower validation standards just to increase sign coverage.

---

# 51. Current Preferred BISINDO Source

Current default source:

**BISINDO Video Dataset — Mendeley Data**

Dataset:

https://data.mendeley.com/datasets/f33k9w86wr/3

License:

**Creative Commons Attribution 4.0 International — CC BY 4.0**

License terms:

https://creativecommons.org/licenses/by/4.0/

Current project policy treats this as the preferred reusable source because it
has an explicit redistribution/modification license.

Before shipping identifiable-person video, still verify whether any applicable
performer/privacy/publicity requirements need additional handling.

Do not assume the copyright license automatically answers every personality or
privacy-right question.

---

# 52. Mendeley Attribution

When a Mendeley BISINDO clip is reused, preserve appropriate attribution.

At minimum record:

- dataset title,
- dataset author/creator,
- source URL,
- CC BY 4.0 license,
- license URL,
- whether the clip was modified.

Example project attribution structure:

```txt
BISINDO Video Dataset
Source: https://data.mendeley.com/datasets/f33k9w86wr/3
License: CC BY 4.0
License: https://creativecommons.org/licenses/by/4.0/
Modification: cropped for interface presentation
```

Use the exact creator attribution provided by the dataset metadata when assets
are integrated.

---

# 53. Keep Asset Licensing Separate

Third-party BISINDO media licensing is separate from the Kotak-Katik software
license.

Do not imply that:

```txt
Kotak-Katik source-code license
```

automatically relicenses:

```txt
third-party BISINDO video
```

Document third-party media explicitly.

Recommended location:

```txt
docs/ATTRIBUTIONS.md
```

or:

```txt
THIRD_PARTY_LICENSES.md
```

---

# 54. Reference-Only BISINDO Sources

The following sources may be useful for research or validation but should not
be copied into the project unless explicit reuse rights are confirmed.

## Pusbisindo Video Dictionary

https://www.pusbisindo.org/kamus-kosa-isyarat

Current status:

```txt
REFERENCE ONLY
UNSAFE TO REDISTRIBUTE WITHOUT PERMISSION
```

Public visibility does not equal redistribution permission.

---

# 55. Balai Bahasa Jawa Timur

Official video/resource pages:

https://balaibahasajatim.kemendikdasmen.go.id/video

Related project information:

https://balaibahasajatim.kemendikdasmen.go.id/berita/inklusi-digital-bbp-jatim-susun-kamus-video-bisindo-fasilitasi-komunikasi-bagi-komunitas-tuli

Current status:

```txt
REFERENCE ONLY
UNSAFE TO REDISTRIBUTE WITHOUT EXPLICIT PERMISSION
```

Do not download, crop, bundle, or republish merely because the material is
publicly viewable.

---

# 56. WL-BISINDO

Repository:

https://github.com/AceKinnn/WL-BISINDO

License:

```txt
CC BY-NC 4.0
```

License terms:

https://creativecommons.org/licenses/by-nc/4.0/

The dataset represents a Banten BISINDO variant.

Current project status:

```txt
CONDITIONAL
```

Do not ship WL-BISINDO material until the intended competition/deployment use
has been confirmed to satisfy the non-commercial restriction.

Prefer the CC BY Mendeley dataset where equivalent content exists.

---

# 57. Teman Isyarat Dataset

Repository:

https://github.com/temanisyarat/dataset

Project:

https://temanisyarat.com/

Regional context:

```txt
Central Java / Solo
```

Current project status:

```txt
REFERENCE / FUTURE CANDIDATE
UNSAFE TO REDISTRIBUTE WITHOUT EXPLICIT LICENSE
```

Do not assume repository visibility grants asset reuse rights.

Also verify whether available files are production linguistic data or sample/mock
material before using them as language references.

---

# 58. Public Does Not Mean Reusable

Agents must never infer:

```txt
public website
```

or:

```txt
public GitHub repository
```

means:

```txt
free to redistribute
```

Before importing third-party media, verify:

- copyright license,
- redistribution permission,
- modification permission,
- attribution requirements,
- commercial restrictions,
- relevant regional/linguistic context.

If permission is unclear:

```txt
DO NOT SHIP THE ASSET
```

---

# 59. BISINDO Regional Variation

BISINDO may vary regionally.

Do not assume one recorded sign is universally preferred throughout Indonesia.

When a dataset states a regional variety, record it in project documentation.

Example:

```txt
WL-BISINDO
Variant: Banten
```

Do not silently combine signs from multiple regions as though they form one
uniform vocabulary.

For the MVP, consistency is preferable to broad regional mixing.

---

# 60. BISINDO Vocabulary Scope

Do not attempt to translate the entire interface into BISINDO for MVP.

Prioritize a small vocabulary tied to major learning concepts.

Candidate concepts include:

```txt
maju
kiri
kanan
ulang
mulai
coba lagi
```

Actual inclusion depends on the availability of validated signs.

Do not force these exact words if an authoritative source uses a more
appropriate linguistic expression.

---

# 61. Missing BISINDO Asset

If a validated sign cannot be sourced:

Bad:

```txt
developer imitates sign from memory
```

Bad:

```txt
AI generates hand animation
```

Bad:

```txt
use similar ASL gesture
```

Correct:

```txt
omit BISINDO clip
+
retain visual gameplay instruction
```

The game must already function without the clip.

---

# 62. Custom BISINDO Recording

Custom recording is acceptable if needed.

However, the performer should be:

- competent in BISINDO,
- preferably a native/regular BISINDO signer,
- or validated by an appropriate Deaf/BISINDO educator/community member.

A developer unfamiliar with BISINDO should not self-record instructional signs
without validation.

If custom material is recorded, document:

- signer/validator permission,
- intended usage rights,
- vocabulary,
- regional context where relevant,
- whether editing/cropping is permitted.

---

# 63. AI and Sign Language

Do not use generative AI output as authoritative BISINDO instruction unless the
result has been independently validated by a qualified human signer.

This applies to:

- generated hand poses,
- generated videos,
- avatar signing,
- interpolated gesture sequences.

Hand anatomy correctness is not linguistic correctness.

---

# 64. BISINDO Presentation

If a BISINDO clip is shown:

- keep hands fully visible,
- keep relevant upper-body/facial expression visible,
- avoid cropping essential signing space,
- maintain sufficient video size,
- avoid UI overlap,
- provide replay control where useful.

Do not crop purely for aesthetics if it removes linguistic information.

---

# 65. BISINDO and Facial Expression

Sign-language communication may depend on more than handshape.

Therefore do not assume that:

```txt
hands-only crop
```

is always sufficient.

When reusing video, preserve enough of the signer to retain the intended
linguistic expression.

---

# 66. BISINDO Placement

BISINDO should not permanently occupy large portions of the puzzle interface.

Potential presentation:

```txt
short contextual card
```

or:

```txt
temporary onboarding corner panel
```

or:

```txt
replayable help element
```

The game board and command relationship remain primary.

---

# 67. BISINDO Replay

If a sign is instructional, allow replay without replaying the entire level.

Avoid one-time-only instructional media.

The player should be able to review the sign when needed.

---

# 68. BISINDO Failure Isolation

If a BISINDO asset:

- fails to load,
- is unavailable,
- is removed for licensing reasons,

the game must remain playable.

Do not make stage progression technically depend on successful BISINDO media
loading.

---

# 69. Captions and Video Text

If future instructional video contains speech:

- provide captions,
- keep captions readable,
- do not hide critical captions behind controls.

If the video consists solely of BISINDO, short textual context may still be
provided when useful.

Do not treat captions as a replacement for BISINDO or vice versa.

They serve different communication needs.

---

# 70. Error Messages

Technical failures should use concise visual language.

Examples:

```txt
Coba lagi
```

or:

```txt
Video belum bisa dimuat
```

Do not expose children to:

- stack traces,
- network error codes,
- technical terminology.

Developer diagnostics belong elsewhere.

---

# 71. Accessibility and Performance

Slow loading is an accessibility problem when it breaks feedback timing.

Prioritize loading critical assets:

- cat,
- board tiles,
- command icons,
- required UI.

Non-critical assets may load afterward:

- decorative props,
- cosmetics,
- optional video,
- ambience.

Do not block the first playable interaction on optional media.

---

# 72. BISINDO Performance

BISINDO video should be compressed responsibly.

Preserve:

- hand clarity,
- movement clarity,
- facial visibility where needed.

Do not compress so aggressively that handshape becomes difficult to distinguish.

Use lazy loading for clips not required immediately.

---

# 73. Loading Feedback

If a gameplay-critical component is still loading, communicate this visually.

Do not leave controls apparently broken.

For optional BISINDO media:

- show loading state,
- allow gameplay to continue when appropriate.

---

# 74. Contrast

Critical foreground elements should remain distinguishable from their
backgrounds.

Pay particular attention to:

- command icons,
- selected blocks,
- active execution state,
- map node states,
- text,
- controls.

Do not lower contrast merely to achieve a soft visual aesthetic.

---

# 75. Text Size

Do not use very small text for child-facing essential information.

Especially avoid tiny labels for:

- command meaning,
- buttons,
- objective information,
- map states.

If information is important enough to display, it should be readable.

---

# 76. Responsive Text

Text should not become unreadably small merely because viewport width decreases.

Reflow UI instead.

Prefer:

```txt
layout change
```

over:

```txt
scale entire interface to 60%
```

---

# 77. Visual Noise

Keep the gameplay environment calm.

Reduce:

- unnecessary particles,
- moving decorations,
- repeated pulses,
- decorative labels,
- dense scenery.

When an important command highlights, it should be easy to notice.

---

# 78. Attention Competition

Avoid having multiple high-attention animations occur simultaneously.

Bad:

```txt
command pulses
+
fish bounces
+
background prop moves
+
map indicator flashes
+
button glows
```

Prioritize the event the child should currently understand.

---

# 79. Accessible Failure State

When execution fails:

- preserve context,
- identify the active command visually,
- keep the board visible,
- allow retry,
- allow editing,
- avoid punitive presentation.

The player should be able to reason from the failure.

---

# 80. Accessible Success State

Success should not immediately destroy the evidence of what happened.

Allow enough time for the child to see:

```txt
final action
    ↓
objective completed
    ↓
celebration
```

before navigating away.

---

# 81. Accessibility Testing Modes

Every meaningful gameplay feature should be tested under:

### Muted Audio

```txt
system/browser audio = 0
```

### Reduced Motion

```txt
prefers-reduced-motion = reduce
```

### Mobile Width

Test narrow touch layouts.

### Desktop

Verify full board and command relationship.

### Keyboard

Verify surrounding web UI remains operable where practical.

---

# 82. Manual Accessibility Test

For each puzzle, verify:

### Goal

Can the objective be identified visually?

### Orientation

Can the cat's forward direction be identified?

### Left / Right

Can turn directions be distinguished without relying solely on color?

### Program

Can command order be identified?

### Execution

Can the active command be identified?

### Collision

Can the reason execution stopped be understood?

### Collection

Can the player see which fish have been collected?

### Success

Can completion be understood without audio?

### Retry

Can the child easily attempt again?

### Responsive

Is all of this still true on mobile?

---

# 83. Deaf-First Test

Perform the entire primary flow muted:

```txt
Start
 ↓
Onboarding
 ↓
Map
 ↓
Puzzle
 ↓
Build
 ↓
Run
 ↓
Collision
 ↓
Debug
 ↓
Retry
 ↓
Success
 ↓
Next Stage
```

At no point should gameplay require hearing.

---

# 84. Accessibility Failure Conditions

A feature is incomplete if any of these are true:

- sound is the only indication of an event,
- left/right is distinguishable only by color,
- the cat's orientation becomes ambiguous,
- collision feedback disappears before inspection,
- reduced motion removes important information,
- mobile controls require hover,
- important targets become too small,
- BISINDO content is linguistically unverified,
- third-party BISINDO licensing is unclear,
- optional media failure prevents gameplay,
- a tutorial explanation is required because the visual interaction itself is
  unclear.

---

# 85. Do Not Claim Accessibility Without Testing

Agents must not write:

```txt
fully accessible
```

or similar absolute claims merely because accessibility features exist.

Prefer specific, supportable statements such as:

```txt
gameplay-critical audio cues have visual equivalents
```

or:

```txt
core puzzles can be completed without audio
```

Claims should match what has actually been verified.

---

# 86. Resource Register

Resource information was last reviewed on 2026-10-07. Recheck the current version, license, attribution, performer permissions, and regional context before integrating any asset.

## Reusable Candidate

### BISINDO Video Dataset — Mendeley Data

https://data.mendeley.com/datasets/f33k9w86wr/3

License:

https://creativecommons.org/licenses/by/4.0/

Status:

```txt
PREFERRED
CC BY 4.0
```

---

## Validation / Reference

### Pusbisindo Video Dictionary

https://www.pusbisindo.org/kamus-kosa-isyarat

Status:

```txt
REFERENCE ONLY UNTIL REUSE PERMISSION IS VERIFIED
```

---

### Balai Bahasa Jawa Timur BISINDO Video Resources

https://balaibahasajatim.kemendikdasmen.go.id/video

Project information:

https://balaibahasajatim.kemendikdasmen.go.id/berita/inklusi-digital-bbp-jatim-susun-kamus-video-bisindo-fasilitasi-komunikasi-bagi-komunitas-tuli

Status:

```txt
REFERENCE ONLY UNTIL REUSE PERMISSION IS VERIFIED
```

---

### WL-BISINDO

https://github.com/AceKinnn/WL-BISINDO

License:

https://creativecommons.org/licenses/by-nc/4.0/

Variant:

```txt
Banten
```

Status:

```txt
CONDITIONAL — NON-COMMERCIAL RESTRICTION
```

---

### Teman Isyarat Dataset

https://github.com/temanisyarat/dataset

https://temanisyarat.com/

Context:

```txt
Central Java / Solo
```

Status:

```txt
REFERENCE / FUTURE CANDIDATE
NO VERIFIED REDISTRIBUTION LICENSE YET
```

---

# 87. Resource Verification Rule

Before adding any external accessibility resource:

1. open the original source,
2. verify current licensing,
3. verify the actual file belongs to that license,
4. record attribution requirements,
5. record modification requirements,
6. verify regional/language context,
7. add the resource to attribution documentation.

Do not rely exclusively on a previous agent's summary.

Licensing may change.

---

# 88. Recommended Attribution File

Maintain:

```txt
docs/ATTRIBUTIONS.md
```

For each third-party media asset record:

```txt
Asset:
Source:
Creator:
License:
License URL:
Original URL:
Modification:
Regional / linguistic notes:
```

Keep this documentation alongside the repository.

---

# 89. Accessibility North Star

Every critical interaction should satisfy:

> If I cannot hear the game, can I still understand what happened?

And:

> If motion is reduced, can I still identify the state?

And:

> If I do not read a paragraph, can I still understand the core task?

And:

> If BISINDO media is unavailable, does the visual interaction still work?

If the answer to any relevant question is no, improve the interaction before
adding more content.

Kotak-Katik should not make accessibility visible as a special feature.

It should make accessible interaction feel like the normal way the game works.
