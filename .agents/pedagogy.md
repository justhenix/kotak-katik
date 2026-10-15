# Desain Pembelajaran: Kotak-Katik

Panduan rilis 15 Oktober 2026 untuk siswa SD kelas 3–6. Anak dapat membaca instruksi singkat berbahasa Indonesia, tanpa pengalaman pemrograman. Pengujian perangkat lunak tidak membuktikan peningkatan kemampuan belajar.

## Siklus belajar

**Rencanakan → Susun perintah → Jalankan → Amati → Perbaiki → Coba lagi.**

Anak memprediksi hasil, mengamati tindakan kucing, membandingkan hasil dengan tujuan, lalu mengoreksi program. Ikan memberi tujuan konkret; hubungan perintah, tindakan, dan hasil harus terlihat.

## I Do / We Do / You Do

- **I Do:** contoh otomatis menempatkan dan menjalankan perintah melalui aksi game/interpreter yang sama dengan pemain. Contoh dapat diulang atau dilewati; skip membuka kelanjutan tanpa completion.
- **We Do:** program awal menyiapkan sebagian pekerjaan. Sorotan/penunjuk mengarahkan satu interaksi relevan. Bagian yang sudah disiapkan dilindungi sesuai kebijakan tahap. Anak tetap melakukan tindakan dan melihat hasil percobaannya.
- **You Do:** anak menyusun solusi mandiri. Arahan prosedural berkurang; orientasi, status eksekusi, hasil, dan aksesibilitas tetap tersedia.

Bantuan mengikuti metadata tahap dan kondisi percobaan. Jangan menambah paragraf tutorial, menampilkan seluruh kontrol sekaligus, atau menjadikan tahap mandiri penyalinan solusi.

## Kurikulum yang diimplementasikan

Sumber: src/game/levels/curriculum.ts. Pertahankan urutan 16 tahap.

| Tahap | ID | Fokus dan fase |
| --- | --- | --- |
| 1 | m2-move-watch | Maju satu petak, contoh |
| 2 | m2-move-try | Melengkapi Maju, terbimbing |
| 3 | m2-sequence-watch | Urutan tindakan, contoh |
| 4 | m2-sequence-build | Menyusun urutan, mandiri |
| 5 | m2-left-watch | Kiri relatif, contoh |
| 6 | m2-right-together | Kanan relatif, terbimbing |
| 7 | m2-turn-alone | Arah dan langkah, mandiri |
| 8 | m2-path-together | Dua belokan, terbimbing |
| 9 | m2-path-alone | Jalur gabungan, mandiri |
| 10 | m2-repeat-watch | Pengulangan, contoh |
| 11 | m2-repeat-together | Jumlah pengulangan, terbimbing |
| 12 | m2-repeat-alone | Pola gerak/belokan, mandiri |
| 13 | m2-debug-watch | Amati, periksa, ubah, contoh |
| 14 | m2-debug-together | Koreksi program awal, terbimbing |
| 15 | m2-debug-alone | Memeriksa Ulangi, mandiri |
| 16 | m2-mixed-journey | Konsep gabungan, mandiri |

Kesulitan berasal dari urutan, perubahan arah, pola, batas slot, dan letak kesalahan. Jangan membuatnya bergantung pada tekanan waktu, refleks, jalur panjang saja, teks panjang, atau kontrol kecil.

## Tujuan dan bukti yang dapat diamati

Anak menghubungkan Maju dengan satu petak, membedakan berputar dari berpindah, memprediksi urutan pendek, mengenali pola berulang, serta menemukan ketidaksesuaian program/tujuan. Debugging memperlihatkan percobaan sebelum perbaikan dan menyediakan pemeriksaan per langkah, termasuk isi Ulangi.

Completion adalah hasil permainan, bukan skor kemampuan atau bukti penguasaan kurikulum sekolah. Tidak ada hukuman, peringkat, atau batas jumlah percobaan.

## Kesalahan, bantuan, dan bahasa

Pertahankan hasil gagal agar dapat diperiksa. Tunjukkan tindakan bermasalah dengan cue dan teks konkret. Jangan langsung memberikan solusi. Anak dapat mengedit dan menjalankan ulang dari kondisi awal.

Gunakan Maju, Kiri, Kanan, Ulangi, Jalankan, dan Lanjut secara konsisten. Instruksi menjelaskan tindakan saat ini. Ikon/warna/animasi mendukung teks; informasi utama tersedia tanpa audio. Penunjuk tangan adalah pointer UI, bukan materi bahasa isyarat.

## Batas dan referensi

Pivot sasaran 15 Oktober 2026 mempertahankan tahap dan perilaku belajar. Uji pemahaman anak/guru serta perangkat fisik belum dilakukan dalam pengumpulan ini. Feature freeze membatasi pekerjaan pada dokumentasi dan penghalang rilis.

[Produk/MDS](product.md), [mekanik](gameplay.md), [desain dan aksesibilitas](design.md), [arsitektur dan kualitas](technical.md).
