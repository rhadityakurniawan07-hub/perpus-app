# Task 15: Integrasi Google Books API (Data Buku & Sampul)

**Date:** 2026-11-09
**Status:** Completed
**Priority:** High
**Dependensi:** Task 6 (CRUD Buku Admin), Task 9 (Koneksi API Frontend)

## Catatan Verifikasi
Implementasi selesai dan `nest build` + `next build` sukses; uji key kosong (400 pesan jelas) & tanpa login (403) berhasil. Uji pencarian dengan **key asli** dan tampilan sampul Google Books belum bisa diuji — menunggu `GOOGLE_BOOKS_API_KEY` diisi di `apps/api/.env` lalu backend direstart.

## Deskripsi
Mengintegrasikan **Google Books API** untuk mengambil data buku dan gambar sampul menggunakan **API key** milik pengguna. Tujuan: memudahkan pengisian katalog (judul, penulis, penerbit, tahun, ISBN, deskripsi, sampul) tanpa input manual, selaras dengan konsep baru "Cari Buku + Rating".

API key **hanya disimpan di backend** (`apps/api/.env`) dan **tidak boleh** diekspos ke frontend (`NEXT_PUBLIC_*`) maupun di-commit ke git.

> **Catatan:** Task ini sudah dikerjakan. Uji dengan key asli & tampilan sampul belum bisa diverifikasi — menunggu `GOOGLE_BOOKS_API_KEY` Anda diisi di `apps/api/.env`, lalu backend direstart.

## Checklist

### 1. Konfigurasi & Keamanan API Key
- [x] Tambahkan `GOOGLE_BOOKS_API_KEY=""` ke `apps/api/.env` (isi key di sini, jangan di-commit).
- [x] Tambahkan placeholder `GOOGLE_BOOKS_API_KEY=""` ke `apps/api/.env.example` sebagai dokumentasi.
- [x] Pastikan `apps/api/.env` tetap masuk `.gitignore` (jangan sampai key ikut ter-commit). (apps/api/.gitignore: `.env`)
- [x] Pastikan key tidak pernah dikirim ke frontend (tidak ada `NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY`).

### 2. Backend (NestJS — `apps/api`)
- [x] Buat `apps/api/src/google-books/google-books.module.ts`.
- [x] Buat `apps/api/src/google-books/google-books.service.ts`:
  - [x] Ambil key dari `ConfigService.get('GOOGLE_BOOKS_API_KEY')`.
  - [x] Fungsi `search(query, maxResults)` memanggil `https://www.googleapis.com/books/v1/volumes?q=<query>&maxResults=<n>&key=<KEY>`.
  - [x] Fungsi `findByVolumeId(volumeId)` memanggil `https://www.googleapis.com/books/v1/volumes/<volumeId>?key=<KEY>`.
  - [x] Normalisasi respons menjadi: `volumeId, title, author, publisher, year, isbn, description, coverImage (https), categories`.
  - [x] Ubah `imageLinks.thumbnail` (`http://` → `https://`) agar kompatibel `next/image`.
- [x] Buat `apps/api/src/google-books/google-books.controller.ts`:
  - [x] `GET /google-books/search?q=...` (auth `JwtAuthGuard` + `RolesGuard`, akses `Role.ADMIN`).
  - [x] `GET /google-books/:volumeId` (auth admin).
- [x] Buat DTO/validasi: `q` wajib (`class-validator`), `maxResults` opsional (default 10, maks 40).
- [x] Daftarkan `GoogleBooksModule` di `apps/api/src/app.module.ts`.
- [x] Tambahkan `HttpModule` (`@nestjs/axios`) atau `fetch` bawaan Node untuk request HTTP. (menggunakan `fetch` bawaan Node 24 — tanpa dependency baru)
- [x] Pastikan file `apps/api/package.json`: tambah `@nestjs/axios` + `axios` bila belum ada. (tidak perlu — pakai `fetch` bawaan)

### 3. Error Handling & Validasi
- [x] Jika `GOOGLE_BOOKS_API_KEY` kosong → kembalikan pesan jelas: "API key Google Books belum dikonfigurasi".
- [x] Tangani kuota habis (HTTP 429) dan error jaringan dengan pesan Bahasa Indonesia yang ramah.
- [x] Jangan bocorkan isi key pada pesan error/log.

### 4. Konfigurasi Frontend (Gambar)
- [x] Update `apps/web/next.config.js`: tambah `images.remotePatterns` untuk:
  - [x] `books.google.com`
  - [x] `books.googleusercontent.com`
- [x] Pastikan `BookCard` / `BookDetail` / form buku dapat menampilkan `coverImage` dari domain Google Books.

### 5. Frontend Admin (Impor Buku)
- [x] Tambah tombol **"Cari di Google Books & Impor"** di `apps/web/src/app/admin/books/page.tsx`.
- [x] Buat komponen `apps/web/src/components/GoogleBooksSearch.tsx`:
  - [x] Input pencarian + tombol cari.
  - [x] Tampilkan hasil (sampul, judul, penulis, tahun, ISBN) dalam daftar/kartu.
  - [x] Tombol **"Impor"** per hasil → panggil endpoint/kirim data ke form buku.
- [x] Integrasi impor:
  - [x] Opsi A: prefill `BookForm` (judul, penulis, penerbit, tahun, ISBN, deskripsi, sampul) lalu admin memilih kategori & menyimpan (`POST /books`).
  - [ ] Opsi B: endpoint `POST /books/import` yang langsung membuat buku dari `volumeId`. (tidak dikerjakan — sengaja pakai Opsi A)
  - [x] Lengkapi field wajib lokal (`categoryId`, `totalStock`, `availableStock` default = `totalStock`).
  - [x] Cegah duplikat ISBN bila sudah ada di katalog. (409 Conflict di `BooksService.create`/`update`)
- [x] Tampilkan pesan sukses/gagal dalam Bahasa Indonesia (gunakan `getErrorMessage`).

### 6. Verifikasi
- [x] `nest build` di `apps/api` berhasil.
- [x] `next build` di `apps/web` berhasil.
- [ ] Uji manual endpoint `GET /google-books/search?q=bumi+manusia` (dengan key valid) mengembalikan data ternormalisasi. (menunggu `GOOGLE_BOOKS_API_KEY` diisi)
- [ ] Uji tampilan sampul dari Google Books di kartu/form buku. (menunggu `GOOGLE_BOOKS_API_KEY` diisi)
- [x] Uji skenario key kosong / tidak valid menampilkan pesan yang jelas. (key kosong → 400 pesan jelas; tanpa login → 403; key palsu ditolak Google)

## Catatan Keamanan
- API key **hanya** di `apps/api/.env` (server-side). Jangan pernah menaruhnya di kode frontend.
- Jangan menempelkan key di chat, issue, atau commit.
- Batasi endpoint Google Books ke admin (`Role.ADMIN`) karena sifatnya untuk pengelolaan katalog.

## Catatan PRD v2.0 (2026-11-09)

Google Books API berada di luar MVP PRD v2.0 (§5.2, "Selanjutnya") tetapi tetap dipertahankan sebagai fitur tambahan yang sudah diimplementasikan. Status: Completed — diverifikasi dengan API key asli (pencarian "bumi manusia" mengembalikan 251 hasil; uji endpoint impor admin OK).

## Referensi
- Google Books API: `https://www.googleapis.com/books/v1/volumes`
- Backend: `apps/api/src/books/`, `apps/api/src/app.module.ts`, `apps/api/.env.example`
- Frontend: `apps/web/next.config.js`, `apps/web/src/app/admin/books/page.tsx`, `apps/web/src/components/BookForm.tsx`
- Konvensi task: `docs/superpowers/plans/`
