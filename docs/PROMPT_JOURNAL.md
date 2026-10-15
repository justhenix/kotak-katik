# Jurnal Prompt Terkurasi: Kotak-Katik

Satu berkas unggahan berisi tepat lima prompt autentik, dipilih 15 Oktober 2026 atas otorisasi pengguna. Kutipan disalin lengkap dari [PROMPT_LOG.md](PROMPT_LOG.md); hanya akhir baris dinormalisasi. Ejaan dan sasaran historis dipertahankan. Hasil diperiksa terhadap [DEVELOPMENT_LOG.md](DEVELOPMENT_LOG.md), laporan milestone, dan Git. Waktu commit tidak dianggap waktu prompt.

Tidak tersedia rekaman ideasi sebelum log dimulai; kategori Ide / PRD memakai prompt perencanaan batas MVP yang benar-benar tercatat. Pada 15 Oktober 2026 sasaran diubah menjadi SD umum kelas 3–6. Kutipan yang menyebut sasaran lama merupakan bukti sejarah. Scope sekarang: [product.md](../.agents/product.md). Raw log tetap utuh.

## 1. Ide / PRD

**Kategori:** Ide / PRD

**Tanggal asli:** 7 Oktober 2026, 18:02 sesuai raw log; zona waktu tidak tertulis.

**Sumber:** 2026-10-07 18:02 - Clarify M0 boundary pada [raw log](PROMPT_LOG.md).

**Tujuan dan konteks:** Penetapan batas MVP awal. Ini prompt perencanaan scope yang tercatat, bukan rekonstruksi percakapan ideasi sebelum log dimulai.

**Prompt asli lengkap (verbatim):**

````text
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
````

**Hasil aktual:** Kernel satu level dengan Maju, Run/Step, ikan, Retry/Reset dan engine murni diwujudkan. Development log mencatat 14 unit/integration test dan smoke desktop/mobile lulus pada milestone tersebut.

**Bukti:** [04ef76a](https://github.com/justhenix/kotak-katik/commit/04ef76a7d3628ccaea1ac9fdfe28c8d3c9dfa6c2); [laporan sumber](DEVELOPMENT_LOG.md).

**Arti bagi pengembangan:** Membatasi scope dan membuktikan instruksi–aksi–hasil sebelum menambah belokan/loops.

## 2. Debugging

**Kategori:** Debugging

**Tanggal asli:** 13 Oktober 2026; jam tidak dicatat.

**Sumber:** 2026-10-13 — M2B visual UX fix pass pada [raw log](PROMPT_LOG.md).

**Tujuan dan konteks:** Memperbaiki clipping, layout mobile, Repeat counter, dan state berdasarkan lima screenshot pengguna. Gambar lampiran tidak direkonstruksi sebagai teks prompt.

**Prompt asli lengkap (verbatim):**

````text
# Kotak-Katik - M2B Visual UX Fix Pass

You are the UI/gameplay engineer responsible for stabilizing M2B before M3.

The previous Computer Use playtest marked M2B as GO because all 16 stages were completable. However, human screenshot review found visible interface and responsive UX problems that the report missed.

**Mission: Fix confirmed visual/interaction problems.**

Read `AGENTS.md`, relevant `.agents/` docs, and `docs/M2B_PLAYTEST_REPORT.md`. Preserve the established toy-like game direction, deterministic engine, 16-stage curriculum, and deaf-first learning experience.

## Required fixes

1. **Clipped command blocks:** Some commands extend beyond the left side of the program tray, particularly in completed states. Fix container padding, overflow, and scroll positioning. First and last blocks must be fully accessible.
2. **Mobile responsiveness:** At 390×844 and 320×740, the game feels cramped and awkward. Rebalance the 3D board, program editor, and execution controls. Avoid page-wide horizontal overflow, obscured controls, excessive empty space, and unnecessarily difficult scrolling. Ensure the user can readily find Play and edit commands.
3. **Repeat count control:** The native blue browser dropdown clashes with the game design. Replace it with a cohesive game-styled aesthetic interaction, preferably a visible `− / 2× / +` counter for supported values 2–4. Keep the number explicit and make controls touch-friendly and keyboard-accessible.
4. **Command highlighting:** Selection, focus, execution, and error states currently feel inconsistent with the game aesthetic. Design distinct, readable visual states. Do not remove focus visibility or sacrifice accessibility for appearance.
5. **Spacing and alignment:** Refine the command tray and completion screens. Prevent content touching borders or getting clipped. Use consistent padding and visual hierarchy.

## Implementation rules

- Inspect actual source code and fix root causes, not screenshot-specific CSS hacks.
- Keep changes focused on M2B stabilization.
- Preserve existing functionality, animations, and pedagogy.
- Do not implement M3 or redesign the whole game.
- Do not replace useful visual numbers or labels with ambiguous icon-only controls.
- Respect minimum comfortable touch-target sizes.
- Do not alter unrelated gameplay logic or Git history.

## Visual verification is mandatory

Launch the application and use **Codex Computer Use** to operate the rendered game.

Verify desktop 1440×900, mobile 390×844, and narrow mobile 320×740.

At minimum, visually retest:

- Normal command placement and execution.
- A long command sequence.
- Repeat count editing and its open/active states.
- Selection, focus, execution, and failure highlights.
- Completed-level screens and progression.
- A tutorial with the ghost-hand pointer.
- Responsive resizing while controls are visible.

Use direct game screenshots, without browser chrome or emulator workspace obscuring the result. Scroll where necessary, but evaluate usability rather than merely proving controls remain technically reachable.

Automated tests may supplement verification, but **passing tests is not sufficient evidence of visual correctness**.

## Acceptance criteria

- No unintended clipping or overlapping UI.
- Program blocks have appropriate edge padding.
- No page-wide horizontal overflow on mobile.
- Play and editing controls remain discoverable and usable.
- Repeat count UI matches the game's design language.
- Clear distinctions among selected, focused, running, and failing blocks.
- Existing game progression remains functional.
- All fixes are visually verified, with before/after evidence.

Write `docs/M2B_VISUAL_FIX_REPORT.md` with changes, screenshots, remaining issues, and a GO/FIX FIRST verdict.

Do not claim GO while known P1 visual usability defects remain. Do not commit, push, or proceed to M3 without my approval.

Start implementing the fixes now.
````

**Hasil aktual:** Tray, responsivitas, Repeat counter, state, dan spacing dikoreksi tanpa mengubah simulasi/kurikulum. Laporan mencatat 227 unit test dan build lulus; run awal 74/76 diikuti perbaikan/rerun terfokus. Satu cek akhir masih tercatat pending pada laporan lama; tidak diubah menjadi klaim lulus. Perubahan kemudian masuk checkpoint baseline M3.

**Bukti:** [186cd82](https://github.com/justhenix/kotak-katik/commit/186cd828482e030a43522a6cff29a59579fc05c2); [laporan sumber](M2B_VISUAL_FIX_REPORT.md).

**Arti bagi pengembangan:** Koreksi berbasis masalah nyata dan peninjauan manusia, dengan hasil gagal dan rerun tetap dilaporkan.

## 3. Audit & Optimasi

**Kategori:** Audit & Optimasi

**Tanggal asli:** 10 Oktober 2026; jam tidak dicatat.

**Sumber:** 2026-10-10 - Finalize M0.5 checkpoint pada [raw log](PROMPT_LOG.md).

**Tujuan dan konteks:** Audit diff, lisensi, reproduksibilitas pemrosesan aset, file sementara, dan gate rilis M0.5.

**Prompt asli lengkap (verbatim):**

````text
Finalize the M0.5 checkpoint for `justhenix/kotak-katik`.

1. Review `git status` and the current diff. Stage only intended M0.5 changes, curated GLB assets, and relevant documentation.
2. Verify asset attribution, licenses, and reproducible processing. Exclude temporary files, full asset packs, generated screenshots, and unnecessary inspection tools.
3. Run unit tests, production build, and Playwright E2E tests. Fix regressions within M0.5 scope.
4. Append an accurate development-log entry and prompt log where required. Do not modify `PROMPT_JOURNAL.md` without my explicit selection.
5. Commit with `feat: integrate curated 3d game assets` and push to `origin/main`.

Preserve existing functionality and Git history. No force-push, unrelated refactors, or new features.

Report commit hash, verification results, and any remaining issues. If critical verification fails, stop before committing.
````

**Hasil aktual:** Enam aset dapat direproduksi byte-for-byte. Laporan dan development log mencatat 25 unit test, build, serta 10 E2E desktop/mobile lulus. Polling test dikoreksi agar tidak melewatkan fase animasi singkat, tanpa mengubah gameplay untuk menyembunyikan masalah harness.

**Bukti:** [a11484d](https://github.com/justhenix/kotak-katik/commit/a11484d11d4f592357a21567183f1ce1b4ca612e); [laporan sumber](M0_5_VERIFICATION.md).

**Arti bagi pengembangan:** Audit provenance dan hasil optimasi lossless dapat diverifikasi ulang.

## 4. Finishing

**Kategori:** Finishing

**Tanggal asli:** 14 Oktober 2026; jam tidak dicatat.

**Sumber:** 2026-10-14: M3 autonomous MVP completion sprint pada [raw log](PROMPT_LOG.md).

**Tujuan dan konteks:** Menyelesaikan title, Ekspedisi, unlocking, persistence, alur akhir, dan persiapan rilis Vercel dalam milestone.

**Prompt asli lengkap (verbatim):**

````text
Implement GitHub issue #1 in `justhenix/kotak-katik` as an autonomous, milestone-driven MVP completion sprint.

**Deadline: October 15, 2026. Priority: functional MVP first, polish later.**

Read `AGENTS.md`, the relevant `.agents/` documents, current source code, and issue #1 before modifying anything.

Execute milestones M3.0 through M3.4 sequentially. Do not stop after planning or scaffolding.

Requirements:

1. Preserve the existing 16-level curriculum, deterministic engine, command editor, 3D scene, and IDWDYD tutorials.
2. Complete title/start navigation, expedition selection, stage unlocking, and persistent local progress.
3. Integrate everything into one functional player journey, from opening the game to completing the final level.
4. Fix regressions immediately. Verify gameplay, accessibility, desktop/mobile usability, and production build.
5. Commit coherent milestones, preserve authentic development evidence, and prepare the Vercel release.

**Execution rules:**

- Implement before polishing.
- Prefer minimal changes over architectural rewrites.
- Do not add unnecessary features or dependencies.
- Do not weaken tests to conceal failures.
- Never fabricate prompt history or automatically curate the prompt journal.
- Avoid asking for confirmation between milestones.
- Report briefly after each milestone, then continue automatically.
- Stop only for genuine blockers requiring external authorization.

**Done means:** All 16 existing stages remain playable, progression is functional, progress survives refresh, the final completion screen works, and the release passes build and critical browser tests.

Work through the milestones until the MVP is finished. Report any remaining submission actions accurately.
````

**Hasil aktual:** Milestone title, Ekspedisi, dan progres diselesaikan pada commit terpisah. Laporan M3 mencatat 239 unit test, build, 98 pemeriksaan browser lokal dan 12 smoke deployment lulus saat itu. Deployment serta integrasi main dicatat pada checkpoint rilis. Angka ini hasil historis, bukan rerun final 15 Oktober.

**Bukti:** [6c3fc6a](https://github.com/justhenix/kotak-katik/commit/6c3fc6aa092cabfc4016ed276c35d42c08f2a9ca), [ad62072](https://github.com/justhenix/kotak-katik/commit/ad62072861daa3f8f1e28c0a8f89e3d2209e410a), [4c22964](https://github.com/justhenix/kotak-katik/commit/4c229640ec64cdc8a5961794f1a7088e229229bf), [c4019a8](https://github.com/justhenix/kotak-katik/commit/c4019a8a03c12fd702111a20892ac23ea14c13ec), [0f409d8](https://github.com/justhenix/kotak-katik/commit/0f409d80301f4d313fbee8bdd73b4dbf84e1644e), [b7fbae2](https://github.com/justhenix/kotak-katik/commit/b7fbae28a9bebe6a5c25b8c97b829a21867b34cc); [laporan sumber](M3_MVP_SPRINT.md).

**Arti bagi pengembangan:** Menutup perjalanan pemain dan persistence dengan verifikasi deployment serta history bertahap.

## 5. Bebas

**Kategori:** Bebas

**Tanggal asli:** 12 Oktober 2026, 09:45 sesuai raw log; zona waktu tidak tertulis.

**Sumber:** 2026-10-12 09:45 - M2B Visual Learning Experience pada [raw log](PROMPT_LOG.md).

**Tujuan dan konteks:** Mengembangkan I Do / We Do / You Do di atas kurikulum dan interpreter yang sudah ada.

**Prompt asli lengkap (verbatim):**

````text
# Kotak-Katik - M2B: Visual Learning Experience

Read `AGENTS.md`, relevant `.agents/*.md`, and M2A's curriculum report.

First, verify M2A's committed work and safely integrate it with the finalized M1.1 GUI. Preserve both implementations. Do not overwrite unfinished worktree changes.

Implement M2B:

1. Short, visual-first I Do demonstrations showing command → cat action → result.
2. We Do stages with partially prepared programs, obvious insertion targets, and contextual visual hints.
3. You Do stages with gradually reduced guidance.
4. Progressive command introduction, following the fixed curriculum.
5. Clear visual feedback for completion and mistakes, understandable without sound.
6. One reusable tutorial/scaffolding system driven by authored level metadata.

Keep the existing game mechanics, assets, and GUI hierarchy. No long tutorial paragraphs, mandatory audio, quiz screens, Home Menu, or Expedition Map.

Verify real beginner, turning, Repeat, and debugging stages on desktop/mobile. Test tutorial progression, skipping/replaying demonstrations, reduced motion, and gameplay regressions.

Document changes, run tests/build/E2E, and commit to a feature branch. Do not push or merge to `main` without confirming integration safety.

**Done when:** A first-time child can learn the controls through visual demonstration, complete guided stages, and transition into independent puzzles.
````

**Hasil aktual:** Demonstrasi memakai aksi game nyata; cue mengikuti metadata dan bantuan berkurang pada tahap mandiri. Development log mencatat 219 unit test dan build lulus. Suite awal 77/78 diikuti dua cek draw-rest yang lulus setelah koreksi; bukan satu run penuh seluruhnya hijau.

**Bukti:** [e9d67d4](https://github.com/justhenix/kotak-katik/commit/e9d67d46c434b761e1e7e28bbbf4e1444f262843), [f1d3151](https://github.com/justhenix/kotak-katik/commit/f1d31518c9cc076ef1f10d7f09267403aaf37a6b); [laporan sumber](M2B_VISUAL_LEARNING.md).

**Arti bagi pengembangan:** Iterasi pembelajaran mempertahankan hubungan perintah, tindakan, dan hasil, serta batas verifikasi yang jujur.
