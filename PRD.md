# PRODUCT REQUIREMENTS DOCUMENT (PRD)
## PERPUS — Katalog, Rating & Jejak Membaca

**Versi:** 2.0
**Status:** Active
**Jenis Produk:** Website
**Target Pengguna:** Pembaca, siswa, komunitas literasi, dan petugas perpustakaan/kurator
**Platform:** Web Desktop dan Mobile

> **Catatan:** Versi 2.0 menggantikan konsep peminjaman (v1.0) dengan konsep **katalog pencarian buku + rating/ulasan + status baca**. Fitur peminjaman tidak lagi menjadi inti produk; data transaksi peminjaman lama dipertahankan sebagai *legacy* dan disembunyikan dari antarmuka.

---

## 1. Ringkasan Produk

PERPUS adalah website katalog dan ulasan buku yang dirancang untuk membantu pembaca:

1. **Mencari** buku dengan cepat (judul, penulis, kategori, ISBN).
2. **Menilai** buku melalui rating bintang 1–5 dan ulasan tertulis.
3. **Mencatat** jejak membaca (status baca: Ingin Dibaca, Sedang Dibaca, Sudah Selesai).

PERPUS menyediakan dua area utama:

1. **Halaman Publik & Anggota:** katalog, detail buku (modal/halaman), rating & ulasan, koleksi pribadi, ulasan saya.
2. **Dashboard Admin:** statistik katalog & ulasan, pengelolaan buku dan anggota, ringkasan jejak membaca komunitas.

## 2. Latar Belakang

Pembaca sering kesulitan:

- Menemukan buku yang sesuai minat dan kualitasnya.
- Membandingkan buku berdasarkan pengalaman pembaca lain.
- Mencatat buku mana yang sudah/sedang/belum dibaca.

Katalog perpustakaan tradisional hanya menampilkan metadata buku tanpa dimensi kualitas subjektif dan tanpa pencatatan jejak membaca pribadi. PERPUS hadir untuk menjembatani katalog terstruktur dengan ulasan komunitas.

## 3. Tujuan Produk

- Mempermudah pencarian koleksi buku.
- Menyediakan rating & ulasan yang jujur dan terkurasi.
- Membantu pembaca memantau jejak membaca pribadi.
- Menyediakan dashboard ringkas bagi kurator/admin.
- Menjadi fondasi komunitas literasi yang sehat.

## 4. Target Pengguna

### 4.1 Admin / Kurator Perpustakaan

- Mengelola koleksi buku (CRUD, stok, kategori).
- Mengelola anggota.
- Memantau statistik katalog & ulasan.
- Meninjau buku dengan rating terbaik dan ulasan terbaru.

### 4.2 Anggota / Pembaca

- Mencari buku berdasarkan judul/penulis/kategori.
- Melihat detail, rating, dan ulasan buku.
- Memberi rating & ulasan (1 rating per buku).
- Menandai status baca: Ingin Dibaca / Sedang Dibaca / Sudah Selesai.
- Melihat koleksi dan ulasan pribadi.

## 5. Ruang Lingkup Produk

### 5.1 Fitur dalam MVP

- Halaman beranda.
- Katalog buku dengan pencarian, filter kategori, filter rating 4.5+, dan sortir.
- Detail buku (modal interaktif + halaman detail).
- Sistem rating bintang 1–5 dan ulasan tertulis.
- Status jejak membaca per anggota (Wishlist / Reading / Finished).
- Login & register anggota.
- Dashboard anggota (Sedang Dibaca, Sudah Selesai, Ulasan Saya).
- Halaman Koleksi Saya & Ulasan & Rating.
- Dashboard admin (statistik katalog, ulasan terbaru, ringkasan jejak membaca).
- CRUD buku dan anggota (admin).

### 5.2 Fitur di Luar MVP (Selanjutnya)

- Impor katalog massal / integrasi Google Books API (rencana: Task 15).
- Moderasi ulasan (filter kata, laporkan ulasan).
- Rekomendasi buku otomatis berbasis rating.
- Lencana/reputasi pembaca.
- Ekspor laporan (PDF/Excel).
- Pembacaan e-book langsung di situs.
- Peminjaman — **dihentikan** (legacy), tidak dikembangkan.

## 6. Struktur Halaman Website

### Halaman Publik & Anggota

| Halaman | Fungsi |
|---|---|
| Beranda | Pengantar, CTA ke katalog |
| Katalog Buku (`/books`) | Pencarian, filter & sortir, grid kartu buku |
| Detail Buku (`/books/:id` atau modal) | Info lengkap, rating, ulasan, status baca |
| Login (`/login`) | Masuk |
| Register (`/register`) | Pendaftaran anggota |
| Dashboard Anggota (`/dashboard`) | Ringkasan statistik baca & ulasan |
| Koleksi Saya (`/my-collection`) | Buku berdasarkan status baca |
| Ulasan & Rating (`/reviews`) | Ulasan yang ditulis anggota |
| Profil (`/profile`) | Informasi akun |

### Halaman Admin

| Halaman | Fungsi |
|---|---|
| Dashboard (`/admin/dashboard`) | Statistik katalog & ulasan, buku rating tertinggi, ulasan terbaru |
| Data Buku (`/admin/books`) | CRUD buku |
| Data Anggota (`/admin/members`) | CRUD & status anggota |

> **Halaman legacy (tidak ditautkan di navigasi, masih dapat diakses):** `/loans`, `/history`, `/admin/loans/*`.

## 7. Kebutuhan Fungsional

### FR-01: Autentikasi Pengguna

- Sistem harus menyediakan login, logout, dan registrasi.
- Role: `ADMIN` dan `MEMBER`.
- Password disimpan dalam bentuk hash (bcrypt).
- Anggota tidak dapat mengakses halaman admin.

### FR-02: Katalog Buku

Informasi buku yang ditampilkan:
- Judul, penulis, penerbit, tahun terbit, kategori, ISBN (opsional).
- Deskripsi, gambar sampul, lokasi rak.
- Rating rata-rata, jumlah ulasan, dan persentase ulasan positif.

### FR-03: Pencarian dan Filter Buku

Anggota dapat:

- Mencari berdasarkan judul, penulis, dan kata kunci.
- Memfilter berdasarkan kategori.
- Memfilter **Rating 4.5+ Saja**.
- Mengurutkan: **Rating Tertinggi**, Judul A–Z, Tahun Terbaru.

### FR-04: Pengelolaan Buku (Admin)

- Tambah, lihat, edit, dan hapus buku.
- Mengelola jumlah stok dan lokasi rak.
- Mengunggah/menampilkan sampul buku.

### FR-05: Pengelolaan Anggota (Admin)

- Tambah, edit, nonaktifkan/aktifkan, dan hapus anggota.
- Melihat daftar anggota dan profilnya (tanpa password).

### FR-06: Rating & Ulasan

- Anggota memberi **satu rating per buku** (1–5 bintang).
- Anggota dapat menulis ulasan opsional (maks 2.000 karakter).
- Rating yang dikirim dapat diubah (upsert).
- Sistem menghitung ulang `averageRating`, `reviewCount`, dan `positivePercent` per buku.
- Ulasan dapat dihapus oleh penulisnya.
- Halaman detail dan kartu buku menampilkan ringkasan rating.

### FR-07: Status Jejak Membaca

- Anggota menandai status per buku:
  - `WISHLIST` — Ingin Dibaca (belum mulai).
  - `READING` — Sedang Dibaca.
  - `FINISHED` — Sudah Selesai.
- Status dapat diubah kapan saja; diambil per anggota.
- Badge status ditampilkan pada detail buku dan koleksi saya.

### FR-08: Dashboard Anggota

Menampilkan:

- Jumlah buku **Sedang Dibaca**.
- Jumlah buku **Sudah Selesai**.
- Jumlah **Ulasan Saya**.
- Daftar buku Sedang Dibaca dan Ulasan Terbaru Saya.

### FR-09: Dashboard Admin & Laporan

Menampilkan:

- Total Koleksi Buku, Total Anggota, Total Ulasan, Rating Rata-rata.
- Buku Rating Tertinggi.
- Ulasan Terbaru.
- Ringkasan Jejak Membaca komunitas (Wishlist / Sedang Dibaca / Sudah Selesai).

## 8. Aturan Bisnis

1. Anggota harus login untuk memberi rating/ulasan dan mengubah status baca.
2. Satu anggota hanya boleh punya satu rating per buku; mengirim ulang mengubah rating sebelumnya.
3. Rating adalah bilangan bulat 1–5.
4. Ulasan opsional; maks 2.000 karakter.
5. `positivePercent` = persentase ulasan dengan rating ≥ 4 dari seluruh ulasan buku.
6. Status baca per anggota per buku; satu status aktif pada satu waktu.
7. Menghapus ulasan akan menghitung ulang agregat rating buku.
8. Penghapusan buku mempertimbangkan riwayat transaksi peminjaman (legacy).

## 9. Kebutuhan Non-Fungsional

### NFR-01: Kemudahan Penggunaan
- Antarmuka sederhana, navigasi konsisten, Bahasa Indonesia.
- Pesan validasi dan error yang jelas dan ramah.

### NFR-02: Responsif
- Laptop/desktop, tablet, dan smartphone.

### NFR-03: Keamanan
- Password di-hash; halaman admin dilindungi autentikasi + pengecekan role di server.
- Input divalidasi (class-validator di backend, validasi sisi klien di frontend).
- Data pribadi tidak ditampilkan ke pengguna lain.

### NFR-04: Performa
- Katalog terasa cepat; paginasi untuk data besar; detail dan rating dimuat efisien.

### NFR-05: Keandalan Data
- Agregat rating dihitung di server dan disimpan di kolom `Book` untuk performa baca.
- Migrasi database terkelola melalui Prisma Migrate.

## 10. Rancangan Database

### Tabel `users`

| Field | Keterangan |
|---|---|
| id | ID pengguna |
| name | Nama lengkap |
| email | Email unik |
| password | Hash bcrypt |
| role | ADMIN / MEMBER |
| status | ACTIVE / INACTIVE |
| createdAt / updatedAt | Timestamp |

### Tabel `categories`

| Field | Keterangan |
|---|---|
| id | ID kategori |
| name | Nama kategori (unik) |
| description | Deskripsi opsional |

### Tabel `books`

| Field | Keterangan |
|---|---|
| id | ID buku |
| title | Judul |
| author | Penulis |
| publisher | Penerbit |
| categoryId | Relasi ke categories |
| isbn | ISBN unik (opsional) |
| year | Tahun terbit |
| description | Deskripsi |
| coverImage | URL sampul |
| totalStock / availableStock | Informasi stok |
| shelfLocation | Lokasi rak |
| **averageRating** | Rating rata-rata (denormalisasi) |
| **reviewCount** | Jumlah ulasan |
| **positivePercent** | Persen ulasan rating ≥ 4 |

### Tabel `reviews` (baru)

| Field | Keterangan |
|---|---|
| id | ID ulasan |
| userId | Penulis ulasan (relasi users, cascade) |
| bookId | Buku yang diulas (relasi books, cascade) |
| rating | 1–5 |
| comment | Teks ulasan opsional |
| createdAt / updatedAt | Timestamp |

Constraint: `@@unique([userId, bookId])`.

### Tabel `reading_statuses` (baru)

| Field | Keterangan |
|---|---|
| id | ID |
| userId | Anggota |
| bookId | Buku |
| status | WISHLIST / READING / FINISHED |
| createdAt / updatedAt | Timestamp |

Constraint: `@@unique([userId, bookId])`.

### Tabel `loans` — Legacy
Dipertahankan untuk kompatibilitas data lama; tidak dipakai di antarmuka v2.0.

### Relasi
- Satu anggota punya banyak `reviews` dan `reading_statuses`.
- Satu buku punya banyak `reviews` dan `reading_statuses`.
- Satu kategori punya banyak `books`.

## 11. Rekomendasi Teknologi

- **Frontend:** Next.js 14 (App Router) + React + Tailwind CSS.
- **Backend:** NestJS 10 + Prisma 5.
- **Database:** PostgreSQL (lokal: 18.x di port 5432).
- **Autentikasi:** JWT (Bearer token) di localStorage.
- **Ikon:** SVG inline (tanpa dependensi ikon tambahan).

## 12. Kriteria Keberhasilan

MVP dianggap berhasil jika:

- Anggota dapat mencari dan memfilter katalog (termasuk sortir rating & filter 4.5+).
- Anggota dapat membuka detail buku, memberi rating 1–5, dan menulis ulasan.
- Rating dan jumlah ulasan tampil konsisten di kartu, detail, dan dashboard.
- Anggota dapat menandai status baca dan melihatnya di Koleksi Saya.
- Dashboard anggota menampilkan Sedang Dibaca / Sudah Selesai / Ulasan Saya.
- Admin dapat CRUD buku & anggota serta melihat statistik katalog & ulasan.
- Website responsif di laptop dan HP.

## 13. Tahapan Pengembangan

### Tahap 1 — Tema & Desain (Archival Modernist)
Design tokens, komponen dasar, header/footer, kartu buku, badge status, rating bintang.

### Tahap 2 — Database & Backend Rating/Jejak Baca
Migrasi `reviews` & `reading_statuses`, endpoint rating, status baca, dan agregat buku.

### Tahap 3 — Katalog & Detail
Halaman katalog (search/filter/sortir), kartu buku, modal detail interaktif, halaman detail.

### Tahap 4 — Area Anggota
Dashboard (3 kartu), Koleksi Saya, Ulasan & Rating, Profil.

### Tahap 5 — Area Admin
Dashboard admin baru (statistik ulasan), penyembunyian menu transaksi.

### Tahap 6 — Testing & Perbaikan
Verifikasi end-to-end: registrasi → login → cari → rating → status baca → dashboard.

## 14. Kesimpulan

PERPUS v2.0 beralih dari aplikasi peminjaman menjadi **platform katalog & ulasan buku** yang membantu pembaca menemukan bacaan berkualitas, menilainya, dan mencatat jejak membaca. Fokus MVP adalah pencarian, rating/ulasan, status baca, serta dashboard anggota dan admin — dengan tetap membuka jalan bagi integrasi Google Books API pada tahap berikutnya.
