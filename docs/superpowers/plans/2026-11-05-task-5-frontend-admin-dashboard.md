# Task 5: Frontend - Dashboard Admin

**Date:** 2026-11-05
**Status:** Completed
**Priority:** High

## Deskripsi
Membuat dashboard admin di `apps/web` sesuai PRD FR-10.

## Checklist
- [ ] Buat halaman `/admin/dashboard` (statistik perpustakaan)
- [ ] Tampilkan total koleksi buku
- [ ] Tampilkan total anggota
- [ ] Tampilkan buku sedang dipinjam
- [ ] Tampilkan pengajuan menunggu
- [ ] Tampilkan buku terlambat
- [ ] Tampilkan aktivitas transaksi terbaru
- [ ] Tampilkan buku populer
- [ ] Buat komponen StatCard, ChartCard
- [ ] Buat layout dengan sidebar navigasi untuk admin

## Catatan PRD v2.0 (2026-11-09)

Task ini dirancang untuk PRD v1.0. Dashboard admin kini menampilkan statistik ulasan (total ulasan, rating rata-rata, buku rating tertinggi, ulasan terbaru) bukan statistik peminjaman. Rute /admin/loans/* dihapus pada 2026-11-09. Rujukan sekarang: PRD v2.0 FR-09.

## Referensi
- PRD v2.0: FR-10 (Dashboard Admin)
- Backend: `GET /reports`

## Catatan Verifikasi (2026-11-09)
Selesai dikerjakan dan lulus verifikasi otomatis (build/uji API) atas perintah user pada 2026-11-09. Catatan: tidak semua item UI di-klik manual satu-per-satu; verifikasi utama melalui build (next/nest), uji endpoint API, dan uji tampilan.