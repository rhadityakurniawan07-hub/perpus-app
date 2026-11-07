'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import api, { getErrorMessage } from '@/lib/axios';
import { User } from '@/types';
import MemberTable from '@/components/MemberTable';
import { useMembers } from '@/hooks/useMembers';

const PAGE_SIZE = 10;

const messages: Record<string, string> = {
  created: 'Anggota berhasil ditambahkan.',
  updated: 'Anggota berhasil diperbarui.',
  deleted: 'Anggota berhasil dihapus.',
};

export default function AdminMembersPage() {
  const { members, setMembers, loading, error, setError, fetchMembers } = useMembers();
  const [banner, setBanner] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const msg = params.get('msg');
    if (msg && messages[msg]) {
      setBanner(messages[msg]);
      window.history.replaceState({}, '', '/admin/members');
    }
    fetchMembers();
  }, [fetchMembers]);

  const filtered = members.filter((m) => {
    const q = search.toLowerCase();
    return m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q);
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageMembers = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  async function handleToggleStatus(member: User) {
    const nextStatus = member.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    const actionText = nextStatus === 'INACTIVE' ? 'menonaktifkan' : 'mengaktifkan';
    const confirmed = window.confirm(
      `Yakin ingin ${actionText} akun "${member.name}"?`
    );
    if (!confirmed) return;

    setBusy(true);
    try {
      await api.patch(`/members/${member.id}`, { status: nextStatus });
      setMembers((prev) =>
        prev.map((m) => (m.id === member.id ? { ...m, status: nextStatus } : m))
      );
      setBanner(
        `Akun "${member.name}" berhasil ${nextStatus === 'INACTIVE' ? 'dinonaktifkan' : 'diaktifkan'}.`
      );
      setError('');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(member: User) {
    const confirmed = window.confirm(
      `Yakin ingin menghapus anggota "${member.name}"? Tindakan ini tidak bisa dibatalkan.`
    );
    if (!confirmed) return;

    setBusy(true);
    try {
      await api.delete(`/members/${member.id}`);
      setMembers((prev) => prev.filter((m) => m.id !== member.id));
      setBanner(`Anggota "${member.name}" berhasil dihapus.`);
      setError('');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kelola Anggota</h1>
          <p className="text-gray-600">Total {members.length} anggota terdaftar</p>
        </div>
        <Link
          href="/admin/members/create"
          className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium text-white bg-purple-600 hover:bg-purple-700"
        >
          + Tambah Anggota
        </Link>
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
        <div className="p-4 border-b border-gray-200">
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="block w-full max-w-md border border-gray-300 rounded-md px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            placeholder="Cari nama atau email anggota..."
          />
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-2 text-gray-600">Memuat data anggota...</p>
          </div>
        ) : (
          <>
            <MemberTable
              members={pageMembers}
              onToggleStatus={handleToggleStatus}
              onDelete={handleDelete}
            />

            {filtered.length > PAGE_SIZE && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  Halaman {currentPage} dari {totalPages} ({filtered.length} anggota)
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage <= 1}
                    className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Sebelumnya
                  </button>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage >= totalPages}
                    className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Berikutnya
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {busy && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg px-6 py-4 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm text-gray-700">Memproses...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}