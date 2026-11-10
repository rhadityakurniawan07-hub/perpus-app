# Task 21: Login Admin Tersembunyi (Easter Egg) "Admin Area"

**Date:** 2026-11-10
**Status:** Completed
**Priority:** High
**Dependensi:** Task 3 (Auth), Task 13 (Design System)
**Terkait:** Task 16 (Dashboard Admin)

## Deskripsi
Menyembunyikan akses login Admin dari alur publik. Pengunjung biasa melihat tombol "Masuk" biasa → halaman `/login` publik. Admin, bukannya diberi tautan, membuka halaman `/admin/login` (halaman gelap) hanya saat **mengklik logo PERPUS 3x dengan cepat** (kesan Easter Egg).

## Fitur
### Easter Egg di SiteHeader
- Logo PERPUS dijadikan tombol; klik 1x → kembali ke `/`; klik 3x cepat (<800ms) → redirect ke `/admin/login`.
- Muncul toast mini "ADMIN AREA" saat trigger Easter Egg.

### Halaman Admin Login (`/admin/login`)
- Tema gelap (pastel violet / bintang SVG), brand "PERPUS — ADMIN AREA".
- Form email+password hanya untuk akun ADMIN.
- Endpoint yang sama dipakai (`POST /auth/login`), tetapi setelah login dengan akun biasa (tidak ADMIN) ditolak; admin diarahkan ke `/admin/dashboard`.

### Proteksi
- `/admin/layout.tsx` — guard `role === 'ADMIN'` yang sudah ada dipakai (`useAuth`); non-ADMIN redirect ke `/admin/login`.
- `/admin/login` dikecualikan dari guard di layout tersebut.
- Easter Egg hanya membuka URL login, tidak melewati autentikasi (backend tetap `JwtAuthGuard + RolesGuard(Role.ADMIN)`).

### Perbaikan
- `apps/api/package.json`: `start:prod` diarahkan ke `dist/apps/api/src/main.js` (path nest-build yang sebenarnya).
- `BooksController`/`BooksService`: dukung opsional `?page=` dan `?limit=` (default: tanpa paginasi, kompatibel kode lama).

## Verifikasi
- Link logo tidak lagi menjadi `Link` — diganti `<button>`; klik 1x → `/`; 3x cepat → `/admin/login`.
- `GET /admin/login` → 200 dengan halaman gelap.
- Login email non-ADMIN di `/admin/login` → ditolak (tidak diarahkan ke dashboard admin).
- `GET /admin/dashboard` untuk non-ADMIN → redirect `/admin/login`.
- `start:prod` sekarang menunjuk file JS yang benar (`dist/apps/api/src/main.js`).

## Catatan
- Ini **obscurity**, bukan keamanan tambahan; proteksi utama tetap di backend (`JwtAuthGuard + RolesGuard`).
- Password admin dirotasi (bukan `MRhWcsu1d2ZXZycZ` lagi) dan akun admin kedua dibuat (lihat commit).
