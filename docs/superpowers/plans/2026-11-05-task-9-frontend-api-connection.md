# Task 9: Frontend - Koneksi API & Auth Context

**Date:** 2026-11-05
**Status:** Completed
**Priority:** High

## Deskripsi
Membuat koneksi frontend (`apps/web`) ke backend (`apps/api`) dan auth context.

## Checklist
- [ ] Buat axios instance di `src/lib/axios.ts` (baseURL: `http://localhost:3001`)
- [ ] Tambah interceptor untuk attach JWT token ke setiap request
- [ ] Buat auth context/provider di `src/lib/auth.tsx`
- [ ] Simpan token di cookie (httpOnly) atau localStorage
- [ ] Buat hook `useAuth()` untuk akses auth state
- [ ] Buat hook `useBooks()` untuk fetch buku
- [ ] Buat hook `useLoans()` untuk fetch peminjaman
- [ ] Buat hook `useMembers()` untuk fetch anggota
- [ ] Tambah error handling untuk response (tampilkan pesan error Bahasa Indonesia)
- [ ] Buat layout dengan provider auth di root layout

## Catatan PRD v2.0 (2026-11-09)

Task ini tetap berlaku di PRD v2.0 (PERPUS — Katalog, Rating & Jejak Membaca). Rujukan sekarang: PRD v2.0 FR-01, FR-02, FR-05, FR-06.

## Referensi
- Backend: `apps/api` (port 3001)
- Dependencies: axios, @perpus-app/prisma-client

## Catatan Verifikasi (2026-11-09)
Selesai dikerjakan dan lulus verifikasi otomatis (build/uji API) atas perintah user pada 2026-11-09. Catatan: tidak semua item UI di-klik manual satu-per-satu; verifikasi utama melalui build (next/nest), uji endpoint API, dan uji tampilan.