# Arsitektur Monorepo - PERPUS

## Gambaran Umum

PERPUS menggunakan monorepo berbasis [Turborepo](https://turbo.build/repo) dengan package manager [Bun](https://bun.sh/). Struktur ini memungkinkan berbagi kode antar aplikasi dan paket secara efisien.

## Struktur Proyek

```text
perpus-app/
├─ apps/           # Aplikasi yang dapat dijalankan
│  ├─ api/         # Backend API (NestJS + Prisma)
│  └─ web/         # Frontend (Next.js App Router + Tailwind)
├─ packages/       # Paket bersama
│  ├─ prisma-client/  # Template Prisma Client (@perpus-app/prisma-client)
│  ├─ ui/             # Komponen UI bersama
│  ├─ eslint-config/  # Konfigurasi ESLint
│  └─ typescript-config/  # Konfigurasi TypeScript
├─ PRD.md          # Product Requirements Document (v2.0)
├─ README.md       # Dokumentasi utama
├─ ARCHITECTURE.md # Dokumen arsitektur (file ini)
├─ turbo.json      # Konfigurasi Turborepo
└─ package.json    # Root package.json (workspace)
```

## Konfigurasi Workspace

Root `package.json` mendefinisikan workspace:

```json
{
  "workspaces": ["apps/*", "packages/*"],
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "lint": "turbo run lint",
    "check-types": "turbo run check-types"
  }
}
```

## Aplikasi (`apps/`)

### `apps/api` — Backend API

| Bagian | Teknologi | Keterangan |
|---|---|---|
| Framework | NestJS 10 | Modular, dependency injection |
| ORM | Prisma 5 | Database access (PostgreSQL) |
| Auth | JWT (`@nestjs/jwt`) | Bearer token, 7 hari |
| Validation | class-validator | DTO input validation |
| Docs | Swagger | `/api` |
| Port | `3001` | `http://localhost:3001` |

Struktur:
```text
apps/api/src/
├─ auth/            # Login, register, JWT strategy
├─ books/           # CRUD buku + auto-import Google Books
├─ google-books/    # Proxy Google Books API (admin & publik)
├─ reviews/         # Rating, ulasan, status baca
├─ members/         # CRUD anggota (admin)
├─ loans/           # Legacy peminjaman (dipertahankan)
├─ reports/         # Laporan statistik
├─ categories/      # Kategori
├─ settings/        # Pengaturan
├─ common/          # Guards, decorators
├─ prisma/          # PrismaService
└─ main.ts          # Entry point
```

### `apps/web` — Frontend

| Bagian | Teknologi | Keterangan |
|---|---|---|
| Framework | Next.js 14 | App Router, RSC + CSR |
| Styling | Tailwind CSS | Utility-first |
| Auth | Context + localStorage | JWT disimpan di client |
| HTTP | Axios | Request + interceptor JWT |
| Port | `3000` | `http://localhost:3000` |

Area utama:
- **Publik**: Landing, Katalog Buku (search + filter + rating), Detail Buku, Panduan Kurasi, Login/Register.
- **Anggota** (`/dashboard`): Koleksi Saya (status baca), Ulasan & Rating, Profil.
- **Admin** (`/admin/*`): Dashboard (statistik), Kelola Buku (CRUD + impor), Kelola Anggota (CRUD), Riwayat Membaca/Ulasan.

## Alur Data

```text
[Browser] ─ Next.js (App Router) ─ REST/JSON
                │
                ▼
            apps/api (NestJS)
                │
                ▼
            Prisma ORM
                │
                ▼
          PostgreSQL (lokal, port 5432)
```

- **Autentikasi**: client mengirim JWT pada header `Authorization: Bearer <token>`.
  `JwtAuthGuard` memvalidasi signature; `RolesGuard` mengecek role (`ADMIN`/`MEMBER`).
- **Publikasi katalog**: semua pengunjung (termasuk tamu) bisa melihat katalog;
  rating & ulasan hanya untuk anggota login.

## Paket (`packages/`)

| Paket | Deskripsi |
|---|---|
| `prisma-client` | Paket Prisma client yang digunakan bersama `@perpus-app/prisma-client` |
| `ui` | Komponen UI bersama |
| `eslint-config` | Konfigurasi ESLint (`base`, `next-js`, `react-internal`) |
| `typescript-config` | Konfigurasi TypeScript (`base.json`, `nextjs.json`, `react-library.json`) |

## Konfigurasi Turborepo

| Task | Keterangan |
|---|---|
| `dev` | Development server (persistent, tidak di-cache) |
| `build` | Build seluruh paket/aplikasi |
| `lint` | Linting |
| `check-types` | Type checking |

## Program Kerja / Roadmap

Fokus saat ini (PRD v2.0):
- Katalog buku dengan pencarian + filter (rating, kategori, status baca).
- Sistem rating & ulasan.
- Reading tracker (Ingin/Sedang/Sudah Selesai).
- Dashboard admin (statistik katalog & ulasan).
- Integrasi Google Books API (impor ke katalog lokal).
- Area admin tersembunyi ("Easter Egg" — 3 klik logo).

## Standar Pengembangan

- **TypeScript** (strict mode di web; longgar di api untuk kemudahan awal).
- **Tailwind CSS** untuk styling.
- **Conventional Commits-ish** untuk pesan commit.
- **Dokumentasi plan** di `docs/superpowers/plans/`.
- **PRD** di `PRD.md` (v2.0).

## Deployment

Saat ini: **lokal** (`apps/api` berjalan di port 3001, `apps/web` di port 3000).
Untuk produksi: **Vercel** (frontend) + PostgreSQL managed service (Neon/Supabase/Railway) + **Docker** atau VM untuk backend NestJS.

## Referensi

- `PRD.md` — Product Requirements Document (v2.0)
- `README.md` — Panduan setup dan overview proyek
