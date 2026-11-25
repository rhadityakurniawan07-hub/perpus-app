'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import CatalogCard, { isGoogleBook } from '@/components/CatalogCard';
import BookDetailModal from '@/components/BookDetailModal';
import { SkeletonGrid } from '@/components/Skeleton';
import api, { getErrorMessage } from '@/lib/axios';
import { Category, ReadingStatusValue, Book } from '@/types';
import { useAuth } from '@/lib/auth';
import { useBooks } from '@/hooks/useBooks';
import { useReadingStatus } from '@/hooks/useReadingStatus';
import type { GoogleBookResult } from '@/components/GoogleBookCard';
import { mapGoogleCategoriesToLocal } from '@/lib/google-books-category';

const sortOptions = [
  { value: 'rating', label: 'Rating Tertinggi' },
  { value: 'title', label: 'Judul A-Z' },
  { value: 'year', label: 'Terbaru' },
];

const imageCategoryChips = [
  { label: 'Semua Kategori', value: '' },
  { label: 'Sastra Klasik', value: 'cat_fiksi' },
  { label: 'Filsafat & Pemikiran', value: 'cat_filsafat' },
  { label: 'Sains & Kosmologi', value: 'cat_sains' },
  { label: 'Teknologi & AI', value: 'cat_sains' },
  { label: 'Sejarah Dunia', value: 'cat_sejarah' },
  { label: 'Matematika & Logika', value: 'cat_sains' },
];

const GOOGLE_PAGE_SIZE = 40;

type CatalogItem =
  | { kind: 'local'; book: Book }
  | { kind: 'google'; book: GoogleBookResult & { __isGoogle: true } };

type GoogleCatalogBook = GoogleBookResult & { __isGoogle: true };

export default function BooksPage() {
  const { isAuthenticated, user } = useAuth();
  const { books, loading, error, fetchBooks, loadMore, hasMore } = useBooks();
  const { fetchMyReading } = useReadingStatus();
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const isAdmin = user?.role === 'ADMIN';

  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [minRating, setMinRating] = useState(false);
  const [minYear, setMinYear] = useState('');
  const [maxYear, setMaxYear] = useState('');
  const [paramsReady, setParamsReady] = useState(false);
  const [readingMap, setReadingMap] = useState<Record<string, ReadingStatusValue>>({});

  const [googleBooks, setGoogleBooks] = useState<GoogleCatalogBook[]>([]);
  const [googleTotal, setGoogleTotal] = useState(0);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleLoadingMore, setGoogleLoadingMore] = useState(false);
  const [googleError, setGoogleError] = useState('');
  const googleStartIndexRef = useRef(0);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const trimmedSearch = search.trim();
  const isSearching = trimmedSearch.length >= 2;

  useEffect(() => {
    fetchCategories();
    const sp = new URLSearchParams(window.location.search);
    const q = sp.get('q');
    const sort = sp.get('sortBy');
    const min = sp.get('minRating');
    const cat = sp.get('category');
    if (q) setSearch(q);
    if (sort && sortOptions.some((o) => o.value === sort)) setSortBy(sort);
    if (min === '4.5') setMinRating(true);
    if (cat) setCategory(cat);
    setParamsReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!paramsReady) return;
    fetchBooks({
      search,
      category,
      minRating: minRating ? '4.5' : undefined,
      minYear: minYear || undefined,
      maxYear: maxYear || undefined,
      sortBy,
      order: sortBy === 'rating' || sortBy === 'year' ? 'desc' : 'asc',
      page: 1,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramsReady, search, category, minRating, minYear, maxYear, sortBy]);

  // Debounce Google Books fetch
  useEffect(() => {
    if (!paramsReady) return;
    if (!isSearching) {
      setGoogleBooks([]);
      setGoogleTotal(0);
      setGoogleError('');
      return;
    }
    googleStartIndexRef.current = 0;
    const timer = setTimeout(() => {
      fetchGoogleBooks(trimmedSearch, 0, false);
    }, 500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramsReady, trimmedSearch]);

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

  async function fetchGoogleBooks(q: string, startIndex: number, append: boolean) {
    if (startIndex === 0) {
      setGoogleLoading(true);
    } else {
      setGoogleLoadingMore(true);
    }
    setGoogleError('');
    try {
      const response = await api.get('/google-books/public/search', {
        params: { q, maxResults: GOOGLE_PAGE_SIZE, startIndex },
      });
      const results = response.data.results ?? [];
      const total = response.data.totalItems ?? 0;
      setGoogleTotal(total);
      googleStartIndexRef.current = startIndex + results.length;
      setGoogleBooks((prev) => {
        if (!append) return results.map((g: GoogleBookResult) => ({ ...g, __isGoogle: true as const }));
        const seen = new Set(
          prev.map((b) => b.volumeId)
        );
        const merged = [...prev];
        for (const g of results) {
          const book: GoogleCatalogBook = { ...g, __isGoogle: true as const };
          if (!seen.has(book.volumeId)) merged.push(book);
        }
        return merged;
      });
    } catch (err) {
      if (!append) {
        setGoogleBooks([]);
        setGoogleTotal(0);
      }
      setGoogleError(getErrorMessage(err));
    } finally {
      setGoogleLoading(false);
      setGoogleLoadingMore(false);
    }
  }

  const loadMoreGoogle = useCallback(() => {
    if (!isSearching) return;
    if (googleLoading || googleLoadingMore) return;
    if (googleBooks.length >= googleTotal) return;
    fetchGoogleBooks(trimmedSearch, googleStartIndexRef.current, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSearching, trimmedSearch, googleLoading, googleLoadingMore, googleBooks.length, googleTotal]);

  // Infinite scroll sentinel
  useEffect(() => {
    if (!isSearching) return;
    if (!sentinelRef.current) return;
    if (googleBooks.length >= googleTotal) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          loadMoreGoogle();
        }
      },
      { rootMargin: '400px' }
    );
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [isSearching, googleBooks.length, googleTotal, loadMoreGoogle]);

  // Filter kategori untuk Google Books
  const googleFiltered = useMemo(() => {
    if (!category) return googleBooks;
    return googleBooks.filter((g) => {
      const catId = mapGoogleCategoriesToLocal(g.categories ?? [], categories);
      return catId === category;
    });
  }, [googleBooks, category, categories]);

  // Gabungkan lokal + Google Books, terapkan filter rating 4.5+ khusus lokal
  const merged: CatalogItem[] = useMemo(() => {
    const localItems: CatalogItem[] = books
      .filter((b) => !minRating || (b.averageRating ?? 0) >= 4.5)
      .map((b) => ({ kind: 'local', book: b }));

    const googleItems: CatalogItem[] = minRating
      ? []
      : googleFiltered.map((g) => ({ kind: 'google', book: g }));

    const all = [...localItems, ...googleItems];

    all.sort((a, b) => {
      const aVal = isGoogleBook(a.book) ? 0 : (a.book as Book).averageRating ?? 0;
      const bVal = isGoogleBook(b.book) ? 0 : (b.book as Book).averageRating ?? 0;
      switch (sortBy) {
        case 'rating':
          return bVal - aVal;
        case 'title':
          return (a.book.title ?? '').localeCompare(b.book.title ?? '');
        case 'year':
          return (b.book.year ?? 0) - (a.book.year ?? 0);
        default:
          return 0;
      }
    });

    return all;
  }, [books, googleFiltered, minRating, sortBy]);

  const anyLoading = loading || googleLoading;
  const showEmpty = !anyLoading && merged.length === 0 && isSearching;

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Page heading */}
        <div className="mb-5">
          <span className="badge bg-violet-100 text-violet-800 dark:text-violet-300 ring-1 ring-violet-200">
            Katalog &amp; Indeks
          </span>
          <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-ink dark:text-slate-100 sm:text-5xl">
            Katalog Koleksi{' '}
            <span className="bg-gradient-to-br from-violet-700 via-violet-500 to-amber-400 bg-clip-text text-transparent">
              PERPUS
            </span>
          </h1>
          <span
            aria-hidden="true"
            className="mt-3 block h-1 w-24 rounded-full bg-gradient-to-r from-violet-600 via-amber-400 to-emerald-400"
          />
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 dark:text-slate-500">
            Persembahan kurasi dari katalog pusat dan Google Books — urutkan, cari,
            dan Anda sendiri yang menentukan untuk memberikan rating Anda.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6 rounded-3xl border border-violet-100 dark:border-violet-800 bg-white dark:bg-slate-800 p-4 shadow-card sm:p-5">
          <label className="relative block">
            <svg
              className="pointer-events-none absolute left-5 top-1/2 h-6 w-6 -translate-y-1/2 text-slate-400 dark:text-slate-500"
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
              placeholder="Cari judul buku, sastrawan, pengarang, ISBN, atau topik..."
              className="input-search !rounded-full !py-4 !pl-14 !text-base"
              aria-label="Cari buku"
            />
          </label>

          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-full border border-slate-200 dark:border-slate-600 bg-lavender dark:bg-slate-800 dark:bg-slate-900 px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 outline-none focus:border-brand-400 focus-visible:ring-2 focus-visible:ring-brand-400"
                aria-label="Urutkan buku"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>

              {!isSearching && (
                <label className="flex cursor-pointer select-none items-center gap-2 rounded-full border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 transition hover:border-brand-300">
                  <input
                    type="checkbox"
                    checked={minRating}
                    onChange={(e) => setMinRating(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-400"
                  />
                  ✓ 4.5+ Saja
                </label>
              )}

              {/* Year range filter */}
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={minYear}
                  onChange={(e) => setMinYear(e.target.value)}
                  placeholder="Tahun min"
                  className="w-24 rounded-full border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2.5 text-sm text-slate-700 dark:text-slate-200 outline-none focus:border-brand-400 focus-visible:ring-2 focus-visible:ring-brand-400"
                  aria-label="Tahun minimum"
                />
                <span className="text-xs text-slate-400 dark:text-slate-500">—</span>
                <input
                  type="number"
                  value={maxYear}
                  onChange={(e) => setMaxYear(e.target.value)}
                  placeholder="Tahun max"
                  className="w-24 rounded-full border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2.5 text-sm text-slate-700 dark:text-slate-200 outline-none focus:border-brand-400 focus-visible:ring-2 focus-visible:ring-brand-400"
                  aria-label="Tahun maksimum"
                />
              </div>
            </div>

            <span className="badge bg-violet-600 dark:bg-violet-500 px-4 py-2 text-xs font-bold text-white">
              {merged.length} Judul Ditampilkan
            </span>
          </div>

          {/* Category chips (label per gambar, mapping internal ke kategori DB) */}
          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-violet-100 dark:border-violet-800 pt-4">
            {imageCategoryChips.map((chip) => (
              <button
                key={chip.label}
                onClick={() => setCategory(chip.value)}
                className={`chip !text-xs ${category === chip.value ? 'chip-active !border-violet-600 !bg-violet-600 dark:bg-violet-500' : '!border-violet-200 !bg-violet-50 dark:bg-violet-900/30 !text-violet-800 dark:text-violet-300 hover:!border-violet-600'}`}
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>

        {/* Errors */}
        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            {error}
          </div>
        )}
        {googleError && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            {googleError}
          </div>
        )}

        {/* Grid: gabungan lokal + Google Books */}
        {anyLoading ? (
          <SkeletonGrid count={6} />
        ) : showEmpty ? (
          <div className="card py-16 text-center">
            <svg className="mx-auto mb-4 h-14 w-14 text-slate-300" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
            <p className="font-semibold text-ink dark:text-slate-100">Tidak ada buku yang ditemukan</p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 dark:text-slate-500">Coba ubah kata kunci atau filter Anda.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {merged.map((item, index) =>
                item.kind === 'local' ? (
                  <CatalogCard
                    key={`local-${item.book.id}`}
                    book={item.book}
                    readingStatus={readingMap[item.book.id] ?? null}
                    onOpen={(b) => setSelectedBook(b as Book)}
                  />
                ) : (
                  <CatalogCard
                    key={`google-${item.book.volumeId}-${index}`}
                    book={item.book}
                  />
                )
              )}
            </div>

            {/* Muat lebih banyak (buku lokal) */}
            {!isSearching && hasMore && !anyLoading && (
              <div className="flex items-center justify-center py-8">
                <button
                  onClick={loadMore}
                  disabled={loading}
                  className="btn-outline flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-brand-600 border-t-transparent" />
                      Memuat...
                    </>
                  ) : (
                    'Muat lebih banyak'
                  )}
                </button>
              </div>
            )}

            {/* Sentinel infinite scroll (hanya saat mencari) */}
            {isSearching && googleBooks.length < googleTotal && !minRating && (
              <div ref={sentinelRef} className="flex items-center justify-center py-8">
                {googleLoadingMore ? (
                  <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400 dark:text-slate-500">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-brand-600 border-t-transparent" />
                    Memuat buku berikutnya...
                  </div>
                ) : (
                  <button onClick={loadMoreGoogle} className="btn-outline">
                    Muat lebih banyak hasil dari Google Books
                  </button>
                )}
              </div>
            )}

            {/* Modal detail buku */}
            {selectedBook && (
              <BookDetailModal
                book={selectedBook}
                onClose={() => setSelectedBook(null)}
              />
            )}
          </>
        )}
      </div>
    </main>
  );
}

