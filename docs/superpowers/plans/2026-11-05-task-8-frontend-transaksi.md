# Task 8: Frontend - Transaksi Peminjaman (Admin)

**Date:** 2026-11-05
**Status:** Pending
**Priority:** High

## Deskripsi
Membuat halaman transaksi peminjaman di `apps/web` sesuai PRD FR-06, FR-07, FR-08.

## Checklist
- [ ] Buat halaman `/admin/loans` (daftar transaksi aktif)
- [ ] Buat halaman `/admin/loans/pending` (pengajuan menunggu)
- [ ] Buat halaman `/admin/loans/active` (peminjaman aktif)
- [ ] Buat halaman `/admin/loans/returned` (riwayat dikembalikan)
- [ ] Buat tabel daftar pengajuan (nama anggota, buku, tanggal pengajuan)
- [ ] Tambah tombol "Setuju" dan "Tolak" pada setiap pengajuan
- [ ] Buat tabel daftar peminjaman aktif (nama anggota, buku, tanggal pinjam, jatuh tempo)
- [ ] Tambah tombol "Kembalikan" pada setiap peminjaman aktif
- [ ] Tampilkan status terlambat (jika melewati jatuh tempo)
- [ ] Integrasikan dengan backend (`GET /loans`, `POST /loans/:id/approve`, `POST /loans/:id/reject`, `POST /loans/:id/return`)
- [ ] Tampilkan pesan sukses/error (bahasa Indonesia)
- [ ] Buat komponen LoanTable, LoanApproval, LoanReturn

## Referensi
- PRD: FR-06 (Pengajuan Peminjaman), FR-07 (Persetujuan Peminjaman), FR-08 (Pengembalian Buku)
- Backend: `GET /loans`, `POST /loans/:id/approve`, `POST /loans/:id/reject`, `POST /loans/:id/return`