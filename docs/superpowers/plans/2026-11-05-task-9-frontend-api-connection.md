# Task 9: Frontend - Koneksi API & Auth Context

**Date:** 2026-11-05
**Status:** Pending
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

## Referensi
- Backend: `apps/api` (port 3001)
- Dependencies: axios, @perpus-app/prisma-client