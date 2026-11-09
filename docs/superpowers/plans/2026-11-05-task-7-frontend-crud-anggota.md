# Task 7: Frontend - CRUD Anggota (Admin)

**Date:** 2026-11-05
**Status:** Completed
**Priority:** High

## Deskripsi
Membuat halaman CRUD anggota di `apps/web` sesuai PRD FR-05.

## Checklist
- [ ] Buat halaman `/admin/members` (daftar anggota)
- [ ] Buat halaman `/admin/members/create` (tambah anggota)
- [ ] Buat halaman `/admin/members/[id]/edit` (edit anggota)
- [ ] Buat tabel daftar anggota dengan pagination
- [ ] Buat form tambah anggota (name, email, password, status)
- [ ] Buat form edit anggota
- [ ] Tambah tombol nonaktifkan/aktifkan akun
- [ ] Tambah tombol hapus (dengan konfirmasi)
- [ ] Tambah kolom riwayat peminjaman per anggota
- [ ] Integrasikan dengan backend (`GET /members`, `POST /members`, `PATCH /members/:id`, `DELETE /members/:id`)
- [ ] Tampilkan pesan sukses/error (bahasa Indonesia)
- [ ] Buat komponen MemberTable, MemberForm

## Catatan PRD v2.0 (2026-11-09)

Task ini tetap berlaku di PRD v2.0 (PERPUS — Katalog, Rating & Jejak Membaca). Rujukan sekarang: PRD v2.0 FR-05. Riwayat peminjaman di halaman edit anggota dipertahankan sebagai data legacy.

## Referensi
- PRD v2.0: FR-05 (Pengelolaan Anggota)
- Backend: `GET /members`, `POST /members`, `PATCH /members/:id`, `DELETE /members/:id`

## Catatan Verifikasi (2026-11-09)
Selesai dikerjakan dan lulus verifikasi otomatis (build/uji API) atas perintah user pada 2026-11-09. Catatan: tidak semua item UI di-klik manual satu-per-satu; verifikasi utama melalui build (next/nest), uji endpoint API, dan uji tampilan.