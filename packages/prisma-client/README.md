# Database Prisma Client

Package terpisah untuk Prisma Client yang bisa digunakan oleh `apps/api` dan `apps/web` (jika diperlukan).

## Struktur

```text
packages/prisma-client/
├── prisma/
│   └── schema.prisma     # Prisma schema
├── src/
│   └── index.ts          # Export Prisma Client
└── package.json
```

## Penggunaan

Di `apps/api/package.json` atau `apps/web/package.json`, tambahkan dependency:

```json
{
  "dependencies": {
    "@perpus-app/prisma-client": "*"
  }
}
```

Lalu import:

```ts
import { PrismaClient, User, Book, Loan } from '@perpus-app/prisma-client';
```

## Scripts

```bash
# Generate Prisma Client
npm run generate

# Run migrations
npm run migrate:dev

# Open Prisma Studio
npm run studio

# Push schema to database
npm run push
```
