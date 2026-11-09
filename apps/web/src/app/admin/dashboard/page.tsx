'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import api, { getErrorMessage } from '@/lib/axios';
import { ReportStats } from '@/types';
import StatCard from '@/components/StatCard';
import RatingStars from '@/components/RatingStars';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<ReportStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    try {
      const response = await api.get('/reports');
      setStats(response.data);
      setError('');
    } catch (err: any) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="py-16 text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-brand-600 border-t-transparent" />
        <p className="mt-3 text-slate-500">Memuat statistik...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
        {error}
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-ink">Dashboard Admin</h1>
        <p className="text-slate-500">Ringkasan aktivitas katalog & ulasan pembaca</p>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Koleksi Buku"
          value={stats.totalBooks}
          color="blue"
          icon={
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
          }
        />
        <StatCard
          title="Total Anggota"
          value={stats.totalMembers}
          color="purple"
          icon={
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6-1.13a4 4 0 100-8 4 4 0 000 8z" />
            </svg>
          }
        />
        <StatCard
          title="Total Ulasan"
          value={stats.totalReviews}
          color="yellow"
          icon={
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
            </svg>
          }
        />
        <StatCard
          title="Rating Rata-rata"
          value={stats.averageRating.toFixed(1)}
          color="green"
          icon={
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Top rated books */}
        <section className="card p-6">
          <h2 className="mb-4 text-lg font-bold text-ink">Buku Rating Tertinggi</h2>
          {stats.topRatedBooks.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-500">
              Belum ada ulasan pada buku manapun.
            </p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {stats.topRatedBooks.map((book) => (
                <li key={book.id} className="flex items-center gap-3 py-3">
                  <div className="flex h-16 w-12 shrink-0 items-center justify-center overflow-hidden rounded-md bg-gradient-to-br from-brand-700 to-ink text-[10px] text-brand-200">
                    {book.coverImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={book.coverImage}
                        alt={book.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      (book.title || '?').charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/books/${book.id}`}
                      className="block truncate text-sm font-semibold text-ink hover:text-brand-700"
                    >
                      {book.title}
                    </Link>
                    <p className="truncate text-xs text-slate-500">{book.author}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <RatingStars rating={book.averageRating || 0} size="sm" />
                      <span className="text-[11px] text-slate-400">
                        {book.averageRating?.toFixed(1)} ({book.reviewCount} ulasan)
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Recent reviews */}
        <section className="card p-6">
          <h2 className="mb-4 text-lg font-bold text-ink">Ulasan Terbaru</h2>
          {stats.recentReviews.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-500">
              Belum ada ulasan dari pembaca.
            </p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {stats.recentReviews.slice(0, 6).map((review) => (
                <li key={review.id} className="py-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-semibold text-ink">
                      {review.book?.title || 'Buku'}
                    </p>
                    <RatingStars rating={review.rating} size="sm" />
                  </div>
                  <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-600">
                    {review.comment || 'Tanpa komentar'}
                  </p>
                  <p className="mt-1 text-[11px] text-slate-400">
                    {review.user?.name || 'Pembaca'} ·{' '}
                    {new Date(review.createdAt).toLocaleDateString('id-ID')}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {/* Reading progress summary */}
      <section className="card mt-6 p-6">
        <h2 className="mb-4 text-lg font-bold text-ink">Ringkasan Jejak Membaca</h2>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="rounded-xl bg-amber-50 p-4">
            <p className="text-2xl font-extrabold text-amber-700">
              {stats.readingSummary?.WISHLIST ?? 0}
            </p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-amber-800">
              Ingin Dibaca
            </p>
          </div>
          <div className="rounded-xl bg-violet-50 p-4">
            <p className="text-2xl font-extrabold text-violet-700">
              {stats.readingSummary?.READING ?? 0}
            </p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-violet-800">
              Sedang Dibaca
            </p>
          </div>
          <div className="rounded-xl bg-emerald-50 p-4">
            <p className="text-2xl font-extrabold text-emerald-700">
              {stats.readingSummary?.FINISHED ?? 0}
            </p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-emerald-800">
              Sudah Selesai
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
