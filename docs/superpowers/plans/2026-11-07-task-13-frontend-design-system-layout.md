# Task 13: Frontend - Design System & Layout "UlasBuku"

**Date:** 2026-11-07
**Status:** Completed
**Priority:** High
**Rujukan:** Gambar desain baru "UlasBuku — Katalog & Kurasi" (tema ungu, latar lavender, footer navy)

## Deskripsi
Membuat fondasi desain (design tokens, tipografi, komponen dasar) dan layout global (header, strip status, footer) sesuai gambar desain baru UlasBuku agar tampilan web semirip mungkin dengan rujukan.

## Checklist
### Design Tokens & Fondasi
- [ ] Update `apps/web/tailwind.config.ts`: warna brand — **ungu terang** (primary), **lavender muda** (background halaman), **navy gelap** (footer/aksen gelap), putih (kartu), abu-abu teks; radius besar; shadow lembut
- [ ] Update `apps/web/src/app/globals.css`: pasang font sans geometris (mirip gambar, mis. Plus Jakarta Sans via `next/font/google`) + kelas komponen `@layer components`
- [ ] Kelas tombol: utama (ungu penuh), outline, ghost, dengan radius konsisten
- [ ] Kelas chip kategori: aktif (ungu penuh putih) & inaktif (putih border abu)
- [ ] Kelas kartu: putih, radius besar, border tipis, shadow lembut
- [ ] Kelas input search besar (rounded penuh, ikon kiri)
- [ ] Kelas badge/status pill (hijau, kuning, biru, ungu, merah) + rating bintang

### Header (navbar baru sesuai gambar)
- [ ] Buat komponen `apps/web/src/components/SiteHeader.tsx`:
  - Logo ikon buku ungu + teks **"UlasBuku"** + subjudul kecil **"KATALOG & KURASI"**
  - Search inline di header: placeholder "Cari judul, penulis, ISBN..."
  - Nav: **Katalog Buku** (tombol ungu aktif), **Koleksi Saya**, **Ulasan & Rating**, **Panduan Kurasi**
  - Ikon bookmark (outline)
  - Info user: nama + label role (mis. "Kurator") + avatar bulat; bila belum login tampilkan tombol Masuk/Daftar
  - Responsif mobile (menu hamburger)
- [ ] Pasang `SiteHeader` di `apps/web/src/app/layout.tsx` untuk semua halaman publik

### Strip Status Komunitas (di bawah header)
- [ ] Buat komponen `apps/web/src/components/StatusStrip.tsx`:
  - Teks komunitas: "KOMUNITAS PEMIRSA & RESENSI BUKU INDONESIA" · "Ribuan review terpercaya" · "Tanda bacaan favorit"
  - Status membaca user (butuh login): titik warna + "SEDANG DIBACA: X BUKU", "SUDAH SELESAI: Y BUKU", "RATING DIBERIKAN: Z ULASAN"
  - Untuk tamu: tampilkan ajakan login/gabung komunitas

### Footer (navy sesuai gambar)
- [ ] Buat komponen `apps/web/src/components/SiteFooter.tsx`:
  - Kolom kiri: logo "UlasBuku" + deskripsi panjang (arsip literasi digital, kurasi pustaka) + badge "Pustaka Terverifikasi" & "Akses Terbuka"
  - Kolom **Kategori Pilihan**: Fiksi Sastra & Klasik, Filsafat & Humaniora, Sains Hayati & Teknologi, Sejarah & Dokumenter, Kajian Sosial & Budaya
  - Kolom **Kurasi & Etika**: Standar Penilaian 5 Bintang, Redaksi Komentar Terpublikasi, Integritas Resensi Pustaka, Pustakawan & Mitra Kurator, Indeks Repositori Publik
  - Kolom **Literasi & Jaringan**: Klub Diskusi Buku Bulanan, Program Penulis Siang, Sentra Katalog, Pusat Bantuan Katalog, Kontak Kurator
  - Baris bawah: copyright + link **Kebijakan Privasi**, **Syarat Penggunaan**, **API Terbuka**
- [ ] Pasang `SiteFooter` di `app/layout.tsx` untuk halaman publik (bukan halaman admin)

### Konsistensi Area Lain
- [ ] `AdminLayout`: samakan aksen ungu, pertahankan gelap navy untuk navbar admin
- [ ] `MemberLayout` + halaman anggota: aksen ungu konsisten dengan tema baru
- [ ] Halaman login/register menyesuaikan tema ungu/lavender

## Kriteria Selesai
- [ ] `next build` berhasil di `apps/web`
- [ ] Header, strip status, dan footer tampil semirip gambar rujukan di semua halaman publik

## Catatan PRD v2.0 (2026-11-09)

Brand diseragamkan menjadi PERPUS (bukan "UlasBuku"); tagline "KATALOG & ULASAN". Header + strip status + footer kini hanya tampil di halaman publik (PublicShell); area member & admin memakai layout sendiri. Rujukan PRD v2.0 (PERPUS — Katalog, Rating & Jejak Membaca).

## Referensi
- Gambar desain baru "UlasBuku" yang dilampirkan user
- File terkait: `apps/web/tailwind.config.ts`, `apps/web/src/app/globals.css`, `apps/web/src/app/layout.tsx`, `apps/web/src/components/MemberLayout.tsx`, `apps/web/src/components/AdminLayout.tsx`

## Catatan Verifikasi (2026-11-09)
Selesai dikerjakan dan lulus verifikasi otomatis (build/uji API) atas perintah user pada 2026-11-09. Catatan: tidak semua item UI di-klik manual satu-per-satu; verifikasi utama melalui build (next/nest), uji endpoint API, dan uji tampilan.