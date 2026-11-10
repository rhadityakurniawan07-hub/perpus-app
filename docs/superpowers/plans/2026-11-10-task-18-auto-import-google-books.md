# Task 18: Fitur - Auto-Import Google Books ke Katalog (& Halaman Detail)

**Date:** 2026-11-10
**Status:** Completed
**Priority:** High
**Dependensi:** Task 17 (Public Search), Task 16 (Katalog & Ulasan)
**Terkait:** Task 20 (Unifikasi Katalog)

## Deskripsi
Menghubungkan hasil Google Books dengan alur **Lihat Detail & Beri Rating** sehingga setiap buku yang dibuka oleh pengunjung (tamu/member/admin) **otomatis tersimpan ke koleksi lokal** — termasuk stok, kategori otomatis, dan anti-duplikat ISBN. Hasilnya: buku Google Books langsung menjadi buku Koleksi PERPUS biasa.

Keputusan:
- Setiap orang (tamu & member) bisa memicu auto-import (endpoint publik).
- Impor terbatas pada yang benar-benar diklik (bukan semua hasil pencarian) — mencegah blognya database berisi buku yang tidak relevan.
- Stok default **5**.
- Kategori: mapping keyword Google Books → kategori lokal; fallback otomatis ke kategori baru **"Google Books"** (auto-created).
- Anti-duplikat ISBN: buku dengan ISBN sama tidak dibuat dua kali; buku lama langsung dikembalikan.

## Checklist
### Backend
- [x] DTO `apps/api/src/books/dto/import-google-books.dto.ts` — `volumeId` wajib (`@IsString() @IsNotEmpty()`).
- [x] Endpoint publik `POST /books/import-google-books` — tanpa guard (tamu boleh).
- [x] `BooksService` (constructor): inject `GoogleBooksService` (via `GoogleBooksModule`).
- [x] `BooksService.importGoogleBooks(volumeId)`:
  - Fetch detail dari Google Books (`findByVolumeId`).
  - Anti-duplikat ISBN (`findUnique(where: { isbn })`).
  - Mapping keyword → kategori lokal (fiksi/sains/sejarah/filsafat/sosial).
  - `ensureGoogleBooksCategory()` — membuat `cat_google-books` bila belum ada.
  - Validasi tahun publikasi (fallback ke tahun berjalan bila invalid).
  - `totalStock = 5`, `availableStock = 5`, `shelfLocation = 'Impor Google Books'`.
- [x] `BooksModule` mengimpor `GoogleBooksModule`.
- [x] `GoogleBooksService` di-export dari `GoogleBooksModule` (sudah).

### Frontend
- [x] `GoogleBookCard.tsx`: tombol tunggal **"Lihat Detail & Beri Rating"** (menggantikan dua tombol lama); klik memicu `POST /books/import-google-books` lalu `window.location.href = '/books/:id'`.
- [x] Badge "Google Books" di kartu **dihapus** — tampil seragam dengan kartu lokal.
- [x] Loading state ("Membuka detail...") & error message Bahasa Indonesia.

## Catatan
- Tidak mengubah schema (Book tetap seperti sebelumnya).
- Tidak mengubah endpoint admin `POST /books` / `PATCH` / `DELETE` — tetap ADMIN-only.
- Task 20 (Unifikasi Katalog) menggabungkan hasil local & Google Books dalam satu grid; kartu hasil Google Books akan memanggil tombol yang sama.

## Verifikasi Uji (API)
- `POST /books/import-google-books` dengan `volumeId` valid → 201, buku tersimpan dengan `id`, `isbn`, `category.id`; `imported: true`.
- Impor ulang volumeId sama → buku yang sama dikembalikan; `imported: false` (tidak duplikat).
- Tamu dapat memicu; tidak perlu token.
