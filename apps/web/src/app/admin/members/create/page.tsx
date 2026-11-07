'use client';

import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import MemberForm from '@/components/MemberForm';

export default function CreateMemberPage() {
  const router = useRouter();

  async function handleSubmit(data: Record<string, unknown>) {
    try {
      await api.post('/members', data);
      router.push('/admin/members?msg=created');
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        (Array.isArray(err.response?.data?.message)
          ? err.response.data.message.join(', ')
          : null) ||
        'Gagal menyimpan anggota. Periksa kembali data yang diisi.';
      throw new Error(message);
    }
  }

  return (
    <div className="max-w-xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Tambah Anggota</h1>
        <p className="text-gray-600">Daftarkan anggota perpustakaan baru</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <MemberForm mode="create" submitLabel="Simpan Anggota" onSubmit={handleSubmit} />
      </div>
    </div>
  );
}