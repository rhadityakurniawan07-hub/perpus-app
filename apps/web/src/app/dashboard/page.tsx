'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/lib/auth';
import MemberLayout from '@/components/MemberLayout';
import RatingStars from '@/components/RatingStars';
import { useMyStats } from '@/hooks/useMyStats';
import { useReadingStatus } from '@/hooks/useReadingStatus';
import { useMyReviews } from '@/hooks/useReviews';
import BadgesDisplay from '@/components/BadgesDisplay';
import api, { getErrorMessage } from '@/lib/axios';
import { Book } from '@/types';

export default function DashboardPage() {
  const { user } = useAuth();
  const { stats, fetchMyStats } = useMyStats();
  const { items: readingList, fetchMyReading } = useReadingStatus();
  const { reviews, fetchMyReviews } = useMyReviews();
  const [mounted, setMounted] = useState(false);
  const [recommendations, setRecommendations] = useState<Book[]>([]);
  const [recLoading, setRecLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchMyStats();
    fetchMyReading('READING');
    fetchMyReviews();
    fetchRecommendations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchRecommendations() {
    setRecLoading(true);
    try {
      const response = await api.get('/books/recommendations?limit=6');
      setRecommendations(response.data || []);
    } catch {
      setRecommendations([]);
    } finally {
      setRecLoading(false);
    }
  }

  const displayName = user?.name?.trim() || 'Pembaca';
  const firstName = displayName.split(' ')[0] || 'Pembaca';
  const totalTracked = stats.wishlist + stats.reading + stats.finished;
  const finishedPercent = totalTracked > 0 ? Math.round((stats.finished / totalTracked) * 100) : 0;
  const hour = mounted ? new Date().getHours() : 0;
  const greeting = !mounted
    ? 'Selamat datang'
    : hour < 11
      ? 'Selamat pagi'
      : hour < 15
        ? 'Selamat siang'
        : hour < 18
          ? 'Selamat sore'
          : 'Selamat malam';

  const metrics = [
    {
      label: 'Ingin Dibaca',
      value: stats.wishlist,
      note: 'Antrian baca',
      icon: <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21l-7.5-4.5L4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />,
      iconClass: 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 ring-amber-100',
    },
    {
      label: 'Sedang Dibaca',
      value: stats.reading,
      note: 'Dalam perjalanan',
      icon: <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />,
      iconClass: 'bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-400 ring-violet-100',
    },
    {
      label: 'Sudah Selesai',
      value: stats.finished,
      note: 'Menjadi bagian Anda',
      icon: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
      iconClass: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 ring-emerald-100',
    },
    {
      label: 'Ulasan',
      value: stats.reviews,
      note: 'Suara Anda di PERPUS',
      icon: <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />,
      iconClass: 'bg-sky-50 dark:bg-sky-900/30 text-sky-700 dark:text-sky-400 ring-sky-100',
    },
  ];

  return (
    <MemberLayout>
      <section className="editorial-panel editorial-dots mb-6 border-violet-100 dark:border-violet-800 bg-[#fbfaff]">
        <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full border border-violet-200 dark:border-violet-700/70" />
        <div className="pointer-events-none absolute -right-28 top-8 h-80 w-80 rounded-full border border-violet-100 dark:border-violet-800" />
        <div className="pointer-events-none absolute right-12 top-10 hidden h-40 w-28 rounded-t-full border border-violet-200 dark:border-violet-700 bg-violet-100 dark:bg-violet-900/40/40 lg:block" />

        <div className="relative grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.15fr_.85fr] lg:p-10">
          <div className="flex flex-col justify-center">
            <div className="editorial-kicker">
              <span className="h-2 w-2 rounded-full bg-violet-600 dark:bg-violet-500" />
              Ruang Baca Pribadi
            </div>
            <p className="mt-6 text-xs font-bold uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">{greeting}</p>
            <h1 className="editorial-heading mt-2 text-5xl sm:text-6xl xl:text-7xl">
              Halo,<br />{firstName}.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 dark:text-slate-300 dark:text-slate-400 sm:text-lg">
              Setiap halaman yang Anda tandai adalah cerita yang sedang tumbuh. Lihat progres bacaan,
              rawat koleksi, dan biarkan pikiran Anda memilih arah berikutnya.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/books" className="rounded-full bg-ink dark:bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-violet-800">
                Jelajahi Katalog →
              </Link>
              <Link href="/my-collection" className="rounded-full border border-violet-200 dark:border-violet-700 bg-white dark:bg-slate-800/70 px-5 py-3 text-sm font-bold text-violet-800 dark:text-violet-300 transition hover:border-violet-400 hover:bg-violet-50 dark:bg-violet-900/30">
                Lihat Perpustakaan Saya
              </Link>
            </div>
          </div>

          <div className="relative rounded-[2rem] border border-white/10 dark:border-slate-700 bg-ink dark:bg-slate-950 p-6 text-white shadow-hero sm:p-7">
            <div className="absolute right-6 top-6 h-20 w-20 rounded-full border border-violet-400/30" />
            <div className="absolute -right-8 bottom-16 h-36 w-36 rounded-full border border-amber-300/20" />
            <div className="relative">
              <div className="flex items-center justify-between gap-4 border-b border-white/10 dark:border-slate-700 pb-5">
                <div>
                  <p className="text-[9px] font-extrabold uppercase tracking-[0.3em] text-amber-300 dark:text-amber-400">Rekam Jejak</p>
                  <h2 className="mt-2 text-xl font-extrabold text-white">Koleksi Anda</h2>
                </div>
                <span className="flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white dark:bg-slate-800/5 text-lg font-black text-violet-200">
                  P
                </span>
              </div>

              <div className="mt-7 flex items-end gap-5">
                <div className="flex h-28 w-20 shrink-0 flex-col justify-between rounded-b-md border border-white/10 dark:border-slate-700 bg-gradient-to-br from-violet-600 via-violet-800 to-ink p-3 shadow-2xl">
                  <span className="h-px w-full bg-white dark:bg-slate-800/30" />
                  <span className="text-center text-3xl font-black text-white/90 dark:text-slate-200">P</span>
                  <span className="h-px w-full bg-white dark:bg-slate-800/30" />
                </div>
                <div>
                  <p className="text-6xl font-black leading-none tracking-tight text-white">
                    {finishedPercent}<span className="text-2xl align-top text-violet-300">%</span>
                  </p>
                  <p className="mt-2 text-xs font-bold uppercase tracking-[0.18em] text-violet-200">Koleksi terselesaikan</p>
                </div>
              </div>

              <div className="mt-6 h-2 overflow-hidden rounded-full bg-white dark:bg-slate-800/10">
                <div className="h-full rounded-full bg-gradient-to-r from-violet-400 to-amber-300 transition-all duration-700" style={{ width: `${finishedPercent}%` }} />
              </div>

              <div className="mt-7 grid grid-cols-3 gap-3 border-t border-white/10 dark:border-slate-700 pt-5 text-center">
                {[
                  { value: stats.reading, label: 'Dibaca' },
                  { value: stats.finished, label: 'Selesai' },
                  { value: stats.reviews, label: 'Ulasan' },
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl border border-white/10 dark:border-slate-700 bg-white dark:bg-slate-800/5 px-2 py-3">
                    <p className="text-2xl font-extrabold text-white">{item.value}</p>
                    <p className="mt-1 text-[9px] font-bold uppercase tracking-wider text-violet-200">{item.label}</p>
                  </div>
                ))}
              </div>

              <p className="mt-5 text-[11px] leading-5 text-violet-100 dark:text-violet-200/60">
                Dihitung dari buku yang Anda tandai sebagai ingin dibaca, sedang dibaca, dan sudah selesai.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="group rounded-2xl border border-violet-100 dark:border-violet-800 bg-white dark:bg-slate-800 p-4 shadow-soft transition hover:-translate-y-1 hover:shadow-card sm:p-5">
            <span className={`flex h-11 w-11 items-center justify-center rounded-xl ring-1 ${metric.iconClass}`}>
              <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">{metric.icon}</svg>
            </span>
            <p className="mt-4 text-3xl font-black tracking-tight text-ink dark:text-slate-100">{metric.value}</p>
            <p className="mt-1 text-xs font-bold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400 dark:text-slate-500">{metric.label}</p>
            <p className="mt-1 hidden text-[10px] text-slate-400 dark:text-slate-500 sm:block">{metric.note}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
        <section className="editorial-panel p-6 sm:p-7 xl:col-span-3">
          <div className="flex items-end justify-between gap-4 border-b border-violet-100 dark:border-violet-800 pb-5">
            <div>
              <p className="editorial-kicker"><span className="h-1.5 w-1.5 rounded-full bg-violet-600 dark:bg-violet-500" />Dalam Perjalanan</p>
              <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-ink dark:text-slate-100">Sedang Dibaca</h2>
            </div>
            <Link href="/my-collection" className="shrink-0 text-xs font-extrabold uppercase tracking-wider text-violet-700 dark:text-violet-400 hover:text-violet-900 dark:text-violet-200">Lihat Koleksi →</Link>
          </div>

          {readingList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-violet-200 dark:border-violet-700 bg-violet-50 dark:bg-violet-900/30">
                <span className="absolute h-12 w-8 rounded-sm border border-violet-400" />
                <span className="absolute h-6 w-px bg-violet-300" />
              </div>
              <h3 className="mt-5 font-extrabold text-ink dark:text-slate-100">Halaman Anda masih kosong.</h3>
              <p className="mt-1 max-w-xs text-sm text-slate-500 dark:text-slate-400 dark:text-slate-500">Pilih buku pertama yang ingin menemani hari-hari Anda.</p>
              <Link href="/books" className="mt-5 rounded-full bg-violet-600 dark:bg-violet-500 px-5 py-2.5 text-sm font-bold text-white hover:bg-violet-50 dark:bg-violet-900/300">Jelajahi Katalog</Link>
            </div>
          ) : (
            <ol className="divide-y divide-violet-100">
              {readingList.slice(0, 5).map((item, index) => (
                <li key={item.id} className="group flex gap-4 py-5 first:pt-5 last:pb-0">
                  <span className="pt-1 text-xs font-black text-violet-300">{String(index + 1).padStart(2, '0')}</span>
                  <div className="relative h-24 w-16 shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-violet-800 to-ink shadow-soft">
                    {item.book?.coverImage ? (
                      <Image src={item.book.coverImage} alt={item.book?.title || 'Sampul buku'} fill sizes="64px" className="object-cover transition duration-300 group-hover:scale-105" loading="lazy" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-violet-200"><svg className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg></div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[9px] font-extrabold uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">Sedang Dibaca</p>
                    <Link href={`/books/${item.bookId}`} className="mt-1 block text-base font-extrabold leading-snug text-ink dark:text-slate-100 transition hover:text-violet-700 dark:text-violet-400">{item.book?.title || 'Buku'}</Link>
                    <p className="mt-1 truncate text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500">oleh {item.book?.author || 'Penulis tidak diketahui'}</p>
                    <div className="mt-2 flex items-center gap-2"><RatingStars rating={item.book?.averageRating || 0} size="sm" /><span className="text-[11px] font-bold text-slate-400 dark:text-slate-500">{(item.book?.averageRating || 0).toFixed(1)}</span></div>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </section>

        <section className="editorial-panel p-6 sm:p-7 xl:col-span-2">
          <div className="flex items-end justify-between gap-4 border-b border-violet-100 dark:border-violet-800 pb-5">
            <div>
              <p className="editorial-kicker"><span className="h-1.5 w-1.5 rounded-full bg-amber-400 dark:bg-amber-500" />Arsip Pribadi</p>
              <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-ink dark:text-slate-100">Ulasan Terbaru</h2>
            </div>
            <Link href="/reviews" className="shrink-0 text-xs font-extrabold uppercase tracking-wider text-violet-700 dark:text-violet-400 hover:text-violet-900 dark:text-violet-200">Lihat Semua →</Link>
          </div>

          {reviews.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <p className="text-6xl font-black leading-none text-violet-100 dark:text-violet-200">“</p>
              <h3 className="mt-2 font-extrabold text-ink dark:text-slate-100">Belum ada catatan.</h3>
              <p className="mt-1 max-w-xs text-sm text-slate-500 dark:text-slate-400 dark:text-slate-500">Suara Anda bisa membantu pembaca lain memilih bacaan.</p>
              <Link href="/books" className="mt-5 rounded-full border border-violet-200 dark:border-violet-700 px-5 py-2.5 text-sm font-bold text-violet-700 dark:text-violet-400 hover:bg-violet-50 dark:bg-violet-900/30">Beri Rating Sekarang</Link>
            </div>
          ) : (
            <ol className="relative mt-5 border-l border-violet-100 dark:border-violet-800 pl-6">
              {reviews.slice(0, 4).map((review) => (
                <li key={review.id} className="relative pb-6 last:pb-0">
                  <span className="absolute -left-[31px] top-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white bg-violet-600 dark:bg-violet-500 ring-1 ring-violet-200" />
                  <Link href={`/books/${review.bookId}`} className="block truncate text-sm font-extrabold text-ink dark:text-slate-100 hover:text-violet-700 dark:text-violet-400">
                    {review.book?.title || 'Buku'}
                  </Link>
                  <div className="mt-1.5 flex flex-wrap items-center gap-2"><RatingStars rating={review.rating} size="sm" /><span className="text-[10px] text-slate-400 dark:text-slate-500">{new Date(review.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span></div>
                  {review.comment && <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-600 dark:text-slate-300 dark:text-slate-400">{review.comment}</p>}
                </li>
              ))}
            </ol>
          )}
        </section>
      </div>

      {/* Rekomendasi Buku */}
      <section className="editorial-panel mt-6 p-6 sm:p-7">
        <div className="flex items-end justify-between gap-4 border-b border-violet-100 dark:border-violet-800 pb-5">
          <div>
            <p className="editorial-kicker"><span className="h-1.5 w-1.5 rounded-full bg-emerald-50 dark:bg-emerald-900/300" />Rekomendasi</p>
            <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-ink dark:text-slate-100">Untuk Anda</h2>
          </div>
          <Link href="/books" className="shrink-0 text-xs font-extrabold uppercase tracking-wider text-violet-700 dark:text-violet-400 hover:text-violet-900 dark:text-violet-200">Lihat Semua →</Link>
        </div>

        {recLoading ? (
          <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="animate-pulse rounded-2xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 p-3">
                <div className="mb-2 h-32 rounded-xl bg-slate-200" />
                <div className="h-3 w-3/4 rounded bg-slate-200" />
                <div className="mt-1 h-2 w-1/2 rounded bg-slate-200" />
              </div>
            ))}
          </div>
        ) : recommendations.length === 0 ? (
          <p className="mt-5 text-sm text-slate-500 dark:text-slate-400 dark:text-slate-500">Belum ada rekomendasi. Beri rating buku untuk mendapat saran personal.</p>
        ) : (
          <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {recommendations.map((book) => (
              <Link
                key={book.id}
                href={`/books/${book.id}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-violet-100 dark:border-violet-800 bg-white dark:bg-slate-800 shadow-soft transition hover:-translate-y-1 hover:shadow-card"
              >
                <div className="relative h-32 shrink-0 overflow-hidden bg-gradient-to-br from-violet-800 to-ink">
                  {book.coverImage ? (
                    <Image src={book.coverImage} alt={book.title} fill sizes="120px" className="object-cover transition duration-300 group-hover:scale-105" loading="lazy" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-violet-200">
                      <svg className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth={1.25} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-2.5">
                  <h3 className="line-clamp-2 text-xs font-bold leading-snug text-ink dark:text-slate-100">{book.title}</h3>
                  <p className="mt-0.5 line-clamp-1 text-[10px] text-slate-500 dark:text-slate-400 dark:text-slate-500">{book.author}</p>
                  <div className="mt-auto pt-1.5 flex items-center gap-1">
                    <span className="text-[10px] text-amber-50 dark:text-amber-1000 dark:text-amber-400">★</span>
                    <span className="text-[10px] font-bold text-slate-700 dark:text-slate-200">{(book.averageRating ?? 0).toFixed(1)}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Lencana Pembaca */}
      <section className="editorial-panel mt-6 p-6 sm:p-7">
        <div className="flex items-end justify-between gap-4 border-b border-violet-100 dark:border-violet-800 pb-5">
          <div>
            <p className="editorial-kicker"><span className="h-1.5 w-1.5 rounded-full bg-amber-400 dark:bg-amber-500" />Reputasi</p>
            <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-ink dark:text-slate-100">Lencana Anda</h2>
          </div>
        </div>
        <BadgesDisplay userId={user?.id} />
      </section>
    </MemberLayout>
  );
}

