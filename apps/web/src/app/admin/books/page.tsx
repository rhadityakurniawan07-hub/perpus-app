'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/lib/axios';
import { Book } from '@/types';
import BookTable from '@/components/BookTable';

const PAGE_SIZE = 10;

const messages: Record<string, string> = {
  created: 'Buku berhasil ditambahkan.',
  updated: 'Buku berhasil diperbarui.',
  deleted: 'Buku berhasil dihapus.',
};

export default function AdminBooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [banner, setBanner] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const msg = params.get('msg');
    if (msg && messages[msg]) {
      setBanner(messages[msg]);
      window.history.replaceState({}, '', '/admin/books');
    }
    fetchBooks();
  }, []);

  async function fetchBooks() {
    try {
      const response = await api.get('/books');
      setBooks(response.data);
      setError('');
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Gagal memuat daftar buku. Pastikan server berjalan.'
      );
    } finally {
      setLoading(false);
    }
  }

  const filtered = books.filter((b) => {
    const q = search.toLowerCase();
    return b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q);
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageBooks = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  async function handleDelete(book: Book) {
    const confirmed = window.confirm(
      `Yakin ingin menghapus buku "${book.title}"? Tindakan ini tidak bisa dibatalkan.`
    );
    if (!confirmed) return;

    setDeleting(true);
    try {
      await api.delete(`/books/${book.id}`);
      setBooks((prev) => prev.filter((b) => b.id !== book.id));
      setBanner(`Buku "${book.title}" berhasil dihapus.`);
      setError('');
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          err.message ||
          'Gagal menghapus buku. Buku mungkin masih memiliki peminjaman aktif.'
      );
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kelola Buku</h1>
          <p className="text-gray-600">Total {books.length} buku terdaftar</p>
        </div>
        <Link
          href="/admin/books/create"
          className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          + Tambah Buku
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
            className="block w-full max-w-md border border-gray-300 rounded-md px-3 py-2 text-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Cari judul atau penulis..."
          />
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-2 text-gray-600">Memuat data buku...</p>
          </div>
        ) : (
          <>
            <BookTable books={pageBooks} onDelete={handleDelete} />

            {filtered.length > PAGE_SIZE && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  Halaman {currentPage} dari {totalPages} ({filtered.length} buku)
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

      {deleting && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg px-6 py-4 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm text-gray-700">Menghapus buku...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}