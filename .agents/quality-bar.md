# Quality Bar — Kotak-Katik

## 1. Purpose

This document defines when work on Kotak-Katik is considered complete.

"Implemented" does not mean "done".

A feature is done only when it:

- works,
- fits the product,
- remains understandable,
- preserves accessibility,
- behaves correctly on supported layouts,
- does not introduce obvious technical debt,
- can be demonstrated reliably,
- supports the competition submission quality.

This file should be used for:

- agent self-review,
- feature completion,
- audits,
- pre-commit checks,
- final competition review.

---

# 2. Priority

When evaluating quality, use this order:

```txt
1. Correct gameplay
2. Child comprehension
3. Deaf-first accessibility
4. Functional reliability
5. Responsive usability
6. Visual quality
7. Technical quality
8. Extra polish
```

A visually beautiful feature that fails 1–5 is not acceptable.

---

# 3. Competition Eligibility Gate

Before scoring matters, the project must pass all mandatory eligibility
requirements.

The competition requires:

- AI Agent reference docs,
- public GitHub repository,
- curated prompt journal,
- valid theme alignment,
- deployed website,
- compliant development history.

Failure to satisfy a required gate can prevent further judging.

Never sacrifice eligibility for polish.

Source check: the eligibility items and scoring weights in this file were taken from the supplied guidebook summary. The [public M-One competition page](https://mone.mutudev.com/coding-competition) confirms the category theme and allows AI assistance, but does not publish the full eligibility gate or weighted rubric. Verify those details against the latest organizer-issued guidebook and technical-meeting instructions before final submission.

---

# 4. Required Submission Artifacts

The final project must have:

```txt
Public GitHub repository
AI Agent reference docs
Curated prompt journal
Raw prompt history / evidence where required
Deployed website
```

Keep these continuously maintainable.

Do not wait until the final hour to reconstruct documentation.

---

# 5. Competition Scoring Model

The official weighted criteria are:

```txt
25%  Proses Vibe Coding
25%  Fungsionalitas & Relevansi Tema
20%  UI/UX & Responsivitas
15%  Kualitas Teknis
15%  Inovasi & Kreativitas
```

Agents should optimize for the whole product.

Do not spend excessive time improving a low-value detail while a higher-weight
criterion remains weak.

---

# 6. Quality Interpretation

For internal review, aim for:

> Clearly demonstrable, coherent, complete, and polished.

The competition's highest evaluation band expects work that is:

```txt
complete
consistent
beyond expectations
```

Do not interpret "working" as sufficient for the highest quality bar.

---

# 7. Proses Vibe Coding — 25%

This criterion is not merely:

> "AI was used."

It evaluates the quality of the AI-assisted development process.

Internal quality targets:

- docs are clear,
- docs are structured,
- goals are explicit,
- stack is explicit,
- features are explicit,
- working rules are explicit,
- prompts are purposeful,
- debugging prompts demonstrate understanding,
- development history is auditable.

---

# 8. Agent Docs Quality

The AI Agent docs should collectively make these clear:

```txt
What are we building?
Who is it for?
Why does it exist?
How does gameplay behave?
How are concepts taught?
What accessibility rules apply?
What should it look like?
How should it be engineered?
What counts as done?
```

Agents should not need to guess fundamental product behavior.

---

# 9. Root AGENTS.md Quality

`AGENTS.md` should remain:

- concise,
- authoritative,
- operational.

Do not turn it into a duplicate of all `.agents/*` files.

Its purpose is to:

```txt
orient
constrain
route
```

Detailed rules belong in dedicated documents.

---

# 10. Prompt Quality

Important prompts should:

- state the intended outcome,
- include relevant constraints,
- identify affected systems,
- avoid vague "make it better" language,
- encourage verification,
- record important reasoning or debugging context.

Good:

```txt
Fix collision execution so the current invalid command remains highlighted and
Run pauses immediately. Do not change successful movement behavior. Add engine
tests for blocked and void destinations.
```

Weak:

```txt
fix collision
```

---

# 11. Debugging Prompt Quality

Debugging prompts should demonstrate understanding of:

```txt
observed symptom
expected behavior
affected system
likely boundary
verification
```

Do not repeatedly ask agents:

```txt
it doesn't work, fix it
```

when the failure can be described more precisely.

---

# 12. Prompt Journal

The competition expects a curated prompt journal.

The curated set should represent meaningful stages such as:

```txt
Idea / PRD
Debugging
Audit & Optimization
Finishing
One free category
```

Do not fill the curated journal with arbitrary prompts merely because they were
long.

Choose prompts that demonstrate development quality.

---

# 13. Development Evidence

Keep development history believable and auditable.

Do not:

- fabricate prompts,
- backdate work,
- rewrite commit chronology,
- force-push to hide mistakes,
- reconstruct false progress after implementation.

Real iteration is acceptable.

Messy-but-authentic improvement is better than suspiciously perfect history.

---

# 14. Fungsionalitas & Relevansi Tema — 25%

Kotak-Katik must clearly satisfy:

```txt
Innovating Education Through Technology
+
Web Education for Kids
```

The educational value must be visible through the product itself.

Do not rely only on README explanations to establish educational relevance.

---

# 15. Core Functional Flow

At minimum, this flow must work reliably:

```txt
open app
↓
start
↓
enter expedition
↓
select level
↓
inspect board
↓
construct program
↓
Run / Step
↓
observe result
↓
retry / edit
↓
complete
↓
progress
```

If this flow breaks, stop polishing secondary features.

---

# 16. Core Gameplay Requirements

Before considering the core game complete, verify:

```txt
forward
left turn
right turn
sequence execution
loop execution
collision
fish collection
Run
Step
Retry
Reset
level completion
progression
```

Each must work from logical state, not visual coincidence.

---

# 17. Movement Correctness

Verify all orientations:

```txt
north + forward
east + forward
south + forward
west + forward
```

Verify turning:

```txt
left from every orientation
right from every orientation
```

Verify:

```txt
4 right turns = original orientation
4 left turns = original orientation
```

---

# 18. Relative Direction Quality

Turning must remain character-relative.

Do not accidentally implement:

```txt
screen left
screen right
```

The game must preserve:

```txt
cat left
cat right
```

even when the visual relationship is mirrored from the player's perspective.

---

# 19. Loop Correctness

Verify:

- correct repeat count,
- correct command order,
- correct Step behavior,
- correct active-command feedback,
- correct state after loop completion.

A loop must not behave differently between Run and Step.

---

# 20. Step Correctness

Step must execute exactly one primitive action.

Example:

```txt
↻ 3x { ⬆ }
```

requires:

```txt
tap 1 → forward
tap 2 → forward
tap 3 → forward
```

One tap must not execute the whole loop.

---

# 21. Collision Correctness

When movement is invalid:

```txt
cat does not move
execution stops
invalid command remains identifiable
visual feedback occurs
player can inspect
```

Do not continue running downstream commands.

---

# 22. Collectible Correctness

Verify:

- fish only collects when entered,
- collected fish cannot collect twice,
- reset restores fish,
- completion updates correctly,
- visual state matches logical state.

---

# 23. Reset Correctness

Reset must return to a deterministic initial state.

Verify restoration of:

- position,
- orientation,
- collectibles,
- execution cursor,
- completion state.

Do not manually reverse gameplay history.

---

# 24. Theme Relevance Test

Ask:

> If the competition title and README disappeared, would a judge still
> understand that this is an educational coding game for children?

If no, strengthen the actual experience.

---

# 25. Educational Relevance Test

A judge should be able to observe:

```txt
instruction
→ action
→ result
→ correction
```

without reading a long explanation.

The educational mechanic should exist in gameplay.

Not only in documentation.

---

# 26. UI/UX & Responsivitas — 20%

The official judging specifically cares about:

- desktop layout,
- mobile layout,
- non-generic visual design,
- animation,
- hover / interaction quality,
- relevant visual assets.

Our quality bar should exceed the minimum.

---

# 27. Desktop Quality

Verify at least one common desktop viewport.

Check:

- board dominance,
- readable commands,
- no unnecessary scroll,
- no overflow,
- clear primary action,
- stable scene framing,
- no visual clipping.

---

# 28. Mobile Quality

Verify at least one common narrow mobile viewport.

Check:

- board remains readable,
- command tray remains usable,
- Play and Step remain reachable,
- tap targets remain large,
- no horizontal overflow,
- no hover requirement,
- text remains readable,
- panels reorganize rather than simply shrink.

---

# 29. Responsive Rule

Responsive design means:

```txt
recompose
```

not:

```txt
scale desktop down
```

If mobile looks like a tiny desktop UI, revise it.

---

# 30. Visual Identity Quality

The interface should visibly follow `design.md`.

Required qualities:

```txt
pastel
toy-like
low-poly
colored panels
calm
child-friendly
coherent
```

It should not resemble generic generated SaaS UI.

---

# 31. Day Theme Quality

Verify:

- board contrast,
- fish visibility,
- cat readability,
- panel harmony,
- semantic left/right colors,
- readable text.

Pastel must not become washed out.

---

# 32. Night Theme Quality

Verify:

- world remains readable,
- no pure-black/neon drift,
- semantic colors remain distinguishable,
- controls remain obvious,
- panel contrast remains sufficient,
- cozy atmosphere remains consistent.

Night mode must feel intentionally designed.

---

# 33. Typography Quality

Verify correct use of:

```txt
FUN font
→ personality

BASIC font
→ clarity
```

Do not use Fun typography for dense utility text.

Do not use tiny helper text to compensate for confusing UI.

---

# 34. Animation Quality

Every significant animation should answer:

> What information does this motion communicate?

Useful:

- command execution,
- cat movement,
- turn,
- collection,
- collision,
- success,
- progression.

Questionable:

- decorative floating,
- random bouncing,
- endless pulsing,
- unrelated particles.

---

# 35. Hover Quality

Desktop hover may enhance interaction.

It must not reveal unique required information.

Touch users must not lose functionality.

---

# 36. Asset Quality

3D assets should look like they belong together.

Verify:

- scale consistency,
- saturation consistency,
- material consistency,
- prop density,
- style coherence.

Do not display assets merely because they exist in a pack.

---

# 37. Cognitive Load Quality

For every gameplay screen ask:

> What does the child need to notice first?

The answer should usually be:

```txt
cat / board / fish
```

then:

```txt
program / commands
```

Secondary controls should visually recede.

---

# 38. No UI Slop

Reject screens with:

- card-inside-card structures,
- tiny uppercase labels,
- decorative chips,
- unnecessary badges,
- generic gradients,
- glass panels,
- random glows,
- floating blobs,
- dense dashboards,
- meaningless stats.

The game should feel authored.

---

# 39. Kualitas Teknis — 15%

The official indicators include:

- code structure,
- folder structure,
- performance,
- compressed/lazy-loaded assets,
- basic SEO,
- clean commit messages.

Treat these as product quality, not cleanup work.

---

# 40. Architecture Quality

Preserve:

```txt
level data
↓
game engine
↓
logical state
↓
rendering
```

Reject architecture where:

- mesh state becomes game state,
- React UI decides collision,
- Run and Step diverge,
- level logic lives in random components.

---

# 41. Type Quality

Use explicit domain types.

Prefer:

```txt
Position
Orientation
Command
LevelDefinition
GameState
Objective
```

Avoid broad untyped objects.

Do not bypass errors with `any` without strong justification.

---

# 42. Component Quality

Components should have one understandable responsibility.

Bad signs:

- several hundred lines mixing engine + UI + scene logic,
- many unrelated effects,
- deeply nested prop plumbing,
- duplicated game rules.

Refactor only when the complexity is real.

Do not refactor for aesthetic purity during deadline pressure.

---

# 43. Dependency Quality

Every added package should solve a current problem.

Before adding one:

```txt
Why do we need it?
What does it replace?
How much complexity does it add?
```

Do not dependency-hoard.

---

# 44. Runtime Quality

Production should not show:

- obvious console errors,
- repeated warnings,
- broken assets,
- unhandled promise rejection,
- failed routes,
- permanent loading states.

Warnings from third-party libraries should be investigated when meaningful.

---

# 45. Build Quality

Before declaring major work done:

```bash
bun run build
```

must succeed.

Run relevant tests as well.

Do not accept:

```txt
dev server looks okay
```

as sufficient verification.

---

# 46. Performance Quality

Prioritize:

- usable first load,
- stable animation,
- reasonable memory,
- responsive input.

Avoid optimizing meaningless micro-benchmarks.

Measure actual issues before adding complicated optimization.

---

# 47. Asset Performance

Before submission, inspect:

- GLB sizes,
- image sizes,
- video sizes,
- BGM size,
- unused assets.

Remove unused heavy assets.

Compress only where quality remains appropriate.

---

# 48. Lazy Loading

Lazy-load when it materially helps.

Likely candidates:

- optional BISINDO video,
- cosmetics,
- non-current environment assets,
- heavy later screens.

Do not lazy-load everything mechanically.

---

# 49. SEO Basics

The game does not need a content-marketing SEO strategy.

But basic web metadata should exist:

```txt
title
description
favicon / icon
viewport
social preview if practical
language metadata
```

Do not spend excessive time on SEO beyond competition relevance.

---

# 50. Commit Quality

Commit messages should explain real changes.

Good:

```txt
feat: add deterministic loop execution

fix: preserve active command after collision

feat: add mobile command tray layout

perf: lazy load bisindo tutorial clips
```

Bad:

```txt
update
fix
final
final final
works
```

---

# 51. Inovasi & Kreativitas — 15%

Innovation should come from meaningful product decisions.

For Kotak-Katik, likely differentiators include:

- deaf-first interaction,
- visual sensory substitution,
- cat-relative direction scaffolding,
- cyan/orange flank association,
- forward gaze cue,
- single-step debugging,
- gradual scaffold removal,
- branching practice with fixed conceptual progression.

Do not add random novelty solely to appear innovative.

---

# 52. Innovation Test

For every claimed innovation ask:

> Does this solve a real problem?

Good:

```txt
visual execution cadence replaces audio dependence
```

Weak:

```txt
we added particles
```

Good:

```txt
single-step execution lets the child inspect cause and effect
```

Weak:

```txt
we added an animated mascot
```

---

# 53. Innovation Must Work

A broken innovative feature earns less value than a polished smaller one.

Do not ship unfinished experimental features merely to list them in the
submission.

---

# 54. Accessibility Quality

Every gameplay-critical interaction must pass the mute test.

Verify:

```txt
audio off
```

then complete:

- onboarding,
- movement,
- turning,
- collision,
- collection,
- debugging,
- success.

Nothing required may disappear.

---

# 55. Visual Parity

For every gameplay sound ask:

> What visual event conveys the same information?

If the answer is unclear, the audio design is incomplete.

---

# 56. Color Redundancy

Verify left/right remain distinguishable without color alone.

Use:

- arrow shape,
- orientation,
- icon direction,
- visual association.

Cyan/orange reinforce meaning.

They do not solely carry it.

---

# 57. Reduced Motion Quality

With reduced motion enabled:

- state changes remain understandable,
- active commands remain identifiable,
- success remains clear,
- collision remains clear.

Do not simply remove animation without replacing its informational role.

---

# 58. BISINDO Quality

Any BISINDO material must:

- be validated,
- have appropriate reuse rights,
- preserve meaningful signing area,
- not be AI-invented,
- not be performed by an unqualified developer without validation.

If unavailable, omit it.

Do not compromise correctness for feature count.

---

# 59. Pedagogical Quality

Every stage should answer:

```txt
What is being taught?
What prior knowledge is assumed?
Why is this harder than the previous relevant stage?
```

If an agent cannot answer these, the stage probably lacks purpose.

---

# 60. New Concept Quality

When introducing a new concept:

- simplify board,
- reduce unrelated commands,
- provide demonstration,
- provide guided interaction,
- keep objective obvious.

Do not introduce a new concept inside a visually complex challenge.

---

# 61. Practice Quality

Practice should vary:

- geometry,
- orientation,
- path arrangement,

without introducing a new mechanic.

Branching practice should not increase conceptual load unexpectedly.

---

# 62. Difficulty Quality

Good difficulty:

```txt
more reasoning
```

Bad difficulty:

```txt
more confusion
```

Reject difficulty caused by:

- ambiguous orientation,
- hidden fish,
- tiny controls,
- unreadable board,
- dense decoration,
- artificial timers.

---

# 63. Failure Quality

An unsuccessful attempt should preserve enough evidence for reasoning.

Verify:

```txt
problem visible
active command visible
board visible
retry available
editing available
```

Avoid blank failure screens.

---

# 64. Success Quality

Success should feel clear and pleasant without becoming slow.

Verify:

```txt
objective visibly completed
cat/world responds
next progression becomes understandable
```

Do not force long celebration sequences after every stage.

---

# 65. Loading Quality

Never leave the child staring at:

- blank canvas,
- broken image icon,
- frozen button,
- unexplained loader.

Provide concise visual loading state.

Optional media failure must not block gameplay.

---

# 66. First-Session Quality

A new player should be able to reach meaningful interaction quickly.

Avoid:

- long intros,
- marketing pages,
- dense setup,
- account creation.

Target:

```txt
open
→ start
→ see interaction
→ play
```

---

# 67. No Adult Explanation Dependency

The MVP should not require constant adult explanation.

If normal interaction repeatedly requires:

```txt
teacher explains what button means
```

improve the UI/scaffolding.

---

# 68. Stage Quality Checklist

Before accepting a stage, verify:

- [ ] concept is explicit internally
- [ ] objective is visually obvious
- [ ] board is no larger than necessary
- [ ] cat orientation is readable
- [ ] relevant commands are available
- [ ] unrelated commands are hidden where appropriate
- [ ] fish are clearly visible
- [ ] execution feedback works
- [ ] collision is understandable
- [ ] mute preserves information
- [ ] mobile remains usable
- [ ] difficulty reason is clear

---

# 69. Feature Quality Checklist

Before declaring a feature done:

- [ ] requirement is understood
- [ ] implementation fits existing architecture
- [ ] relevant engine behavior is tested
- [ ] build succeeds
- [ ] no obvious runtime error exists
- [ ] desktop checked
- [ ] mobile checked
- [ ] mute behavior checked
- [ ] visual hierarchy checked
- [ ] no unnecessary scope added
- [ ] related documentation updated when needed

---

# 70. Gameplay Regression Checklist

After significant engine changes, verify:

- [ ] forward movement
- [ ] left turn
- [ ] right turn
- [ ] sequence order
- [ ] loop count
- [ ] Step
- [ ] Run
- [ ] collision stop
- [ ] fish collection
- [ ] reset
- [ ] retry
- [ ] completion

---

# 71. UI Regression Checklist

After significant UI changes, verify:

- [ ] desktop
- [ ] mobile
- [ ] Day theme
- [ ] Night theme
- [ ] command tap
- [ ] drag/reorder if relevant
- [ ] Play
- [ ] Step
- [ ] Retry
- [ ] settings
- [ ] focus/keyboard basics
- [ ] no overflow

---

# 72. Accessibility Regression Checklist

Verify:

- [ ] complete flow works muted
- [ ] sound has visual equivalent
- [ ] left/right is not color-only
- [ ] active command is visible
- [ ] collision persists for inspection
- [ ] reduced motion preserves information
- [ ] touch does not require hover
- [ ] essential text remains readable
- [ ] BISINDO assets are validated/licensed

---

# 73. Performance Regression Checklist

Check:

- [ ] no unnecessary frame-loop logic
- [ ] no obvious React render loop
- [ ] no giant unused asset loaded immediately
- [ ] no duplicate model loading
- [ ] mobile remains responsive
- [ ] production bundle builds
- [ ] optional assets lazy-load where appropriate

---

# 74. Competition Evidence Checklist

Maintain evidence for:

- [ ] public repository
- [ ] commit chronology
- [ ] AI Agent docs
- [ ] curated prompts
- [ ] raw prompt history
- [ ] deployed site
- [ ] third-party attribution
- [ ] asset licenses

Do not reconstruct these after the deadline.

---

# 75. Pre-Submission Gate

Before submission, all of these must be true:

```txt
PUBLIC REPO        PASS
DEPLOY              PASS
AGENT DOCS          PASS
PROMPT JOURNAL      PASS
CORE GAMEPLAY       PASS
MOBILE              PASS
DESKTOP             PASS
MUTE TEST           PASS
BUILD               PASS
CRITICAL TESTS      PASS
ASSET LICENSES      PASS
```

If any critical line is FAIL, fix it before adding polish.

---

# 76. Final Polish Priority

When core functionality is already stable, polish in this order:

```txt
1. obvious bugs
2. onboarding clarity
3. gameplay feedback
4. responsive layout
5. accessibility issues
6. scene composition
7. transitions
8. micro-animation
9. decorative detail
```

Do not reverse this order.

---

# 77. Deadline Triage

When time is limited, remove or defer:

- extra cosmetics,
- elaborate transitions,
- extra environmental themes,
- optional branches,
- secondary settings,
- experimental effects.

Protect:

- core puzzle flow,
- learning progression,
- accessibility,
- deployment,
- documentation,
- submission evidence.

---

# 78. Claim Discipline

Do not claim:

```txt
fully accessible
perfect UX
optimized
complete
production-ready
```

without appropriate evidence.

Prefer concrete statements:

```txt
core gameplay has visual equivalents for audio cues
```

```txt
tested at desktop and mobile breakpoints
```

```txt
engine movement and loop behavior covered by unit tests
```

Specific claims are more defensible.

---

# 79. Agent Completion Report

After meaningful work, an agent should report concisely:

```txt
Changed:
- ...

Verified:
- ...

Not verified / remaining risk:
- ...
```

Do not produce long victory summaries.

Do not claim verification that was not actually performed.

---

# 80. Stop Conditions

An agent must stop and flag the issue instead of improvising if:

- gameplay docs conflict,
- accessibility requirements conflict,
- asset licensing is unclear,
- BISINDO correctness is uncertain,
- a requested change would break competition compliance,
- implementation requires unsupported manual 3D expertise,
- architectural rewrite is becoming larger than the requested task.

Do not silently invent a solution to a product-level ambiguity.

---

# 81. Final Product Test

A judge should be able to open Kotak-Katik and understand:

```txt
This is for children.
This teaches coding logic.
I can see what the commands do.
The game is intentionally designed for deaf accessibility.
The visual identity is deliberate.
The product actually works.
```

without needing the developer to explain everything.

---

# 82. Quality North Star

Kotak-Katik does not need to be enormous.

It needs to be:

```txt
small enough to finish
deep enough to matter
clear enough for children
accessible without special mode
polished enough to feel intentional
technical enough to be trustworthy
documented enough to be defensible
```

Prefer a complete, coherent 15-level experience over a half-built platform with
50 features.
