# PERPUS API

Backend API untuk **PERPUS — Katalog, Rating & Jejak Membaca**, dibangun dengan NestJS, Prisma, dan PostgreSQL.

## Teknologi

- NestJS 10
- Prisma 5
- PostgreSQL 18 (lokal, port 5432, auth `trust`)
- JWT (Bearer token, 7 hari)
- class-validator / class-transformer
- Swagger (`/api`)

## Struktur

```text
src/
├─ auth/            login, register, JWT strategy
├─ books/           CRUD buku + auto-import Google Books
├─ google-books/    proxy Google Books API (admin & publik)
├─ reviews/         rating, ulasan, status baca
├─ reading/         (via reviews module: /reading/me)
├─ members/         CRUD anggota (admin)
├─ loans/           legacy peminjaman (dipertahankan, tidak ditautkan di UI baru)
├─ reports/         statistik katalog & ulasan (admin)
├─ categories/      daftar kategori
├─ settings/        pengaturan
├─ common/          guards, decorators
├─ prisma/          PrismaService
└─ main.ts          entry point
```

## Konfigurasi Environment

Salin `.env.example` menjadi `.env`, lalu isi:

```env
DATABASE_URL="postgresql://postgres@127.0.0.1:5432/perpus_db?schema=public"
JWT_SECRET=<rahasia>
JWT_EXPIRES_IN=7d
PORT=3001
GOOGLE_BOOKS_API_KEY=<opsional, untuk fitur impor>
```

`.env.example` sudah tersedia dan ter-commit; `.env` diabaikan git dan **tidak boleh dibagikan**.

## Menjalankan di Lokal

Gunakan Bun + Turborepo dari **root repo**:

```bash
# dari root repo (bukan dari folder ini)
bun install
bun run dev      # menjalankan apps/web (:3000) & apps/api (:3001) bersamaan
```

Atau jalankan khusus API dari folder ini:

```bash
bun run dev      # `bun src/main.ts` (watch-like)
bun run build    # nest build -> ./dist
bun run start:prod  # node dist/main.js
```

Swagger UI: http://localhost:3001/api

## Endpoint Utama

### Auth
- `POST /auth/login` — masuk (email, password) → `access_token` + `user`
- `POST /auth/register` — daftar anggota (member)

### Buku (publik)
- `GET /books?search=&category=&available=&minRating=&sortBy=&order=` — daftar buku
- `GET /books/:id` — detail
- `GET /categories` — daftar kategori
- `GET /google-books/public/search` — pencarian Google Books (tanpa login)

### Buku (admin)
- `POST /books` — tambah
- `PATCH /books/:id` — edit
- `DELETE /books/:id` — hapus
- `POST /books/import-google-books` — auto-import dari Google Books (siapapun, dengan stok default 5)

### Reviews
- `GET /books/:bookId/reviews` — daftar ulasan
- `POST /books/:bookId/reviews` — beri/update ulasan (login)
- `DELETE /reviews/:id` — hapus ulasan sendiri
- `GET /reviews/mine` — ulasan saya
- `GET /reviews/my-stats` — statistik baca & ulasan saya
- `GET /reading/me?status=` — buku berdasarkan status baca
- `PUT /books/:bookId/reading-status` — set status baca

### Anggota (admin)
- `GET /members` — list
- `GET /members/:id` — detail (termasuk riwayat membaca & ulasan)
- `POST /members` — tambah
- `PATCH /members/:id` — edit (password di-hash di backend)
- `DELETE /members/:id` — hapus

### Laporan (admin)
- `GET /reports` — statistik katalog & ulasan

## Script

```bash
bun run build     # nest build
bun run lint      # ESLint src/test
bun run test      # Jest (src/**/*.spec.ts) — saat ini belum ada test file
bun run format    # Prettier
bun run start:prod
```

## Lisensi

UNLICENSED
