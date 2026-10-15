# Smart I Do → We Do → You Do

15 October 2026. This change preserves the minimal gameplay GUI committed as `8d95212` and adds interaction permissions to the existing lesson system. The supplied three-phase illustration is a sequence of learning states, not an application layout.

## One policy, enforced at dispatch

`src/stores/interaction-policy.ts` derives permissions from the learning phase, authored guidance conditions, program, simulation, and existing lesson progress. It contains no stage IDs or solution witnesses. Components use this policy to expose relevant controls; every public game editing/execution action also checks it before changing state. Hidden or stale controls therefore cannot bypass the lesson by calling an old handler.

`createLessonStore` installs the guard on its game store. Authored demonstration actions and explicit lesson reset/replay operations use `withLessonActions`, a synchronous dispatch scope around the same game actions. Its scope ends in `finally`, including exceptions, and does not carry into a delayed callback. The interpreter, level data, authored solutions, and progression rules are unchanged. There is no second tutorial state machine.

| Phase | Interactions |
| --- | --- |
| I Do | Automated command placement, replacement, stepping and execution continue. Manual program/execution actions are locked. Replay, Skip and expedition navigation remain operable. |
| We Do | Only the current authored insertion or decision is editable. Prepared commands are protected. Irrelevant insertion, movement, deletion and Repeat-body tools are omitted. |
| We Do after an attempt | Inspection, correction and retry are available. Correction revisits the authored missing command, count or learner decision rather than assuming the command where movement stopped caused the mistake. |
| You Do / engineering practice | Normal program, count, body, replacement, insertion, movement and deletion are available. Procedural spotlight and ghost hand are absent. Execution retains its ordinary edit lock and Stop behavior. |

The turn decision retains both Kiri and Kanan. Repeat count adjustment remains available when the authored count step advances to Run, so a child can choose 4 after passing through 3 and observe the failure. In repair, 2 can also produce an unfinished attempt. Permissions never compare a program against a correct solution. Selection is cleared or revalidated as guidance advances; the still-relevant Repeat count control remains usable.

## Guidance and accidental taps

The ghost hand and spotlight share one live DOM resolver. It follows mounted insertion slots, palette choices, Ganti, count controls, Repeat entry/return, Play and Step through scrolling and responsive reflow. The board remains readable under subtle dimming. The SVG overlay ignores pointer events, so permitted actions and navigation receive the original input.

An unrelated tap leaves the program and simulation untouched, briefly emphasizes the intended target, and announces “Coba yang ditunjuk.” No modal or punitive message is introduced. Protected pieces retain their visual meaning and accessible names; they are marked unavailable and excluded from the normal Tab sequence. Keyboard focus advances to the next permitted control when a step completes or a repair closes. Reduced motion uses a static outline instead of the opacity pulse. All new child-facing messages contain fewer than five Indonesian words.

Real-render corrections removed a hard rectangular world cutout, restored full contrast on the demonstrated disabled command, narrowed palette spotlights to actual choices, and placed the fingertip on an actual button within a choice/count group. No new scene assets, shaders, dependencies, panels or gameplay mechanics were introduced.

## Browser evidence

| Phase / state | Desktop | Mobile |
| --- | --- | --- |
| I Do | [image](evidence/smart-idwdyd/desktop-i-do.png) | [image](evidence/smart-idwdyd/mobile-i-do.png) |
| We Do choices | [image](evidence/smart-idwdyd/desktop-we-do-choice.png) | [image](evidence/smart-idwdyd/mobile-we-do-choice.png) |
| We Do mistake | [image](evidence/smart-idwdyd/desktop-we-do-failure.png) | [image](evidence/smart-idwdyd/mobile-we-do-failure.png) |
| We Do Repeat | [image](evidence/smart-idwdyd/desktop-we-do-repeat.png) | [image](evidence/smart-idwdyd/mobile-we-do-repeat.png) |
| Repeat inspection at 320×740 | [image](evidence/smart-idwdyd/desktop-we-do-repeat-failure-320.png) | [image](evidence/smart-idwdyd/mobile-we-do-repeat-failure-320.png) |
| You Do | [image](evidence/smart-idwdyd/desktop-you-do.png) | [image](evidence/smart-idwdyd/mobile-you-do.png) |
| 320px debugging at 200% text | [image](evidence/smart-idwdyd/desktop-we-do-debug-zoom.png) | [image](evidence/smart-idwdyd/mobile-we-do-debug-zoom.png) |

Captures use the actual production application and CSS viewports, not rendered mockups. Final executed commands and results are appended to [the development log](DEVELOPMENT_LOG.md). The focused tutorial checks exercise real mouse/touch and keyboard inputs, both wrong and correct choices, prepared-block protection, Replay/Skip/navigation, Repeat repair, independent editing, and live anchors. The broader gate also retains all 16 stage witnesses, full player journeys, model animation/loading, Stop, relative Step behavior, persistence, title navigation and responsive geometry.

The explicit current-interface browser gate is `bunx playwright test -c playwright.gui.config.ts e2e/smart-idwdyd.spec.ts e2e/gui-redesign.spec.ts e2e/curriculum.spec.ts e2e/journey.spec.ts e2e/assets.spec.ts e2e/title-screen.spec.ts e2e/mvp-release.spec.ts --reporter=list`. Historical UI suites that describe the removed panel hierarchy are outside that command; no claim is made that every historical selector still applies.

Executed results: **264 unit tests pass in 12 files**, and TypeScript/production build passes. The broad production-browser run passed **87/88** cases, including both complete 16-stage journeys. Its one failure was a test attempting the debugging repair before the required observed attempt. The flow was corrected to perform that attempt first, preserving the solution and final simulation assertions. The final expanded targeted run passed **26/26** in 4.8 minutes, including the repaired desktop/mobile stage, all current dock checks, all Smart IDWDYD checks, the normal-motion corrective cue, reduced-motion fallback, real fingertip bounds, and keyboard focus after guided additions and repair. Together these runs verify **88 distinct browser cases cumulatively**; this is not a claim of a single uninterrupted 88-case green run. Initial focus failures were repaired in the implementation, not removed from the assertions.

Physical-device performance, assistive-technology testing with actual screen readers, and SDLB-B classroom comprehension remain unverified. Automated checks cover accessible names, keyboard input, visual feedback and reduced motion; they do not substitute for those sessions. The existing Three.js bundle advisory remains. No deployment, history rewrite, prompt-journal curation or change to the user's untracked screenshots is included.
