# Task 12: Backend - Loan Enum

**Date:** 2026-11-05
**Status:** Pending
**Priority:** Medium

## Deskripsi
Membuat enum untuk status loan di `apps/api/src/loans/enums/`.

## Checklist
- [ ] Buat file `apps/api/src/loans/enums/loan-status.enum.ts`
- [ ] Buat enum `LoanStatus` dengan nilai:
  - `PENDING` (Menunggu Persetujuan)
  - `APPROVED` (Disetujui)
  - `REJECTED` (Ditolak)
  - `CANCELLED` (Dibatalkan)
  - `BORROWED` (Dipinjam)
  - `RETURNED` (Dikembalikan)
  - `OVERDUE` (Terlambat)
- [ ] Ekspor enum dari `loans.module.ts` jika perlu
- [ ] Pastikan enum sesuai dengan yang digunakan di `loans.service.ts`

## Referensi
- Backend: `apps/api` (NestJS)
- File yang ada: `apps/api/src/loans/loans.service.ts`, `packages/prisma-client/prisma/schema.prisma`
- Prisma schema: `enum LoanStatus` sudah ada di schema.prisma