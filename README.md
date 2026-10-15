# Kotak-Katik

Game edukasi web untuk **siswa SD kelas 3–6**. Susun perintah agar kucing mengambil ikan sambil belajar urutan, arah relatif, pengulangan, debugging, dan pemecahan masalah.

**[Mainkan Kotak-Katik](https://kotak-katik.henix.my.id)** · [GitHub](https://github.com/justhenix/kotak-katik)

Dibuat untuk M-ONE Telkomsel Coding Competition 2026, tema *Web Education for Kids*.

## Bermain

Tekan **Mulai**, amati contoh, lalu susun **Maju**, **Kiri**, **Kanan**, dan **Ulangi**. Jalankan, amati hasil, dan perbaiki sampai semua ikan terkumpul. Maju mengikuti arah hadap kucing.

Ada 16 tahap dengan **I Do → We Do → You Do**, Ekspedisi, inspeksi satu langkah, dan progres lokal. Mendukung sentuh/keyboard, reduced motion, serta umpan balik visual tanpa audio. WebGL diperlukan.

## Pengembangan

React, TypeScript, Vite, Three.js/React Three Fiber, Zustand, Tailwind CSS, dan Bun.

~~~sh
bun install --frozen-lockfile
bun run dev
bun run test
bun run build
~~~

E2E setelah build: `bun x playwright install chromium`, lalu `bun x playwright test e2e/journey.spec.ts`.

Rilis 15 Oktober 2026: build, 264 unit test, dan 10 pemeriksaan deployment lulus, termasuk perjalanan 16 tahap pada mobile. Suite mechanics lama memiliki selector yang belum mengikuti editor saat ini. [Rincian verifikasi](docs/DEVELOPMENT_LOG.md).

## Dokumentasi AI

Lima acuan: [produk/MDS](.agents/product.md), [pedagogi](.agents/pedagogy.md), [gameplay](.agents/gameplay.md), [desain/aksesibilitas](.agents/design.md), [teknis](.agents/technical.md).

[Jurnal prompt](docs/PROMPT_JOURNAL.md) berisi lima prompt autentik; [raw log](docs/PROMPT_LOG.md) dan Git history mempertahankan sejarah. Sasaran ditetapkan menjadi SD umum kelas 3–6 pada 15 Oktober 2026; penyebutan sasaran lama dalam sejarah tetap dipertahankan.

## Credits

Kucing/pointer: Kenney (CC0). Clownfish: Quaternius (CC0). Alternatif trout: Poly by Google (CC BY 3.0). Foliage dibuat secara prosedural dalam proyek. [Atribusi lengkap](docs/ATTRIBUTIONS.md) · [Lisensi](public/licenses).
