'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import { ReportStats, Loan } from '@/types';
import StatCard from '@/components/StatCard';
import ChartCard from '@/components/ChartCard';

const statusLabel: Record<Loan['status'], string> = {
  PENDING: 'Menunggu',
  APPROVED: 'Disetujui',
  REJECTED: 'Ditolak',
  CANCELLED: 'Dibatalkan',
  BORROWED: 'Dipinjam',
  RETURNED: 'Dikembalikan',
  OVERDUE: 'Terlambat',
};

const statusClass: Record<Loan['status'], string> = {
  PENDING: 'bg-blue-100 text-blue-800',
  APPROVED: 'bg-indigo-100 text-indigo-800',
  REJECTED: 'bg-red-100 text-red-800',
  CANCELLED: 'bg-gray-100 text-gray-800',
  BORROWED: 'bg-yellow-100 text-yellow-800',
  RETURNED: 'bg-green-100 text-green-800',
  OVERDUE: 'bg-red-100 text-red-800',
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<ReportStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    try {
      const response = await api.get('/reports');
      setStats(response.data);
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Gagal memuat data laporan. Pastikan server berjalan.'
      );
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-2 text-gray-600">Memuat statistik...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
        {error}
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Admin</h1>
        <p className="text-gray-600">Ringkasan aktivitas perpustakaan</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <StatCard
          title="Total Koleksi Buku"
          value={stats.totalBooks}
          color="blue"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C6.777 6.253 3 10.25 3 15c0 4.777 3.777 8.747 9 8.747s9-3.97 9-8.747c0-4.747-3.777-8.747-9-8.747z"
              />
            </svg>
          }
        />
        <StatCard
          title="Total Anggota"
          value={stats.totalMembers}
          color="purple"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6-1.13a4 4 0 100-8 4 4 0 000 8z"
              />
            </svg>
          }
        />
        <StatCard
          title="Buku Sedang Dipinjam"
          value={stats.borrowedBooks}
          color="yellow"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-9a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
        />
        <StatCard
          title="Pengajuan Menunggu"
          value={stats.pendingLoans}
          color="blue"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          }
        />
        <StatCard
          title="Buku Terlambat"
          value={stats.overdueLoans}
          color="red"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
        />
        <StatCard
          title="Total Transaksi"
          value={stats.recentLoans.length > 0 ? stats.recentLoans.length : 0}
          color="green"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ChartCard
          title="Buku Populer"
          data={stats.popularBooks
            .filter((p) => p.book)
            .map((p) => ({ label: p.book!.title, value: p.count }))}
        />

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Transaksi Terbaru</h2>
          {stats.recentLoans.length === 0 ? (
            <p className="text-sm text-gray-500 py-6 text-center">Belum ada transaksi.</p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {stats.recentLoans.slice(0, 6).map((loan) => (
                <li key={loan.id} className="py-3 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {loan.book?.title || '-'}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {loan.user?.name || '-'} ·{' '}
                      {new Date(loan.createdAt).toLocaleDateString('id-ID')}
                    </p>
                  </div>
                  <span
                    className={`flex-shrink-0 px-2 py-1 text-xs font-semibold rounded-full ${statusClass[loan.status]}`}
                  >
                    {statusLabel[loan.status]}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Buku Terlambat Dikembalikan</h2>
        {stats.lateLoans.length === 0 ? (
          <p className="text-sm text-gray-500 py-4 text-center">
            Tidak ada peminjaman yang terlambat. Bagus!
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Buku
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Peminjam
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Jatuh Tempo
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stats.lateLoans.slice(0, 10).map((loan) => (
                  <tr key={loan.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {loan.book?.title || '-'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">{loan.user?.name || '-'}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {loan.dueDate
                        ? new Date(loan.dueDate).toLocaleDateString('id-ID')
                        : '-'}
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                        Terlambat
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}