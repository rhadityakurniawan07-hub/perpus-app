'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api, { getErrorMessage } from '@/lib/axios';

export interface GoogleBookResult {
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

interface GoogleBookCardProps {
  book: GoogleBookResult;
  isAdmin: boolean;
}

export default function GoogleBookCard({ book }: GoogleBookCardProps) {
  const router = useRouter();
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState('');

  async function handleOpenDetail() {
    setError('');
    setImporting(true);
    try {
      const response = await api.post('/books/import-google-books', {
        volumeId: book.volumeId,
      });
      const id = response.data?.book?.id || response.data?.id;
      if (!id) throw new Error('ID buku tidak valid');
      router.push(`/books/${id}`);
    } catch (err) {
      setError(getErrorMessage(err));
      setImporting(false);
    }
  }

  return (
    <article className="card flex flex-col overflow-hidden">
      <div className="relative flex h-48 shrink-0 items-center justify-center overflow-hidden bg-gradient-to-br from-brand-800 via-ink to-slate-900 sm:h-56">
        {book.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={book.coverImage}
            alt={book.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <svg className="h-16 w-16 text-brand-300" fill="none" stroke="currentColor" strokeWidth={1.25} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
          </svg>
        )}
        {book.year && (
          <span className="badge absolute right-2 top-2 bg-white/85 text-slate-700 shadow-soft backdrop-blur">
            {book.year}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-2 font-bold leading-snug text-ink">{book.title}</h3>
        <p className="mt-1 line-clamp-1 text-sm text-slate-500">oleh {book.author}</p>
        <p className="mt-0.5 line-clamp-1 text-xs text-slate-400">
          {book.publisher || '-'}{book.isbn ? ` · ISBN ${book.isbn}` : ''}
        </p>

        {book.description && (
          <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-slate-500">
            {book.description}
          </p>
        )}

        <div className="mt-auto pt-4">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Belum ada rating lokal
          </p>
          {error && (
            <p className="mb-2 text-[11px] leading-tight text-red-600">{error}</p>
          )}
          <button
            onClick={handleOpenDetail}
            disabled={importing}
            className="btn-primary w-full !py-2.5 text-xs disabled:cursor-wait disabled:opacity-70"
          >
            {importing ? 'Membuka detail...' : 'Lihat Detail & Beri Rating'}
          </button>
        </div>
      </div>
    </article>
  );
}
