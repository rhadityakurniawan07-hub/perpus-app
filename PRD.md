# PRODUCT REQUIREMENTS DOCUMENT (PRD)
## PinjamanBuku — Sistem Informasi Perpustakaan

**Versi:** 1.0  
**Status:** Draft  
**Jenis Produk:** Website  
**Target Pengguna:** Siswa, anggota perpustakaan, dan petugas perpustakaan  
**Platform:** Web Desktop dan Mobile

---

## 1. Ringkasan Produk

PinjamanBuku adalah website sistem informasi perpustakaan yang dirancang untuk mempermudah pengelolaan koleksi buku, data anggota, peminjaman, dan pengembalian buku secara digital.

Website menyediakan dua area utama:

1. **Halaman Anggota:** Untuk mencari buku, melihat ketersediaan, mengajukan peminjaman, dan melihat riwayat.
2. **Dashboard Admin:** Untuk mengelola buku, anggota, transaksi peminjaman, pengembalian, dan laporan.

Website ini berfokus pada perpustakaan sekolah atau perpustakaan umum yang memiliki koleksi buku fisik.

Peminjaman tetap dilakukan dengan mengambil buku secara langsung di perpustakaan. Website digunakan untuk mencari buku dan mengelola proses administrasinya.

## 2. Latar Belakang Masalah

Pengelolaan perpustakaan secara manual dapat menimbulkan beberapa masalah:

- Pencatatan buku masih menggunakan buku tulis atau spreadsheet.
- Anggota kesulitan mengetahui ketersediaan buku.
- Petugas membutuhkan waktu untuk mencari data peminjaman.
- Pengembalian buku terlambat sulit dipantau.
- Riwayat peminjaman tidak tersimpan dengan rapi.
- Pengelolaan stok buku berisiko tidak akurat.

PinjamanBuku dibuat untuk menyediakan sistem yang lebih terorganisir, mudah digunakan, dan dapat diakses melalui browser.

## 3. Tujuan Produk

Tujuan utama pengembangan website:

- Mempermudah pencarian koleksi buku.
- Mempercepat proses administrasi perpustakaan.
- Menyediakan informasi stok buku yang akurat.
- Mempermudah pencatatan peminjaman dan pengembalian.
- Membantu petugas memantau keterlambatan.
- Menyediakan laporan aktivitas perpustakaan.

## 4. Target Pengguna

### 4.1 Admin / Petugas Perpustakaan

Admin bertanggung jawab mengelola seluruh aktivitas perpustakaan.

Kebutuhan:
- Mengelola data buku.
- Mengelola data anggota.
- Memproses peminjaman dan pengembalian.
- Memantau stok buku.
- Melihat laporan dan riwayat transaksi.

### 4.2 Anggota / Siswa

Anggota menggunakan website untuk mencari dan meminjam buku.

Kebutuhan:
- Mencari buku berdasarkan judul atau penulis.
- Melihat detail dan ketersediaan buku.
- Mengajukan peminjaman.
- Melihat status peminjaman.
- Melihat tanggal pengembalian.
- Melihat riwayat peminjaman.

## 5. Ruang Lingkup Produk

### 5.1 Fitur yang Termasuk dalam MVP

MVP adalah versi awal website yang memiliki fitur inti dan dapat digunakan.

- Halaman beranda.
- Katalog buku.
- Pencarian dan filter buku.
- Detail buku.
- Login admin dan anggota.
- Dashboard admin.
- CRUD data buku.
- CRUD data anggota.
- Pengajuan peminjaman.
- Persetujuan peminjaman oleh admin.
- Pencatatan pengembalian.
- Status ketersediaan buku.
- Riwayat peminjaman.
- Peringatan keterlambatan.
- Dashboard statistik sederhana.

### 5.2 Fitur di Luar MVP

Fitur berikut dapat dikembangkan pada versi selanjutnya:

- Pembayaran denda online.
- Scan barcode atau QR Code.
- Notifikasi email atau WhatsApp.
- Reservasi antrean buku.
- Export laporan PDF dan Excel.
- Rekomendasi buku otomatis.
- Pembacaan e-book langsung di website.
- Integrasi dengan sistem perpustakaan lain.

## 6. Struktur Halaman Website

### Halaman Publik dan Anggota

| Halaman | Fungsi |
|---|---|
| Beranda | Menampilkan informasi dan buku populer |
| Katalog Buku | Menampilkan koleksi buku |
| Detail Buku | Informasi lengkap buku |
| Login | Masuk ke akun |
| Register | Pendaftaran anggota |
| Dashboard Anggota | Ringkasan peminjaman |
| Peminjaman Saya | Daftar peminjaman aktif |
| Riwayat | Riwayat peminjaman |
| Profil | Informasi akun anggota |

### Halaman Admin

| Halaman | Fungsi |
|---|---|
| Dashboard | Statistik perpustakaan |
| Data Buku | Mengelola koleksi buku |
| Data Anggota | Mengelola anggota |
| Pengajuan | Memproses permintaan pinjam |
| Peminjaman | Mengelola transaksi aktif |
| Pengembalian | Memproses buku kembali |
| Riwayat Transaksi | Melihat transaksi sebelumnya |
| Laporan | Statistik dan laporan |
| Pengaturan | Mengatur aturan peminjaman |

## 7. Kebutuhan Fungsional

### FR-01: Autentikasi Pengguna

Sistem harus menyediakan login dan logout.

- Admin dan anggota memiliki hak akses berbeda.
- Password disimpan dalam bentuk hash.
- Pengguna hanya dapat mengakses halaman sesuai perannya.
- Anggota tidak dapat membuka dashboard admin.

### FR-02: Katalog Buku

Sistem harus menampilkan daftar buku yang tersedia.

Informasi buku:
- Judul buku.
- Penulis.
- Penerbit.
- Tahun terbit.
- Kategori.
- ISBN (opsional).
- Deskripsi.
- Gambar sampul.
- Lokasi rak.
- Jumlah stok.
- Jumlah buku tersedia.

### FR-03: Pencarian dan Filter Buku

Anggota dapat:

- Mencari buku berdasarkan judul.
- Mencari berdasarkan penulis.
- Memfilter berdasarkan kategori.
- Memfilter berdasarkan ketersediaan.
- Mengurutkan buku berdasarkan judul atau tahun terbit.

### FR-04: Pengelolaan Buku

Admin dapat:

- Menambahkan buku.
- Melihat detail buku.
- Mengedit informasi buku.
- Menghapus buku.
- Mengatur jumlah stok.
- Mengunggah sampul buku.

Sistem tidak boleh menghapus buku yang masih memiliki transaksi peminjaman aktif.

### FR-05: Pengelolaan Anggota

Admin dapat:

- Menambahkan anggota.
- Mengedit data anggota.
- Melihat detail anggota.
- Menonaktifkan akun anggota.
- Melihat riwayat peminjaman anggota.

### FR-06: Pengajuan Peminjaman

Anggota dapat mengajukan peminjaman buku.

Data pengajuan:
- Anggota.
- Buku yang dipilih.
- Tanggal pengajuan.
- Tanggal rencana peminjaman.
- Status pengajuan.

Status pengajuan:
- Menunggu Persetujuan.
- Disetujui.
- Ditolak.
- Dibatalkan.

Pengajuan hanya dapat dilakukan jika buku tersedia dan anggota memenuhi aturan peminjaman.

### FR-07: Persetujuan Peminjaman

Admin dapat menyetujui atau menolak pengajuan.

Ketika disetujui:
- Sistem membuat transaksi peminjaman.
- Sistem mencatat tanggal pinjam.
- Sistem menentukan tanggal jatuh tempo.
- Stok buku tersedia berkurang.
- Status transaksi berubah menjadi Dipinjam.

Jika stok sudah habis saat admin memproses pengajuan, sistem harus menolak persetujuan dan menampilkan pesan.

### FR-08: Pengembalian Buku

Admin dapat memproses pengembalian buku.

Sistem harus:
- Mencatat tanggal pengembalian.
- Mengubah status menjadi Dikembalikan.
- Menambah stok buku tersedia.
- Menghitung keterlambatan jika melewati jatuh tempo.
- Menyimpan transaksi ke riwayat.

### FR-09: Riwayat Peminjaman

Anggota dapat melihat riwayat peminjaman miliknya sendiri.

Admin dapat melihat seluruh transaksi.

Informasi riwayat:
- Nama anggota.
- Judul buku.
- Tanggal pinjam.
- Tanggal jatuh tempo.
- Tanggal kembali.
- Status transaksi.

### FR-10: Dashboard Admin

Dashboard menampilkan:

- Total koleksi buku.
- Total anggota.
- Buku sedang dipinjam.
- Pengajuan menunggu.
- Buku terlambat dikembalikan.
- Aktivitas transaksi terbaru.
- Buku populer.

### FR-11: Laporan

Admin dapat melihat laporan berdasarkan rentang tanggal.

Laporan meliputi:
- Jumlah peminjaman.
- Jumlah pengembalian.
- Buku paling sering dipinjam.
- Anggota paling aktif.
- Daftar keterlambatan.

## 8. Aturan Bisnis

Aturan awal yang digunakan:

1. Anggota harus login untuk mengajukan peminjaman.
2. Anggota hanya dapat meminjam buku yang tersedia.
3. Maksimal peminjaman awal adalah 3 buku per anggota.
4. Durasi peminjaman awal adalah 7 hari.
5. Admin dapat mengubah aturan tersebut melalui pengaturan.
6. Buku yang sedang dipinjam tidak dapat dipinjam oleh anggota lain jika stok tersedia habis.
7. Pengajuan yang belum disetujui tidak mengurangi stok.
8. Stok berkurang ketika peminjaman disetujui.
9. Stok bertambah ketika buku dikembalikan.
10. Buku yang terlambat diberi status Terlambat.
11. Anggota yang memiliki peminjaman terlambat dapat dibatasi dari peminjaman baru.
12. Penghapusan data buku atau anggota harus mempertimbangkan riwayat transaksi.

## 9. Kebutuhan Non-Fungsional

### NFR-01: Kemudahan Penggunaan

- Antarmuka sederhana dan mudah dipahami.
- Bahasa utama menggunakan Bahasa Indonesia.
- Navigasi konsisten.
- Formulir menampilkan pesan validasi yang jelas.

### NFR-02: Responsif

Website harus dapat digunakan pada:
- Laptop dan desktop.
- Tablet.
- Smartphone.

### NFR-03: Keamanan

- Password harus di-hash.
- Halaman admin dilindungi autentikasi.
- Hak akses diperiksa di server.
- Input pengguna divalidasi.
- Data pribadi anggota tidak ditampilkan kepada pengguna lain.

### NFR-04: Performa

- Halaman utama ditargetkan dapat dimuat dalam waktu sekitar 3 detik pada koneksi normal.
- Pencarian buku harus terasa cepat.
- Tabel data menggunakan pagination jika jumlah data besar.

### NFR-05: Keandalan Data

- Data transaksi harus tersimpan secara konsisten.
- Perubahan stok harus sesuai dengan transaksi.
- Sistem mencegah stok menjadi negatif.
- Database harus memiliki mekanisme backup.

## 10. Rancangan Database

### Tabel User

| Field | Keterangan |
|---|---|
| id | ID pengguna |
| name | Nama lengkap |
| email | Email unik |
| password | Password hash |
| role | ADMIN atau MEMBER |
| status | Aktif atau Nonaktif |
| createdAt | Tanggal dibuat |

### Tabel Book

| Field | Keterangan |
|---|---|
| id | ID buku |
| title | Judul buku |
| author | Penulis |
| publisher | Penerbit |
| category | Kategori |
| isbn | ISBN opsional |
| year | Tahun terbit |
| description | Deskripsi |
| coverImage | Gambar sampul |
| totalStock | Total stok |
| availableStock | Stok tersedia |
| shelfLocation | Lokasi rak |

### Tabel Loan

| Field | Keterangan |
|---|---|
| id | ID transaksi |
| userId | Anggota |
| bookId | Buku |
| requestDate | Tanggal pengajuan |
| borrowDate | Tanggal pinjam |
| dueDate | Tanggal jatuh tempo |
| returnDate | Tanggal pengembalian |
| status | Status transaksi |

### Tabel Category

| Field | Keterangan |
|---|---|
| id | ID kategori |
| name | Nama kategori |
| description | Deskripsi |

Relasi:
- Satu anggota dapat memiliki banyak transaksi peminjaman.
- Satu buku dapat muncul pada banyak transaksi.
- Satu kategori dapat memiliki banyak buku.

## 11. Rekomendasi Teknologi

Untuk versi yang akan dikembangkan menjadi website online:

- **Frontend:** Next.js dan React.
- **Styling:** Tailwind CSS.
- **Backend:** Next.js API / Server Actions.
- **Database:** PostgreSQL.
- **ORM:** Prisma.
- **Autentikasi:** Sistem login dengan role admin dan anggota.
- **Deployment:** Vercel atau hosting sejenis.
- **Database hosting:** PostgreSQL managed service.

Untuk tahap belajar paling awal, tampilan dan interaksi dapat dibuat dengan HTML, CSS, JavaScript, serta LocalStorage. Namun, LocalStorage hanya untuk prototype dan tidak boleh digunakan sebagai penyimpanan utama data perpustakaan online.

## 12. Kriteria Keberhasilan

MVP dianggap berhasil jika:

- Admin dapat login.
- Admin dapat melakukan CRUD buku.
- Admin dapat mengelola anggota.
- Anggota dapat mencari buku.
- Anggota dapat mengajukan peminjaman.
- Admin dapat menyetujui pengajuan.
- Stok berubah sesuai transaksi.
- Admin dapat memproses pengembalian.
- Anggota dapat melihat riwayat peminjaman.
- Website dapat digunakan pada laptop dan HP.
- Data tetap tersimpan setelah pengguna logout dan login kembali.

## 13. Tahapan Pengembangan

### Tahap 1 — UI/UX
Membuat desain dashboard, sidebar, navbar, katalog, dan tabel.

### Tahap 2 — Data Buku
Membuat CRUD buku, pencarian, filter, dan detail buku.

### Tahap 3 — Data Anggota
Membuat pengelolaan anggota dan akun.

### Tahap 4 — Transaksi
Membuat pengajuan, persetujuan, peminjaman, dan pengembalian.

### Tahap 5 — Database
Menghubungkan aplikasi ke PostgreSQL menggunakan Prisma.

### Tahap 6 — Autentikasi
Menerapkan login dan pembatasan akses berdasarkan role.

### Tahap 7 — Testing dan Deployment
Menguji seluruh fitur, memperbaiki bug, dan mempublikasikan website.

## 14. Kesimpulan

PinjamanBuku merupakan website sistem informasi perpustakaan yang bertujuan mempermudah pengelolaan buku dan transaksi peminjaman.

Fokus utama MVP adalah katalog buku, pengelolaan anggota, peminjaman, pengembalian, dan dashboard admin.

Pengembangan dilakukan secara bertahap agar proyek tetap realistis untuk pemula, tetapi memiliki fondasi yang baik untuk dikembangkan menjadi aplikasi perpustakaan yang lebih lengkap.

