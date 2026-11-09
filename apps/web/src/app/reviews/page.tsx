'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import MemberLayout from '@/components/MemberLayout';
import RatingStars from '@/components/RatingStars';
import { useMyReviews } from '@/hooks/useReviews';

export default function ReviewsPage() {
  const { reviews, loading, error, fetchMyReviews, deleteReview } = useMyReviews();

  useEffect(() => {
    fetchMyReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleDelete(id: string) {
    const confirmed = window.confirm('Hapus ulasan ini? Tindakan tidak bisa dibatalkan.');
    if (!confirmed) return;
    try {
      await deleteReview(id);
    } catch (err) {
      console.error('Gagal menghapus ulasan:', err);
    }
  }

  return (
    <MemberLayout>
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-ink">Ulasan & Rating Saya</h1>
          <p className="text-slate-500">
            {reviews.length} ulasan yang telah Anda tulis.
          </p>
        </div>
        <Link href="/books" className="btn-primary">
          + Beri Rating Buku
        </Link>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="py-16 text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-brand-600 border-t-transparent" />
          <p className="mt-3 text-sm text-slate-500">Memuat ulasan...</p>
        </div>
      ) : reviews.length === 0 ? (
        <div className="card py-16 text-center">
          <svg className="mx-auto mb-4 h-14 w-14 text-slate-300" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
          </svg>
          <p className="font-semibold text-ink">Anda belum menulis ulasan</p>
          <p className="mt-1 text-sm text-slate-500">
            Buka detail buku dan berikan rating pertama Anda.
          </p>
          <Link href="/books" className="btn-primary mt-4">Jelajahi Katalog</Link>
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {reviews.map((review) => (
            <li key={review.id} className="card flex flex-col p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <Link
                    href={`/books/${review.bookId}`}
                    className="block font-bold text-ink hover:text-brand-700"
                  >
                    {review.book?.title || 'Buku'}
                  </Link>
                  <p className="mt-0.5 text-sm text-slate-500">oleh {review.book?.author}</p>
                </div>
                <button
                  onClick={() => handleDelete(review.id)}
                  aria-label="Hapus ulasan"
                  className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                </button>
              </div>

              <div className="mt-3 flex items-center gap-2">
                <RatingStars rating={review.rating} size="md" />
                <span className="text-sm font-bold text-ink">{review.rating}/5</span>
                <span className="text-xs text-slate-400">
                  · {new Date(review.createdAt).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              </div>

              {review.comment ? (
                <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">
                  “{review.comment}”
                </p>
              ) : (
                <p className="mt-3 flex-1 text-sm italic text-slate-400">Tanpa komentar</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </MemberLayout>
  );
}
