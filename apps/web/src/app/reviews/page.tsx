'use client';

import { useEffect, useMemo } from 'react';
import Link from 'next/link';
import MemberLayout from '@/components/MemberLayout';
import RatingStars from '@/components/RatingStars';
import { useMyReviews } from '@/hooks/useReviews';
import { useMyStats } from '@/hooks/useMyStats';

export default function ReviewsPage() {
  const { reviews, loading, error, fetchMyReviews, deleteReview } = useMyReviews();
  const { stats, fetchMyStats } = useMyStats();

  useEffect(() => {
    fetchMyReviews();
    fetchMyStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const reviewCount = typeof stats.reviews === 'number' ? stats.reviews : reviews.length;
  const averageRating = useMemo(() => reviews.length ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0, [reviews]);
  const distribution = useMemo(() => [5, 4, 3, 2, 1].map((rating) => reviews.filter((review) => review.rating === rating).length), [reviews]);
  const maxDistribution = Math.max(...distribution, 1);

  async function handleDelete(id: string) {
    const confirmed = window.confirm('Hapus ulasan ini? Tindakan tidak bisa dibatalkan.');
    if (!confirmed) return;
    try {
      await deleteReview(id);
      await fetchMyStats();
    } catch (err) {
      console.error('Gagal menghapus ulasan:', err);
    }
  }

  return (
    <MemberLayout>
      <section className="editorial-panel editorial-dots mb-6 border-amber-100 bg-[#fffdf7]">
        <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full border border-amber-200/60" />
        <div className="pointer-events-none absolute -right-24 bottom-0 h-56 w-56 rounded-full border border-violet-200/70" />
        <div className="relative grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.05fr_.95fr] lg:p-10">
          <div className="flex flex-col justify-center">
            <div className="editorial-kicker text-amber-700"><span className="h-2 w-2 rounded-full bg-amber-500" />Arsip Resensi</div>
            <h1 className="editorial-heading mt-5 text-5xl sm:text-6xl xl:text-7xl">Suara<br />yang Tertulis.</h1>
            <p className="mt-6 max-w-lg text-base leading-7 text-slate-600 sm:text-lg">
              Catat kesan, simpan ketidaksetujuan, dan temukan kembali alasan Anda mencintai sebuah buku.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/books" className="rounded-full bg-ink px-5 py-3 text-sm font-bold text-white transition hover:bg-violet-800">Beri Rating Buku →</Link>
              <span className="rounded-full border border-amber-200 bg-white/70 px-5 py-3 text-sm font-bold text-amber-800">Catatan pribadi Anda</span>
            </div>
          </div>

          <div className="relative rounded-[2rem] border border-amber-100 bg-ink p-6 text-white shadow-hero sm:p-7">
            <div className="absolute right-5 top-5 h-16 w-16 rounded-full border border-amber-300/30" />
            <div className="absolute -left-12 bottom-10 h-36 w-36 rounded-full border border-violet-400/20" />
            <div className="relative">
              <div className="flex items-center justify-between border-b border-white/10 pb-5">
                <div>
                  <p className="text-[9px] font-extrabold uppercase tracking-[0.3em] text-amber-300">Ikhtisar</p>
                  <h2 className="mt-2 text-xl font-extrabold text-white">Jejak Penilaian</h2>
                </div>
                <span className="text-5xl font-black leading-none text-white/10">“</span>
              </div>
              <div className="mt-6 grid grid-cols-[auto_1fr] items-end gap-6 border-b border-white/10 pb-6">
                <div>
                  <p className="text-7xl font-black leading-none tracking-tight text-white">{averageRating.toFixed(1)}</p>
                  <div className="mt-2"><RatingStars rating={averageRating} size="md" /></div>
                </div>
                <div className="pb-1 text-right">
                  <p className="text-5xl font-black text-amber-300">{reviewCount}</p>
                  <p className="mt-1 text-[9px] font-extrabold uppercase leading-4 tracking-[0.18em] text-violet-100">Ulasan<br />tercatat</p>
                </div>
              </div>
              <div className="mt-6 space-y-2.5">
                {distribution.map((count, index) => {
                  const rating = 5 - index;
                  return (
                    <div key={rating} className="flex items-center gap-3 text-[10px] font-bold uppercase text-violet-100">
                      <span className="w-3 text-right">{rating}</span>
                      <span className="text-amber-300">★</span>
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/10">
                        <div className="h-full rounded-full bg-gradient-to-r from-amber-300 to-orange-400 transition-all duration-700" style={{ width: `${(count / maxDistribution) * 100}%` }} />
                      </div>
                      <span className="w-5 text-right text-white/50">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {error && (
        <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">{error}</div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {[0, 1, 2, 3].map((item) => (
            <div key={item} className="h-64 animate-pulse rounded-3xl border border-amber-100 bg-white p-6"><div className="h-4 w-20 rounded bg-amber-50" /><div className="mt-5 h-6 w-2/3 rounded bg-violet-50" /><div className="mt-5 space-y-2"><div className="h-3 w-full rounded bg-slate-100" /><div className="h-3 w-5/6 rounded bg-slate-100" /></div></div>
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="editorial-panel flex flex-col items-center px-6 py-16 text-center">
          <div className="relative flex h-28 w-28 items-center justify-center"><span className="absolute h-24 w-20 rotate-6 rounded-sm border border-amber-200 bg-amber-50" /><span className="absolute h-24 w-20 -rotate-6 rounded-sm border border-violet-200 bg-white shadow-soft" /><span className="relative text-6xl font-black leading-none text-violet-300">“</span></div>
          <p className="editorial-kicker mt-6 text-amber-700">Arsip Kosong</p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-ink">Tuliskan kesan pertama Anda.</h2>
          <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">Satu ulasan yang jujur dapat menjadi kompas bagi pembaca berikutnya.</p>
          <Link href="/books" className="mt-6 rounded-full bg-violet-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-violet-500">Jelajahi Katalog →</Link>
        </div>
      ) : (
        <div>
          <div className="mb-4 flex items-end justify-between gap-4 border-b border-amber-100 pb-4">
            <div>
              <p className="editorial-kicker text-amber-700"><span className="h-1.5 w-1.5 rounded-full bg-amber-500" />Resensi Pribadi</p>
              <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-ink">Kumpulan Catatan</h2>
            </div>
            <p className="hidden text-[10px] font-extrabold uppercase tracking-[0.18em] text-slate-400 sm:block">{reviews.length} catatan tersimpan</p>
          </div>
          <ul className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {reviews.map((review) => (
              <li key={review.id} className="group relative flex min-h-72 flex-col overflow-hidden rounded-3xl border border-amber-100 bg-white p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-card sm:p-7">
                <span className="absolute right-5 top-1 text-8xl font-black leading-none text-amber-50 transition group-hover:text-amber-100">“</span>
                <div className="relative flex items-start justify-between gap-4 border-b border-amber-100 pb-5">
                  <div className="min-w-0">
                    <Link href={`/books/${review.bookId}`} className="block text-xl font-extrabold leading-snug text-ink transition hover:text-violet-700">{review.book?.title || 'Buku'}</Link>
                    <p className="mt-1 text-xs text-slate-500">oleh {review.book?.author || 'Penulis tidak diketahui'}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(review.id)}
                    aria-label="Hapus ulasan"
                    className="shrink-0 rounded-full border border-transparent p-2 text-slate-300 transition hover:border-red-100 hover:bg-red-50 hover:text-red-500"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                  </button>
                </div>
                <div className="relative mt-5 flex items-center gap-3"><RatingStars rating={review.rating} size="md" /><span className="text-xs font-extrabold text-ink">{review.rating}/5</span><span className="text-[10px] text-slate-400">· {new Date(review.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span></div>
                <div className="relative mt-5 flex-1">
                  {review.comment ? <blockquote className="text-base leading-7 text-slate-700"><span className="mr-1 text-2xl font-black leading-none text-amber-500">“</span>{review.comment}<span className="ml-1 text-2xl font-black leading-none text-amber-500">”</span></blockquote> : <p className="text-sm italic leading-7 text-slate-400">Hanya memberi penilaian, tanpa catatan tambahan.</p>}
                </div>
                <div className="relative mt-6 flex items-center justify-between border-t border-amber-100 pt-4 text-[9px] font-extrabold uppercase tracking-[0.2em] text-slate-400"><span>PERPUS Review</span><Link href={`/books/${review.bookId}`} className="text-violet-700 hover:text-violet-900">Baca Lagi →</Link></div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </MemberLayout>
  );
}
