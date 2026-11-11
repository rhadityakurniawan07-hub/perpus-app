'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { Book, ReadingStatusValue } from '@/types';
import api, { getErrorMessage } from '@/lib/axios';
import RatingStars from '@/components/RatingStars';
import type { GoogleBookResult } from '@/components/GoogleBookCard';

export type CatalogBook = Book | (GoogleBookResult & { __isGoogle: true });

interface CatalogCardProps {
  book: CatalogBook;
  readingStatus?: ReadingStatusValue | null;
  onOpen?: () => void;
}

export function isGoogleBook(book: CatalogBook): book is GoogleBookResult & { __isGoogle: true } {
  return (book as any).__isGoogle === true;
}

export default function CatalogCard({ book, readingStatus, onOpen }: CatalogCardProps) {
  const { isAuthenticated } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState('');

  const isGoogle = isGoogleBook(book);
  const rating = isGoogle ? 0 : (book as Book).averageRating ?? 0;
  const reviewCount = isGoogle ? 0 : (book as Book).reviewCount ?? 0;
  const positivePercent = isGoogle ? 0 : (book as Book).positivePercent ?? 0;

  async function handleOpen() {
    setImporting(true);
    setError('');
    if (!isGoogleBook(book)) {
      setImporting(false);
      return;
    }
    if (!isAuthenticated) {
      router.push(`/login?next=${encodeURIComponent(pathname || '/books')}`);
      setImporting(false);
      return;
    }
    try {
      const response = await api.post('/books/import-google-books', {
        volumeId: book.volumeId,
      });
      const id = response.data?.book?.id || response.data?.id;
      if (!id) throw new Error('ID buku tidak valid');
      window.location.href = `/books/${id}`;
    } catch (err) {
      setError(getErrorMessage(err));
      setImporting(false);
    }
  }

  const status = readingStatus
    ? {
        label: readingStatus === 'FINISHED' ? 'Sudah Selesai' : readingStatus === 'READING' ? 'Sedang Dibaca' : 'Belum Dibaca',
        className:
          readingStatus === 'FINISHED'
            ? 'bg-emerald-100 text-emerald-800'
            : readingStatus === 'READING'
            ? 'bg-amber-100 text-amber-800'
            : 'bg-slate-100 text-slate-600',
      }
    : reviewCount === 0 && rating === 0
    ? { label: 'Baru Ditambahkan', className: 'bg-brand-100 text-brand-800' }
    : { label: 'Belum Dibaca', className: 'bg-slate-100 text-slate-600' };

  const coverEl = (
    <div className="relative block h-52 shrink-0 select-none overflow-hidden bg-gradient-to-br from-violet-900 via-ink to-slate-900">
      {book.coverImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={book.coverImage}
          alt={book.title}
          className="h-full w-full object-cover transition duration-500 hover:scale-105"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <svg className="h-16 w-16 text-brand-300" fill="none" stroke="currentColor" strokeWidth={1.25} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
          </svg>
        </div>
      )}
      <span className="badge absolute left-2 top-2 bg-white/95 text-violet-900 shadow-soft backdrop-blur">
        {(book as any).category?.name || 'Google Books'}
      </span>
      {book.year && (
        <span className="badge absolute right-2 top-2 bg-violet-600/90 text-white shadow-soft backdrop-blur">
          {book.year}
        </span>
      )}
      <span className={`badge absolute bottom-2 right-2 shadow-soft backdrop-blur ${status.className}`}>
        {status.label}
      </span>
    </div>
  );

  const body = (
    <div className="flex flex-1 flex-col p-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-1.5">
          <RatingStars rating={rating} size="sm" />
          <span className="text-sm font-extrabold text-ink">
            {rating.toFixed(1)}
          </span>
          <span className="text-xs text-slate-500">({reviewCount} ulasan)</span>
        </div>
        <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-700 ring-1 ring-emerald-200">
          {positivePercent}% Puas
        </span>
      </div>

      <p className="mt-2 truncate text-[11px] text-slate-400">
        ISBN {(book as any).isbn || '-'}{(book as any).category?.name ? ` • ${(book as any).category.name}` : ''}
      </p>

      <h3 className="mt-1.5 line-clamp-2 font-bold leading-snug text-ink">{book.title}</h3>
      <p className="mt-0.5 line-clamp-1 text-sm text-slate-500">oleh {book.author}</p>

      {book.description && (
        <p className="mt-2 line-clamp-2 text-xs italic leading-relaxed text-slate-500">
          "{book.description}"
        </p>
      )}

      <div className="mt-auto pt-4">
        {error && (
          <p className="mb-2 text-[11px] leading-tight text-red-600">{error}</p>
        )}
        {isGoogle ? (
          <button
            onClick={handleOpen}
            disabled={importing}
            className="btn-primary w-full !py-2.5 text-xs disabled:cursor-wait disabled:opacity-70"
          >
            {importing ? 'Membuka detail...' : 'Lihat Detail & Beri Rating'}
          </button>
        ) : (
          <Link
            href={`/books/${book.id}`}
            className="btn-primary w-full !py-2.5 text-center text-xs block"
          >
            Lihat Detail &amp; Beri Rating
          </Link>
        )}
      </div>
    </div>
  );

  return (
    <article className="card flex flex-col overflow-hidden">
      {isGoogle ? (
        coverEl
      ) : (
        <Link href={`/books/${book.id}`} className="relative block shrink-0">
          {coverEl}
        </Link>
      )}
      {body}
    </article>
  );
}
