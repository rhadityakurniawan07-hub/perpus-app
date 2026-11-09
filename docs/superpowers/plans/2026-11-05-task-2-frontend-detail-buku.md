# Task 2: Frontend - Detail Buku

**Date:** 2026-11-05
**Status:** Completed
**Priority:** High

## Deskripsi
Membuat halaman detail buku di `apps/web` sesuai PRD FR-02.

## Checklist
- [ ] Buat halaman `/books/[id]` (detail buku)
- [ ] Tampilkan informasi lengkap buku: judul, penulis, penerbit, tahun terbit, kategori, ISBN, deskripsi, gambar sampul, lokasi rak, stok total, stok tersedia
- [ ] Tambah tombol "Ajukan Peminjaman" (arahkan ke login jika belum login)
- [ ] Tambah tombol "Kembali" ke katalog
- [ ] Tampilkan status ketersediaan (tersedia/habis) dengan warna
- [ ] Buat komponen BookDetail
- [ ] Pastikan halaman responsif

## Catatan PRD v2.0 (2026-11-09)

Task ini dirancang untuk PRD v1.0. Tombol "Ajukan Peminjaman" dihapus; digantikan oleh "Lihat Detail & Beri Rating" (rating & ulasan). Rujukan sekarang: PRD v2.0 FR-02, FR-06.

## Referensi
- PRD v2.0: FR-02 (Katalog Buku), FR-04 (Pengelolaan Buku)
- Backend: `GET /books/:id`

## Catatan Verifikasi (2026-11-09)
Selesai dikerjakan dan lulus verifikasi otomatis (build/uji API) atas perintah user pada 2026-11-09. Catatan: tidak semua item UI di-klik manual satu-per-satu; verifikasi utama melalui build (next/nest), uji endpoint API, dan uji tampilan.