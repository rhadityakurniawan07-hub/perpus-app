# PinjamanBuku - Sistem Informasi Perpustakaan

Website sistem informasi perpustakaan untuk mempermudah pengelolaan koleksi buku, data anggota, peminjaman, dan pengembalian buku secara digital. Dirancang untuk perpustakaan sekolah atau perpustakaan umum yang memiliki koleksi buku fisik.

## Deskripsi

PinjamanBuku menyediakan dua area utama:

- **Halaman Anggota** - Untuk mencari buku, melihat ketersediaan, mengajukan peminjaman, dan melihat riwayat peminjaman
- **Dashboard Admin** - Untuk mengelola buku, anggota, transaksi peminjaman, pengembalian, dan laporan

Peminjaman tetap dilakukan dengan mengambil buku secara langsung di perpustakaan. Website digunakan untuk mencari buku dan mengelola proses administrasinya.

## Teknologi

Berdasarkan rekomendasi PRD:

- **Frontend:** [Next.js](https://nextjs.org/) dan [React](https://react.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Backend:** Next.js API Routes / Server Actions
- **Database:** [PostgreSQL](https://www.postgresql.org/)
- **ORM:** [Prisma](https://www.prisma.io/)
- **Autentikasi:** Role-based (Admin dan Anggota)
- **Deployment:** [Vercel](https://vercel.com/) dengan PostgreSQL managed service

## Fitur

### MVP (Minimum Viable Product)

#### Untuk Publik & Anggota
- Beranda
- Katalog buku dengan pencarian dan filter
- Detail buku
- Login dan registrasi anggota
- Dashboard anggota
- Pengajuan peminjaman
- Daftar peminjaman aktif
- Riwayat peminjaman
- Profil anggota

#### Untuk Admin/Petugas
- Dashboard dengan statistik
- CRUD data buku
- CRUD data anggota
- Persetujuan/penolakan pengajuan peminjaman
- Pencatatan peminjaman dan pengembalian
- Riwayat transaksi
- Laporan (peminjaman, pengembalian, buku populer, anggota aktif, keterlambatan)
- Pengaturan aturan peminjaman
- Peringatan keterlambatan

### Fitur di Luar MVP
- Pembayaran denda online
- Scan barcode atau QR Code
- Notifikasi email atau WhatsApp
- Reservasi antrean buku
- Export laporan PDF dan Excel
- Rekomendasi buku otomatis
- Pembacaan e-book
- Integrasi dengan sistem perpustakaan lain

## Struktur Database

### User
| Field | Tipe | Keterangan |
|---|---|---|
| id | String/Int | ID pengguna |
| name | String | Nama lengkap |
| email | String | Email unik |
| password | String | Password (hash) |
| role | Enum | `ADMIN` atau `MEMBER` |
| status | Enum | `ACTIVE` atau `INACTIVE` |
| createdAt | DateTime | Tanggal dibuat |

### Book
| Field | Tipe | Keterangan |
|---|---|---|
| id | String/Int | ID buku |
| title | String | Judul buku |
| author | String | Penulis |
| publisher | String | Penerbit |
| category | String/Relation | Kategori |
| isbn | String (opsional) | ISBN |
| year | Int | Tahun terbit |
| description | Text | Deskripsi |
| coverImage | String (opsional) | URL gambar sampul |
| totalStock | Int | Total stok |
| availableStock | Int | Stok tersedia |
| shelfLocation | String | Lokasi rak |

### Loan
| Field | Tipe | Keterangan |
|---|---|---|
| id | String/Int | ID transaksi |
| userId | FK | Relasi ke User |
| bookId | FK | Relasi ke Book |
| requestDate | DateTime | Tanggal pengajuan |
| borrowDate | DateTime (nullable) | Tanggal pinjam |
| dueDate | DateTime (nullable) | Tanggal jatuh tempo |
| returnDate | DateTime (nullable) | Tanggal pengembalian |
| status | Enum | Status transaksi |

### Category
| Field | Tipe | Keterangan |
|---|---|---|
| id | String/Int | ID kategori |
| name | String | Nama kategori |
| description | String (opsional) | Deskripsi |

**Relasi:**
- User 1:N Loan
- Book 1:N Loan
- Category 1:N Book

## Aturan Bisnis

- Anggota harus login untuk mengajukan peminjaman
- Anggota hanya dapat meminjam buku yang tersedia
- Maksimal peminjaman: **3 buku per anggota**
- Durasi peminjaman: **7 hari** (dapat diubah oleh admin)
- Stok berkurang saat peminjaman disetujui, bertambah saat buku dikembalikan
- Pengajuan yang belum disetujui tidak mengurangi stok
- Buku tidak dapat dihapus jika masih memiliki transaksi aktif
- Anggota dengan peminjaman terlambat dapat dibatasi dari peminjaman baru
- Sistem mencegah stok menjadi negatif

## Status Transaksi

| Status | Keterangan |
|---|---|
| Menunggu Persetujuan | Pengajuan baru, menunggu persetujuan admin |
| Disetujui/Dipinjam | Sudah disetujui dan buku sedang dipinjam |
| Ditolak | Pengajuan ditolak oleh admin |
| Dibatalkan | Dibatalkan oleh anggota |
| Dikembalikan | Buku sudah dikembalikan |
| Terlambat | Melewati tanggal jatuh tempo |

## Kriteria Keberhasilan MVP

- [ ] Admin dapat login
- [ ] Admin dapat CRUD buku dan anggota
- [ ] Anggota dapat mencari dan melihat detail buku
- [ ] Anggota dapat mengajukan peminjaman
- [ ] Admin dapat menyetujui/menolak pengajuan
- [ ] Stok buku berubah sesuai transaksi (berkurang saat disetujui, bertambah saat dikembalikan)
- [ ] Admin dapat memproses pengembalian
- [ ] Anggota dapat melihat riwayat peminjaman
- [ ] Website responsif (desktop, tablet, mobile)
- [ ] Data tersimpan konsisten di database

## Tahapan Pengembangan

1. **UI/UX** - Desain dashboard, sidebar, navbar, katalog, dan tabel
2. **Data Buku** - CRUD buku, pencarian, filter, dan detail buku
3. **Data Anggota** - Pengelolaan anggota dan akun
4. **Transaksi** - Pengajuan, persetujuan, peminjaman, dan pengembalian
5. **Database** - Integrasi PostgreSQL dengan Prisma
6. **Autentikasi** - Login dan pembatasan akses berdasarkan role
7. **Testing & Deployment** - Pengujian, perbaikan bug, dan publikasi

## Memulai Pengembangan

```bash
# Install dependencies
npm install

# Setup environment variables
cp .env.example .env

# Setup database
npx prisma migrate dev
npx prisma generate

# Jalankan development server
npm run dev
```

## Lisensi

Proyek ini dikembangkan untuk tujuan pembelajaran.

---

**Versi:** 1.0 | **Status:** Draft | **Platform:** Web (Desktop & Mobile)