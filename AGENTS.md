# Workspace guidance: Kotak-Katik

## Product and release priorities

Kotak-Katik is a visual computational-thinking game for general elementary students in grades 3–6 (SD kelas 3–6). Children can read short Indonesian instructions and learn by planning, constructing commands, executing, observing, debugging, and improving.

Prioritize correct learning mechanics, comprehension, accessibility, functional completeness, responsive usability, then polish. The competition release is feature-frozen: preserve the current game, curriculum, progression, commands, cat/fish models, and visual identity. Only documentation, verification, deployment, and proven release blockers are in scope. Do not add features, import assets, upgrade dependencies, redesign UI, or refactor working systems.

## Five canonical reference documents

Exactly these five Markdown files belong in .agents/:

- [product.md](.agents/product.md): canonical MDS/PRD, audience, implemented scope, acceptance.
- [pedagogy.md](.agents/pedagogy.md): 16-stage curriculum and I Do / We Do / You Do.
- [gameplay.md](.agents/gameplay.md): deterministic mechanics and progression.
- [design.md](.agents/design.md): UI/UX and applicable accessibility guidance.
- [technical.md](.agents/technical.md): architecture, quality bar, tests, deployment, eligibility.

The former accessibility and quality-bar documents were consolidated into design and technical on 15 October 2026. Their original versions remain in Git history. Root AGENTS.md is guidance, not a sixth upload.

## Mechanics and engineering

Forward follows the cat's orientation. Turns rotate in place. Run and Step share a pure deterministic interpreter; commands remain typed program data. Simulation owns movement, collection, collision, and completion. Three.js renders state and never decides rules. Keep explicit level, avatar, program, cursor, status, loop, and completion state.

Inspect relevant code/conventions before edits. Preserve data flow, package manager, renderer, and architecture. Avoid duplicated rules, hidden effects, scattered magic values, and any used to bypass errors. Navigation cancels pending execution and demonstration work. Persist progress separately from runtime/program state.

## Learning and inclusive interaction

Preserve demonstration, guided completion, independent play, and the authored 16-stage progression. Mistakes remain inspectable and retryable; no punitive feedback or immediate solution reveals. Use short concrete Indonesian, consistent icons, visible orientation, cyan left/orange right, readable controls, touch targets, keyboard focus, reduced motion, and visual feedback without audio dependence.

Do not claim validated sign-language media, special-education effectiveness, classroom testing, or comprehensive accessibility testing that has not occurred. Existing functional accessibility stays intact.

## Visual and asset preservation

Keep the stable orthographic low-poly diorama and legible tile relationships. Preserve custom procedural foliage in src/scene/title/Dressing.tsx and src/scene/Environment/ToyboxDressing.tsx. Do not merge henix/quaternius-foliage-ground. Props must not obscure the board. Preserve licenses and third-party credit.

## Authentic history and scope pivot

The audience changed from the earlier special-education focus to general SD grades 3–6 on 15 October 2026. Record this explicitly; never rewrite past prompts, reports, decisions, or Git commits to conceal it. docs/PROMPT_LOG.md remains raw evidence. docs/PROMPT_JOURNAL.md contains at most five selected original prompts verbatim, with supported outcomes, provenance, and honest timestamp limits.

Do not reset/force-push history or overwrite another contributor's work. Inspect status, branches, latest commits, and diffs before release. Use normal commits and pushes to main.

## Verification and submission

Run production build and focused tests. Verify affected mechanics, title/Mulai, tutorial, command construction, execution, fish, progression, Ekspedisi, persistence, mobile layout, runtime errors, and assets as relevant. Never equate compilation or push with functioning gameplay/deployment.

Competition: M-ONE Telkomsel Coding Competition 2026, Web Education for Kids. Public repository and anonymous production access are required. Target: <https://kotak-katik.henix.my.id>.

Upload exactly five .agents Markdown references and one docs/PROMPT_JOURNAL.md. Verify the form accepts .md; report rejection without making PDF/DOCX replacements. Do not claim submission without confirmation. Internal stop: 15 October 2026, 23:00 WIB; then submission/recovery only. Participant-confirmed deadline: 23:59 WIB.

## Skill routing and recovery

Apply anti-slop standards and plain language. For frontend edits consult fe-audit-slop; for API/schema/LLM edits consult be-audit-slop. If a test/edit fails twice or five reads yield no progress, apply frustrated recovery. No autonomous visual or backend expansion during the freeze.
