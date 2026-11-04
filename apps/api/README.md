# PinjamanBuku API

Backend API untuk Sistem Informasi Perpustakaan PinjamanBuku menggunakan NestJS, Prisma, dan PostgreSQL.

## Teknologi

- [NestJS](https://nestjs.com/) - Framework Node.js
- [Prisma](https://www.prisma.io/) - ORM
- [PostgreSQL](https://www.postgresql.org/) - Database
- [JWT](https://jwt.io/) - Authentication
- [class-validator](https://github.com/typestack/class-validator) - Input validation

## Struktur

```text
src/
├── auth/        # Authentication (login, register)
├── books/       # Book management
├── members/     # Member management
├── loans/       # Loan & return transactions
├── reports/     # Reports
├── settings/    # Settings
├── categories/  # Categories
├── common/      # Shared utilities (guards, filters, decorators)
├── prisma/      # Prisma service
└── main.ts      # Entry point
```

## Development

```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env

# Generate Prisma Client (use shared package)
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Start dev server
npm run start:dev
```

## API Endpoints

### Auth
- `POST /auth/login` - Login
- `POST /auth/register` - Register anggota

### Books
- `GET /books` - List semua buku
- `GET /books/:id` - Detail buku
- `POST /books` - Tambah buku (Admin)
- `PATCH /books/:id` - Edit buku (Admin)
- `DELETE /books/:id` - Hapus buku (Admin)

### Members
- `GET /members` - List anggota (Admin)
- `GET /members/:id` - Detail anggota (Admin)
- `POST /members` - Tambah anggota (Admin)
- `PATCH /members/:id` - Edit anggota (Admin)
- `DELETE /members/:id` - Hapus anggota (Admin)

### Loans
- `GET /loans` - List peminjaman
- `POST /loans/request` - Pengajuan peminjaman (Member)
- `POST /loans/:id/approve` - Persetujuan peminjaman (Admin)
- `POST /loans/:id/return` - Pengembalian buku (Admin)

### Reports
- `GET /reports` - Laporan statistik (Admin)

## Lisensi

UNLICENSED
