# M1 mechanics

M1 extends the M0.5 simulation/store/editor boundaries. It adds no renderer-driven game rules, dependencies, obstacle mechanics, curriculum, or progression.

## Engineering fixtures

| URL | Purpose | Available commands | Limits |
| --- | --- | --- | --- |
| `/` or `/?fixture=kernel` | Original three-tile M0 fixture, unchanged level data | Forward | None |
| `/?fixture=turning` | Small corner path | Forward, Left, Right | None |
| `/?fixture=loops` | Four-tile square with three fish | Forward, Left, Right, Repeat | Four top-level slots, three body slots |

Unknown fixture names fall back to the kernel. These URLs expose deterministic engineering fixtures in development and production, not final lessons or an expedition. The URL selects level identity only; program and simulation remain in the store.

## Program and interpreter

`Command` is a discriminated union of three primitive types and `{ type: 'repeat', count: 2 | 3 | 4, commands: readonly PrimitiveCommand[] }`. Bodies cannot contain Repeat. `maxProgramSlots` counts top-level blocks, including one slot per Repeat container; `maxLoopBodySlots` counts primitives in each body. Both limits are optional, validated nonnegative integers.

`programError` enforces permissions, counts, structure, and limits at level/store/interpreter boundaries. Empty Repeat bodies are valid while editing, but the entire program is unrunnable until every body contains a primitive. Run, Step, and Retry stay disabled with an inline empty-body message. No empty-body Step or hidden loop-container action occurs.

`executeNextAction` consumes a cursor `{ commandIndex, bodyIndex, iteration }`. One invocation attempts exactly one Forward/Left/Right. It advances the body index, then iteration, then top-level index without flattening the program or maintaining a second executor. Iterations are one-based. On collision it retains the attempted cursor and emits the failing path without advancing or moving the cat.

The state exposes `activeCommandPath` (`[top]` or `[top, body]`) and `loopIteration` for highlighting. `activeCommandIndex` remains the top-level index; `nextCommandIndex` retains its M0 meaning as the number of successful primitive actions, rather than becoming a top-level pointer. The separate cursor identifies the next primitive. This preserves the Forward-only contract without conflating loops and actions.

Turning uses the canonical north/east/south/west engine order and emits a `turned` event. It changes facing exactly one quarter-turn and retains position. Only Forward can collect fish. Collecting every fish satisfies the objective, but completion waits until the valid program ends; a later collision still fails.

## Store and editing

The existing single 400 ms timeout chain calls the shared interpreter for Run and Retry. Both restore the original board and retained program before the first timed action. Step continues a paused cursor; Step after a terminal state restarts from the beginning, matching M0. Editing after Step/error/completion restores the board, collected state, and cursor. Reset deep-clones the level's initial program, including Repeat bodies.

All editor mutations are guarded during Run: add/remove, reorder, repeat count, and Reset. Invalid/out-of-range edits are no-ops. Limits are enforced by store actions as well as disabled controls. Stop cancels the pending timeout and preserves the last result for inspection; Step can continue from that cursor. Stopping before the first action restores idle. Run/Retry after a pause start over. App cleanup cancels pending execution.

The editor uses semantic tap/keyboard controls: palette buttons append commands; each Repeat has its own primitive-only palette and native 2×/3×/4× selector; command buttons remove; adjacent previous/next buttons reorder within a scope. Repeat containers can reorder with other top-level blocks. Moving a primitive between scopes is accomplished by removing and re-adding it; drag-and-drop is unnecessary.

## Presentation

The existing cat playback interpolates target yaw over 240 ms, leaving position unchanged for turns. Ordinary turns travel exactly one quarter-turn; rapid interrupted Steps retain the event's left/right direction while catching up to the latest logical pose. Relative forward, cyan-left, and orange-right cues stay attached to the same placement group. Status-only Stop updates preserve the current animation rather than restarting pickup/reactions. Reduced motion snaps to the exact logical pose and preserves persistent command/iteration highlights. Demand rendering remains bounded.

All seven GLB binaries, processing, licenses, default clownfish, alternate trout, and shared fish size remain unchanged. M0.5 animation/loading/recovery tests remain intact.

Following the existing Pastel Toybox direction: ENERGY 2 / RHYTHM 2 / MOTION 2. Cyan/orange reinforce arrow geometry and relative direction. The Repeat boundary groups a real command body and its iteration rather than decorating an unrelated panel. Previous/next buttons expose ordering without precise dragging. Native selectors provide familiar keyboard/touch count editing. The cream workbench and existing type/board composition are retained.

## Next milestone

M2 still needs authored curriculum and gradual-release instruction, an appropriate entry/progression flow, and learner validation. These engineering fixtures do not establish independent child comprehension. Expedition, onboarding, persistence, and new scenery/mechanics are outside M1.

## Verified checkpoint (2026-10-10)

Final executed checks: 53 Vitest tests, production build, and 24 Playwright tests passed. Existing M0/M0.5 regressions remain intact. Desktop/mobile production renders were inspected for turns, all facings, body editing, execution/error highlights, collection/completion, reduced motion, and 200% text zoom. No unexpected runtime errors in successful flows. Full evidence and corrected intermediate failures are recorded in DEVELOPMENT_LOG.md. The renderer bundle advisory remains; physical-device and learner testing are not claimed.
