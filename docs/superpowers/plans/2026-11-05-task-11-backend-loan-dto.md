# Task 11: Backend - Loan DTO

**Date:** 2026-11-05
**Status:** Pending
**Priority:** Medium

## Deskripsi
Membuat DTO (Data Transfer Object) untuk loan module di `apps/api/src/loans/dto/`.

## Checklist
- [ ] Buat file `apps/api/src/loans/dto/request-loan.dto.ts`
- [ ] Buat class `RequestLoanDto` dengan validasi (bookId required)
- [ ] Buat file `apps/api/src/loans/dto/return-loan.dto.ts`
- [ ] Buat class `ReturnLoanDto` jika diperlukan
- [ ] Gunakan `class-validator` untuk validasi input
- [ ] Ekspor DTO dari `loans.module.ts` jika perlu

## Referensi
- Backend: `apps/api` (NestJS)
- Dependencies: `class-validator`
- File yang ada: `apps/api/src/loans/loans.controller.ts`, `apps/api/src/loans/loans.service.ts`