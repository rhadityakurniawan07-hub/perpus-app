# Task 2: Frontend - Detail Buku

**Date:** 2026-11-05
**Status:** Pending
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

## Referensi
- PRD: FR-02 (Katalog Buku), FR-04 (Pengelolaan Buku)
- Backend: `GET /books/:id`