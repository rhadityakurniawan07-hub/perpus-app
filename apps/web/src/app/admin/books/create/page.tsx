'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import BookForm from '@/components/BookForm';
import { Book } from '@/types';

export default function CreateBookPage() {
  const router = useRouter();

  // Data hasil impor Google Books disimpan di sessionStorage oleh modal impor.
  const [imported] = useState<Book | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      const raw = sessionStorage.getItem('googleBooksImport');
      if (raw) {
        sessionStorage.removeItem('googleBooksImport');
        const book = JSON.parse(raw);
        return {
          id: '',
          title: book.title ?? '',
          author: book.author ?? '',
          publisher: book.publisher ?? '',
          categoryId: '',
          isbn: book.isbn ?? '',
          year: book.year ?? 0,
          description: book.description ?? '',
          coverImage: book.coverImage ?? '',
          totalStock: 0,
          availableStock: 0,
          shelfLocation: '',
          averageRating: 0,
          reviewCount: 0,
          positivePercent: 0,
          createdAt: '',
          updatedAt: '',
        } satisfies Partial<Book> as Book;
      }
    } catch {
      // abaikan data impor yang rusak
    }
    return null;
  });

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
        <p className="text-gray-600">
          {imported
            ? 'Form terisi dari impor Google Books — lengkapi kategori & stok, lalu simpan.'
            : 'Masukkan informasi buku baru'}
        </p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <BookForm submitLabel="Simpan Buku" onSubmit={handleSubmit} initialData={imported ?? undefined} />
      </div>
    </div>
  );
}
