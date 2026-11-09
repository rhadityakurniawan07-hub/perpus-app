# Task 11: Backend - Loan DTO

**Date:** 2026-11-05
**Status:** Completed
**Priority:** Medium

## Deskripsi
Membuat DTO (Data Transfer Object) untuk loan module di `apps/api/src/loans/dto/`.

## Catatan Verifikasi
`nest build` berhasil. Uji API nyata: `POST /loans/request` dengan body `{}` → 400 ("bookId wajib diisi."); `POST /loans/request` dengan `{"bookId":"book1"}` → loan PENDING; approve → BORROWED (stok 5→4); return → RETURNED (stok 5); loan uji dihapus. Data DB kembali bersih.

## Checklist
- [x] Buat file `apps/api/src/loans/dto/request-loan.dto.ts`
- [x] Buat class `RequestLoanDto` dengan validasi (bookId required)
- [x] Buat file `apps/api/src/loans/dto/return-loan.dto.ts`
- [x] Buat class `ReturnLoanDto` jika diperlukan (returnDate opsional, default now)
- [x] Gunakan `class-validator` untuk validasi input
- [ ] Ekspor DTO dari `loans.module.ts` jika perlu — tidak diperlukan (DTO dipakai langsung lewat import di controller; modul lain tidak butuh)

## Catatan PRD v2.0 (2026-11-09)

Task ini berhubungan dengan modul loans yang kini legacy di PRD v2.0 (§10, Tabel loans). Kode DTO tetap dipertahankan dan validasi backend tetap aktif; tidak dipakai di UI aktif.

## Referensi
- Backend: `apps/api` (NestJS)
- Dependencies: `class-validator`
- File yang ada: `apps/api/src/loans/loans.controller.ts`, `apps/api/src/loans/loans.service.ts`