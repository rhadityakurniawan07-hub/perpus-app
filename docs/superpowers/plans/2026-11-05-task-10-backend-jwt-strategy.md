# Task 10: Backend - JWT Strategy

**Date:** 2026-11-05
**Status:** Pending
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

## Referensi
- Backend: `apps/api` (NestJS)
- Dependencies: `@nestjs/passport`, `passport-jwt`
- File yang ada: `apps/api/src/auth/auth.service.ts`, `apps/api/src/auth/auth.module.ts`