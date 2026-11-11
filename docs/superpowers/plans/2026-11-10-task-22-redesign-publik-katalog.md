# Task 22 — Redesign Halaman Publik & Katalog (gaya referensi kirim user)

**Tanggal:** 2026-11-10
**Status:** COMPLETED
**Konteks:** User mengirim gambar referensi ("Temukan Karya Hebat, Beri Rating, & Abadikan Jejak Membaca.") dengan brand digugat "UlasBuku" — keputusan user: **brand tetap PERPUS**. Plans lama task-13/14/16 dihapus & digantikan dokumen ini.

## Keputusan (sesuai jawaban user)
| No | Pertanyaan | Jawaban (final yang dikerjakan) |
|----|-----------|----------------------------------|
| 1 | Background hero | Gambar rak buku perpustakaan gelap — **Pexels photo 2908984**, di-download ke `apps/web/public/hero-library.jpg` (Unsplash CDN mengembalikan 404 dari environment ini) |
| 2 | Data 6 kartu rekomendasi | book1 Bumi Manusia, book3 Kosmos, book6 Nusantara, book2 Kecerdasan Buatan Modern, book4 Meditasi, book5 Kalkulus Diferensial — hardcoded order |
| 3 | Icon notifikasi | **Dihilangkan**, tidak ditambahkan |
| 4 | Karya Pilihan Redaksi | Featured dari API live: `GET /books?sortBy=rating&order=desc`, ambil index 0 |
| 5 | Mapping chip kategori | Label per gambar; mapping internal ke DB id (Teknologi & AI dan Matematika & Logika berbagi `cat_sains`) |
| 6 | Hero stats | **Live** dari endpoint baru publik `GET /reports/public` (`totalBooks`, `totalReviews`) + `/reviews/my-stats` untuk ★ Rating Anda jika login. (Catatan: `/reports` penuh tetap ADMIN-only; tamu menerima angka live dari endpoint publik, bukan placeholder) |
| 7 | Card style kartu | Gaya gambar penuh (soft badges, status pojok, % puas) |

## Mapping chips label (label → categoryId)
```
Semua Kategori      → ''
Sastra Klasik       → cat_fiksi
Filsafat & Pemikiran → cat_filsafat
Sains & Kosmologi   → cat_sains
Teknologi & AI      → cat_sains
Sejarah Dunia       → cat_sejarah
Matematika & Logika → cat_sains
```
Catatan jujur: Sains/Teknologi/Matematika berbagi `cat_sains` karena kategori DB hanya 6; menambah kategori baru butuh izin user.

## Halaman & komponen yang diubah
1. `apps/web/src/components/SiteHeader.tsx` — rewrite: logo PERPUS (tap 3x → /admin/login tetap), nav per referensi (Jelajah Buku / Koleksi Saya / Ulasan & Diskusi / Kurasi Pilihan), search, hapus notifikasi
2. `apps/web/src/components/StatusStrip.tsx` — rewrite: strip "Indeks Nasional · Platform Kurasi Buku & Resensi Komunitas Indonesia" + **statistik live** dari `/reports/public` (Buku Terindeks, Ulasan Pembaca) + Kurator Aktif (statis) + ★ Rating Anda (untuk login)
3. `apps/web/src/components/SiteFooter.tsx` — rewrite 4 kolom (Eksplorasi / Kategori Literatur / Komunitas Pembaca)
4. `apps/web/src/app/page.tsx` — rewrite landing: hero full-bleed `hero-library.jpg` + overlay gradient, panel "Karya Pilihan Redaksi Minggu Ini", search bar + dropdown Rating Tertinggi + checkbox ✓ 4.5+ Saja, chips kategori, 6 kartu rekomendasi, section penutup quote + CTA
5. `apps/web/src/app/books/page.tsx` — filter panel baru (search rounded, chips kategori label gambar, badge "N Judul Ditampilkan"), grid 3 kolom
6. `apps/web/src/components/CatalogCard.tsx` — cover h-52, badge tahun violet, "% Puas" sebagai pill emerald, tombol "Lihat Detail & Beri Rating"
7. `apps/web/src/app/books/[id]/page.tsx` & `components/BookDetail.tsx` — breadcrumb, cover panel gelap (background library + overlay violet), panel info dengan card meta, status baca, form ulasan, daftar ulasan grid 2 kolom
8. `apps/web/src/app/login/page.tsx`, `register/page.tsx` — dark lavender card di atas background library
9. `apps/web/src/app/guide/page.tsx` — hero band gelap + 5 section
10. Reskin aksen violet: `/profile` (rewrite penuh: header panel lavender + grid info + tombol keluar), `/reviews`, `/my-collection`, `MemberLayout`
11. `apps/web/src/app/icon.svg` — favicon aplikasi (logo buku PERPUS)
12. Backend: `apps/api/src/reports/reports-public.controller.ts` (endpoint publik `GET /reports/public`), `reports.service.ts` (+`getPublicStatistics()`), `reports.module.ts` (registrasi controller)
13. `apps/web/public/hero-library.jpg` — gambar rak buku perpustakaan gelap

## Tidak diubah
- Panel admin (`/admin/*, /admin/login`), `AdminLayout.tsx`, skema database, kredensial admin.

## Verifikasi (11 Nov 2026, sesi Claude/opencode)
- `nest build` exit 0 (dengan endpoint publik baru)
- `next build` exit 0 (21 route, termasuk `/icon.svg`)
- API dev jalan di `:3001`: `GET /reports/public` → **200** `{"totalBooks":31,"totalReviews":5}`; `GET /reports` (penuh) → **403** untuk tamu (tetap ADMIN-only)
- Semua rute publik 200 OK: `/`, `/books`, `/books/book1`, `/login`, `/register`, `/guide`, `/profile`, `/my-collection`, `/reviews`, `/icon.svg`
- Working tree belum di-commit (user melakukan commit manual)

## Catatan jujur
- Gambar hero bukan Unsplash persis referensi — Unsplash CDN tidak bisa diakses dari environment ini; user memilih tetap pakai gambar mirip (Pexels 2908984).
- Angka "Kurator Aktif 12.190" tetap statis (tidak ada statistik publik yang setara).
- Quote "Karya monumental…" di kartu redaksi generik (bukan ulasan spesifik buku featured), placeholder editorial.
