# Task 20: Frontend - Unifikasi Katalog: Satu Pencarian, Grid Gabungan (Lokal + Google Books) tanpa Tab

**Date:** 2026-11-10
**Status:** Completed
**Priority:** High
**Dependensi:** Task 17 (Public Search), Task 18 (Auto-Import), Task 16 (Katalog & Ulasan)
**Terkait:** Task 14 (Katalog sebelumnya)

## Deskripsi
Menghapus pemisahan tab "Koleksi PERPUS" vs "Google Books" — kini hanya **satu grid** berisi gabungan lokal dan hasil Google Books dengan satu kolom pencarian. Sesuai keputusan user:
- Tamu pun bisa mencari buku Live dari Google Books tanpa login.
- Rating/ulasan tetap hanya untuk anggota login.
- Chip kategori **dinamis** — hanya tampil kategori yang muncul di hasil gabungan.
- Filter "Rating 4,5+ Saja" menyembunyikan hasil Google Books (rating 0).
- Chips dipetakan dari Google Books `categories` ke kategori lokal (keyword matching).

## Checklist
### Frontend
- [x] `apps/web/src/app/books/page.tsx` — rewrite besar:
  - Hapus state `mode`, tab chips, komponen placeholder Google-only.
  - Satu input pencarian (search) — tetap seperti sebelumnya.
  - Saat mengetik ≥2 karakter: **fetch** `GET /books?search=...` (lokal) **dan** `GET /google-books/public/search?q=...&startIndex=0&maxResults=40` secara paralel.
  - Debounce 500 ms agar kuota Google Books tidak terbuang per keystroke.
  - **Gabung hasil** di satu grid — lokal (sort: `rating` desc / `title` asc / `year` desc) **di bawah** Google Books (rating = 0, di bawah).
  - **Filter "Rating 4,5+ Saja"** → sembunyikan hasil Google Books; lokal disaring via `averageRating >= 4.5`.
  - Filter **kategori** (chip): lokal via `categoryId`; Google Books via keyword mapping di `google-books-category.ts`.
  - **Chips dinamis**: hanya kategori yang muncul pada hasil gabungan saat itu (dihitung dari union lokal + mapping Google Books).
  - Heading halaman: "Koleksi PERPUS" (sebelumnya "Katalog Pustaka & Indeks Pembaca").
  - Infinite scroll sentinel: men-*trigger* memuat 40 buku Google Books berikutnya (via `startIndex = startIndex + results.length`), di-dedup by `volumeId`, saat grid sudah mendekati dasar (`rootMargin: 400px`).
- [x] Komponen baru `apps/web/src/components/CatalogCard.tsx`:
  - Kartu gabungan (lokal & Google Books) — **tanpa badge** sumber, seragam.
  - Lokal: `BookCard`-like dengan reading-status badge (WISHLIST/READING/FINISHED, termasuk "Baru Ditambahkan" untuk buku tanpa rating).
  - Google Books: rating 0, tanpa status baca (belum diimpor), tombol **"Lihat Detail & Beri Rating"** (auto-import via `POST /books/import-google-books`, redirect `/books/:id`).
  - Loading state per kartu saat import.
- [x] `apps/web/src/lib/google-books-category.ts`:
  - `mapGoogleCategoriesToLocal(googleCategories[], localCategories[]) => string | null`
  - Pemetaan regex (case-insensitive):
    - `fiction|novel|literature|poetry|fantasy|mystery|romance` → `cat_fiksi`
    - `science|technology|medicine|computer|mathematics|psych|biology|chemistry|physics|health|nursing` → `cat_sains`
    - `history|biography|memoir|war` → `cat_sejarah`
    - `philosophy|religion|spirituality|ethics|theology|mythology` → `cat_filsafat`
    - `social|economics|business|politics|education|law` → `cat_sosial`
    - Sisanya → Kategori "Google Books" (`cat_google-books`, auto-created oleh backend bila belum ada).
- [x] `apps/web/src/components/GoogleBookCard.tsx`:
  - Tombol "Impor ke Katalog" dihapus; sekarang hanya satu tombol **"Lihat Detail & Beri Rating"**.
  - Badge "Google Books" dihapus.
  - Loading state + pesan error Bahasa Indonesia.
- [x] `Card` badge tahun publikasi (`year`) dipertahankan untuk semua buku (lokal & Google Books)

### Verifikasi
- [x] `nest build` (apps/api) & `next build` (apps/web) sukses.
- [x] `curl GET /books?search=bumi+manusia` → 6 buku lokal + Google Books (dengan sampul & ISBN ternormalisasi).
- [x] `curl GET /google-books/public/search?q=bumi&maxResults=3` → **200**, `totalItems=255`, hasil ternormalisasi.
- [x] Rute katalog `/books` menyatu tanpa tab.
- [x] Tamu dapat membuka `/books` tanpa login → tetap melihat hasil.

## Catatan
- Task ini **tidak mengubah skema** — tidak ada migrasi baru.
- Tidak mengubah endpoint admin `/google-books/search` / `/google-books/:volumeId` — tetap ADMIN-only.
- "Koleksi PERPUS" sekarang adalah label katalog gabungan; PRD tetap menyebut "PERPUS — Katalog, Rating & Jejak Membaca".
- Chips kategori kosong jika tidak ada hasil gabungan (chip tidak tampil).
- Filter "Rating 4,5+ Saja" menampilkan **0 hasil** jika hanya ada hasil Google Books (karena semua Google Books ratingnya 0) — sesuai keputusan user.

## Referensi
- PRD: `PRD.md` (v2.0)
- Backend: `apps/api/src/google-books/`, `apps/api/src/books/`
- Frontend: `apps/web/src/app/books/page.tsx`, `CatalogCard.tsx`, `lib/google-books-category.ts`
