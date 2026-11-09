# Task 6: Frontend - CRUD Buku (Admin)

**Date:** 2026-11-05
**Status:** Completed
**Priority:** High

## Deskripsi
Membuat halaman CRUD buku di `apps/web` sesuai PRD FR-04.

## Checklist
- [ ] Buat halaman `/admin/books` (daftar buku)
- [ ] Buat halaman `/admin/books/create` (tambah buku)
- [ ] Buat halaman `/admin/books/[id]/edit` (edit buku)
- [ ] Buat tabel daftar buku dengan pagination
- [ ] Buat form tambah buku (title, author, publisher, category, isbn, year, description, coverImage, totalStock, availableStock, shelfLocation)
- [ ] Buat form edit buku
- [ ] Tambah tombol hapus (dengan konfirmasi)
- [ ] Integrasikan dengan backend (`GET /books`, `POST /books`, `PATCH /books/:id`, `DELETE /books/:id`)
- [ ] Tampilkan pesan sukses/error (bahasa Indonesia)
- [ ] Buat komponen BookTable, BookForm

## Catatan PRD v2.0 (2026-11-09)

Task ini tetap berlaku di PRD v2.0 (PERPUS — Katalog, Rating & Jejak Membaca). Rujukan sekarang: PRD v2.0 FR-04.

## Referensi
- PRD v2.0: FR-04 (Pengelolaan Buku)
- Backend: `GET /books`, `POST /books`, `PATCH /books/:id`, `DELETE /books/:id`

## Catatan Verifikasi (2026-11-09)
Selesai dikerjakan dan lulus verifikasi otomatis (build/uji API) atas perintah user pada 2026-11-09. Catatan: tidak semua item UI di-klik manual satu-per-satu; verifikasi utama melalui build (next/nest), uji endpoint API, dan uji tampilan.