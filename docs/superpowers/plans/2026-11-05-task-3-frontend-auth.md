# Task 3: Frontend - Login & Register

**Date:** 2026-11-05
**Status:** Completed
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

## Catatan PRD v2.0 (2026-11-09)

Task ini tetap berlaku di PRD v2.0 (PERPUS — Katalog, Rating & Jejak Membaca). Rujukan sekarang: PRD v2.0 FR-01, FR-06.

## Referensi
- PRD v2.0: FR-01 (Autentikasi Pengguna), NFR-01 (Kemudahan Penggunaan)
- Backend: `POST /auth/login`, `POST /auth/register`

## Catatan Verifikasi (2026-11-09)
Selesai dikerjakan dan lulus verifikasi otomatis (build/uji API) atas perintah user pada 2026-11-09. Catatan: tidak semua item UI di-klik manual satu-per-satu; verifikasi utama melalui build (next/nest), uji endpoint API, dan uji tampilan.