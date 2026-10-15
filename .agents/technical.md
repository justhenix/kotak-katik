# Arsitektur dan Standar Kualitas: Kotak-Katik

Kontrak rilis 15 Oktober 2026 untuk game web siswa SD kelas 3–6. Menggabungkan arsitektur yang berlaku dan quality bar. Rencana lama yang belum diterapkan tidak menjadi klaim fitur.

## Stack aktual

Bun, Vite, React, TypeScript, Three.js, React Three Fiber, Zustand, Tailwind CSS, Lucide React, Fredoka/Inter, Vitest, dan Playwright. Versi aktual dicatat di package.json/bun.lock. Tidak ada backend, API key, LLM runtime, akun, atau database. Deployment statis memakai konfigurasi Vercel yang sudah ada. Jangan menaikkan dependensi saat feature freeze.

## Arsitektur

| Lokasi | Tanggung jawab |
| --- | --- |
| src/game/ | Tipe program/level, validasi, interpreter, simulasi murni, kurikulum lokal |
| src/stores/ | Editor, eksekusi, tutorial, navigasi, progres |
| src/components/ | Kontrol DOM yang membaca/mengirim aksi store |
| src/scene/ | Proyeksi state, loading model, animasi presentasi |
| public/assets/ dan public/licenses/ | Aset runtime dan pemberitahuan lisensi |
| e2e/ | Interaksi browser dan pemeriksaan tampilan |

Simulasi adalah sumber kebenaran. Mesh, callback animasi, dan koordinat layar tidak menetapkan gerak, ikan, tabrakan, atau completion. Run/Step berbagi executor primitif. Level/program sama menghasilkan state sama dan dapat diuji tanpa WebGL.

State eksplisit mencakup level, posisi/orientasi, program, cursor/blok aktif, iterasi, status, ikan, dan completion. Gunakan domain data bertipe, komponen terfokus, serta alur prediktabel. Hindari any untuk melewati type error, aturan duplikat, mutasi tersembunyi, dan abstraksi prematur.

## Progres dan siklus hidup

src/stores/progress-store.ts menyimpan payload versi 1 pada key kotak-katik:progress: tahap selesai, terbuka, dan pilihan resume. Decode menormalisasi data rusak/tidak cocok terhadap kurikulum. Program dan eksekusi dibangun ulang dari data tahap.

Jika localStorage ditolak, sesi berjalan dengan pemberitahuan penyimpanan. Reset progres memerlukan konfirmasi. Preview teknik tidak memberikan progres. Navigasi/restart/replay membatalkan Run/demo tertunda; pekerjaan tahap lama tidak boleh mengubah tahap baru.

## Aset dan performa

Pertahankan kucing/ikan dan dedaunan prosedural asli di src/scene/title/Dressing.tsx serta src/scene/Environment/ToyboxDressing.tsx. Jangan merge henix/quaternius-foliage-ground atau mengganti renderer/aset. Lisensi/sumber: docs/ATTRIBUTIONS.md, docs/ASSETS.md, public/licenses/.

Demand rendering berhenti saat adegan tenang; animasi dibatasi dan dibersihkan. Loading model serta kegagalan WebGL/aset harus dapat dipahami. Reduced motion mempertahankan cue statis. Kendalikan kompleksitas dan render ulang tanpa optimasi spekulatif. Advisory bundle Vite yang sudah ada dilaporkan, bukan alasan refactor menjelang pengumpulan.

## Pengujian dan gate rilis

Perintah lokal:

~~~sh
bun install --frozen-lockfile
bun run test
bun run build
bun x playwright test e2e/journey.spec.ts
~~~

Build menjalankan TypeScript/Vite. Browser lokal memakai hasil build; rebuild setelah perubahan source. Untuk deployment, set MVP_BASE_URL ke target dan gunakan --config playwright.release.config.ts. Jalankan pemeriksaan terfokus sesuai perubahan.

Gate: title/Mulai, contoh terbimbing, konstruksi/eksekusi perintah, ikan, kelanjutan, Ekspedisi, persistensi setelah refresh, serta mobile bekerja. Bila mekanik berubah, periksa gerak/arah, tabrakan, loops, Step, retry/reset, completion. Periksa runtime dan request aset; kompilasi saja tidak membuktikan interaksi.

Jangan melemahkan test. Bedakan masalah harness dari bug produk melalui bukti. Laporkan perintah dan hasil aktual. Emulasi bukan validasi pemahaman anak, semua teknologi bantu, atau perangkat fisik.

## Deployment dan checklist kompetisi

- Branch main; checkpoint permainan sebelum dokumentasi final: a990865.
- Review status/diff, jangan timpa pekerjaan lain. Commit/push normal; tanpa reset history, amend bukti kompetisi, atau force-push.
- Verifikasi deployment READY dan akses anonim ke game. Push bukan bukti deployment.
- Repositori publik: <https://github.com/justhenix/kotak-katik>.
- Target produksi: <https://kotak-katik.henix.my.id>. URL Vercel sekunder hanya jika terverifikasi.
- Tema Web Education for Kids; dokumentasi AI, prompt, sumber aset, dan lisensi harus autentik. Jangan menyalin proyek pribadi lama.
- Tepat lima .agents/*.md: product, pedagogy, gameplay, design, technical. Root AGENTS.md bukan unggahan keenam.
- Satu docs/PROMPT_JOURNAL.md dengan maksimal lima prompt verbatim. Raw log dan commit lama tetap utuh; timestamp/hasil tak terverifikasi dinyatakan demikian.
- Format tetap Markdown. Verifikasi ekstensi/batas file di form. Jangan diam-diam membuat PDF/DOCX atau mengganti upload dengan link repo.

## Feature freeze dan cutoff

Hanya dokumentasi, verifikasi, deployment, dan koreksi penghalang rilis yang terbukti. Tidak ada fitur/desain ulang/dependensi baru/migrasi. Batas internal 15 Oktober 2026 pukul 23:00 WIB; setelahnya hanya pemulihan/pengumpulan. Deadline resmi yang disampaikan peserta: 23:59 WIB. Jangan mengklaim formulir terkirim tanpa konfirmasi.

[Produk/MDS](product.md), [pedagogi](pedagogy.md), [mekanik](gameplay.md), [desain dan aksesibilitas](design.md), [panduan agen](../AGENTS.md), [README](../README.md).
