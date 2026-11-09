'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { getErrorMessage } from '@/lib/axios';
import { Book, ReadingStatusValue } from '@/types';
import { useBookReviews } from '@/hooks/useReviews';
import { useReadingStatus } from '@/hooks/useReadingStatus';
import RatingStars from '@/components/RatingStars';

const statusOptions: { value: ReadingStatusValue; label: string }[] = [
  { value: 'WISHLIST', label: 'Ingin Dibaca' },
  { value: 'READING', label: 'Sedang Dibaca' },
  { value: 'FINISHED', label: 'Sudah Selesai' },
];

export default function BookDetail({ book }: { book: Book }) {
  const { user, isAuthenticated } = useAuth();
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

  async function handleStatusChange(next: ReadingStatusValue) {
    setStatus(next);
    try {
      await setReadingStatus(book.id, next);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  async function handleSubmit() {
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
    <div className="card overflow-hidden">
      <div className="grid md:grid-cols-[320px_1fr]">
        {/* Cover */}
        <div className="relative flex min-h-72 items-center justify-center bg-gradient-to-br from-brand-800 via-ink to-slate-900 p-8">
          {book.coverImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={book.coverImage}
              alt={book.title}
              className="h-64 w-44 rounded-xl object-cover shadow-card"
            />
          ) : (
            <svg className="h-40 w-40 text-brand-300" fill="none" stroke="currentColor" strokeWidth={1.25} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
          )}
          <span className="absolute left-4 top-4 badge bg-white/90 text-ink shadow-soft backdrop-blur">
            {book.category?.name || 'Umum'}
          </span>
        </div>

        {/* Info */}
        <div className="p-6 lg:p-8">
          <h1 className="text-3xl font-extrabold leading-tight text-ink">{book.title}</h1>
          <p className="mt-1 text-lg text-slate-600">oleh {book.author}</p>

          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
            <RatingStars rating={average} size="lg" />
            <span className="text-xl font-extrabold text-ink">{average.toFixed(1)}</span>
            <span className="text-sm text-slate-500">{count} ulasan</span>
            <span className="text-sm font-semibold text-emerald-600">{positive}% Positif</span>
          </div>

          <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 text-sm sm:grid-cols-4">
            <div><dt className="text-slate-500">Penerbit</dt><dd className="font-semibold text-ink">{book.publisher || '-'}</dd></div>
            <div><dt className="text-slate-500">Tahun</dt><dd className="font-semibold text-ink">{book.year}</dd></div>
            <div><dt className="text-slate-500">ISBN</dt><dd className="font-semibold text-ink">{book.isbn || '-'}</dd></div>
            <div><dt className="text-slate-500">Rak</dt><dd className="font-semibold text-ink">{book.shelfLocation || '-'}</dd></div>
          </dl>

          {book.description && (
            <div className="mt-5">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">Deskripsi</h2>
              <p className="mt-1.5 leading-relaxed text-slate-700">{book.description}</p>
            </div>
          )}

          {/* Reading status */}
          <div className="mt-6">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Status Baca Anda
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {statusOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleStatusChange(opt.value)}
                  disabled={!isAuthenticated}
                  className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                    status === opt.value
                      ? 'border-brand-500 bg-brand-50 text-brand-800'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Rating form */}
          {isAuthenticated ? (
            <div className="mt-6">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Beri Rating & Ulasan
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
                className="mt-3 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
              />
              {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
              {notice && <p className="mt-2 text-sm text-emerald-600">{notice}</p>}
              <button className="btn-primary mt-3" onClick={handleSubmit} disabled={submitting}>
                {submitting ? 'Menyimpan...' : 'Kirim Ulasan'}
              </button>
            </div>
          ) : (
            <div className="mt-6">
              <Link href="/login" className="btn-primary">
                Masuk untuk Memberi Rating
              </Link>
            </div>
          )}

          <Link href="/books" className="btn-ghost mt-4">
            ← Kembali ke Katalog
          </Link>
        </div>
      </div>

      {/* Reviews */}
      <div className="border-t border-slate-100 p-6 lg:p-8">
        <h2 className="text-lg font-bold text-ink">Ulasan Pembaca</h2>
        {loading ? (
          <p className="mt-3 text-sm text-slate-500">Memuat ulasan...</p>
        ) : !summary || summary.reviews.length === 0 ? (
          <p className="mt-3 rounded-xl bg-slate-50 px-4 py-4 text-center text-sm text-slate-500">
            Belum ada ulasan untuk buku ini.
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-slate-100">
            {summary.reviews.map((review) => (
              <li key={review.id} className="py-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-800">
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
                  <p className="mt-2 pl-12 text-sm leading-relaxed text-slate-600">{review.comment}</p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
