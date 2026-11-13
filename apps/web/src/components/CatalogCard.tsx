'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { Book, ReadingStatusValue, Review } from '@/types';
import api, { getErrorMessage } from '@/lib/axios';
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
  const [latestReview, setLatestReview] = useState<Review | null>(null);
  const cardRef = useRef<HTMLElement | null>(null);
  const requestedReviewRef = useRef(false);

  const isGoogle = isGoogleBook(book);
  const localId = isGoogle ? null : (book as Book).id;
  const rating = isGoogle ? 0 : (book as Book).averageRating ?? 0;
  const reviewCount = isGoogle ? 0 : (book as Book).reviewCount ?? 0;
  const positivePercent = isGoogle ? 0 : (book as Book).positivePercent ?? 0;
  const categoryName = (book as any).category?.name || (isGoogle ? 'Google Books' : 'Umum');

  useEffect(() => {
    requestedReviewRef.current = false;
    setLatestReview(null);
  }, [localId]);

  useEffect(() => {
    if (!localId || !cardRef.current) return;

    async function fetchLatestReview() {
      if (requestedReviewRef.current || !localId) return;
      requestedReviewRef.current = true;
      try {
        const response = await api.get(`/books/${localId}/reviews`);
        const reviews: Review[] = response.data?.reviews ?? [];
        setLatestReview(reviews.find((review) => review.comment?.trim()) ?? reviews[0] ?? null);
      } catch {
        setLatestReview(null);
      }
    }

    if (typeof IntersectionObserver === 'undefined') {
      fetchLatestReview();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect();
          fetchLatestReview();
        }
      },
      { rootMargin: '180px' }
    );

    observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, [localId]);

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
        label: readingStatus === 'FINISHED' ? 'Sudah Selesai' : readingStatus === 'READING' ? 'Sedang Dibaca' : 'Ingin Dibaca',
        className:
          readingStatus === 'FINISHED'
            ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
            : readingStatus === 'READING'
              ? 'border-violet-200 bg-violet-50 text-violet-700'
              : 'border-amber-200 bg-amber-50 text-amber-700',
      }
    : reviewCount === 0 && rating === 0
      ? { label: 'Baru Ditambahkan', className: 'border-violet-200 bg-violet-50 text-violet-700' }
      : { label: 'Ingin Dibaca', className: 'border-amber-200 bg-amber-50 text-amber-700' };

  const quote = latestReview?.comment?.trim() || book.description?.trim() || 'Belum ada kutipan dari pembaca.';
  const quoteAuthor = latestReview?.user?.name || (book.description ? 'Sinopsis buku' : 'Belum ada ulasan');
  const quoteLabel = latestReview ? 'Ulasan Terpilih' : 'Rangkuman';
  const coverPanel = (
    <div className="relative flex h-36 shrink-0 touch-none items-center justify-center overflow-visible rounded-2xl bg-slate-100 shadow-[inset_0_0_0_1px_rgba(15,23,42,0.04)] sm:h-auto sm:w-28 sm:self-stretch lg:w-32">
      {book.coverImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={book.coverImage}
          alt={book.title}
          className="h-32 w-20 max-h-full object-contain drop-shadow-[0_8px_10px_rgba(15,23,42,0.28)] sm:h-44 sm:w-24 lg:h-48 lg:w-28"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center rounded-2xl">
          <svg className="h-14 w-14 text-violet-300" fill="none" stroke="currentColor" strokeWidth={1.1} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
          </svg>
        </div>
      )}
    </div>
  );

  const body = (
    <div className="flex min-w-0 flex-1 flex-col text-left">
      <div className="flex min-w-0 items-start justify-between gap-2">
      <div className="flex min-w-0 flex-wrap items-center gap-1.5">
        <span className="inline-flex max-w-[8.5rem] items-center truncate rounded-md bg-violet-50 px-2 py-1 text-[8px] font-black uppercase tracking-[0.14em] text-violet-700 sm:text-[9px]">
          {categoryName}
        </span>
        {book.year && (
          <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 text-[8px] font-bold text-slate-500 sm:text-[9px]">
            <svg className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3M4 11h16M5 5h14a1 1 0 011 1v15a1 1 0 01-1 1H5a1 1 0 01-1-1V6a1 1 0 011-1z" />
            </svg>
            {book.year}
          </span>
        )}
      </div>
      <span className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-2 py-1 text-[8px] font-bold shadow-sm sm:text-[9px] ${status.className}`}>
        <svg className="h-2.5 w-2.5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21l-7.5-4.5L4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
        </svg>
        {status.label}
      </span>
    </div>

      <h3 className="mt-2 line-clamp-2 break-words pr-1 text-[15px] font-black leading-tight tracking-tight text-slate-950 sm:text-base">
        {book.title}
      </h3>
      <p className="mt-1 flex min-w-0 items-center gap-1.5 text-[10px] font-semibold text-slate-500">
        <svg className="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a7.5 7.5 0 0115 0" />
        </svg>
        <span className="truncate">{book.author || 'Tidak diketahui'}</span>
      </p>

      <div className="mt-1.5 flex items-center justify-between gap-2 border-b border-slate-100 pb-2">
        <div className="flex min-w-0 items-center gap-1.5">
          <svg className="h-3.5 w-3.5 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          <strong className="text-[12px] text-slate-950">{rating > 0 ? rating.toFixed(1) : '0.0'}</strong>
          <span className="truncate text-[8px] font-medium text-slate-400 sm:text-[9px]">({reviewCount} ulasan)</span>
        </div>
        <span className="shrink-0 rounded-md bg-emerald-50 px-1.5 py-0.5 text-[8px] font-black text-emerald-700 sm:text-[9px]">
          {positivePercent}% Puas
        </span>
      </div>

      <div className="mt-2 rounded-xl bg-violet-50 px-2.5 py-2 text-slate-600">
        <div className="flex items-start gap-1.5">
          <span className="mt-0.5 font-serif text-lg leading-none text-violet-400">“</span>
          <p className="line-clamp-2 text-[8px] font-medium italic leading-snug">{quote}</p>
          <span className="font-serif text-lg leading-none text-violet-400">”</span>
        </div>
        <p className="mt-1 truncate text-[7px] font-semibold text-slate-400"><span className="mr-1 text-violet-400">●</span>{quoteAuthor}</p>
      </div>

      <div className="mt-2 grid grid-cols-2 gap-1 text-[8px] leading-tight sm:grid-cols-3">
        <div className="flex min-w-0 items-center gap-1 rounded-lg bg-blue-50 px-1.5 py-1 font-semibold text-slate-600">
          <svg className="h-3 w-3 shrink-0 text-violet-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 7h14M5 12h14M5 17h10" /></svg>
          <span className="truncate" title={(book as any).shelfLocation || '-'}>{(book as any).shelfLocation || '-'}</span>
        </div>
        <div className="flex min-w-0 items-center gap-1 rounded-lg bg-blue-50 px-1.5 py-1 font-semibold text-slate-600">
          <svg className="h-3 w-3 shrink-0 text-violet-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3M4 11h16M5 5h14a1 1 0 011 1v15a1 1 0 01-1 1H5a1 1 0 01-1-1V6a1 1 0 011-1z" /></svg>
          <span className="truncate">Terbit {book.year || '-'}</span>
        </div>
        <div className="col-span-1 flex min-w-0 items-center rounded-lg bg-blue-50 px-1.5 py-1 font-semibold text-slate-600">
          <span className="truncate" title={(book as any).isbn || '-'}>ISBN {(book as any).isbn || '-'}</span>
        </div>
      </div>

      <div className="mt-2">
        {error && <p className="mb-1 text-[8px] leading-tight text-red-600">{error}</p>}
        {isGoogle ? (
          <button
            onClick={handleOpen}
            disabled={importing}
            className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-indigo-700 py-2.5 text-[10px] font-bold text-white transition hover:bg-indigo-600 disabled:cursor-wait disabled:opacity-70"
          >
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 10h8M8 14h5m4 5l-1.5-1.5H8A2.5 2.5 0 015.5 15V7A2.5 2.5 0 018 4.5h8A2.5 2.5 0 0118.5 7v8.5l-1.5 1.5z" /></svg>
            {importing ? 'Membuka detail...' : 'Lihat Detail & Beri Rating'}
          </button>
        ) : (
          <Link
            href={`/books/${(book as Book).id}`}
            className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-indigo-700 py-2.5 text-[10px] font-bold text-white transition hover:bg-indigo-600"
          >
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 10h8M8 14h5m4 5l-1.5-1.5H8A2.5 2.5 0 015.5 15V7A2.5 2.5 0 018 4.5h8A2.5 2.5 0 0118.5 7v8.5l-1.5 1.5z" /></svg>
            Lihat Detail &amp; Beri Rating
          </Link>
        )}
      </div>
    </div>
  );

  return (
    <article
      ref={cardRef}
      className="group relative flex h-full min-h-[18rem] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_8px_24px_rgba(30,27,75,0.08)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_36px_rgba(30,27,75,0.14)] sm:min-h-[17rem] sm:p-2.5"
    >
      {isGoogle ? (
        <div className="flex h-full flex-col gap-2 sm:flex-row">
          {coverPanel}
          {body}
        </div>
      ) : (
        <Link href={`/books/${(book as Book).id}`} className="flex h-full flex-col gap-2 sm:flex-row">
          {coverPanel}
          {body}
        </Link>
      )}
    </article>
  );
}
