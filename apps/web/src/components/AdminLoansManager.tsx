'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import api from '@/lib/axios';
import { Loan } from '@/types';
import AdminLoanTable from '@/components/AdminLoanTable';

const tabs = [
  { name: 'Semua', href: '/admin/loans' },
  { name: 'Menunggu', href: '/admin/loans/pending' },
  { name: 'Dipinjam', href: '/admin/loans/active' },
  { name: 'Riwayat', href: '/admin/loans/returned' },
];

type ActionMode = 'all' | 'approve-reject' | 'return' | 'none';

interface AdminLoansManagerProps {
  title: string;
  subtitle: string;
  statuses?: Loan['status'][];
  actionMode: ActionMode;
  dateLabel?: 'request' | 'borrow';
  emptyText?: string;
}

export default function AdminLoansManager({
  title,
  subtitle,
  statuses,
  actionMode,
  dateLabel = 'request',
  emptyText = 'Tidak ada data transaksi.',
}: AdminLoansManagerProps) {
  const pathname = usePathname();
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [banner, setBanner] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetchLoans();
  }, []);

  async function fetchLoans() {
    try {
      const response = await api.get('/loans');
      let data: Loan[] = response.data;
      if (statuses && statuses.length > 0) {
        data = data.filter((l) => statuses.includes(l.status));
      }
      setLoans(data);
      setError('');
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Gagal memuat data transaksi. Pastikan server berjalan.'
      );
    } finally {
      setLoading(false);
    }
  }

  function refreshAfterAction(updated: Loan) {
    setLoans((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
    // Jika status berubah tidak cocok lagi dengan filter halaman, hapus dari daftar
    if (statuses && statuses.length > 0 && !statuses.includes(updated.status)) {
      setLoans((prev) => prev.filter((l) => l.id !== updated.id));
    }
  }

  async function handleApprove(loan: Loan) {
    const confirmed = window.confirm(
      `Setujui peminjaman "${loan.book?.title}" oleh ${loan.user?.name}? Stok buku akan berkurang 1 dan jatuh tempo 7 hari.`
    );
    if (!confirmed) return;

    setBusy(true);
    try {
      const response = await api.post(`/loans/${loan.id}/approve`);
      refreshAfterAction(response.data);
      setBanner('Peminjaman disetujui. Buku siap diambil anggota.');
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal menyetujui peminjaman.');
    } finally {
      setBusy(false);
    }
  }

  async function handleReject(loan: Loan) {
    const confirmed = window.confirm(
      `Tolak pengajuan peminjaman "${loan.book?.title}" oleh ${loan.user?.name}?`
    );
    if (!confirmed) return;

    setBusy(true);
    try {
      const response = await api.post(`/loans/${loan.id}/reject`);
      refreshAfterAction(response.data);
      setBanner('Pengajuan peminjaman ditolak.');
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal menolak pengajuan.');
    } finally {
      setBusy(false);
    }
  }

  async function handleReturn(loan: Loan) {
    const confirmed = window.confirm(
      `Proses pengembalian buku "${loan.book?.title}" dari ${loan.user?.name}?`
    );
    if (!confirmed) return;

    setBusy(true);
    try {
      const response = await api.post(`/loans/${loan.id}/return`);
      refreshAfterAction(response.data);
      const isLate = response.data?.status === 'OVERDUE';
      setBanner(
        isLate
          ? 'Buku berhasil dikembalikan, tapi terlambat dari jatuh tempo (status: Terlambat).'
          : 'Buku berhasil dikembalikan. Stok bertambah 1.'
      );
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal memproses pengembalian.');
    } finally {
      setBusy(false);
    }
  }

  const showApprove = actionMode === 'all' || actionMode === 'approve-reject';
  const showReject = actionMode === 'all' || actionMode === 'approve-reject';
  const showReturn = actionMode === 'all' || actionMode === 'return';

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        <p className="text-gray-600">{subtitle}</p>
      </div>

      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-6 overflow-x-auto">
          {tabs.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              className={`whitespace-nowrap pb-3 px-1 border-b-2 text-sm font-medium ${
                pathname === tab.href
                  ? 'border-purple-600 text-purple-700'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.name}
            </Link>
          ))}
        </nav>
      </div>

      {banner && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md mb-4 flex items-center justify-between">
          <span>{banner}</span>
          <button onClick={() => setBanner('')} className="text-green-700 font-bold ml-4">
            ×
          </button>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4 flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError('')} className="text-red-700 font-bold ml-4">
            ×
          </button>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-2 text-gray-600">Memuat data transaksi...</p>
          </div>
        ) : loans.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg">{emptyText}</p>
          </div>
        ) : (
          <AdminLoanTable
            loans={loans}
            dateLabel={dateLabel}
            onApprove={showApprove ? handleApprove : undefined}
            onReject={showReject ? handleReject : undefined}
            onReturn={showReturn ? handleReturn : undefined}
          />
        )}
      </div>

      {busy && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg px-6 py-4 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm text-gray-700">Memproses transaksi...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}