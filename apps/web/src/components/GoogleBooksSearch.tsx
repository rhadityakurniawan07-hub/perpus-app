'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api, { getErrorMessage } from '@/lib/axios';

interface GoogleBook {
  volumeId: string;
  title: string;
  author: string;
  publisher: string;
  year: number | null;
  isbn: string | null;
  description: string;
  coverImage: string | null;
  categories: string[];
}

interface GoogleBooksSearchProps {
  onClose: () => void;
}

export default function GoogleBooksSearch({ onClose }: GoogleBooksSearchProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GoogleBook[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState('');

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;

    setSearching(true);
    setError('');
    try {
      const response = await api.get('/google-books/search', {
        params: { q, maxResults: 12 },
      });
      setResults(response.data.results ?? []);
      setTotalItems(response.data.totalItems ?? 0);
    } catch (err) {
      setResults([]);
      setTotalItems(0);
      setError(getErrorMessage(err));
    } finally {
      setSearching(false);
    }
  }

  function handleImport(book: GoogleBook) {
    sessionStorage.setItem('googleBooksImport', JSON.stringify(book));
    router.push('/admin/books/create');
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Import buku dari Google Books"
    >
      <div
        className="card flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 p-5">
          <div>
            <h2 className="text-xl font-extrabold text-ink">Import dari Google Books</h2>
            <p className="mt-1 text-sm text-slate-500">
              Cari buku lalu klik <span className="font-semibold">Impor</span>; form Tambah Buku akan terisi otomatis.
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Tutup"
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSearch} className="border-b border-slate-100 p-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
              placeholder="Cari judul buku, misal: Bumi Manusia..."
              className="input-search flex-1"
              aria-label="Cari buku di Google Books"
            />
            <button type="submit" disabled={searching || !query.trim()} className="btn-primary">
              {searching ? 'Mencari...' : 'Cari'}
            </button>
          </div>
          {totalItems > 0 && (
            <p className="mt-2 text-xs text-slate-500">
              Menampilkan {results.length} dari {totalItems} hasil dari Google Books.
            </p>
          )}
          {error && (
            <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}
        </form>

        <div className="flex-1 overflow-y-auto p-4">
          {results.length === 0 && !searching && !error && (
            <p className="py-10 text-center text-sm text-slate-400">
              Ketik kata kunci lalu klik Cari.
            </p>
          )}
          {searching && (
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-600 border-t-transparent" />
            </div>
          )}
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {results.map((book) => (
              <li key={book.volumeId} className="flex gap-3 rounded-xl border border-slate-200 bg-white p-3">
                <div className="flex h-24 w-16 shrink-0 items-center justify-center overflow-hidden rounded-md bg-gradient-to-br from-brand-700 to-ink text-brand-200">
                  {book.coverImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={book.coverImage} alt={book.title} className="h-full w-full object-cover" />
                  ) : (
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                    </svg>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-2 text-sm font-semibold text-ink">{book.title}</p>
                  <p className="mt-0.5 line-clamp-1 text-xs text-slate-500">{book.author}</p>
                  <p className="mt-0.5 text-[11px] text-slate-400">
                    {book.year ?? '-'}{book.isbn ? ` · ISBN ${book.isbn}` : ''}
                  </p>
                  <button
                    onClick={() => handleImport(book)}
                    className="mt-2 inline-flex items-center gap-1 rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-brand-700"
                  >
                    Impor
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
