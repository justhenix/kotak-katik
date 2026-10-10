# Product Definition: Kotak-Katik

## Product summary

Kotak-Katik is a deaf-first visual computational-thinking game for elementary children. The competition MVP is designed primarily for SDLB-B students in classes 1–3, while remaining playable by hearing children and other beginners.

Children arrange visual instructions to guide a cat through a tile-based world. They learn sequencing, relative direction, repetition, prediction, debugging, and basic algorithmic reasoning by seeing what their instructions make the cat do.

Kotak-Katik is a focused learning game, not a general coding platform.

## Product thesis

Children should be able to understand computational logic by seeing the connection between:

```text
instruction → action → result
```

The game teaches through movement, orientation, repetition, prediction, observation, and correction before relying on programming terms or written explanations. Puzzle comprehension should not depend on translating a paragraph into spatial behavior.

## Audience

### Primary audience

SDLB-B students in elementary classes 1–3 who are beginning computational-thinking activities. Design for:

- little or no programming knowledge;
- varying reading fluency;
- strong benefit from visual demonstration;
- limited tolerance for dense interfaces;
- possible use of touch input.

Do not assume familiarity with programming terms, Scratch, block coding, coordinates, or keyboard controls.

### Secondary audience

Hearing children of similar age, older first-time learners, and children who benefit from visual-first instruction may also use the game. Serving them must not weaken the deaf-first experience or turn the product into a generic coding platform.

## Deaf-first experience

There is no separate simplified “deaf mode.” Accessibility is part of the default experience. Audio may add atmosphere or reinforce feedback, but it must never carry unique gameplay information. Turning sound off must not make a puzzle harder to understand.

Gameplay-critical information must have a clear visual equivalent, including:

- execution timing and the active command;
- movement and destination;
- collision or invalid movement;
- success and progression;
- the cat’s current orientation.

Hearing players may receive optional music or sound effects, but no extra instructions or puzzle information.

Use BISINDO only as validated instructional material. Do not invent, approximate, or generate signs without appropriate validation. If validated material is unavailable, keep the integration point and use other clear visual scaffolding.

## Product promise

The child should be able to say:

> “I can see what my instructions make the cat do.”

The interface should not become a puzzle of its own. The relationship between an instruction and its effect should stay visible, and the child should gradually understand why the cat moved as it did.

## Learning outcomes

The MVP introduces these ideas:

- **Sequencing:** the order of actions changes the result.
- **Relative direction:** forward, left, and right are understood from the cat’s orientation.
- **Repetition:** a repeated pattern can be expressed compactly. Recognizing the pattern matters more than memorizing the word “loop.”
- **Prediction:** the child gradually anticipates what the cat will do next.
- **Debugging:** an unexpected result can be inspected, understood, and corrected.

## Core experience

The main play loop is:

```text
enter expedition
→ choose an available stage
→ inspect the world
→ build a command sequence
→ run it or step through it
→ observe the cat
→ compare the result with the goal
→ revise if needed
→ complete the stage and progress
```

Most development effort should improve this loop.

## Entry and independent play

The game should feel playable immediately. A suitable entry flow is:

```text
title → start → short visual demonstration → guided first interaction → expedition
```

Keep competition or explanatory material secondary to play. After a brief introduction, children should be able to complete routine puzzles without an adult repeatedly explaining what controls mean, what happened, or what counts as success.

## Guided learning

Use gradual release:

- **I Do:** demonstrate command placement and execution; let the child observe.
- **We Do:** prepare most of the solution and ask the child to complete a constrained part.
- **You Do:** let the child construct a solution independently as scaffolding fades.

Do not move abruptly from a demonstration to a complex empty puzzle.

## Content and difficulty

Target **12–18 polished playable stages** for the MVP. Stage count is a planning range, not a quality target to preserve at all costs.

| Stage group | Target | Learning purpose |
| --- | ---: | --- |
| Introduction | 2–3 | Forward movement, command placement, run, and instruction-to-action feedback |
| Sequencing | 2–3 | Combining actions and understanding order |
| Turning | 3–4 | Left/right relative to the cat and combined movement |
| Repetition | 2–3 | Recognizing repeated patterns and using constrained command slots |
| Debugging | 2–3 | Inspecting an incorrect program, stepping through it, and fixing an instruction |
| Mixed challenge | 1–2 | Combining learned ideas without adding a new mechanic |

Difficulty should come from reasoning: relationships between steps, direction changes, repeated patterns, limited command slots, and finding incorrect instructions. Do not create difficulty through tiny controls, time pressure, long text, confusing visuals, hidden information, excessive program length, or fast reactions.

## Mistakes and retry

Mistakes are part of learning, not punishment. Support a cycle of:

```text
run → observe → inspect or step through → identify a mismatch → edit → retry
```

Avoid harsh failure screens, negative scoring, limited retries, humiliating reactions, or revealing the solution immediately.

## Expedition and rewards

Represent progression as a small visual expedition that makes the current location, completed stages, available stages, and future progression easy to recognize. A simple two-way choice can add curiosity; large branching trees can overwhelm younger players. Branches should invite exploration, not create strategic anxiety.

Possible stage types include path puzzles, loop checkpoints, debugging challenges, rest or cosmetic reward nodes, and milestone challenges. Completion itself should feel positive. Small cosmetics such as a hat, ribbon, scarf, or toy are appropriate; avoid turning rewards into inventory management.

Do not center the MVP on stars, grades, scores, leaderboards, accuracy percentages, or competition between children.

## Language and comprehension

Kotak-Katik is visual-first, not text-free. Core puzzles should require little reading. Use short, concrete Indonesian when text prevents ambiguity, such as “Mulai,” “Ulangi,” “Lanjut,” and “Coba lagi.” Text should support a clear interaction, not compensate for a confusing one.

## Product personality

The game should feel playful, warm, curious, calm, tactile, and exploratory. It should not feel clinical, corporate, overstimulating, competitive, infantilizing, or like an enterprise dashboard. The child is exploring a small world, not operating educational software.

## MVP scope

The competition MVP includes:

- playable tile-based puzzles and visual command construction;
- forward, left-turn, right-turn, and repetition commands;
- full-program and single-step execution;
- retry/reset and clear visual feedback;
- an expedition map with stage unlocking;
- local progress persistence;
- responsive interaction;
- optional sound effects or music, with visual feedback parity;
- small cosmetic milestones where feasible.

## Non-goals

Unless explicitly reconsidered, the MVP does not need accounts, cloud saves, a database, a teacher or analytics dashboard, an AI tutor or chatbot, multiplayer, leaderboards, a level editor, procedural level generation, complex customization, or an economy. Local progress is sufficient for completed stages, unlocked nodes, basic settings, and cosmetics. Do not add backend infrastructure just to store that information.

## Success criteria

The MVP succeeds when a child can:

1. understand how to place and run a command;
2. understand forward movement and distinguish left/right from the cat’s perspective;
3. predict and execute a short sequence;
4. visually understand what happened;
5. retry after an unexpected result;
6. understand repetition after guided exposure;
7. step through a program to inspect its behavior;
8. progress through several stages without constant adult explanation.

For every puzzle, core reasoning should not depend on reading a paragraph. For every gameplay-critical event, a player who cannot hear should receive enough information to understand what happened. BISINDO accuracy matters more than coverage.

## Scope test

Before adding a feature, ask whether it improves computational-thinking learning, child comprehension, deaf accessibility, core gameplay, progression clarity, meaningful polish, or competition quality. If not, defer it. If removing it would not weaken the core learning experience, it is probably secondary.
