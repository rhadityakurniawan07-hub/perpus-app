# Task 4: Frontend - Dashboard Anggota

**Date:** 2026-11-05
**Status:** Completed
**Priority:** High

## Deskripsi
Membuat dashboard anggota di `apps/web` sesuai PRD halaman anggota.

## Checklist
- [ ] Buat halaman `/dashboard` (dashboard anggota)
- [ ] Buat halaman `/loans` (peminjaman saya)
- [ ] Buat halaman `/history` (riwayat peminjaman)
- [ ] Buat halaman `/profile` (profil anggota)
- [ ] Tampilkan ringkasan peminjaman aktif
- [ ] Tampilkan daftar buku yang sedang dipinjam
- [ ] Tampilkan riwayat peminjaman (nama buku, tanggal pinjam, jatuh tempo, kembali, status)
- [ ] Tambah tombol "Ajukan Peminjaman" di dashboard
- [ ] Buat komponen MemberDashboard, LoanTable, HistoryTable
- [ ] Buat layout dengan sidebar navigasi untuk anggota

## Catatan PRD v2.0 (2026-11-09)

Task ini dirancang untuk PRD v1.0. Dashboard anggota kini menampilkan Sedang Dibaca / Sudah Selesai / Ulasan Saya (bukan peminjaman). Rute /loans dan /history dihapus pada 2026-11-09. Rujukan sekarang: PRD v2.0 FR-07, FR-08.

## Referensi
- PRD v2.0: Halaman Anggota (Dashboard Anggota, Peminjaman Saya, Riwayat, Profil), FR-09
- Backend: `GET /loans/my-loans`, `GET /auth/me`

## Catatan Verifikasi (2026-11-09)
Selesai dikerjakan dan lulus verifikasi otomatis (build/uji API) atas perintah user pada 2026-11-09. Catatan: tidak semua item UI di-klik manual satu-per-satu; verifikasi utama melalui build (next/nest), uji endpoint API, dan uji tampilan.