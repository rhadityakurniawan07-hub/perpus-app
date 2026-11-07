'use client';

import AdminLoansManager from '@/components/AdminLoansManager';

export default function AdminLoansPage() {
  return (
    <AdminLoansManager
      title="Transaksi Peminjaman"
      subtitle="Semua pengajuan, peminjaman, dan pengembalian"
      actionMode="all"
      emptyText="Belum ada transaksi peminjaman."
    />
  );
}