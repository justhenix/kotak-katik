# Product Definition / MDS / PRD: Kotak-Katik

Versi pengumpulan: 15 Oktober 2026. Sumber kebenaran ruang lingkup produk saat ini.

## Ringkasan

Kotak-Katik adalah game edukasi berbasis web untuk siswa kelas 3–6 SD yang memperkenalkan computational thinking melalui permainan menyusun perintah, mengarahkan kucing mengambil ikan, serta menyelesaikan tantangan logika secara bertahap.

Pemain diasumsikan dapat membaca instruksi pendek berbahasa Indonesia. Pengalaman pemrograman, koordinat, dan keyboard tidak menjadi prasyarat.

## Masalah, solusi, dan nilai pendidikan

Konsep urutan, arah relatif, dan pengulangan sulit dipahami jika hanya dijelaskan sebagai istilah. Game memberi anak objek yang dapat diamati: kucing, petak, ikan, dan blok perintah. Anak merencanakan jalan, menyusun instruksi, menjalankannya, lalu melihat akibat setiap tindakan. Ketika hasil berbeda dari rencana, anak memeriksa dan memperbaiki susunan.

Siklus belajar: **Rencanakan → Susun perintah → Jalankan → Amati → Perbaiki → Coba lagi**.

Tujuan pendidikan mencakup sequencing, algorithmic thinking, arah relatif, repetition/loops, debugging, penalaran logis, dan pemecahan masalah. Anak belajar melalui bermain dan percobaan. Efektivitas belajar belum diukur melalui penelitian atau uji kelas.

## Fitur yang sudah tersedia

- Layar judul dengan Mulai, Lanjutkan ketika ada progres, dan Ekspedisi.
- Kurikulum tetap 16 tahap: gerak, urutan, belokan, jalur gabungan, pengulangan, debugging, dan tantangan campuran.
- I Do: contoh otomatis melalui interpreter asli. We Do: program awal dan aksi terbimbing. You Do: penyelesaian mandiri.
- Blok Maju, Kiri, Kanan, dan Ulangi sesuai perintah yang diizinkan tahap. Ulangi 2–4 kali dengan isi perintah primitif; tanpa loop bersarang.
- Eksekusi program dan pemeriksaan satu langkah. Step diperkenalkan pada debugging dan tantangan campuran; fixture teknik menyediakan Run/Step.
- Pengambilan ikan, penanda perintah aktif, umpan balik tabrakan, perbaikan dan percobaan ulang.
- Ekspedisi berurutan dengan tahap terkunci/tersedia/saat ini/selesai. Melewati contoh membuka kelanjutan tanpa memberi status selesai.
- Progres lokal browser dan resume setelah refresh; penghapusan progres dengan konfirmasi.
- Tata letak responsif, kontrol sentuh/keyboard, umpan balik tanpa ketergantungan audio, dan reduced motion.
- Dunia pastel low-poly, model kucing/ikan yang sudah dikurasi, dan dedaunan prosedural asli proyek.

## MVP dan batas rilis

Feature freeze mempertahankan permainan yang sudah bekerja. Tidak ada fitur baru, desain ulang, aset baru, peningkatan dependensi, atau migrasi. Koreksi hanya untuk kegagalan yang menghalangi permainan atau pengumpulan.

Di luar rilis: akun, backend, cloud save, multiplayer, leaderboard, ekonomi/inventori, AI chat, dashboard guru, editor level, level prosedural, loop bersarang, tema tambahan, dan audio. Tidak ada klaim media isyarat tervalidasi, efektivitas pendidikan khusus, atau sertifikasi aksesibilitas.

## Tema kompetisi dan pengumpulan

M-ONE Telkomsel Coding Competition 2026, tema Web Education for Kids. Pengalaman web menghubungkan instruksi, tindakan, dan hasil yang terlihat.

Repositori: <https://github.com/justhenix/kotak-katik>. Target produksi: <https://kotak-katik.henix.my.id>.

Docs Acuan AI berisi tepat lima Markdown di .agents/: product, pedagogy, gameplay, design, technical. Jurnal unggahan terpisah: docs/PROMPT_JOURNAL.md, maksimal lima prompt autentik. Verifikasi ekstensi dan keberhasilan pengumpulan pada form.

## Kriteria penerimaan

1. Mulai membuka contoh pertama; pemain dapat menyusun dan menjalankan instruksi pada latihan.
2. Arah relatif, putaran di tempat, pengulangan, ikan, dan completion tetap deterministik.
3. Kesalahan dapat diamati, diperiksa, diedit, dan dicoba lagi tanpa hukuman atau solusi otomatis.
4. Tahap terbuka sesuai aturan; progres tersimpan jika localStorage tersedia.
5. Papan dan kontrol dapat dipakai pada desktop/mobile tanpa error runtime kritis atau aset hilang.
6. Build dan pemeriksaan rilis dilaporkan sesuai eksekusi sebenarnya.

## Keputusan ruang lingkup

Pada 15 Oktober 2026, sasaran ditetapkan menjadi siswa SD umum kelas 3–6. Ini perubahan posisi dan dokumentasi, bukan penulisan ulang mekanik atau kurikulum. Prompt, laporan, dan commit lama yang menyebut sasaran pendidikan khusus tetap menjadi bukti historis.

## Referensi

[Pedagogi](pedagogy.md), [mekanik](gameplay.md), [desain dan aksesibilitas](design.md), [arsitektur dan kualitas](technical.md), [panduan agen](../AGENTS.md).
