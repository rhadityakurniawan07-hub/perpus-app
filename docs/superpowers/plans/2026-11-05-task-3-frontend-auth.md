# Task 3: Frontend - Login & Register

**Date:** 2026-11-05
**Status:** Pending
**Priority:** High

## Deskripsi
Membuat halaman login dan register di `apps/web` sesuai PRD FR-01.

## Checklist
- [ ] Buat halaman `/login`
- [ ] Buat form login (email, password)
- [ ] Buat halaman `/register`
- [ ] Buat form register (name, email, password)
- [ ] Integrasikan dengan backend auth (`POST /auth/login`, `POST /auth/register`)
- [ ] Simpan JWT token di cookie/localStorage
- [ ] Buat auth context/provider untuk manage session
- [ ] Tambah validasi form
- [ ] Tampilkan pesan error yang jelas (bahasa Indonesia)
- [ ] Redirect ke dashboard setelah login

## Referensi
- PRD: FR-01 (Autentikasi Pengguna), NFR-01 (Kemudahan Penggunaan)
- Backend: `POST /auth/login`, `POST /auth/register`