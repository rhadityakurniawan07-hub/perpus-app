# Task 7: Frontend - CRUD Anggota (Admin)

**Date:** 2026-11-05
**Status:** Pending
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

## Referensi
- PRD: FR-05 (Pengelolaan Anggota)
- Backend: `GET /members`, `POST /members`, `PATCH /members/:id`, `DELETE /members/:id`