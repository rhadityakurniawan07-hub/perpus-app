'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import MemberLayout from '@/components/MemberLayout';
import LoanTable from '@/components/LoanTable';
import { useLoans } from '@/hooks/useLoans';

export default function DashboardPage() {
  const { user } = useAuth();
  const { loans, loading, error } = useLoans({ mine: true });

  const activeLoans = loans.filter(
    (l) => l.status === 'BORROWED' || l.status === 'PENDING'
  );
  const historyLoans = loans.filter(
    (l) => l.status === 'RETURNED' || l.status === 'OVERDUE'
  );

  return (
    <MemberLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Selamat datang, {user?.name}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg
                className="w-8 h-8 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C6.777 6.253 3 10.25 3 15c0 4.777 3.777 8.747 9 8.747s9-3.97 9-8.747c0-4.747-3.777-8.747-9-8.747zM9 17l9-5 9 5"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Peminjaman Aktif</p>
              <p className="text-2xl font-semibold text-gray-900">{activeLoans.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Sudah Dikembalikan</p>
              <p className="text-2xl font-semibold text-gray-900">{historyLoans.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg
                className="w-8 h-8 text-yellow-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-9a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Menunggu Persetujuan</p>
              <p className="text-2xl font-semibold text-gray-900">
                {loans.filter((l) => l.status === 'PENDING').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Peminjaman Aktif</h2>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4 text-sm">
            {error}
          </div>
        )}
        {loading ? (
          <div className="text-center py-4">
            <div className="inline-block w-6 h-6 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : activeLoans.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>Belum ada peminjaman aktif.</p>
            <Link
              href="/books"
              className="mt-2 inline-block text-blue-600 hover:text-blue-800"
            >
              Cari dan pinjam buku sekarang →
            </Link>
          </div>
        ) : (
          <LoanTable loans={activeLoans} />
        )}
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Riwayat Peminjaman</h2>
          <Link href="/history" className="text-sm text-blue-600 hover:text-blue-800">
            Lihat Semua →
          </Link>
        </div>
        {historyLoans.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Belum ada riwayat peminjaman.
          </div>
        ) : (
          <LoanTable loans={historyLoans.slice(0, 5)} showReturnDate={true} />
        )}
      </div>
    </MemberLayout>
  );
}