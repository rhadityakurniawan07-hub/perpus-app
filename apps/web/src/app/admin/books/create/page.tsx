'use client';

import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import BookForm from '@/components/BookForm';

export default function CreateBookPage() {
  const router = useRouter();

  async function handleSubmit(data: Record<string, unknown>) {
    try {
      await api.post('/books', data);
      router.push('/admin/books?msg=created');
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        (Array.isArray(err.response?.data?.message)
          ? err.response.data.message.join(', ')
          : null) ||
        'Gagal menyimpan buku. Periksa kembali data yang diisi.';
      throw new Error(message);
    }
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Tambah Buku</h1>
        <p className="text-gray-600">Masukkan informasi buku baru</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <BookForm submitLabel="Simpan Buku" onSubmit={handleSubmit} />
      </div>
    </div>
  );
}