'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { getErrorMessage } from '@/lib/axios';
import { Book, ReadingStatusValue } from '@/types';
import { useBookReviews } from '@/hooks/useReviews';
import { useReadingStatus } from '@/hooks/useReadingStatus';
import RatingStars from '@/components/RatingStars';

const statusOptions: { value: ReadingStatusValue; label: string }[] = [
  { value: 'WISHLIST', label: 'Belum Dibaca' },
  { value: 'READING', label: 'Sedang Dibaca' },
  { value: 'FINISHED', label: 'Sudah Selesai' },
];

export default function BookDetail({ book }: { book: Book }) {
  const { user, isAuthenticated } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const { summary, loading, error, setError, fetchReviews, submitReview } = useBookReviews(book.id);
  const { fetchBookUserState, setStatus: setReadingStatus } = useReadingStatus();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [status, setStatus] = useState<ReadingStatusValue | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    fetchReviews(book.id);
    if (isAuthenticated) {
      fetchBookUserState(book.id)
        .then((state) => {
          setRating(state.review?.rating ?? 0);
          setComment(state.review?.comment ?? '');
          setStatus(state.status);
        })
        .catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [book.id, isAuthenticated]);

  function redirectToLogin() {
    router.push(`/login?next=${encodeURIComponent(pathname || `/books/${book.id}`)}`);
  }

  async function handleStatusChange(next: ReadingStatusValue) {
    if (!isAuthenticated) {
      redirectToLogin();
      return;
    }
    setStatus(next);
    try {
      await setReadingStatus(book.id, next);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  async function handleSubmit() {
    if (!isAuthenticated) {
      redirectToLogin();
      return;
    }
    if (rating < 1) {
      setError('Pilih minimal 1 bintang sebelum mengirim ulasan.');
      return;
    }
    setSubmitting(true);
    setError('');
    setNotice('');
    try {
      await submitReview(book.id, rating, comment.trim() || undefined);
      setNotice('Ulasan Anda berhasil disimpan. Terima kasih!');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  const average = summary?.averageRating ?? book.averageRating ?? 0;
  const count = summary?.reviewCount ?? book.reviewCount ?? 0;
  const positive = summary?.positivePercent ?? book.positivePercent ?? 0;

  return (
    <div className="overflow-hidden rounded-3xl border border-violet-100 bg-white shadow-card">
      {/* Breadcrumb */}
      <div className="border-b border-violet-100 bg-lavender/60 px-6 py-3 text-xs text-slate-500">
        <Link href="/" className="hover:text-brand-700">Beranda</Link>
        <span className="mx-2">/</span>
        <Link href="/books" className="hover:text-brand-700">Katalog</Link>
        <span className="mx-2">/</span>
        <span className="font-semibold text-ink">{book.title}</span>
      </div>

      <div className="grid lg:grid-cols-[360px_1fr]">
        {/* Cover panel */}
        <div
          className="relative flex min-h-80 items-center justify-center bg-cover bg-center p-8"
          style={{
            backgroundImage: "url('/hero-library.jpg')",
          }}
        >
          <div className="absolute inset-0 bg-violet-950/85" />
          <Link href={`/books/${book.id}`} className="relative block">
            {book.coverImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={book.coverImage}
                alt={book.title}
                className="h-72 w-48 rounded-2xl object-cover shadow-hero ring-1 ring-white/20 sm:h-80 sm:w-52"
              />
            ) : (
              <div className="flex h-72 w-48 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-800 to-ink sm:h-80 sm:w-52">
                <svg className="h-36 w-36 text-violet-300" fill="none" stroke="currentColor" strokeWidth={1.25} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                </svg>
              </div>
            )}
          </Link>
          <span className="badge absolute left-4 top-4 bg-white/90 text-violet-900 shadow-soft backdrop-blur">
            {book.category?.name || 'Umum'}
          </span>
          {book.year && (
            <span className="badge absolute right-4 top-4 bg-violet-600/90 text-white shadow-soft backdrop-blur">
              {book.year}
            </span>
          )}
        </div>

        {/* Info panel */}
        <div className="p-6 lg:p-8">
          <h1 className="text-3xl font-extrabold leading-tight text-ink">{book.title}</h1>
          <p className="mt-1 text-lg text-slate-600">
            oleh <span className="font-semibold text-ink">{book.author}</span>
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <RatingStars rating={average} size="lg" />
            <span className="text-2xl font-extrabold text-ink">{average.toFixed(1)}</span>
            <span className="text-sm text-slate-500">({count} ulasan)</span>
            <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 ring-1 ring-emerald-200">
              {positive}% Rekomendasi
            </span>
          </div>

          <dl className="mt-5 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
            <div className="rounded-2xl border border-violet-100 bg-violet-50/60 p-3">
              <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Penerbit</dt>
              <dd className="mt-0.5 font-semibold text-ink">{book.publisher || '-'}</dd>
            </div>
            <div className="rounded-2xl border border-violet-100 bg-violet-50/60 p-3">
              <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Tahun</dt>
              <dd className="mt-0.5 font-semibold text-ink">{book.year}</dd>
            </div>
            <div className="rounded-2xl border border-violet-100 bg-violet-50/60 p-3">
              <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">ISBN</dt>
              <dd className="mt-0.5 font-semibold text-ink">{book.isbn || '-'}</dd>
            </div>
            <div className="rounded-2xl border border-violet-100 bg-violet-50/60 p-3">
              <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Rak</dt>
              <dd className="mt-0.5 font-semibold text-ink">{book.shelfLocation || '-'}</dd>
            </div>
          </dl>

          {book.description && (
            <div className="mt-5">
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Tentang Buku</h2>
              <p className="mt-1.5 leading-relaxed text-slate-700">{book.description}</p>
            </div>
          )}

          {/* Status baca */}
          <div className="mt-6">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
              Status Baca Anda
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {statusOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleStatusChange(opt.value)}
                  className={`rounded-full border px-4 py-2 text-xs font-semibold transition transition-colors ${
                    status === opt.value
                      ? 'border-violet-600 bg-violet-600 text-white'
                      : 'border-violet-200 bg-white text-violet-900 hover:border-violet-400'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Form ulasan */}
          {isAuthenticated ? (
            <div className="mt-6 rounded-2xl border border-violet-100 bg-violet-50/50 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                Beri Rating &amp; Ulasan
              </p>
              <div className="mt-2 flex items-center gap-3">
                <RatingStars rating={rating} size="lg" interactive onChange={setRating} />
                {rating > 0 && <span className="text-sm font-bold text-ink">{rating}/5</span>}
              </div>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={2}
                maxLength={2000}
                placeholder="Tulis refleksi atau tanggapan Anda..."
                className="mt-3 w-full rounded-xl border border-violet-100 bg-white px-4 py-3 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
              />
              {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
              {notice && <p className="mt-2 text-sm text-emerald-600">{notice}</p>}
              <button className="btn-primary mt-3 !bg-violet-600 hover:!bg-violet-500" onClick={handleSubmit} disabled={submitting}>
                {submitting ? 'Menyimpan...' : 'Kirim Ulasan'}
              </button>
            </div>
          ) : (
            <div className="mt-6">
              <Link href={`/login?next=${encodeURIComponent(pathname || `/books/${book.id}`)}`} className="btn-primary !bg-violet-600 hover:!bg-violet-500">
                Masuk untuk Memberi Rating
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Ulasan pembaca */}
      <div className="border-t border-violet-100 bg-white p-6 lg:p-8">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-ink">Ulasan Pembaca</h2>
          <Link href="/books" className="text-xs font-bold text-brand-700 hover:text-brand-800">
            ← Kembali ke Katalog
          </Link>
        </div>
        {loading ? (
          <p className="mt-3 text-sm text-slate-500">Memuat ulasan...</p>
        ) : !summary || summary.reviews.length === 0 ? (
          <p className="mt-4 rounded-2xl bg-violet-50 px-4 py-6 text-center text-sm text-slate-500">
            Belum ada ulasan untuk buku ini. Jadilah pembaca pertama yang menulis.
          </p>
        ) : (
          <ul className="mt-4 grid gap-3 md:grid-cols-2">
            {summary.reviews.map((review) => (
              <li key={review.id} className="rounded-2xl border border-violet-100 bg-lavender/50 p-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-600 text-xs font-bold text-white">
                    {(review.user?.name || '?').charAt(0).toUpperCase()}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-ink">{review.user?.name || 'Pembaca'}</p>
                    <div className="flex items-center gap-2">
                      <RatingStars rating={review.rating} size="sm" />
                      <span className="text-[11px] text-slate-400">
                        {new Date(review.createdAt).toLocaleDateString('id-ID')}
                      </span>
                    </div>
                  </div>
                </div>
                {review.comment && (
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">“{review.comment}”</p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
