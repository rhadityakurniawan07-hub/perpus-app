# Task 1: Frontend - Katalog Buku

**Date:** 2026-11-05
**Status:** Completed
**Priority:** High

## Deskripsi
Membuat halaman katalog buku di `apps/web` sesuai PRD FR-02 dan FR-03.

## Checklist
- [ ] Buat halaman `/books` (katalog buku)
- [ ] Tampilkan daftar buku dengan grid/card layout
- [ ] Tambah fitur search berdasarkan judul dan penulis
- [ ] Tambah filter berdasarkan kategori
- [ ] Tambah filter berdasarkan ketersediaan (tersedia/habis)
- [ ] Tambah sorting berdasarkan judul atau tahun terbit
- [ ] Tampilkan informasi buku: judul, penulis, penerbit, kategori, stok, sampul
- [ ] Buat komponen BookCard reusable
- [ ] Buat komponen BookSearch dan BookFilter
- [ ] Pastikan halaman responsif (desktop, tablet, mobile)

## Catatan PRD v2.0 (2026-11-09)

Task ini dirancang untuk PRD v1.0 (konsep peminjaman "PinjamanBuku"). Implementasinya disesuaikan/disederhanakan oleh Task 13/14/16 agar sesuai PRD v2.0 (PERPUS — Katalog, Rating & Jejak Membaca). Filter "tersedia/habis" digantikan filter "Rating 4.5+ Saja"; sorting rating ditambahkan; tombol "Ajukan Peminjaman" dihapus. Rujukan sekarang: PRD v2.0 FR-02, FR-03.

## Referensi
- PRD v2.0: FR-02 (Katalog Buku), FR-03 (Pencarian dan Filter)
- Backend: `GET /books?search=&category=&available=&sortBy=&order=`

## Catatan Verifikasi (2026-11-09)
Selesai dikerjakan dan lulus verifikasi otomatis (build/uji API) atas perintah user pada 2026-11-09. Catatan: tidak semua item UI di-klik manual satu-per-satu; verifikasi utama melalui build (next/nest), uji endpoint API, dan uji tampilan.