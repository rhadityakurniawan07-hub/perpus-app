'use client';

import MemberLayout from '@/components/MemberLayout';
import LoanTable from '@/components/LoanTable';
import { useLoans } from '@/hooks/useLoans';

export default function HistoryPage() {
  const { loans, loading, error } = useLoans({ mine: true });
  const historyLoans = loans.filter(
    (l) => l.status === 'RETURNED' || l.status === 'OVERDUE'
  );

  return (
    <MemberLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Riwayat Peminjaman</h1>
        <p className="text-gray-600">Daftar buku yang sudah dikembalikan</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-2 text-gray-600">Memuat data...</p>
        </div>
      ) : historyLoans.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <svg
            className="mx-auto w-16 h-16 text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-gray-600">Belum ada riwayat peminjaman</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-6">
          <LoanTable loans={historyLoans} showReturnDate={true} />
        </div>
      )}
    </MemberLayout>
  );
}