# Task 17: Backend - Google Books Public Search (Akses Publik, Tanpa Login)

**Date:** 2026-11-10
**Status:** Completed
**Priority:** High
**Dependensi:** Task 15 (Integrasi Google Books API), Task 16 (Katalog & Ulasan)
**Terkait:** Task 18 (Auto-Import), Task 20 (Unifikasi Katalog)

## Deskripsi
Membuka endpoint pencarian Google Books untuk **semua pengunjung** (tamu & member), tanpa perlu login — agar katalog menampilkan hasil live Google Books untuk semua orang. Endpoint admin (`/google-books/search`) tetap ADMIN-only.

Keputusan (sesuai keinginan user):
- Tamu bisa mencari buku apa pun dari Google Books di katalog.
- Tamu bisa melihat hasil (tanpa login) beserta sampulnya.
- Rating/ulasan tetap login-only.
- Kuota terpakai per pencarian; tidak ada throttling (keputusan user).

## Checklist
### Backend
- [x] DTO `apps/api/src/google-books/dto/search-google-books-public.dto.ts`:
  - `q` wajib, `@MinLength(2, { message: 'Kata pencarian minimal 2 karakter.' })`
  - `maxResults` opsional, default 40, `@Min(1)`, `@Max(40)`
  - `startIndex` opsional, default 0, `@Min(0)`
- [x] Controller baru `apps/api/src/google-books/google-books-public.controller.ts` — path `@Controller('google-books/public')`, **tanpa guard apapun** (publik).
- [x] Route: `GET /google-books/public/search?q=...&startIndex=...&maxResults=...`
- [x] `GoogleBooksService`: tambah method `searchPublic(q, startIndex, maxResults)` — reuse `fetchVolumes` + `normalize` (mengembalikan `volumeId, title, author, publisher, year, isbn, description, coverImage (https), categories`).
- [x] `GoogleBooksModule` memuat `GoogleBooksController` (admin) **dan** `GoogleBooksPublicController`.
- [x] Verifikasi error:
  - `maxResults > 40` → HTTP 400
  - `q` kurang dari 2 karakter → HTTP 400
  - Key tidak diset → error message jelas (400)
- [x] Endpoint admin `/google-books/search` dan `/google-books/:volumeId` **tidak diubah** — tetap ADMIN-only.

## Contoh Response
```json
{
  "totalItems": 255,
  "startIndex": 0,
  "maxResults": 40,
  "results": [
    {
      "volumeId": "...",
      "title": "...",
      "author": "...",
      "publisher": "...",
      "year": 2021,
      "isbn": "...",
      "description": "...",
      "coverImage": "https://...",
      "categories": ["Fiction"]
    }
  ]
}
```

## Catatan
- Tidak ada perubahan schema, tidak ada migrasi.
- Tidak menambah dependency baru (`fetch` global).
- Kuota Google Books tetap terbebani; belum ada caching/rate-limit (keputusan user).
- Task 18 (Auto-Import) menggunakan endpoint ini sebagai sumber data.
