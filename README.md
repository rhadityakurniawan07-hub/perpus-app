# PERPUS — Katalog, Rating & Jejak Membaca

Website sistem informasi katalog dan ulasan buku untuk mempermudah pengelolaan koleksi buku, pencarian, dan pencatatan jejak membaca secara digital. Dibuat untuk perpustakaan sekolah, kampus, atau komunitas literasi.

## Apa itu PERPUS?

PERPUS adalah website katalog & ulasan buku yang menyediakan dua area utama:

- **Halaman Publik & Anggota** — mencari buku, membaca detail, memberikan rating & ulasan, serta mencatat status baca (Ingin Dibaca / Sedang Dibaca / Sudah Selesai).
- **Dashboard Admin (tersembunyi)** — mengelola buku, anggota, serta memantau statistik katalog & ulasan.

> **Catatan:** Konsep sebelumnya (v1.0, "PinjamanBuku") berbasis peminjaman buku fisik telah digantikan oleh konsep **Katalog & Ulasan** (v2.0). Model `Loan` tetap ada di database untuk kompatibilitas data tetapi disembunyikan dari antarmuka.

## Lingkup

### MVP (Memenuhi PRD v2.0)

#### Publik (semua orang, tanpa login)
- Beranda dengan katalog unggulan
- Katalog lengkap dengan pencarian, filter kategori, filter rating 4.5+, dan sortir (rating/judul/tahun)
- Detail buku (cover, deskripsi, ulasan)
- Panduan Kurasi
- Login & Register

#### Anggota (login)
- Dashboard anggota (statistik baca & ulasan pribadi)
- Koleksi Saya (status baca)
- Ulasan & Rating Saya
- Profil

#### Admin (login role ADMIN)
- Dashboard (statistik katalog & ulasan)
- Manajemen buku (CRUD, impor dari Google Books)
- Manajemen anggota (CRUD, aktif/nonaktif, hapus)
- Riwayat Membaca & Ulasan per anggota

### Fitur di Luar MVP
- Pembayaran denda online
- Notifikasi (email/WA)
- Export laporan PDF/Excel
- Rekomendasi buku otomatis
- Pembacaan e-book di situs
- Integrasi OPAC/SLIMS

## Teknologi

- **Frontend:** Next.js 14 (App Router) + React + Tailwind CSS
- **Backend:** NestJS 10 + Prisma 5
- **Database:** PostgreSQL 18
- **Autentikasi:** JWT (Bearer token)
- **Monorepo:** Turborepo + Bun
- **Styling:** Tailwind CSS
- **Dokumentasi API:** Swagger (`http://localhost:3001/api`)

## Konsep Fitur

- **Rating & Ulasan** — satu rating per buku per anggota, bisa diubah. Rating rata-rata dihitung ulang setelah setiap ulasan.
- **Reading Tracker** — setiap anggota bisa menandai status baca per buku (Ingin Dibaca / Sedang Dibaca / Sudah Selesai).
- **Google Books Integration** — pencarian live ke Google Books untuk anggota & tamu; auto-import ke katalog saat buku dibuka detailnya.
- **Koleksi PERPUS** — gabungan buku lokal + hasil Google Books (auto-import di detail).

## Struktur Database

### `users`
| Field | Keterangan |
|---|---|
| id | Internal ID |
| name | Nama lengkap |
| email | Email unik |
| password | Hash bcrypt |
| role | `ADMIN` / `MEMBER` |
| status | `ACTIVE` / `INACTIVE` |

### `books`
| Field | Keterangan |
|---|---|
| id | ID buku |
| title | Judul |
| author | Penulis |
| publisher | Penerbit |
| categoryId | FK ke kategori |
| isbn | ISBN unik |
| year | Tahun terbit |
| coverImage | URL cover |
| totalStock / availableStock | Stok |
| averageRating | Rata-rata rating (dihitung) |
| reviewCount | Jumlah ulasan |
| positivePercent | % rating positif |

### `reviews`
| Field | Keterangan |
|---|---|
| id | ID ulasan |
| userId, bookId | FK |
| rating | 1–5 |
| comment | Teks ulasan (opsional) |

### `reading_statuses`
| Field | Keterangan |
|---|---|
| id | ID |
| userId, bookId | FK |
| status | `WISHLIST` / `READING` / `FINISHED` |

## Memulai Pengembangan

```bash
# Clone repo & masuk folder
cd perpus-app

# Install dependencies
bun install

# Generate Prisma Client (jika ada perubahan schema)
cd packages/prisma-client
bun run generate

# Setup env
cp apps/api/.env.example apps/api/.env   # isi DATABASE_URL dll

# Jalankan database (di mesin, perlu PostgreSQL berjalan di port 5432)
# Buat database perpus_db jika belum ada

# Migrasi (hanya jika belum pernah)
cd packages/prisma-client
bun run migrate:dev

# Jalankan apps (backend + frontend)
cd ..
bun run dev
```

Aplikasi berjalan di:
- Frontend: `http://localhost:3000`
- Backend (API): `http://localhost:3001`
- Swagger: `http://localhost:3001/api`

## Kredensial Default (Development)

Semua akun berikut role `ADMIN`:

| Email | Password (hashed) |
|---|---|
| `admin@perpus.co.id` | `130207` (di-hash bcrypt di DB) |
| `admin@cadangan.perpus` | `130207` (di-hash bcrypt di DB) |

> Password sesederhana itu **bukan untuk produksi** — ganti segera setelah deploy.

## Dokumentasi Tambahan

- `ARCHITECTURE.md` — Arsitektur monorepo
- `PRD.md` — Product Requirements (v2.0)
- `apps/api/README.md` — Dokumentasi backend

## Lisensi

Private — untuk keperluan proyek ini.
