'use client';

import AdminLoansManager from '@/components/AdminLoansManager';

export default function AdminLoansActivePage() {
  return (
    <AdminLoansManager
      title="Peminjaman Aktif"
      subtitle="Buku yang sedang dipinjam anggota — proses pengembalian di sini"
      statuses={['BORROWED']}
      actionMode="return"
      dateLabel="borrow"
      emptyText="Tidak ada peminjaman yang sedang berjalan."
    />
  );
}