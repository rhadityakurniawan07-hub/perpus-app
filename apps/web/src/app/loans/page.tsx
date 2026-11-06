'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/lib/axios';
import { Loan } from '@/types';
import MemberLayout from '@/components/MemberLayout';
import LoanTable from '@/components/LoanTable';

export default function LoansPage() {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLoans();
  }, []);

  async function fetchLoans() {
    try {
      const response = await api.get('/loans/my-loans');
      setLoans(response.data.filter((l: Loan) => l.status === 'BORROWED' || l.status === 'PENDING'));
    } catch (error) {
      console.error('Gagal mengambil data peminjaman:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <MemberLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Peminjaman Saya</h1>
        <p className="text-gray-600">Daftar buku yang sedang atau menunggu peminjaman</p>
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
              d="M12 6.253v13m0-13C6.777 6.253 3 10.25 3 15c0 4.777 3.777 8.747 9 8.747s9-3.97 9-8.747c0-4.747-3.777-8.747-9-8.747zM9 17l9-5 9 5"
            />
          </svg>
          <p className="text-gray-600 mb-4">Belum ada peminjaman aktif</p>
          <Link
            href="/books"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Cari Buku
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-6">
          <LoanTable loans={loans} />
        </div>
      )}
    </MemberLayout>
  );
}