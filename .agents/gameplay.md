# Mekanik Permainan: Kotak-Katik

Kontrak rilis 15 Oktober 2026 untuk siswa SD kelas 3–6. Pertahankan mekanik, command system, kurikulum, dan aset saat ini.

## Dunia dan tujuan

Kucing berada pada petak grid dengan posisi logis x/z dan orientasi north/east/south/west. Level menetapkan petak sah, posisi awal, ikan, perintah tersedia, program awal, dan batas slot bila ada. Tujuan adalah mengambil seluruh ikan melalui program yang valid. Proyeksi ortografis hanya menampilkan state, bukan menentukan arah.

## Perintah

| Perintah | Aturan |
| --- | --- |
| Maju | Satu petak mengikuti orientasi kucing saat itu |
| Kiri | Putar 90° ke kiri di petak yang sama |
| Kanan | Putar 90° ke kanan di petak yang sama |
| Ulangi | Jalankan isi 2, 3, atau 4 kali sesuai pilihan tahap |

Isi Ulangi hanya perintah primitif, tanpa loop bersarang. Kiri diberi cyan, Kanan orange, disertai panah/label. Jangan mengganti arah relatif kucing dengan arah layar.

## Editor dan eksekusi

Pilih slot +, lalu pilih perintah. Pemilihan blok dan kontrol kontekstual mendukung penggantian, penyisipan, pengurutan, dan penghapusan sesuai konteks. Header Ulangi menampilkan jumlah; edit isi memilih badan loop. Kebijakan tahap terbimbing melindungi program awal dan memusatkan tindakan.

Run menjalankan program dengan tempo yang dikendalikan store. Step menjalankan tepat satu tindakan primitif, termasuk di dalam Ulangi. Keduanya berbagi interpreter dan aturan simulasi. Pada kurikulum, Play/Step tersedia sesuai fase; Step diperkenalkan pada debugging dan tantangan campuran. Fixture teknik menyediakan keduanya.

Program adalah data bertipe. Level dan program sama selalu menghasilkan state/hasil sama. Timer mengatur tempo; callback animasi tidak menetapkan aturan. Posisi, orientasi, cursor, blok aktif, iterasi, status, ikan terkumpul, dan completion harus eksplisit.

## Hasil dan pemulihan

- Maju ke petak tidak sah menghentikan eksekusi sebagai gagal. Kucing tetap pada posisi sah terakhir; perintah bermasalah ditandai.
- Ikan dikumpulkan ketika simulasi mencapai petaknya. Renderer mengikuti hasil simulasi.
- Completion memerlukan akhir program valid dan seluruh ikan terkumpul. Mengambil ikan terakhir sebelum tindakan berikutnya yang gagal tidak cukup.
- Stop mempertahankan hasil untuk inspeksi. Run ulang setelah gagal memulai papan awal dengan program dipertahankan.
- Pemilihan/edit perintah mengembalikan papan dan cursor sesuai kebijakan editor. Mulai ulang memulihkan program awal dan cue tahap.
- Inspeksi debugging mengembalikan kondisi awal tanpa mengubah program, kemudian memungkinkan Step.
- Keluar tahap membatalkan pekerjaan Run/demo tertunda. Replay bersih; animasi lama tidak boleh mengubah tahap baru.

## Pembelajaran dan progres

Ada 16 tahap tetap. I Do memakai aksi engine nyata; We Do menyediakan pekerjaan awal; You Do memberi ruang solusi mandiri. Debugging memperlihatkan percobaan sebelum bantuan perbaikan.

Ekspedisi mengikuti urutan yang ditulis, dengan status locked/available/current/completed. Selesai membuka tahap berikutnya. Lewati contoh hanya berlaku pada demonstrasi dan membuka kelanjutan tanpa completion. Lanjut tersedia setelah selesai atau skip eksplisit. Tahap selesai dapat dimainkan ulang.

Progres menyimpan tahap selesai, terbuka, dan pilihan resume. Program, posisi, dan cursor tidak dipulihkan sebagai sesi eksekusi. Preview level/fixture tidak memberikan progres ekspedisi.

## Umpan balik dan verifikasi

Tindakan, orientasi, ikan, tabrakan, blok aktif, iterasi, dan hasil harus terlihat tanpa audio. Gunakan Bahasa Indonesia pendek sesuai kemampuan baca kelas 3–6. Reduced motion mempertahankan state/cue tanpa interpolasi dekoratif.

Periksa gerak/arah, tabrakan, loops, Run/Step, retry/reset, completion, dan progres jika terpengaruh perubahan. Jangan mengubah aturan demi screenshot atau melemahkan test.

[Produk/MDS](product.md), [pedagogi](pedagogy.md), [desain dan aksesibilitas](design.md), [arsitektur dan kualitas](technical.md).
