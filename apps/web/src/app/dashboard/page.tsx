'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import MemberLayout from '@/components/MemberLayout';
import RatingStars from '@/components/RatingStars';
import { useMyStats } from '@/hooks/useMyStats';
import { useReadingStatus } from '@/hooks/useReadingStatus';
import { useMyReviews } from '@/hooks/useReviews';

export default function DashboardPage() {
  const { user } = useAuth();
  const { stats, fetchMyStats } = useMyStats();
  const { items: readingList, fetchMyReading } = useReadingStatus();
  const { reviews, fetchMyReviews } = useMyReviews();

  useEffect(() => {
    fetchMyStats();
    fetchMyReading('READING');
    fetchMyReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cards = [
    {
      label: 'Sedang Dibaca',
      value: stats.reading,
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
        </svg>
      ),
      iconClass: 'bg-violet-100 text-violet-600',
    },
    {
      label: 'Sudah Selesai',
      value: stats.finished,
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      iconClass: 'bg-emerald-100 text-emerald-600',
    },
    {
      label: 'Ulasan Saya',
      value: stats.reviews,
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
        </svg>
      ),
      iconClass: 'bg-amber-100 text-amber-600',
    },
  ];

  return (
    <MemberLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-ink">Dashboard</h1>
        <p className="text-slate-500">Selamat datang, {user?.name?.split(' ')[0] || 'Pembaca'}!</p>
      </div>

      {/* Stat cards */}
      <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
        {cards.map((card) => (
          <div key={card.label} className="card flex items-center gap-4 p-6">
            <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${card.iconClass}`}>
              {card.icon}
            </span>
            <div>
              <p className="text-sm font-medium text-slate-500">{card.label}</p>
              <p className="text-2xl font-extrabold text-ink">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Reading list */}
        <section className="card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-ink">Sedang Dibaca</h2>
            <Link href="/my-collection" className="text-sm font-semibold text-brand-700 hover:underline">
              Lihat Koleksi →
            </Link>
          </div>

          {readingList.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-sm text-slate-500">Belum ada buku yang sedang Anda baca.</p>
              <Link href="/books" className="btn-primary mt-4">
                Jelajahi Katalog
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {readingList.slice(0, 5).map((item) => (
                <li key={item.id} className="flex items-center gap-4 py-3">
                  <div className="flex h-16 w-12 shrink-0 items-center justify-center overflow-hidden rounded-md bg-gradient-to-br from-brand-700 to-ink text-brand-200">
                    {item.book?.coverImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.book.coverImage}
                        alt={item.book.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                      </svg>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/books/${item.bookId}`}
                      className="block truncate text-sm font-semibold text-ink hover:text-brand-700"
                    >
                      {item.book?.title || 'Buku'}
                    </Link>
                    <p className="truncate text-xs text-slate-500">{item.book?.author}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <RatingStars rating={item.book?.averageRating || 0} size="sm" />
                      <span className="text-[11px] text-slate-400">{(item.book?.averageRating || 0).toFixed(1)}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* My reviews */}
        <section className="card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-ink">Ulasan Terbaru Saya</h2>
            <Link href="/reviews" className="text-sm font-semibold text-brand-700 hover:underline">
              Lihat Semua →
            </Link>
          </div>

          {reviews.length === 0 ? (
            <div className="py-8 text-center">
              <p className="text-sm text-slate-500">Anda belum menulis ulasan.</p>
              <Link href="/books" className="btn-primary mt-4">
                Beri Rating Sekarang
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {reviews.slice(0, 4).map((review) => (
                <li key={review.id} className="py-3">
                  <Link
                    href={`/books/${review.bookId}`}
                    className="block truncate text-sm font-semibold text-ink hover:text-brand-700"
                  >
                    {review.book?.title || 'Buku'}
                  </Link>
                  <div className="mt-1 flex items-center gap-2">
                    <RatingStars rating={review.rating} size="sm" />
                    <span className="text-[11px] text-slate-400">
                      {new Date(review.createdAt).toLocaleDateString('id-ID')}
                    </span>
                  </div>
                  {review.comment && (
                    <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-600">
                      {review.comment}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </MemberLayout>
  );
}
