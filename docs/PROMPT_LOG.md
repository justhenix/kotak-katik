# Prompt Log

### 2026-10-07 17:38 — Set up AI-development logs

**Prompt**

`````text
````plaintext
Set up Kotak-Katik's competition AI-development logs.

Do not implement gameplay yet.

Create:

```txt
docs/
├── PROMPT_JOURNAL.md
├── PROMPT_LOG.md
└── DEVELOPMENT_LOG.md
````

## PROMPT_JOURNAL.md

This is the curated max-5 prompt journal for judging.

Sections:

1. Ide / PRD
2. Debugging
3. Audit & Optimasi
4. Finishing
5. Free

Important:

- Do NOT automatically select prompts.
- Only add a prompt to this journal when I explicitly tell you to curate/select it.
- Selected prompts must be copied verbatim from my real prompts.
- Never rewrite an old prompt to make it look better.
- Leave unselected sections as `Not selected yet`.

For now, leave every slot unselected.

---

## PROMPT_LOG.md

This is the full chronological raw prompt record.

Rules:

- append-only,
- never delete old entries,
- never rewrite old prompts,
- preserve prompts verbatim,
- preserve chronological order,
- corrections are new entries,
- never fabricate timestamps, models, or metadata.

Use:
````plaintext
### YYYY-MM-DD HH:MM — Short task name

**Prompt**

```text
<verbatim user prompt>
````

**Result**

- concise TLDR only
````plaintext

Do not dump long agent completion messages into the log.

A short factual result summary is enough because the raw prompt is the main
evidence.

---

## DEVELOPMENT_LOG.md

Map meaningful work to Git history.

Use:

```md
### YYYY-MM-DD — Task / Milestone

**Prompt:** PROMPT_LOG entry / timestamp

**Done**
- short TLDR
- max ~3 bullets

**Verified**
- tests/build/manual checks

**Commit**
- `<hash>` `<message>`

**Remaining**
- only if applicable
````

Never fabricate commit hashes.

Use `Pending commit` until a real commit exists.

---

## Workflow

For meaningful AI-assisted work:

1. append my exact prompt to `PROMPT_LOG.md`
2. agent does the work
3. record a short TLDR result
4. verify the result
5. commit normally
6. add/update the matching `DEVELOPMENT_LOG.md` entry

Only update `PROMPT_JOURNAL.md` when I explicitly say to select/curate a prompt.

---

## Integrity

- Prompt log is append-only for transparency.
- Never delete failed, weak, or superseded prompts.
- Never rewrite Git history to match the logs.
- Never fabricate prompt or commit chronology.
- Curated prompts must come from the real prompt log.

Keep everything simple Markdown.

Commit this setup as:

`docs: add AI development logging system`

Do not begin M0 yet.
````plaintext

And yes, I’d use this philosophy:

```text
PROMPT_LOG
= full user prompt + tiny result TLDR

DEVELOPMENT_LOG
= what changed + verification + commit

PROMPT_JOURNAL
= only the 5 prompts YOU explicitly choose
````

That keeps transparency without producing a 500-page log.




`````


**Result**

- Created the three requested AI-development log files and left all journal slots unselected. No gameplay code changed.

### 2026-10-07 17:51 - M0 Playable Kernel

**Prompt**

```text
Read `AGENTS.md` and all referenced `.agents/` docs first.

Then inspect the repo and start M0 - Playable Kernel following the documented architecture and quality bar.

Before work, append this prompt verbatim to `docs/PROMPT_LOG.md`. After work, add only a concise TLDR + verification + real commit to `docs/DEVELOPMENT_LOG.md`.

Do not touch `PROMPT_JOURNAL.md` unless I explicitly ask.

Keep scope strict. Do not implement M1+ features yet.
```

### 2026-10-07 18:02 - Clarify M0 boundary

**Prompt**

```text
Use this M0 boundary instead:

- one tiny isometric level
- placeholder primitives only
- Forward command only
- Run
- Step
- fish collection
- Retry
- Reset Program
- deterministic pure game engine + basic tests
- desktop/mobile smoke check
- bun run build passes

Defer:
- Left/Right
- collision complexity beyond basic invalid-tile stop
- loops
- expedition
- onboarding
- persistence
- audio
- themes
- real Quaternius/Kenney assets

M0 is only proving the architecture and end-to-end playable kernel.
Do not expand scope.
```

**Result**

- Implemented the clarified Forward-only M0 kernel; 14 tests, desktop/mobile smoke checks, and production build pass. No M1+ systems added.
