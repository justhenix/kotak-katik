# UI/UX dan Aksesibilitas: Kotak-Katik

Panduan rilis 15 Oktober 2026 untuk siswa SD kelas 3–6. Menggabungkan arahan visual dan prinsip aksesibilitas yang berlaku dari panduan sebelumnya. Ini standar pemeliharaan, bukan klaim sertifikasi atau hasil uji pengguna.

## Identitas dan hierarki

Pertahankan diorama mainan pastel low-poly, petak tebal, material matte, kucing sebagai karakter utama, dan ikan sebagai tujuan. Papan harus terbaca di atas dekorasi. Kamera ortografis isometrik/aksonometrik stabil; batas petak dan orientasi tidak boleh disamarkan.

ENERGY 2 / RHYTHM 2 / MOTION 2: hangat, tenang, gerak singkat yang menjelaskan aksi. Satu tugas utama per layar. Pertahankan workbench dan blok perintah yang sudah ada; tidak ada desain ulang rilis.

## Aset dan lingkungan

Pertahankan model kucing/ikan yang sudah dikurasi serta atribusinya. Dedaunan prosedural asli di src/scene/title/Dressing.tsx dan src/scene/Environment/ToyboxDressing.tsx adalah bagian identitas. Jangan mengintegrasikan henix/quaternius-foliage-ground atau mengimpor aset baru.

Pohon, pulau kecil, awan, dan bayangan memberi konteks tanpa menutupi petak, ikan, karakter, arah, atau kontrol. Gunakan siluet sederhana, warna pastel, dan ruang yang cukup. Hindari partikel ramai, kilatan cepat, atau guncangan kamera.

## Warna, tipografi, dan state

- Kiri cyan; Kanan orange. Arah juga diberikan lewat panah, label, dan orientasi karakter.
- Pertahankan Maju kuning, Play hijau, serta bentuk blok berlekuk yang tersambung.
- Gunakan teks gelap yang terbaca pada permukaan terang. Pastel dan teks putih tidak otomatis cukup kontras.
- Fredoka untuk judul singkat; Inter untuk kontrol dan informasi. Ukuran, jarak, dan pembungkusan mendukung pembacaan anak.
- Bedakan selected, fokus keyboard, eksekusi, dan error melalui outline, bentuk, label, atau posisi; jangan bergantung pada warna saja.
- Informasi penting tetap tersedia untuk diperiksa, bukan hanya animasi sesaat atau tooltip.

## Interaksi dan bahasa

Pakai kontrol semantik berlabel dan ikon konsisten. Tap-to-add tersedia; drag/hover bukan prasyarat. Gunakan teks konkret: Mulai, Maju, Kiri, Kanan, Ulangi, Lanjut. Label aksesibel menjelaskan aksi/posisi. Hindari jargon dan ikon tanpa penjelasan.

Kontrol inti menargetkan area minimal 44 × 44 CSS px. Keyboard dapat menjangkau dan mengaktifkan tombol dengan fokus terlihat. Penunjuk tutorial tidak mencegat input. Pembatasan tahap terbimbing tetap menyediakan navigasi, replay, dan hasil.

## Responsif

Papan, program, dan kontrol menyesuaikan layar; mobile dapat menumpuk panel. Pertahankan keterbacaan petak/orientasi dan keterjangkauan Play. Blok pertama/terakhir tidak terpotong. Tidak ada page-wide horizontal overflow; strip program boleh menggulir lokal. Teks besar/layar pendek boleh memerlukan gulir vertikal.

Periksa desktop 1440 px, mobile 390 × 844, dan narrow mobile 320 × 740 bila terpengaruh. Emulasi browser tidak membuktikan performa perangkat fisik.

## Aksesibilitas yang dipertahankan

Eksekusi, putaran, tabrakan, pengambilan ikan, completion, dan progres memiliki umpan balik visual tanpa audio. Reduced motion mengurangi interpolasi/animasi pointer, mempertahankan orientasi, blok aktif, iterasi, dan pesan hasil.

Pakai HTML semantik, nama aksesibel, fokus yang masuk akal setelah navigasi/dialog, dan konfirmasi sebelum hapus progres. Batal mempertahankan progres. Bila penyimpanan gagal, tampilkan pemberitahuan dan izinkan sesi berlanjut.

Tidak ada materi bahasa isyarat terintegrasi atau klaim validasinya. Pointer tangan adalah petunjuk UI. Jangan mengklaim efektivitas pendidikan khusus atau kepatuhan aksesibilitas menyeluruh.

## Batas dan referensi

Pivot sasaran 15 Oktober 2026 tidak menghapus aksesibilitas fungsional. Feature freeze hanya mengizinkan koreksi penghalang rilis. Bukti visual harus berasal dari game nyata dengan tanggal/konteks jujur.

[Produk/MDS](product.md), [pedagogi](pedagogy.md), [mekanik](gameplay.md), [arsitektur dan kualitas](technical.md).
