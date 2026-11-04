# Arsitektur Monorepo - PinjamanBuku

## Gambaran Umum

PinjamanBuku menggunakan monorepo berbasis [Turborepo](https://turbo.build/repo) dengan package manager [Bun](https://bun.sh/) (Bun 1.4.0). Struktur ini memungkinkan berbagi kode antar aplikasi dan paket secara efisien.

## Struktur Proyek

```text
perpus-app/
├── apps/           # Aplikasi yang dapat dijalankan (frontend/backend)
├── packages/       # Paket bersama yang dapat digunakan oleh apps
├── PRD.md          # Product Requirements Document
├── README.md       # Dokumentasi utama
├── turbo.json      # Konfigurasi Turborepo
├── package.json    # Root package.json dengan workspace config
└── bun.lock        # Lockfile Bun
```

## Konfigurasi Workspace

Root `package.json` mendefinisikan workspace:

```json
{
  "workspaces": ["apps/*", "packages/*"],
  "scripts": {
    "build": "turbo run build",
    "dev": "turbo run dev",
    "lint": "turbo run lint",
    "format": "prettier --write \"**/*.{ts,tsx,md}\"",
    "check-types": "turbo run check-types"
  }
}
```

## Paket yang Tersedia

| Paket | Deskripsi | Tujuan |
|---|---|---|
| `packages/ui` | Komponen UI reusable berbasis React + TypeScript | Berbagi komponen seperti Button, Card, dll antar aplikasi |
| `packages/eslint-config` | Konfigurasi ESLint terpusat | Menstandarisasi linting di seluruh monorepo |
| `packages/typescript-config` | Konfigurasi TypeScript terpusat | Menstandarisasi konfigurasi TypeScript di seluruh monorepo |

### Detail packages

**`packages/ui`**
- `src/button.tsx`, `src/card.tsx`, `src/code.tsx` - Komponen dasar
- `package.json`, `tsconfig.json`, `eslint.config.mjs` - Konfigurasi paket

**`packages/eslint-config`**
- `base.js` - Konfigurasi ESLint dasar
- `next.js` - Konfigurasi untuk Next.js
- `react-internal.js` - Konfigurasi untuk internal React packages

**`packages/typescript-config`**
- `base.json` - Konfigurasi TypeScript dasar
- `nextjs.json` - Konfigurasi untuk Next.js
- `react-library.json` - Konfigurasi untuk React library

## Aplikasi (`apps/`)

Saat ini folder `apps/` kosong. Rencana arsitektur untuk PinjamanBuku:

| Aplikasi | Rencana Teknologi | Deskripsi |
|---|---|---|
| `apps/web` | Next.js 15 + React + TypeScript + Tailwind CSS | Aplikasi utama - Frontend & Backend (API Routes/Server Actions). Menangani semua fitur PinjamanBuku (katalog, peminjaman, dashboard admin, autentikasi). |

Berdasarkan rekomendasi di PRD, aplikasi utama akan menggunakan Next.js fullstack dengan struktur:

```text
apps/web/
├── app/              # App Router Next.js
├── components/       # Komponen spesifik aplikasi
├── lib/              # Utilities, helpers, prisma client
├── prisma/           # Schema dan migrasi Prisma
└── types/            # Type definitions
```

## Alur Data & Arsitektur Aplikasi

```text
[Browser] → Next.js (App Router)
              ├── Server Components (RSC)
              ├── Server Actions (mutasi data)
              └── API Routes (jika diperlukan)
                    ↓
                  Prisma ORM
                    ↓
                  PostgreSQL Database
```

**Keterangan:**
- **Server Components** - Untuk render halaman dan fetch data
- **Server Actions** - Untuk operasi CRUD (create/update/delete) dengan validasi
- **Prisma ORM** - Abstraksi database dengan type-safe queries
- **PostgreSQL** - Database relasional utama

## Konfigurasi Turborepo

`turbo.json` mendefinisikan task pipeline:

| Task | Dependensi | Cache | Keterangan |
|---|---|---|---|
| `build` | `^build` (build dependencies terlebih dahulu) | Default | Build output ke `.next/**` (exclude cache) |
| `lint` | `^lint` | Default | Linting seluruh paket/aplikasi |
| `check-types` | `^check-types` | Default | Type checking |
| `dev` | - | `false`, `persistent: true` | Development server, tidak di-cache |

## Aturan Bisnis (Ringkas)

Arsitektur aplikasi harus mendukung:

- **Role-based access**: `ADMIN` dan `MEMBER`
- **Transaksi peminjaman**: Pengajuan → Persetujuan → Peminjaman → Pengembalian
- **Manajemen stok**: Otomatis berkurang saat disetujui, bertambah saat dikembalikan
- **Validasi bisnis**: Maks 3 buku, durasi 7 hari, cegah peminjaman jika ada keterlambatan
- **Integritas data**: Cegah penghapusan buku/anggota dengan transaksi aktif, cegah stok negatif

## Standar Pengembangan

- **Bahasa**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **Format**: Prettier untuk formatting
- **Linting**: ESLint dengan konfigurasi terpusat
- **Komit**: Ikuti konvensi proyek

## Deployment

- **Aplikasi**: [Vercel](https://vercel.com/) (optimal untuk Next.js)
- **Database**: PostgreSQL managed service (Neon, Supabase, Railway, dll)
- **Environment**: Menggunakan variabel lingkungan (`.env`)

## Referensi

- [PRD.md](./PRD.md) - Product Requirements Document lengkap
- [README.md](./README.md) - Panduan setup dan overview proyek
- [Turborepo Docs](https://turbo.build/repo/docs)
- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)