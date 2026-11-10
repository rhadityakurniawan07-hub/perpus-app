# Task 19: Skrip Utilitas - Reseed 6 Buku Contoh dari Google Books

**Date:** 2026-11-10
**Status:** Completed
**Priority:** Medium
**Dependensi:** Task 14 (Landing & Katalog redesign), Task 15 (Google Books API)
**Terkait:** Task 16 (Katalog & Ulasan)

## Deskripsi
Mengganti data 6 buku contoh hasil Task 14 dengan metadata & sampul **asli dari Google Books** (bukan data imajiner), sambil mempertahankan id buku dan rating/ulasan yang sudah diberikan pengguna. Skrip disimpan sebagai **utilitas** di repo (boleh dipakai kembali jika ingin memuat ulang).

**Metode:** Daftar `volumeId` terkurasi manual (Google Books search terlalu broad untuk auto-match — ternyata banyak false positive), bukan hasil pencarian otomatis.

## Checklist
- [x] Buat `apps/api/scripts/reseed-google-books.ts`:
  - Menggunakan `GOOGLE_BOOKS_API_KEY` dari `apps/api/.env`
  - Fetch `GET /volumes/{volumeId}` per buku
  - Normalize: `title, author, publisher, year, isbn, description, coverImage (https)`
  - `UPDATE books` per id (fix: `book1..book6`), pertahankan `id` & kolom rating/ulasan.
  - Skip ISBN yang dipakai buku lain (log & lanjut) — tidak menggagalkan reseed.
- [x] Daftar volumeId terkurasi:
  - `book1` → "Bumi Manusia" — Pramoedya Ananta Toer (1976, ISBN 9789799731461, Tetralogi Buru)
  - `book2` → "FONDASI KECERDASAN BUATAN MODERN" — Deosa Putra Caniago (2026, ISBN 9786347474223)
  - `book3` → "Kosmos" — Carl Sagan (ISBN 9786231345066)
  - `book4` → "Meditasi" — Marcus Aurelius (ISBN 9786237290919)
  - `book5` → "Kalkulus Diferensial" — Ari Andari (ISBN 9786024328245)
  - `book6` → "Nusantara" — Bernard Hubertus Maria Vlekke (2008, ISBN 9789799101075)
- [x] Jalankan `bun scripts/reseed-google-books.ts`:
  - Hasil: **6/6 buku berhasil** — sampul `https` dan metadata real tersimpan.
- [x] Verifikasi di DB: keenam buku memiliki `coverImage` terisi (URL `https` dari Google Books).
- [x] Script **dipertahankan** sebagai utilitas (bukan dihapus).
- [x] Catatan: Script tidak di-run ulang otomatis — hanya saat dibutuhkan.

## Catatan
- Buku 4 dan 5 bukan persis judul seed awal (seed imajiner tidak ada di Google Books); dipilih edisi nyata terdekat dengan topik Surat pribadi seed.
- Jika ingin menambah buku contoh baru, copy pola script dan tambah entry di `TARGETS`.
- Script tidak memvalidasi ISBN ke format check-digit; hanya memastikan unik di DB.
