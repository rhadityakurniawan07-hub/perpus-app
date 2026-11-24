# E2E Test Checklist — PERPUS v2.0

**Versi:** 1.0  
**Tanggal:** 2026-11-24  
**Status:** Manual — Belum automated

---

## Prasyarat

- [ ] PostgreSQL jalan (port 5432): `Get-Service postgresql-x64-18` → Status Running
- [ ] API jalan (port 3001): `cd apps/api && bun run dev`
- [ ] Web jalan (port 3000): `cd apps/web && bun run dev`
- [ ] Database sudah di-seed: `cd packages/prisma-client && bun run seed`
- [ ] Browser: Chrome/Firefox/Edge (latest)

---

## Flow 1: Registrasi Anggota Baru

- [ ] Buka `http://localhost:3000/register`
- [ ] Isi nama, email valid, password (min 6 char)
- [ ] Klik "Daftar" → redirect ke `/dashboard`
- [ ] Verifikasi: nama & email tersimpan, role MEMBER
- [ ] Verifikasi: 4 kartu stats tampil (Wishlist, Reading, Finished, Reviews) semua 0

**Edge case:**
- [ ] Email sudah terdaftar → error "Email sudah terdaftar"
- [ ] Password <6 char → error validasi (client-side)
- [ ] Email invalid → error "Format email tidak valid"

---

## Flow 2: Login Anggota

- [ ] Buka `http://localhost:3000/login`
- [ ] Masuk dengan `member@perpus.co.id` / `password123`
- [ ] Redirect ke `/dashboard`
- [ ] Verifikasi: nama "Demo Member", stats tampil

**Edge case:**
- [ ] Email/password salah → error "Email atau password salah"
- [ ] Akun nonaktif → error "Akun tidak aktif"
- [ ] Admin login di /login → redirect ke /admin/dashboard (bukan /dashboard)

---

## Flow 3: Login Admin

- [ ] Buka `http://localhost:3000/admin/login` (via URL langsung atau link "Admin" di footer)
- [ ] Masuk dengan `admin@perpus.co.id` / `130207`
- [ ] Redirect ke `/admin/dashboard`
- [ ] Verifikasi: statistik katalog & ulasan tampil (Total Koleksi, Total Anggota, Total Ulasan, Rating Rata-rata)

**Edge case:**
- [ ] Member login di /admin/login → redirect ke /dashboard + pesan penolakan
- [ ] Admin login di /login → redirect ke /admin/dashboard
- [ ] Akses /admin/dashboard tanpa login → redirect ke /admin/login

---

## Flow 4: Pencarian & Filter Katalog

- [ ] Buka `http://localhost:3000/books`
- [ ] Cari judul buku (2+ karakter) → hasil muncul (lokal + Google Books)
- [ ] Filter kategori (chip) → hasil terfilter
- [ ] Centang "✓ 4.5+ Saja" → hanya buku rating ≥4.5 (filter hilang saat search aktif)
- [ ] Sortir "Rating Tertinggi" → urut descending
- [ ] Sortir "Judul A-Z" → urut alfabetis
- [ ] Sortir "Terbaru" → urut tahun desc

**Edge case:**
- [ ] Search 1 karakter → tidak fetch Google Books
- [ ] Search tidak ada hasil → pesan "Tidak ada buku yang ditemukan"
- [ ] Filter kategori saat search → Google Books terfilter client-side

---

## Flow 5: Detail Buku & Modal

- [ ] Klik kartu buku lokal → modal detail muncul (overlay gelap)
- [ ] Modal tampil: cover, judul, penulis, rating, ulasan, status baca, form ulasan
- [ ] Klik overlay (di luar modal) → modal tutup
- [ ] Tekan Escape → modal tutup
- [ ] Klik tombol X → modal tutup
- [ ] Klik "Buka Halaman Detail" → navigate ke /books/[id]
- [ ] Deep link /books/[id] → halaman detail tampil (bukan modal)
- [ ] Body scroll terkunci saat modal buka

**Edge case:**
- [ ] Buku Google → tetap flow import (tidak modal, karena belum ada ID lokal)
- [ ] Modal buka saat scroll → posisi scroll tetap

---

## Flow 6: Rating & Ulasan

- [ ] Login sebagai member
- [ ] Buka detail buku → klik 4 bintang → ketik ulasan → kirim
- [ ] Verifikasi: rating tersimpan, ulasan muncul di daftar
- [ ] Verifikasi: averageRating, reviewCount, positivePercent update di kartu
- [ ] Ubah rating (kirim ulang) → rating terupdate (upsert, bukan duplikat)
- [ ] Hapus ulasan → agregat terhitung ulang
- [ ] Ketik ulasan >2000 char → counter merah, button disabled
- [ ] Pilih 0 bintang → button disabled, error message

**Edge case:**
- [ ] Ulasan kosong (hanya rating) → tampil "Hanya memberi penilaian, tanpa catatan tambahan"
- [ ] Ulasan max 2000 char → counter `2000/2000`, button disabled jika >2000

---

## Flow 7: Status Baca

- [ ] Login sebagai member
- [ ] Buka detail buku → klik "Sedang Dibaca"
- [ ] Verifikasi: badge status berubah di kartu
- [ ] Buka /my-collection → buku muncul di tab "Sedang Dibaca"
- [ ] Ubah status → "Sudah Selesai" → pindah tab
- [ ] Dashboard → "Sudah Selesai" counter bertambah

**Edge case:**
- [ ] Status baca tanpa login → redirect ke /login?next=...
- [ ] Ubah status berulang → status terupdate (upsert, bukan duplikat)

---

## Flow 8: Dashboard Anggota

- [ ] Buka /dashboard
- [ ] Verifikasi: 4 kartu (Ingin Dibaca, Sedang Dibaca, Sudah Selesai, Ulasan)
- [ ] Verifikasi: daftar "Sedang Dibaca" & "Ulasan Terbaru" tampil
- [ ] Greeting sesuai waktu (pagi/siang/sore/malam)

**Edge case:**
- [ ] User baru (belum ada data) → semua counter 0, greeting "Selamat datang"

---

## Flow 9: Admin CRUD Buku

- [ ] Login sebagai admin
- [ ] Buka /admin/books → daftar buku tampil (paginated 10/page)
- [ ] Tambah buku baru → redirect dengan banner "Buku berhasil ditambahkan"
- [ ] Edit buku → redirect dengan banner "Buku berhasil diperbarui"
- [ ] Hapus buku → confirm dialog → buku hilang dari daftar
- [ ] Import Google Books → search → import → redirect ke create form
- [ ] Klik "Muat lebih banyak" → load 10 buku berikutnya
- [ ] Search buku → filter by title/author

**Edge case:**
- [ ] Hapus buku dengan ulasan → error "Buku mungkin masih memiliki peminjaman aktif"
- [ ] Tambah buku dengan ISBN duplikat → error 409

---

## Flow 10: Admin CRUD Anggota

- [ ] Buka /admin/members → daftar anggota tampil (paginated)
- [ ] Tambah anggota baru → redirect dengan banner
- [ ] Edit anggota → redirect dengan banner
- [ ] Toggle status (aktif/nonaktif) → status berubah
- [ ] Hapus anggota → confirm dialog → anggota hilang

**Edge case:**
- [ ] Hapus anggota dengan ulasan → cascade delete (ulasan & reading status ikut terhapus)
- [ ] Tambah anggota dengan email duplikat → error

---

## Flow Bonus: Google Books Search

- [ ] Search 2+ karakter → Google Books hasil muncul (infinite scroll)
- [ ] Klik "Lihat Detail & Beri Rating" → import → redirect ke detail
- [ ] Filter 4.5+ disembunyikan saat search aktif
- [ ] "Muat lebih banyak hasil dari Google Books" → load more

---

## Flow Bonus: Auth Guard

- [ ] Akses /admin/dashboard tanpa login → redirect ke /admin/login
- [ ] Akses /dashboard tanpa login → redirect ke /login?next=/dashboard
- [ ] Login member di /admin/login → redirect ke /dashboard
- [ ] Login admin di /login → redirect ke /admin/dashboard
- [ ] Logout dari admin → redirect ke /admin/login
- [ ] Logout dari member → redirect ke /login
- [ ] Klik logo 3x → tidak lagi membuka admin (Easter Egg dihapus)
- [ ] Link "Admin" di footer → membuka /admin/login

---

## Flow Bonus: Responsive

- [ ] Buka di mobile (375px) → layout responsive, tidak overflow
- [ ] Buka di tablet (768px) → layout responsive
- [ ] Buka di desktop (1280px) → layout full

---

## Hasil Test

| Flow | Status | Catatan |
|------|--------|---------|
| Flow 1: Registrasi | ⬜ | |
| Flow 2: Login Anggota | ⬜ | |
| Flow 3: Login Admin | ⬜ | |
| Flow 4: Pencarian & Filter | ⬜ | |
| Flow 5: Detail Buku & Modal | ⬜ | |
| Flow 6: Rating & Ulasan | ⬜ | |
| Flow 7: Status Baca | ⬜ | |
| Flow 8: Dashboard Anggota | ⬜ | |
| Flow 9: Admin CRUD Buku | ⬜ | |
| Flow 10: Admin CRUD Anggota | ⬜ | |
| Bonus: Google Books Search | ⬜ | |
| Bonus: Auth Guard | ⬜ | |
| Bonus: Responsive | ⬜ | |

**Legend:** ⬜ Belum ditest | ✅ Lolos | ❌ Gagal

---

## Catatan

- Isi kolom "Catatan" jika ada bug atau perilaku tidak sesuai
- Screenshot bug bisa disimpan di folder `docs/screenshots/` (opsional)
- Setelah semua flow ✅, MVP dianggap selesai (PRD §12)