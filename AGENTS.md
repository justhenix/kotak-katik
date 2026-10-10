# AGENTS.md

## Project

Kotak-Katik is a visual computational-thinking game for elementary students, designed especially for deaf students in SDLB-B classes 1–3. It teaches sequencing, relative direction, repetition, debugging, and basic algorithmic reasoning through a deterministic grid-based cat controlled by visual command blocks.

Build an understandable learning game, not a generic coding website or a Scratch clone. Keep the relationship between instruction, action, and result visible.

## Priorities

When requirements conflict, prioritize:

1. Correct learning mechanic
2. Child comprehension
3. Accessibility
4. Functional completeness
5. Responsive usability
6. Visual polish
7. Technical cleverness

Do not trade priorities 1–5 for priorities 6–7.

## Core mechanics

- The cat moves on a tile grid using commands for forward, turn left, turn right, and repeat a command sequence.
- Forward is relative to the cat’s current orientation. Turns change orientation without changing tiles. Never replace this mechanic with screen-relative movement.
- The same level and command sequence must always produce the same result.
- Support both full-program execution and single-step execution so a child can inspect each command and its result.
- Treat commands as program data. Keep puzzle rules in the interpreter, not in UI events, meshes, or animation callbacks.

## Learning and feedback

- Introduce concepts in order: forward movement, sequences, turns, combined paths, loops, debugging, then mixed challenges. Do not add difficulty only by making paths longer.
- Use gradual release: demonstrate, provide a constrained completion, then let the child solve independently.
- Make mistakes useful: let the player observe, step through, identify a mismatch, edit, and retry. Avoid punitive feedback, unexplained “wrong” states, and immediate solution reveals.
- Keep branching choices limited and node states clear if using an expedition map. Fixed or seeded progression is acceptable.

## Accessibility and child-facing UI

- Never communicate gameplay-critical information through sound alone. Execution, collisions, and completion need clear visual feedback.
- Make the cat’s forward, left, and right directions easy to identify. Keep left/right cues consistent across the character and commands; use cyan for left and orange for right where applicable.
- BISINDO material must be validated. Do not invent or approximate signs; leave an integration point if validated material is unavailable.
- Use short, concrete Indonesian for child-facing text. Prefer icons and interaction over paragraphs, but use text when it prevents ambiguity. Avoid unexplained icons, tiny helper text, tooltip-dependent actions, and developer terminology.
- Preserve readable tiles and reachable, large touch targets on mobile. Reflow panels when needed and prevent horizontal overflow.
- Keep one obvious primary task on each screen.

## Visual and asset direction

- Keep the board readable above decoration. Props must not obscure tile boundaries, orientation, destinations, or command feedback.
- Use a lightweight low-poly or voxel-like world with simple silhouettes and the cat as the focal character.
- Use an orthographic isometric/axonometric camera. Camera movement or perspective must not make tile relationships harder to read.
- Use assets allowed by the competition and their licenses. Document third-party assets and packages; do not copy material from unrelated projects.

## Engineering

- Keep simulation state separate from Three.js rendering. The simulation is authoritative; rendering follows it. A level should be testable without rendering the scene.
- Keep explicit state for the level, cat position and orientation, command program, execution progress, execution status, and completion.
- Before changing code, inspect the relevant files and conventions, understand the current implementation, and make the smallest coherent change. Do not rewrite working systems or migrate frameworks, package managers, renderers, or styling systems without an explicit request.
- Prefer focused components, typed domain data, predictable data flow, and shared primitives where repetition exists. Avoid premature abstraction, duplicated rules, scattered gameplay magic numbers, hidden side effects, and `any` used to bypass type errors.
- Keep the experience lightweight. Control scene complexity, animation loops, asset loading, and unnecessary re-renders without optimizing prematurely.

## Scope and competition constraints

Prefer a polished playable learning loop over feature count. Do not add multiplayer, authentication, backend infrastructure, procedural generation, social features, economies, inventories, AI chat, or extra settings without a clear product need. Local structured level data is acceptable.

This project is for the M-One Telkomsel Coding Competition 2026, “Web Education for Kids.” Keep the repository public and the deployed site accessible for judging. Maintain accurate AI-development documentation and prompt history. Preserve an auditable Git history: do not falsify prompt history, rewrite or force-push competition commits, or copy code/components from older personal projects.

Before adding a feature, check whether it improves learning, comprehension, accessibility, or judged product quality. If it does not, defer it.

## Verification and completion

After meaningful gameplay changes, verify the affected behavior, including movement, turns and orientation, collisions, loops, stepping, reset/retry, and level completion as relevant. For UI changes, inspect desktop and mobile layouts. Check for runtime errors; compilation alone does not prove the interaction works.

A feature is done when the intended interaction works, the learning mechanic stays correct, important state is visually understandable, relevant input modes work, desktop and mobile remain usable, and the change fits the existing architecture without unnecessary scope.

## Project guidance

Keep this root file focused on durable constraints. Put detailed product, pedagogy, accessibility, design, technical, and competition guidance in `.agents/` documents as those documents are created. Consult relevant project guidance before making decisions. If guidance conflicts, surface the conflict; a direct user instruction takes precedence unless it violates competition rules.
