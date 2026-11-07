'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { Book } from '@/types';
import BookForm from '@/components/BookForm';

export default function EditBookPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBook();
  }, [params.id]);

  async function fetchBook() {
    try {
      const response = await api.get(`/books/${params.id}`);
      if (!response.data) {
        setError('Buku tidak ditemukan.');
      } else {
        setBook(response.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal memuat data buku.');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(data: Record<string, unknown>) {
    try {
      await api.patch(`/books/${params.id}`, data);
      router.push('/admin/books?msg=updated');
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        (Array.isArray(err.response?.data?.message)
          ? err.response.data.message.join(', ')
          : null) ||
        'Gagal memperbarui buku.';
      throw new Error(message);
    }
  }

  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-2 text-gray-600">Memuat data buku...</p>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="max-w-3xl">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error || 'Buku tidak ditemukan.'}
        </div>
        <button
          onClick={() => router.push('/admin/books')}
          className="mt-4 text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          ← Kembali ke daftar buku
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Edit Buku</h1>
        <p className="text-gray-600">Perbarui informasi buku &quot;{book.title}&quot;</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <BookForm initialData={book} submitLabel="Simpan Perubahan" onSubmit={handleSubmit} />
      </div>
    </div>
  );
}