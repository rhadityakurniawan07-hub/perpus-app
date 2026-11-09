# Task 12: Backend - Loan Enum

**Date:** 2026-11-05
**Status:** Completed
**Priority:** Medium

## Deskripsi
Membuat enum untuk status loan di `apps/api/src/loans/enums/`.

## Catatan Verifikasi
Enum `LoanStatus` di `loans/enums/loan-status.enum.ts` adalah re-export dari enum Prisma (`@perpus-app/prisma-client`) sehingga tidak ada duplikasi/drift. `loans.controller.ts` & `loans.service.ts` di-refactor memakai enum (string literal dihapus). `GET /loans?status=` kini memvalidasi nilai (nilai tidak valid → 400 dengan daftar status sah). `GET /loans?status=FOO` terbukti mengembalikan 400.

## Checklist
- [x] Buat file `apps/api/src/loans/enums/loan-status.enum.ts`
- [x] Buat enum `LoanStatus` dengan nilai:
  - `PENDING` (Menunggu Persetujuan)
  - `APPROVED` (Disetujui)
  - `REJECTED` (Ditolak)
  - `CANCELLED` (Dibatalkan)
  - `BORROWED` (Dipinjam)
  - `RETURNED` (Dikembalikan)
  - `OVERDUE` (Terlambat)
- [ ] Ekspor enum dari `loans.module.ts` jika perlu — tidak diperlukan (enum dipakai lewat path langsung, bukan sebagai provider)
- [x] Pastikan enum sesuai dengan yang digunakan di `loans.service.ts`

## Catatan PRD v2.0 (2026-11-09)

Task ini berhubungan dengan modul loans yang kini legacy di PRD v2.0 (§10, Tabel loans). Enum LoanStatus adalah re-export dari enum Prisma; digunakan di service/controller loans yang dipertahankan sebagai legacy.

## Referensi
- Backend: `apps/api` (NestJS)
- File yang ada: `apps/api/src/loans/loans.service.ts`, `packages/prisma-client/prisma/schema.prisma`
- Prisma schema: `enum LoanStatus` sudah ada di schema.prisma