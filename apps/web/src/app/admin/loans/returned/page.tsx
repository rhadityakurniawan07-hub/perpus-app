'use client';

import AdminLoansManager from '@/components/AdminLoansManager';

export default function AdminLoansReturnedPage() {
  return (
    <AdminLoansManager
      title="Riwayat Transaksi"
      subtitle="Peminjaman yang sudah selesai, terlambat, atau ditolak"
      statuses={['RETURNED', 'OVERDUE', 'REJECTED', 'CANCELLED']}
      actionMode="none"
      emptyText="Belum ada riwayat transaksi."
    />
  );
}