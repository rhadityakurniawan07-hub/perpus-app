'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { User, Loan } from '@/types';
import MemberForm from '@/components/MemberForm';

interface MemberDetail extends User {
  loans?: Loan[];
}

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

export default function EditMemberPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [member, setMember] = useState<MemberDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMember();
  }, [params.id]);

  async function fetchMember() {
    try {
      const response = await api.get(`/members/${params.id}`);
      if (!response.data) {
        setError('Anggota tidak ditemukan.');
      } else {
        setMember(response.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal memuat data anggota.');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(data: Record<string, unknown>) {
    try {
      await api.patch(`/members/${params.id}`, data);
      router.push('/admin/members?msg=updated');
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        (Array.isArray(err.response?.data?.message)
          ? err.response.data.message.join(', ')
          : null) ||
        'Gagal memperbarui data anggota.';
      throw new Error(message);
    }
  }

  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="inline-block w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-2 text-gray-600">Memuat data anggota...</p>
      </div>
    );
  }

  if (error || !member) {
    return (
      <div className="max-w-xl">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error || 'Anggota tidak ditemukan.'}
        </div>
        <button
          onClick={() => router.push('/admin/members')}
          className="mt-4 text-sm text-purple-600 hover:text-purple-800 font-medium"
        >
          ← Kembali ke daftar anggota
        </button>
      </div>
    );
  }

  const loans = member.loans || [];

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Edit Anggota</h1>
        <p className="text-gray-600">Perbarui data anggota &quot;{member.name}&quot;</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <MemberForm
            mode="edit"
            initialData={member}
            submitLabel="Simpan Perubahan"
            onSubmit={handleSubmit}
          />
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-1">
            Riwayat Peminjaman
          </h2>
          <p className="text-sm text-gray-500 mb-4">{loans.length} total transaksi</p>

          {loans.length === 0 ? (
            <p className="text-sm text-gray-500 py-6 text-center">
              Belum ada riwayat peminjaman.
            </p>
          ) : (
            <ul className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
              {loans
                .slice()
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .map((loan) => (
                  <li key={loan.id} className="py-3 flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {loan.book?.title || '-'}
                      </p>
                      <p className="text-xs text-gray-500">
                        Pinjam:{' '}
                        {loan.borrowDate
                          ? new Date(loan.borrowDate).toLocaleDateString('id-ID')
                          : loan.requestDate
                            ? new Date(loan.requestDate).toLocaleDateString('id-ID')
                            : '-'}
                        {loan.returnDate && (
                          <> · Kembali: {new Date(loan.returnDate).toLocaleDateString('id-ID')}</>
                        )}
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
    </div>
  );
}