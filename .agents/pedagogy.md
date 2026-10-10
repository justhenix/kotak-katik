# Pedagogy — Kotak-Katik

## 1. Purpose

Kotak-Katik teaches introductory computational thinking through visual,
spatial interaction.

The curriculum is designed primarily for deaf children in SDLB-B classes 1–3.

This document defines:

- concept order,
- instructional progression,
- scaffolding,
- practice structure,
- difficulty rules,
- mastery expectations,
- feedback philosophy.

Gameplay mechanics are defined in `gameplay.md`.

This document defines how those mechanics are taught.

---

# 2. Core Pedagogical Principle

The child should understand a computational idea through observable cause and
effect before being expected to name or explain it formally.

The preferred learning relationship is:

```txt
SEE
  ↓
TRY
  ↓
OBSERVE
  ↓
UNDERSTAND
  ↓
PRACTICE
```

not:

```txt
READ DEFINITION
      ↓
MEMORIZE TERM
      ↓
ATTEMPT EXERCISE
```

Formal programming vocabulary is secondary.

Conceptual understanding comes first.

---

# 3. Fixed Curriculum Order

The conceptual progression is fixed.

```txt
Movement
   ↓
Sequencing
   ↓
Relative Turning
   ↓
Combined Paths
   ↓
Repetition
   ↓
Debugging
   ↓
Mixed Application
```

A later concept must not be introduced before the prerequisite concept has
been demonstrated and practiced.

Examples:

- do not introduce loops before sequencing,
- do not introduce complex paths before turning,
- do not teach debugging before the child understands normal execution,
- do not introduce combined challenges before their components are familiar.

Agents must not reorder the curriculum merely to create more variety.

---

# 4. Linear Concepts, Branching Practice

The expedition map may branch.

The curriculum does not.

A branch may contain:

- another practice board,
- another spatial arrangement,
- a slightly different visual environment,
- a rest/reward node,
- another example of the same concept.

A branch must not introduce:

- a new command,
- a new interaction rule,
- a new objective type,
- a new environmental mechanic,
- a new cognitive requirement.

Example:

```txt
                ┌─ Turn Practice A ─┐
Turning Intro ──┤                   ├─ Combined Paths
                └─ Turn Practice B ─┘
```

Both branches practice turning.

Neither branch introduces loops.

---

# 5. Why Practice Branches Exist

Practice branches provide:

- repetition without exact duplication,
- learner agency,
- variation in spatial examples,
- pacing,
- reduced feeling of a rigid worksheet.

They should not create strategic complexity.

The child should never need to ask:

> "Which branch has the mechanic I need later?"

Branches should eventually rejoin the guided curriculum.

---

# 6. One New Concept at a Time

Early and intermediate stages should introduce only one major new idea at once.

Bad:

```txt
new turn command
+
new loop mechanic
+
new obstacle type
+
new UI control
```

Better:

```txt
known movement
+
one new turn command
```

Once a concept becomes familiar, it may be combined with previously mastered
concepts.

New mechanic introduction should happen against an otherwise familiar
interaction context.

---

# 7. Cognitive Load Rule

Do not create difficulty through unnecessary interface complexity.

When teaching a new concept:

- simplify the board,
- restrict the command palette,
- reduce unrelated decoration,
- reduce unnecessary choices,
- keep instructions brief,
- keep visual hierarchy obvious.

As conceptual complexity increases, interface complexity should remain stable.

The game should become harder because the reasoning becomes richer, not because
the screen becomes busier.

---

# 8. IDWDYD Framework

Kotak-Katik uses:

```txt
I Do
  ↓
We Do
  ↓
You Do
```

for major concepts.

This progression may span several stages.

Do not assume one demonstration is enough for every concept.

---

# 9. I Do — Demonstration

Purpose:

> Show the relationship between an instruction and its effect.

The child observes a short demonstration.

Possible sequence:

```txt
command appears
      ↓
command is placed
      ↓
active command highlights
      ↓
cat performs action
      ↓
result becomes visually obvious
```

The demonstration should be short enough that the child quickly reaches an
interactive moment.

Avoid:

- long tutorial videos,
- paragraphs before interaction,
- explaining every future rule,
- multiple new concepts in one demo.

---

# 10. Demonstration Design

An I Do stage should answer one question.

Examples:

### Movement

> What happens when this forward block runs?

### Turning

> What happens to the cat when this turn block runs?

### Loop

> What happens when this group repeats?

### Debugging

> How can we inspect a program one action at a time?

Do not demonstrate several concepts simultaneously.

---

# 11. Ghost Hand

A ghost hand or equivalent pointer may demonstrate interaction.

Use it to show:

- where to tap,
- where a block goes,
- how to start execution.

It should not repeatedly perform actions the child already understands.

Fade this support quickly.

The ghost hand is instructional scaffolding, not a permanent navigation system.

---

# 12. We Do — Guided Practice

Purpose:

> Let the child complete the important reasoning step while reducing unrelated
> decisions.

Possible scaffolds:

- pre-filled program,
- one empty program slot,
- restricted command palette,
- highlighted target area,
- short board,
- turn preview,
- visual prompt.

Example:

```txt
[ ⬆ ] [ ? ] [ ⬆ ]
```

with only:

```txt
↷
```

and one distractor where appropriate.

The child should still perform the meaningful action.

Do not make guided practice fully automatic.

---

# 13. Guided Practice Should Isolate the Concept

If teaching right-turn:

- movement should already be familiar,
- board geometry should clearly require a turn,
- the relevant turn command should be easy to locate,
- no loop decision should be required.

The child should be reasoning about:

> "Which way should the cat turn?"

not:

> "What does this whole interface do?"

---

# 14. You Do — Independent Practice

Purpose:

> Let the child apply the concept without procedural prompting.

Typical changes:

- empty program tray,
- broader command palette,
- no ghost hand,
- fewer highlighted hints.

Accessibility scaffolding remains.

Do not remove:

- orientation cues,
- visual execution feedback,
- clear objectives,
- readable tile structure.

Independent does not mean inaccessible.

---

# 15. Scaffold Fading

Scaffolding should decrease gradually.

Example progression:

```txt
Stage A
full demonstration

Stage B
pre-filled program + one missing command

Stage C
restricted palette + empty program

Stage D
normal palette + independent solution

Stage E
practice variant
```

Avoid:

```txt
full tutorial
    ↓
completely unsupported complex puzzle
```

---

# 16. Scaffolding Is Concept-Specific

A child may be independent in one concept while receiving support for another.

Example:

The child already understands:

- forward,
- sequencing.

When turning is introduced:

- forward commands need no tutorial,
- turn behavior receives new scaffolding.

Do not restart the entire tutorial model for every stage.

---

# 17. Curriculum Phase 1 — Movement

## Learning goal

Understand:

> A forward command makes the cat move one tile in the direction it faces.

The child does not yet need to reason about turning.

### Suggested progression

#### I Do

```txt
🐱 □ 🐟
```

System demonstrates:

```txt
⬆
```

#### We Do

```txt
🐱 □ 🐟
```

Child places the available forward command.

#### You Do

```txt
🐱 □ □ 🐟
```

Child places multiple forward commands.

---

# 18. Movement Mastery Signal

The child is ready to continue when they can independently:

- identify the fish objective,
- add a forward command,
- execute it,
- understand that repeated forward commands produce repeated movement.

No formal assessment screen is required.

Progression through the stage itself is sufficient evidence.

---

# 19. Curriculum Phase 2 — Sequencing

## Learning goal

Understand:

> Commands happen in order.

The important realization is not simply that multiple blocks can be placed.

It is:

> Changing the order can change the result.

---

# 20. Sequencing Stage Design

Start with simple paths where order is visually obvious.

Example:

```txt
🐱 □ 🐟 □ 🐟
```

Then introduce situations where commands differ.

Do not immediately create long sequences.

Recommended early sequence length:

```txt
2–4 primitive commands
```

Increase only after execution tracing is familiar.

---

# 21. Sequencing Language

Avoid requiring formal vocabulary such as:

- sequence,
- algorithm,
- instruction list.

The UI may visually communicate:

```txt
first
→ next
→ next
```

Formal terminology may appear later in supporting educational material.

The game itself should remain understandable without it.

---

# 22. Curriculum Phase 3 — Relative Turning

## Learning goal

Understand:

> Left and right belong to the cat's orientation.

This is a major conceptual step.

Turning deserves more scaffolding than simple forward movement.

---

# 23. Turning Introduction

Introduce one turn direction clearly before requiring frequent alternation.

Possible sequence:

```txt
known forward path
    ↓
one obvious corner
    ↓
turn demonstration
    ↓
guided turn
    ↓
independent turn
```

Both turn commands may exist visually once the relationship is understood, but
initial tasks should remain simple.

---

# 24. Spatial Scaffolding for Turning

Required support includes:

- visible cat orientation,
- forward gaze cue,
- cyan association for left,
- orange association for right,
- matching command colors,
- optional ghost rotation preview.

Do not rely on text such as:

```txt
"Kanan"
"Kiri"
```

as the only distinction.

Do not rely on color alone either.

Use redundant visual cues.

---

# 25. Screen Direction vs Character Direction

The learning challenge is intentionally character-relative.

If the cat faces toward the player:

```txt
cat's right ≠ player's screen-right
```

Do not simplify the mechanic into absolute directions.

Instead, support reasoning visually.

The child should gradually learn to think:

> "Which side is the cat's right?"

not:

> "Which side of my screen is right?"

---

# 26. Turning Practice Variants

Turning is a good place for branching practice.

Example:

```txt
                 ┌─ L-shaped path ─────┐
Turn Intro ──────┤                     ├─ Combined Paths
                 └─ mirrored L-path ───┘
```

The second branch may mirror the spatial arrangement.

It should not introduce new rules.

This provides useful perspective variation without increasing system complexity.

---

# 27. Curriculum Phase 4 — Combined Paths

## Learning goal

Combine:

- forward,
- sequencing,
- left turn,
- right turn.

No new command is introduced.

Difficulty comes from planning a short route.

---

# 28. Combined Path Design

Boards may gradually contain:

- two corners,
- multiple collectibles,
- mirrored paths,
- alternative valid routes.

Keep board size controlled.

Do not compensate for weak puzzle design by adding more tiles.

The child should be able to visually trace the route.

---

# 29. Planning Before Execution

At this stage, encourage prediction.

The interface may subtly support questions such as:

> Where will the cat face after this command?

Avoid requiring a written answer.

Prediction should happen through interaction.

---

# 30. Curriculum Phase 5 — Repetition

## Learning goal

Recognize:

> Some instructions repeat.

Then discover:

> Repeated instructions can be grouped.

The conceptual order matters.

Do not begin with a definition of a loop.

---

# 31. Experience Repetition Before Naming It

Before exposing the repeat block, allow the child to solve repeated movement
normally.

Example:

```txt
⬆ ⬆ ⬆
```

Later present a similar pattern under a meaningful slot constraint.

The child should encounter:

> "I need to do the same thing several times."

before receiving the repeat solution.

---

# 32. Loop Introduction

The repeat command should feel like a useful tool, not arbitrary syntax.

Example progression:

```txt
Stage A
⬆ ⬆

Stage B
⬆ ⬆ ⬆

Stage C
same visible repetition
but limited program space

Stage D
introduce ↻
```

Then demonstrate:

```txt
↻ 3x
 └─ ⬆
```

---

# 33. Slot Limits

Slot limits are allowed when they have pedagogical purpose.

Good:

> Encourage recognition of a visible repeated pattern.

Bad:

> Make the puzzle harder without teaching anything.

Do not use strict slot limits before the relevant compression concept has been
introduced.

---

# 34. Loop Complexity

For MVP, repetition should remain concrete.

Prefer:

```txt
2x
3x
4x
```

Avoid introducing:

- unknown repeat counts,
- conditions,
- nested loops,
- variables.

The learning target is pattern recognition and repetition.

Not abstract control-flow theory.

---

# 35. Repetition Practice Branches

Possible variants:

```txt
                 ┌─ straight repetition ─┐
Loop Intro ──────┤                       ├─ Debugging
                 └─ turn-pattern repeat ─┘
```

Both reinforce the same concept.

Do not place a new command inside only one branch.

---

# 36. Curriculum Phase 6 — Debugging

## Learning goal

Understand:

> An incorrect result can be inspected and corrected.

Debugging should be framed as normal problem solving.

Not failure.

---

# 37. Debugging Prerequisites

Do not introduce debugging until the child can already:

- read the visual program order,
- understand execution,
- identify the active command,
- understand forward and turning,
- use retry.

Otherwise debugging becomes random guessing.

---

# 38. Debugging Introduction

Start with one clear incorrect command.

Example:

Expected route requires:

```txt
⬆ ⬆ ↷ ⬆
```

Given:

```txt
⬆ ⬆ ↶ ⬆
```

The child should observe what happens.

Then use Step mode to inspect the program.

Do not immediately mark the wrong block before execution.

---

# 39. Debugging Process

Teach this behavioral loop:

```txt
Run
 ↓
Observe
 ↓
Step
 ↓
Find where behavior changes
 ↓
Edit
 ↓
Retry
```

The goal is not merely to select the visually different command.

The goal is understanding:

> "This instruction caused that result."

---

# 40. Debugging Feedback

After execution reaches a problem:

- preserve board state,
- preserve visible program,
- preserve active/failing command context.

Do not immediately replace the screen with:

```txt
SALAH
```

or an answer explanation.

The evidence needed for reasoning should remain visible.

---

# 41. Curriculum Phase 7 — Mixed Application

## Learning goal

Apply already-learned concepts together.

Mixed stages may combine:

- sequencing,
- turns,
- repetition,
- debugging.

Mixed stages must not introduce another major mechanic.

The challenge is integration.

Not novelty.

---

# 42. Mastery Philosophy

Kotak-Katik does not require formal exams.

A concept is sufficiently understood for progression when the child can use it
within gameplay with substantially reduced scaffolding.

Examples:

### Movement

Can independently move toward visible fish.

### Sequencing

Can construct a short ordered program.

### Turning

Can choose an appropriate relative turn in a familiar path.

### Loop

Can use repetition when the board presents an obvious repeated pattern.

### Debugging

Can inspect and correct a simple faulty program.

These are functional mastery signals.

---

# 43. Do Not Over-Assess

Avoid adding:

- quiz screens,
- multiple-choice tests,
- written definitions,
- percentage mastery scores,
- formal grading.

The game itself provides evidence of understanding.

Assessment should remain embedded in play.

---

# 44. Error Philosophy

An incorrect attempt is useful information.

The system should help the child answer:

> What did my instructions actually do?

Then:

> What should I change?

Do not frame mistakes as poor performance.

---

# 45. Productive Failure

A useful failed attempt has:

- a visible cause,
- an observable result,
- an available correction.

Bad failure:

> The game says wrong but the child cannot understand why.

Good failure:

```txt
active command
      ↓
cat turns unexpectedly
      ↓
route mismatch becomes visible
      ↓
child changes command
```

---

# 46. Hint Philosophy

Hints should preserve reasoning.

Use progressive hints.

Example hierarchy:

### Hint Level 1

Highlight the relevant region of the board.

### Hint Level 2

Highlight where execution diverged.

### Hint Level 3

Reduce the available command choices.

### Hint Level 4

Demonstrate the relevant interaction.

Avoid immediately revealing the entire program.

---

# 47. Hints Are Not Required Everywhere

Do not build a complex universal hint system unless necessary.

For MVP, many stages can rely on:

- guided progression,
- visual feedback,
- Step mode,
- retry.

Hints should address actual observed confusion.

Do not invent support for hypothetical problems before playtesting.

---

# 48. Text and Reading Load

Child-facing text should remain:

- short,
- concrete,
- contextual.

Prefer:

```txt
Coba lagi
```

over:

```txt
Urutan perintahmu masih belum membawa karakter menuju seluruh objek yang harus
dikumpulkan.
```

Prefer showing behavior over explaining behavior.

---

# 49. Visual Instruction First

When possible:

```txt
animation + icon
```

should communicate before:

```txt
sentence
```

Examples:

- demonstrate a turn instead of describing rotation,
- pulse an empty slot instead of writing where to place a block,
- show repeat animation instead of defining iteration.

---

# 50. BISINDO Role

BISINDO may reinforce important introductory concepts.

Potential use:

- initial concept introduction,
- short contextual guidance,
- optional replayable explanation.

BISINDO should not become a second tutorial layer constantly competing with the
game.

Keep attention focused on the primary interaction.

---

# 51. BISINDO Accuracy

Only use validated BISINDO content.

Do not invent gestures.

Do not infer signs from:

- ASL,
- SIBI,
- generic sign-language imagery,
- AI-generated hand poses.

If reliable content is unavailable:

- omit the gesture,
- retain visual gameplay scaffolding,
- preserve an integration point for later.

Accuracy is more important than coverage.

---

# 52. Deaf-First Teaching

Do not design a lesson around audio and then create a visual fallback.

Design the visual lesson first.

Then optionally layer audio.

Correct order:

```txt
visual learning interaction
        ↓
optional SFX/BGM reinforcement
```

Not:

```txt
audio interaction
        ↓
accessibility patch
```

---

# 53. Experience Parity

The curriculum must remain equally understandable without sound.

A hearing player may experience:

- more atmosphere,
- rhythmic reinforcement,
- additional sensory delight.

They must not gain pedagogical information unavailable visually.

---

# 54. Pace

Children should control reasoning pace.

Do not require:

- fast reaction,
- quick command placement,
- timed answers.

Execution itself may have deliberate pacing so cause and effect remains visible.

Thinking time should not be penalized.

---

# 55. Repetition Without Boredom

Children need repeated exposure.

Do not achieve this through exact duplication.

Vary:

- path shape,
- cat starting orientation,
- collectible placement,
- environment dressing,
- branch choice.

Keep the underlying concept constant.

This creates practice variation without introducing new cognitive load.

---

# 56. Environmental Variation

Visual themes may change for freshness.

Examples:

- grass island,
- garden,
- small village,
- riverside.

Environmental changes must not create new implicit gameplay rules.

A decorative bridge should not suddenly behave differently from a normal
traversable tile unless that mechanic has explicitly been taught.

Visual novelty must not imply mechanical novelty accidentally.

---

# 57. Consistency

Once a visual cue has meaning, preserve it.

Examples:

```txt
cyan → left
orange → right
fish → collectible
active border → currently executing command
```

Do not casually reuse those cues for unrelated meanings.

Consistency reduces relearning.

---

# 58. Choice Design

Choices should remain meaningful but limited.

Good:

```txt
Which practice route do you want?
```

Bad:

```txt
Which of six unknown systems do you want to learn next?
```

For lower-elementary children, prefer at most two branch choices at a time.

---

# 59. Practice Branch Equivalence

Branches do not need identical geometry.

They should have comparable conceptual difficulty.

Example:

```txt
Branch A:
one right turn + three fish

Branch B:
one left turn + three fish
```

This is useful variation.

Bad:

```txt
Branch A:
simple turn practice

Branch B:
nested loop + moving platform
```

---

# 60. Rejoining the Curriculum

Branches should generally converge.

Example:

```txt
          Practice A
         /          \
Concept              Next Concept
         \          /
          Practice B
```

This ensures all children encounter the same core curriculum sequence.

Do not create permanently separate learning tracks in the MVP.

---

# 61. Rest Nodes

Rest nodes provide cognitive pacing.

They may:

- celebrate progress,
- reveal a cosmetic,
- show the cat resting,
- provide a small visual interaction.

They should not introduce educational content that the child must remember.

Rest means rest.

---

# 62. Milestone Stages

Milestone stages test combination rather than novelty.

A milestone may require:

```txt
sequence
+
turning
+
loop
```

if all three have already been taught.

Do not introduce a new mechanic during the milestone merely to make it feel
special.

---

# 63. Difficulty Dimensions

Allowed difficulty dimensions include:

### Sequence Length

More commands to reason about.

### Spatial Turns

More changes in orientation.

### Pattern Recognition

Repeated structures become less immediately obvious.

### Program Constraint

Smaller top-level program space after loops are understood.

### Debugging Distance

The incorrect command occurs later in a known sequence.

### Concept Combination

Several previously learned mechanics appear together.

Increase these gradually.

---

# 64. Avoid Compound Difficulty Spikes

Do not simultaneously increase:

```txt
board size
+
sequence length
+
new mechanic
+
slot constraint
+
visual complexity
```

A stage should have a clear reason it is harder than the previous one.

Agents should be able to state that reason in one sentence.

---

# 65. Difficulty Explanation Test

For every stage, the author should be able to write:

> "This stage is harder because ______."

Good:

> "The child must reason about two turns instead of one."

Good:

> "The repeated path must now be represented with a loop."

Bad:

> "There are more things happening."

---

# 66. Avoid Fake Difficulty

Do not create difficulty through:

- obscured collectibles,
- ambiguous orientation,
- tiny controls,
- unnecessary animation,
- misleading decoration,
- similar-looking command icons,
- arbitrary failure conditions.

These measure interface tolerance, not computational thinking.

---

# 67. Stage Learning Metadata

Each stage should explicitly identify its pedagogical role.

Conceptually:

```ts
type LearningMetadata = {
  concept:
    | "movement"
    | "sequence"
    | "turning"
    | "combined-path"
    | "loop"
    | "debug"
    | "mixed";

  phase:
    | "i-do"
    | "we-do"
    | "you-do"
    | "practice"
    | "milestone";

  introducesNewConcept: boolean;

  learningGoal: string;

  difficultyReason?: string;
};
```

Exact implementation may differ.

The principle should remain.

---

# 68. New Concept Gate

Before `introducesNewConcept: true`, verify:

1. prerequisite concepts have already appeared,
2. the board is simplified,
3. unrelated command choices are reduced,
4. the new behavior is demonstrated,
5. visual scaffolding exists,
6. immediate guided practice follows.

Do not introduce concepts casually through ordinary levels.

---

# 69. Practice Stage Gate

A practice stage should:

- use already-introduced mechanics,
- vary the application,
- require actual reasoning,
- avoid unnecessary instruction.

Practice is not another tutorial.

---

# 70. Milestone Gate

A milestone stage should:

- contain no major new mechanic,
- combine existing concepts,
- remain independently solvable,
- provide satisfying progression feedback.

---

# 71. Adult Support

Kotak-Katik may initially be introduced by:

- teacher,
- parent,
- facilitator.

However, routine progression should not depend on continuous adult explanation.

The game should gradually establish enough visual language for independent play.

---

# 72. Independent Play Goal

After initial onboarding, a child should increasingly be able to:

```txt
see objective
→ construct commands
→ run
→ observe
→ retry
→ progress
```

without repeatedly asking:

> "What am I supposed to do?"

If that question occurs frequently, improve the interaction before adding more
instructional text.

---

# 73. Playtesting Questions

When observing a child, do not begin by explaining mistakes.

Watch for:

- where they look first,
- whether they identify the fish,
- whether they understand cat orientation,
- whether they associate command and action,
- whether they use retry naturally,
- whether they notice active command highlighting,
- whether Step mode helps debugging,
- whether branch choices create hesitation.

The child's behavior is evidence.

---

# 74. Avoid Teaching During Testing

During usability testing, distinguish:

```txt
product failure
```

from:

```txt
learner difficulty
```

If the facilitator constantly explains the interface, the product is not being
properly tested.

Allow the interface to communicate first.

---

# 75. Signs of Excess Cognitive Load

Potential warning signs:

- child repeatedly scans unrelated UI,
- child cannot locate the primary action,
- child confuses objective with decoration,
- child forgets what a command does immediately after demonstration,
- child guesses commands without observing execution,
- child ignores feedback because too many animations occur,
- branch selection becomes a puzzle itself.

When these occur, simplify before adding explanation.

---

# 76. Instruction Hierarchy

When the child is confused, prefer fixes in this order:

```txt
1. improve world clarity
2. improve visual state
3. improve animation / demonstration
4. reduce available choices
5. add iconographic cue
6. add short text
7. add additional explanation
```

Do not jump directly to paragraphs.

---

# 77. Reward and Motivation

Motivation should come primarily from:

- making the cat act as intended,
- collecting fish,
- seeing progression,
- discovering new patterns,
- small cosmetic rewards.

Avoid external pressure systems.

Do not use:

- streak anxiety,
- lives,
- ranking,
- punitive scoring,
- countdowns.

---

# 78. Cosmetics

Cosmetics provide delight.

They do not indicate intelligence, skill ranking, or performance quality.

A child should not feel:

> "I got the bad reward because I solved it slowly."

Progress rewards should remain positive and low-pressure.

---

# 79. No Speed-Based Mastery

Fast completion does not imply better understanding.

Do not score based on execution or thinking time.

Children should be allowed to:

- pause,
- inspect,
- replay,
- step through,
- retry.

---

# 80. No Reading-Based Mastery

Do not use written terminology recall as proof of computational understanding.

A child who can correctly use repetition without knowing the word "loop" has
still demonstrated the core concept.

Terminology can follow conceptual understanding.

---

# 81. No Audio-Based Mastery

Do not create tasks requiring recognition of:

- sound sequences,
- musical cues,
- spoken instructions.

All pedagogically necessary information must be visually represented.

---

# 82. Accessibility Is Not Scaffolding to Remove

Some support fades.

Accessibility does not.

May fade:

- ghost hand,
- restricted palette,
- pre-filled solution,
- explicit turn preview.

Must remain:

- readable orientation,
- visual command feedback,
- visual collision feedback,
- visual completion feedback,
- non-audio information parity.

---

# 83. Curriculum Simplicity

The MVP curriculum should be narrow and deep.

Teach a small number of ideas clearly.

Do not add extra computational concepts merely to appear educationally broad.

Not required for MVP:

- variables,
- functions,
- conditionals,
- events,
- coordinates,
- recursion,
- Boolean logic.

A polished understanding of sequencing, direction, repetition, and debugging is
more valuable than shallow exposure to many concepts.

---

# 84. Pedagogical Scope Guard

Before introducing another concept, ask:

> Does this strengthen the intended MVP learning progression?

Then:

> Can the current curriculum already demonstrate meaningful computational
> thinking without it?

If yes, defer the new concept.

---

# 85. Stage Authoring Checklist

For every stage answer:

### Concept

What concept is being taught or practiced?

### Phase

Is this:

- I Do,
- We Do,
- You Do,
- practice,
- milestone?

### Prior Knowledge

What does the child already know?

### New Knowledge

Is anything genuinely new?

### Objective

Is the goal visually obvious?

### Cognitive Load

What unrelated choices can be removed?

### Feedback

Can the child see why their program produced the result?

### Accessibility

Is everything understandable without sound?

### Difficulty

Why is this stage harder than the previous relevant stage?

If these cannot be answered clearly, revise the stage.

---

# 86. Curriculum Map

The MVP should approximately follow:

```txt
MOVEMENT
│
├─ I Do
├─ We Do
└─ You Do
     │
     ▼

SEQUENCING
│
├─ Guided
├─ Independent
├─ Practice A ─┐
└─ Practice B ─┘
     │
     ▼

TURNING
│
├─ I Do
├─ We Do
├─ You Do
├─ Practice A ─┐
└─ Practice B ─┘
     │
     ▼

COMBINED PATHS
│
├─ Independent
└─ Practice
     │
     ▼

REPETITION
│
├─ Experience repetition
├─ I Do
├─ We Do
├─ You Do
├─ Practice A ─┐
└─ Practice B ─┘
     │
     ▼

DEBUGGING
│
├─ I Do
├─ Guided correction
└─ Independent correction
     │
     ▼

MIXED MILESTONE
```

Exact level count may change.

Concept order should not.

---

# 87. Pedagogical North Star

Every stage should move the child slightly closer to understanding:

> "The result happened because of the instructions I made."

Progression should evolve from:

```txt
I watch the cat move
```

to:

```txt
I know what this command will do
```

to:

```txt
I can combine commands
```

to:

```txt
I recognize repetition
```

to:

```txt
I can inspect why my program did not work
```

The goal is not command memorization.

The goal is **visible computational reasoning**.
