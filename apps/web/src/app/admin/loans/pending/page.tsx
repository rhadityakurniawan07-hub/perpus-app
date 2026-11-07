'use client';

import AdminLoansManager from '@/components/AdminLoansManager';

export default function AdminLoansPendingPage() {
  return (
    <AdminLoansManager
      title="Pengajuan Menunggu"
      subtitle="Setujui atau tolak pengajuan peminjaman anggota"
      statuses={['PENDING']}
      actionMode="approve-reject"
      emptyText="Tidak ada pengajuan yang menunggu persetujuan."
    />
  );
}