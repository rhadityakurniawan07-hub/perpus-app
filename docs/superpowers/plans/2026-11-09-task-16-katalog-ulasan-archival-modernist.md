# Task 16: Katalog & Ulasan Buku — "Archival Modernist" (Rating + Status Baca)

**Date:** 2026-11-09
**Status:** Completed
**Priority:** High
**Dependensi:** Task 6 (CRUD Buku), Task 9 (Koneksi API Frontend), Task 10 (JWT)
**Terkait:** Task 15 (Google Books API — dikerjakan terpisah)

## Deskripsi
Mengubah konsep aplikasi dari **peminjaman** menjadi **katalog pencarian buku + rating/ulasan + status baca (reading tracker)** dengan tema **Archival Modernist** (palet ungu-indigo, tipografi tajam, kartu terstruktur). Fitur peminjaman **disembunyikan dari UI**; kode/model `Loan` tetap dipertahankan.

Poin utama sesuai spesifikasi:
- Tanpa tombol/kuota/tenggat peminjaman; diganti tombol **"Lihat Detail & Beri Rating"**.
- Kartu buku menampilkan **rating bintang** (mis. ★ 4.9 dari 342 ulasan) + **persentase kepuasan**.
- Pencarian dilengkapi sortir **Rating Tertinggi** dan filter **Rating 4.5+ Saja**.
- Badge status baca: 🟢 **Sudah Selesai**, 🟣 **Sedang Dibaca**, 🟡 **Belum Selesai / Ingin Dibaca**.
- **Modal interaktif**: pilih status baca, rating 1–5, tulis ulasan refleksi.
- Dashboard anggota: kartu **Sedang Dibaca**, **Sudah Selesai**, **Ulasan Saya**.

> **Catatan:** Task ini sudah dikerjakan dan diverifikasi (build + uji API end-to-end). Lihat penjelasan hasil di obrolan.

---

## Fase 0 — Database Lokal
- [x] Buat database: `createdb -U postgres -h 127.0.0.1 -p 5432 perpus_db` (auth lokal `trust`, tanpa password).
- [x] Set `apps/api/.env`: `DATABASE_URL="postgresql://postgres@127.0.0.1:5432/perpus_db?schema=public"`.
- [x] Pastikan `apps/api/.env` tetap di `.gitignore`.

## Fase 1 — Fondasi Tema (Archival Modernist)
- [x] `apps/web/tailwind.config.ts`: palet indigo/purple (primary `#4F46E5`/`#6D28D9`), lavender bg, navy, success/warning; `borderRadius`, `boxShadow.soft`, `fontFamily`.
- [x] `apps/web/src/app/globals.css`: kelas `.btn-primary`, `.btn-outline`, `.chip`, `.chip-active`, `.card`, `.input-search`, `.badge-*`.
- [x] `apps/web/src/app/layout.tsx`: font `next/font/google` (Plus Jakarta Sans / Inter).
- [x] Ikon memakai SVG inline (tanpa dependency baru).

## Fase 2 — Prisma Schema (`packages/prisma-client/prisma/schema.prisma`)
- [x] Tambah `enum ReadingStatusValue { WISHLIST, READING, FINISHED }`.
- [x] Tambah `model Review { id, userId, bookId, rating Int, comment String? @db.Text, createdAt, updatedAt, @@unique([userId, bookId]) }`.
- [x] Tambah `model ReadingStatus { id, userId, bookId, status ReadingStatusValue @default(WISHLIST), createdAt, updatedAt, @@unique([userId, bookId]) }`.
- [x] Relasi balik di `User` (`reviews[]`, `readingStatuses[]`) dan `Book` (`reviews[]`, `readingStatuses[]`).
- [x] Tambah `averageRating Float @default(0)` + `reviewCount Int @default(0)` di `Book`.
- [x] Pertahankan `Loan`/`LoanStatus` (legacy, tidak dihapus).
- [x] Jalankan `prisma migrate dev --name init_rating` + `prisma generate`.

## Fase 3 — Backend (`apps/api`)
### Modul `reviews/`
- [x] `reviews.module.ts`, `reviews.controller.ts`, `reviews.service.ts`.
- [x] `dto/create-review.dto.ts` — `rating @IsInt @Min(1) @Max(5)`, `comment?`.
- [x] `dto/reading-status.dto.ts` — `status` enum.
- [x] `POST /books/:bookId/reviews` (auth) — upsert rating+komentar, hitung ulang agregat `Book`.
- [x] `GET /books/:bookId/reviews` — `{ averageRating, reviewCount, positivePercent, reviews[] }` (nama user, bintang, teks, tanggal).
- [x] `DELETE /reviews/:id` (auth, milik sendiri) — hapus + hitung ulang agregat.
- [x] `GET /reviews/mine` — ulasan milik user login.
- [x] `GET /reviews/my-stats` — `{ wishlist, reading, finished, reviews }`.
- [x] `GET /reading/me?status=` dan `PUT /books/:bookId/reading-status` (auth).
- [x] Daftarkan `ReviewsModule` di `app.module.ts`.

### Penyesuaian modul lain
- [x] `books.service.ts`: sertakan `averageRating`/`reviewCount`; dukung `sortBy=rating` (desc) + filter `minRating=4.5`.
- [x] `reports.service.ts`: tambah `totalReviews`, `averageRating`, `topRatedBooks`, `recentReviews`, `readingSummary`.
- [x] Verifikasi `nest build`.

## Fase 4 — Frontend: Tipe & Hooks
- [x] `apps/web/src/types/index.ts`: tambah `Review`, `ReadingStatus`; perluas `Book` (`averageRating`, `reviewCount`).
- [x] `apps/web/src/hooks/useReviews.ts`.
- [x] `apps/web/src/hooks/useReadingStatus.ts`.
- [x] `apps/web/src/hooks/useMyStats.ts`.

## Fase 5 — Katalog, Kartu & Modal
- [x] `components/RatingStars.tsx` — tampil & input bintang interaktif.
- [x] `components/BookCard.tsx` (redesain): badge status baca (🟢/🟣/🟡), `★ 4.9 (342 ulasan)`, `98% Positif`, tombol **"Lihat Detail & Beri Rating"**.
- [x] `components/BookDetailModal.tsx` — modal: info buku, pilih status baca, rating 1–5, textarea ulasan, tombol kirim, daftar ulasan.
- [x] `components/ReviewList.tsx` — daftar ulasan (nama, bintang, teks, tanggal).
- [x] `app/books/page.tsx`: search besar, sortir **Rating Tertinggi**/Judul A–Z/Terbaru, checkbox **Rating 4.5+ Saja**, chip kategori, badge "X Judul Ditampilkan", grid responsif, state modal.
- [x] `app/books/[id]/page.tsx` + `components/BookDetail.tsx`: pakai konten yang sama; hapus tombol "Ajukan Peminjaman"/"Login untuk Pinjam".

## Fase 6 — Area Anggota
- [x] `components/MemberLayout.tsx`: nav → **Katalog Buku, Koleksi Saya, Ulasan & Rating, Profil** (hapus menu Peminjaman Saya & Riwayat; route tetap ada).
- [x] `app/dashboard/page.tsx`: 3 kartu → **Sedang Dibaca / Sudah Selesai / Ulasan Saya** (`useMyStats`); ganti tabel pinjam dengan daftar "Sedang Dibaca" + "Ulasan Terbaru".
- [x] `app/my-collection/page.tsx` (baru): tab Semua / Ingin Dibaca / Sedang Dibaca / Sudah Selesai.
- [x] `app/reviews/page.tsx` (baru): ulasan & rating yang saya tulis.

## Fase 7 — Area Admin
- [x] `components/AdminLayout.tsx`: sembunyikan menu "Transaksi".
- [x] `app/admin/dashboard/page.tsx`: kartu → Total Koleksi, Total Anggota, Total Ulasan, Rating Rata-rata + Buku Rating Tertinggi & Ulasan Terbaru.
- [x] Halaman `app/admin/loans/*` dibiarkan ada (tidak ditautkan).

## Fase 8 — PRD
- [x] Tulis ulang `PRD.md` → **PERPUS — Katalog, Rating & Jejak Membaca**.
- [x] Ringkasan, latar belakang, tujuan, target pengguna (admin/member).
- [x] MVP & struktur halaman baru (Katalog, Koleksi Saya, Ulasan & Rating).
- [x] FR: rating & ulasan, status baca, dashboard anggota/admin.
- [x] Aturan bisnis: 1 rating/user/buku (boleh diubah), skala 1–5, ulasan opsional.
- [x] Rancangan DB: tabel **Review** & **ReadingStatus**; `Loan` dicatat sebagai legacy.
- [x] Kriteria keberhasilan & tahapan pengembangan disesuaikan.

## Fase 9 — Verifikasi
- [x] `prisma generate` berhasil.
- [x] `nest build` (apps/api) berhasil.
- [x] `next build` (apps/web) berhasil.
- [x] Uji alur: cari buku → modal → pilih status baca → beri rating/ulasan → cek dashboard, `/my-collection`, `/reviews`.
- [x] Pastikan menu Peminjaman/Transaksi tidak lagi tampil di UI.

---

## Catatan
- **Google Books API (Task 15) dikerjakan terpisah**, tidak termasuk task ini.
- **Tanpa seed data**: katalog awal kosong sampai admin menambah buku.
- Peminjaman hanya **disembunyikan dari UI**, bukan dihapus dari kode/DB.

## Catatan PRD v2.0 (2026-11-09)

Task ini adalah implementasi inti PRD v2.0 (FR-02..FR-09, tema Archival Modernist). Catatan: komponen modal detail (BookDetailModal) digantikan halaman detail + tombol "Lihat Detail & Beri Rating" (lihat Task 14); rute /loans & /history dihapus 2026-11-09.

## Referensi
- PRD v2.0: `PRD.md`
- Schema: `packages/prisma-client/prisma/schema.prisma`
- Backend: `apps/api/src/books/`, `apps/api/src/reports/`, `apps/api/src/app.module.ts`
- Frontend: `apps/web/src/app/`, `apps/web/src/components/`, `apps/web/src/hooks/`, `apps/web/src/types/index.ts`

## Catatan Verifikasi (2026-11-09)
Selesai dikerjakan dan lulus verifikasi otomatis (build/uji API) atas perintah user pada 2026-11-09. Catatan: tidak semua item UI di-klik manual satu-per-satu; verifikasi utama melalui build (next/nest), uji endpoint API, dan uji tampilan.