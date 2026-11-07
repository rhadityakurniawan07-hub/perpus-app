# Task 14: Frontend - Redesign Landing, Katalog & Kartu Buku (UlasBuku)

**Date:** 2026-11-07
**Status:** Pending
**Priority:** High
**Rujukan:** Gambar desain baru "UlasBuku — Katalog & Kurasi"
**Dependensi:** Task 13 (design system, header, strip status, footer)

## Deskripsi
Merancang ulang halaman landing, katalog, detail buku, dan kartu buku agar semirip mungkin dengan gambar desain baru — termasuk rating bintang, status membaca, dan fitur ulasan.

## Checklist
### Landing Page (`apps/web/src/app/page.tsx`)
- [ ] Hero: badge kecil ungu **"EKSPLOASI LITERATUR & RATING BINTANG"**
- [ ] Hero: heading besar 2 baris **"Temukan, Nilai, & Catat Jejak Membaca Buku Favorit Anda"**
- [ ] Hero: paragraf deskripsi (eksplorasi judul, rating bintang, status "Sudah Selesai Dibaca" / "Sedang Dibaca" / "Belum Dibaca")
- [ ] 3 statistik hero dengan ikon: **4.850+ Judul Katalog**, **28.400+ Ulasan Pembaca**, **12.190 Kurva Komunitas** (angka dari API bila ada, fallback statis)
- [ ] Kartu kanan hero **"SOROTAN PEKAN INI"**: badge "Pilihan Editor" + rating 4.9, gambar buku unggulan (Pramoedya — Tetralogi Buru atau buku populer dari API), baris "Aktivitas Terkini", "+42 ulasan baru minggu ini", "96% Resensi Selesai Dibaca", "85/100 Skor Kurasi"
- [ ] Search bar besar: "Cari judul buku, pengarang, subjek katalog, atau nomor ISBN..." → `/books`
- [ ] Dropdown **"Urutkan: Rating Tertinggi"** + checkbox **"Rating 4,5+ Saja"**
- [ ] Chip kategori: label "KATEGORI:" + "Semua Kategori" (aktif ungu) + daftar kategori dari `GET /categories`
- [ ] Section 3 langkah (badge "ALUR SEDERHANA MEMBACA" + heading **"Bagaimana Cara Mengkursasi & Mencatat Buku?"**):
  1. **Cari Koleksi Menarik** — jelajahi kategori/rak + link "Filter Kategori Cepat →"
  2. **Tandai Status Membaca** — Sudah Selesai / Sedang Dibaca / Daftar Impian + link "Sinkronisasi Otomatis →"
  3. **Beri Rating & Bagikan Resensi** — bintang 1–5 + ulasan jujur + link "Berkontribusi pada Komunitas →"

### Katalog (`apps/web/src/app/books/page.tsx`)
- [ ] Section header: heading **"Katalog Pustaka & Indeks Pembaca"** + subtitle "Menampilkan koleksi buku terkini beserta catatan status membaca terkini"
- [ ] Badge kanan: **"X Judul Ditampilkan"**
- [ ] Search bar besar + dropdown urutkan (Rating Tertinggi, Judul A–Z, Terbaru) + checkbox "Rating 4,5+ Saja"
- [ ] Chip kategori horizontal (aktif ungu)
- [ ] Grid kartu buku 3 kolom responsif

### Kartu Buku (`apps/web/src/components/BookCard.tsx`) — redesign total
- [ ] Cover: gambar `coverImage`, fallback gradasi ungu + ikon buku
- [ ] Badge atas cover: tag **kategori** (kiri, ungu) + **tahun** (kanan)
- [ ] Badge **status membaca** di atas cover (kanan): "Sudah Selesai" (hijau), "Sedang Dibaca" (kuning), "Belum Dibaca" (abu), "Baru Ditambahkan" (ungu)
- [ ] Di bawah cover: **rating bintang** (mis. ★ 4.9) + "(342 ulasan)" + **"98% Positif"**
- [ ] Baris meta: **ISBN** + **lokasi rak** (mis. "Rak S-03 • Sastra")
- [ ] Judul, penulis, **kutipan/excerpt** buku (miring, 2 baris)
- [ ] Tombol utama lebar: **"Lihat Detail & Beri Rating"** (ungu) → `/books/[id]`

### Detail Buku (`apps/web/src/app/books/[id]/page.tsx`)
- [ ] Tampilkan rating rata-rata + jumlah ulasan + % positif
- [ ] Form **beri rating bintang 1–5** + tulis ulasan (textarea) + tombol "Kirim Ulasan" (integrasi endpoint ulasan bila tersedia; bila belum, siapkan state/UX-nya)
- [ ] Daftar ulasan pembaca lain (nama, bintang, teks, tanggal)
- [ ] Status membaca user: pilih "Belum Dibaca" / "Sedang Dibaca" / "Sudah Selesai Dibaca"
- [ ] Info: kategori, penerbit, tahun, ISBN, rak, stok, deskripsi
- [ ] Tombol aksi peminjaman (bila fitur pinjam dipertahankan) dengan gaya ungu konsisten

### Halaman Baru Terkait Desain
- [ ] `/my-collection` (**Koleksi Saya**): daftar buku dengan status membaca user (tab: Semua, Belum Dibaca, Sedang Dibaca, Sudah Selesai)
- [ ] `/reviews` (**Ulasan & Rating**): ulasan yang ditulis user + rating yang diberikan
- [ ] `/guide` (**Panduan Kurasi**): halaman statis panduan kurasi/etika resensi (konten dari gambar)

### Data & Integrasi (sesuaikan dengan backend yang ada)
- [ ] Rating & ulasan: buat model `Review` di Prisma (`userId`, `bookId`, `rating`, `comment`, `createdAt`) + endpoint `GET/POST /books/:id/reviews` + rating rata-rata di `Book`
- [ ] Status membaca: tambah field/tabel `ReadingStatus` (`userId`, `bookId`, `status`: NOT_STARTED/READING/FINISHED) + endpoint `GET/POST/PATCH /my-reading`
- [ ] Hitung strip status (sedang dibaca / selesai / jumlah rating) dari data user login
- [ ] Seed data minimal: 6 buku contoh (sesuai gambar: Bumi Manusia, Kecerdasan Buatan Modern, Kosmos, Meditasi, Kalkulus, Nusantara) + beberapa ulasan contoh agar tampil seperti gambar

### Konsistensi Area Lain
- [ ] `MemberLayout` + dashboard anggota: aksen ungu, menu "Koleksi Saya" & "Ulasan & Rating"
- [ ] `AdminLayout`: aksen ungu, gelap navy dipertahankan

## Kriteria Selesai
- [ ] Tampilan landing, katalog, kartu buku, dan detail **semirip mungkin** dengan gambar UlasBuku
- [ ] Rating, ulasan, dan status membaca berfungsi end-to-end (butuh backend + database)
- [ ] Fitur lama (peminjaman) tetap berfungsi bila dipertahankan
- [ ] `next build` berhasil di `apps/web`

## Referensi
- Gambar desain baru "UlasBuku" yang dilampirkan user
- PRD: FR-02 (Katalog), FR-03 (Detail), NFR-01; fitur baru rating/ulasan/status baca di luar PRD awal
- File terkait: `apps/web/src/app/page.tsx`, `apps/web/src/app/books/page.tsx`, `apps/web/src/app/books/[id]/page.tsx`, `apps/web/src/components/BookCard.tsx`, `packages/prisma-client/prisma/schema.prisma`, `apps/api/src/books/`
