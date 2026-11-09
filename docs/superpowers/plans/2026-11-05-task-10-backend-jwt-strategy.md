# Task 10: Backend - JWT Strategy

**Date:** 2026-11-05
**Status:** Completed
**Priority:** High

## Deskripsi
Membuat JWT strategy di `apps/api/src/auth/strategies/` untuk autentikasi NestJS.

## Checklist
- [ ] Buat file `apps/api/src/auth/strategies/jwt.strategy.ts`
- [ ] Buat class `JwtStrategy` extends `PassportStrategy`
- [ ] Konfigurasi JWT secret dari environment variable
- [ ] Implementasi `validate()` method untuk decode token
- [ ] Ekspor `JwtStrategy` dari `auth.module.ts`
- [ ] Pastikan strategy terdaftar di `AuthModule`

## Catatan PRD v2.0 (2026-11-09)

Task ini tetap berlaku di PRD v2.0 (PERPUS — Katalog, Rating & Jejak Membaca). Rujukan sekarang: PRD v2.0 FR-01.

## Referensi
- Backend: `apps/api` (NestJS)
- Dependencies: `@nestjs/passport`, `passport-jwt`
- File yang ada: `apps/api/src/auth/auth.service.ts`, `apps/api/src/auth/auth.module.ts`

## Catatan Verifikasi (2026-11-09)
Selesai dikerjakan dan lulus verifikasi otomatis (build/uji API) atas perintah user pada 2026-11-09. Catatan: tidak semua item UI di-klik manual satu-per-satu; verifikasi utama melalui build (next/nest), uji endpoint API, dan uji tampilan.