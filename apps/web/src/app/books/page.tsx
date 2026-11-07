'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import BookCard from '@/components/BookCard';
import api from '@/lib/axios';
import { Category } from '@/types';
import { useBooks } from '@/hooks/useBooks';

export default function BooksPage() {
  const { books, loading, error, fetchBooks } = useBooks();
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [available, setAvailable] = useState('');
  const [sortBy, setSortBy] = useState('title');
  const [order, setOrder] = useState('asc');

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchBooks({ search, category, available, sortBy, order });
  }, [search, category, available, sortBy, order, fetchBooks]);

  async function fetchCategories() {
    try {
      const response = await api.get('/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Gagal mengambil data kategori:', error);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Katalog Buku</h1>
          <p className="text-gray-600 mt-2">Jelajahi koleksi buku perpustakaan</p>
        </div>

        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <input
                type="text"
                placeholder="Cari berdasarkan judul atau penulis..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">Semua Kategori</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <select
              value={available}
              onChange={(e) => setAvailable(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">Semua</option>
              <option value="true">Tersedia</option>
              <option value="false">Habis</option>
            </select>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Urutkan:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="title">Judul</option>
                <option value="year">Tahun Terbit</option>
              </select>
              <select
                value={order}
                onChange={(e) => setOrder(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
            <span className="text-sm text-gray-500">
              {books.length} buku ditemukan
            </span>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-2 text-gray-600">Memuat buku...</p>
          </div>
        ) : books.length === 0 ? (
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
            <p className="text-gray-600">Tidak ada buku yang ditemukan</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}