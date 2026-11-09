'use client';

import { useState, useEffect } from 'react';
import BookCard from '@/components/BookCard';
import GoogleBookCard, { GoogleBookResult } from '@/components/GoogleBookCard';
import api, { getErrorMessage } from '@/lib/axios';
import { Category, ReadingStatusValue } from '@/types';
import { useAuth } from '@/lib/auth';
import { useBooks } from '@/hooks/useBooks';
import { useReadingStatus } from '@/hooks/useReadingStatus';

const sortOptions = [
  { value: 'rating', label: 'Rating Tertinggi' },
  { value: 'title', label: 'Judul A-Z' },
  { value: 'year', label: 'Terbaru' },
];

type Mode = 'local' | 'google';

export default function BooksPage() {
  const { isAuthenticated, user } = useAuth();
  const { books, loading, error, fetchBooks } = useBooks();
  const { fetchMyReading } = useReadingStatus();

  const isAdmin = user?.role === 'ADMIN';

  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [minRating, setMinRating] = useState(false);
  const [paramsReady, setParamsReady] = useState(false);
  const [readingMap, setReadingMap] = useState<Record<string, ReadingStatusValue>>({});

  // Mode Google Books (admin saja)
  const [mode, setMode] = useState<Mode>('local');
  const [googleBooks, setGoogleBooks] = useState<GoogleBookResult[]>([]);
  const [googleTotal, setGoogleTotal] = useState(0);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleError, setGoogleError] = useState('');
  const [googleQuery, setGoogleQuery] = useState('');

  useEffect(() => {
    fetchCategories();
    const sp = new URLSearchParams(window.location.search);
    const q = sp.get('q');
    const sort = sp.get('sortBy');
    const min = sp.get('minRating');
    const cat = sp.get('category');
    const m = sp.get('mode');
    if (q) setSearch(q);
    if (sort && sortOptions.some((o) => o.value === sort)) setSortBy(sort);
    if (min === '4.5') setMinRating(true);
    if (cat) setCategory(cat);
    if (m === 'google' && isAdmin) setMode('google');
    setParamsReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!paramsReady || mode !== 'local') return;
    fetchBooks({
      search,
      category,
      minRating: minRating ? '4.5' : undefined,
      sortBy,
      order: sortBy === 'rating' || sortBy === 'year' ? 'desc' : 'asc',
    });
  }, [paramsReady, mode, search, category, minRating, sortBy, fetchBooks]);

  useEffect(() => {
    if (!isAuthenticated) {
      setReadingMap({});
      return;
    }
    fetchMyReading()
      .then((items) => {
        const map: Record<string, ReadingStatusValue> = {};
        for (const item of items) {
          map[item.bookId] = item.status;
        }
        setReadingMap(map);
      })
      .catch(() => setReadingMap({}));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  async function fetchCategories() {
    try {
      const response = await api.get('/categories');
      setCategories(response.data);
    } catch (err) {
      console.error('Gagal mengambil data kategori:', err);
    }
  }

  async function searchGoogleBooks(e: React.FormEvent) {
    e.preventDefault();
    const q = googleQuery.trim();
    if (!q) return;

    setGoogleLoading(true);
    setGoogleError('');
    try {
      const response = await api.get('/google-books/search', {
        params: { q, maxResults: 12 },
      });
      setGoogleBooks(response.data.results ?? []);
      setGoogleTotal(response.data.totalItems ?? 0);
    } catch (err) {
      setGoogleBooks([]);
      setGoogleTotal(0);
      setGoogleError(getErrorMessage(err));
    } finally {
      setGoogleLoading(false);
    }
  }

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Page heading */}
        <div className="mb-6">
          <h1 className="text-3xl font-extrabold tracking-tight text-ink">
            Katalog Pustaka &amp; Indeks Pembaca
          </h1>
          <p className="mt-1 text-slate-500">
            Menampilkan koleksi buku terkini beserta catatan status membaca terkini
          </p>
        </div>

        {/* Mode tabs: hanya untuk ADMIN */}
        {isAdmin && (
          <div className="mb-4 flex gap-2">
            <button
              onClick={() => setMode('local')}
              className={`chip ${mode === 'local' ? 'chip-active' : ''}`}
            >
              Koleksi PERPUS
            </button>
            <button
              onClick={() => setMode('google')}
              className={`chip ${mode === 'google' ? 'chip-active' : ''}`}
            >
              Google Books
            </button>
          </div>
        )}

        {/* Filters / Google Books search */}
        <div className="card mb-5 p-4">
          {mode === 'local' ? (
            <>
              <label className="relative block">
                <svg
                  className="pointer-events-none absolute left-4 top-1/2 h-6 w-6 -translate-y-1/2 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.75}
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m2.35-5.4a7.75 7.75 0 11-15.5 0 7.75 7.75 0 0115.5 0z" />
                </svg>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari judul, pengarang, subjek katalog, atau nomor ISBN..."
                  className="input-search !pl-12"
                  aria-label="Cari buku"
                />
              </label>

              <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap items-center gap-3">
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-600">
                    Urutkan:
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
                      aria-label="Urutkan buku"
                    >
                      {sortOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-brand-300">
                    <input
                      type="checkbox"
                      checked={minRating}
                      onChange={(e) => setMinRating(e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-400"
                    />
                    Rating 4,5+ Saja
                  </label>
                </div>

                <span className="badge bg-brand-100 px-3 py-1.5 text-xs font-bold text-brand-800">
                  {books.length} Judul Ditampilkan
                </span>
              </div>

              {/* Category chips */}
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Kategori:
                </span>
                <button
                  onClick={() => setCategory('')}
                  className={`chip ${category === '' ? 'chip-active' : ''}`}
                >
                  Semua Kategori
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setCategory(cat.id)}
                    className={`chip ${category === cat.id ? 'chip-active' : ''}`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <form onSubmit={searchGoogleBooks} role="search">
              <label className="relative block">
                <svg
                  className="pointer-events-none absolute left-4 top-1/2 h-6 w-6 -translate-y-1/2 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.75}
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m2.35-5.4a7.75 7.75 0 11-15.5 0 7.75 7.75 0 0115.5 0z" />
                </svg>
                <input
                  type="text"
                  value={googleQuery}
                  onChange={(e) => setGoogleQuery(e.target.value)}
                  placeholder="Cari judul buku di Google Books..."
                  className="input-search !pl-12"
                  aria-label="Cari buku di Google Books"
                />
              </label>
              <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-slate-500">
                  Hasil langsung dari Google Books. Klik <span className="font-semibold text-ink">Impor ke Katalog</span> pada buku yang ingin ditambahkan.
                </p>
                <button type="submit" disabled={googleLoading || !googleQuery.trim()} className="btn-primary !py-2">
                  {googleLoading ? 'Mencari...' : 'Cari'}
                </button>
              </div>
              {googleTotal > 0 && (
                <p className="mt-2 text-[11px] text-slate-400">
                  Menampilkan {googleBooks.length} dari {googleTotal} hasil.
                </p>
              )}
            </form>
          )}
        </div>

        {/* Error */}
        {mode === 'google' && googleError && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            {googleError}
          </div>
        )}
        {mode === 'local' && error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            {error}
          </div>
        )}

        {/* Grid: local */}
        {mode === 'local' &&
          (loading ? (
            <div className="py-16 text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-brand-600 border-t-transparent" />
              <p className="mt-3 text-sm text-slate-500">Memuat katalog...</p>
            </div>
          ) : books.length === 0 ? (
            <div className="card py-16 text-center">
              <svg className="mx-auto mb-4 h-14 w-14 text-slate-300" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              </svg>
              <p className="font-semibold text-ink">Tidak ada buku yang ditemukan</p>
              <p className="mt-1 text-sm text-slate-500">Coba ubah kata kunci atau filter Anda.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {books.map((book) => (
                <BookCard key={book.id} book={book} readingStatus={readingMap[book.id] ?? null} />
              ))}
            </div>
          ))}

        {/* Grid: Google Books */}
        {mode === 'google' &&
          (googleLoading ? (
            <div className="py-16 text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-brand-600 border-t-transparent" />
              <p className="mt-3 text-sm text-slate-500">Mencari di Google Books...</p>
            </div>
          ) : googleBooks.length === 0 ? (
            <div className="card py-16 text-center">
              <svg className="mx-auto mb-4 h-14 w-14 text-slate-300" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m2.35-5.4a7.75 7.75 0 11-15.5 0 7.75 7.75 0 0115.5 0z" />
              </svg>
              <p className="font-semibold text-ink">Belum ada hasil dari Google Books</p>
              <p className="mt-1 text-sm text-slate-500">Ketik kata kunci lalu klik Cari.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {googleBooks.map((book) => (
                <GoogleBookCard key={book.volumeId} book={book} isAdmin={isAdmin} />
              ))}
            </div>
          ))}
      </div>
    </main>
  );
}
