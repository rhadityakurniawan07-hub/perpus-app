'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import { Loan } from '@/types';
import MemberLayout from '@/components/MemberLayout';
import LoanTable from '@/components/LoanTable';

export default function HistoryPage() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLoans();
  }, []);

  async function fetchLoans() {
    try {
      const response = await api.get('/loans/my-loans');
      setLoans(response.data.filter((l: Loan) => l.status === 'RETURNED' || l.status === 'OVERDUE'));
    } catch (error) {
      console.error('Gagal mengambil riwayat:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <MemberLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Riwayat Peminjaman</h1>
        <p className="text-gray-600">Daftar buku yang sudah dikembalikan</p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-2 text-gray-600">Memuat data...</p>
        </div>
      ) : loans.length === 0 ? (
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
          <LoanTable loans={loans} showReturnDate={true} />
        </div>
      )}
    </MemberLayout>
  );
}