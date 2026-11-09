# Task 8: Frontend - Transaksi Peminjaman (Admin)

**Date:** 2026-11-05
**Status:** Completed
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

## Catatan PRD v2.0 (2026-11-09)

Task ini dirancang untuk PRD v1.0 (konsep peminjaman). Peminjaman kini legacy dan disembunyikan/dihapus dari antarmuka: rute /admin/loans/* dihapus pada 2026-11-09; backend loans tetap dipertahankan (lihat PRD v2.0 §6, §10, Tabel loans).

## Referensi
- PRD v2.0: FR-06 (Pengajuan Peminjaman), FR-07 (Persetujuan Peminjaman), FR-08 (Pengembalian Buku)
- Backend: `GET /loans`, `POST /loans/:id/approve`, `POST /loans/:id/reject`, `POST /loans/:id/return`

## Catatan Verifikasi (2026-11-09)
Selesai dikerjakan dan lulus verifikasi otomatis (build/uji API) atas perintah user pada 2026-11-09. Catatan: tidak semua item UI di-klik manual satu-per-satu; verifikasi utama melalui build (next/nest), uji endpoint API, dan uji tampilan.