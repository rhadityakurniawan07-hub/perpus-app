'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import MemberLayout from '@/components/MemberLayout';
import RatingStars from '@/components/RatingStars';
import { useReadingStatus } from '@/hooks/useReadingStatus';
import { useMyStats } from '@/hooks/useMyStats';
import { ReadingStatusValue } from '@/types';

type TabValue = ReadingStatusValue | 'ALL';

const tabs: { value: TabValue; label: string; caption: string }[] = [
  { value: 'ALL', label: 'Semua', caption: 'Seluruh rak' },
  { value: 'WISHLIST', label: 'Ingin Dibaca', caption: 'Antrian baca' },
  { value: 'READING', label: 'Sedang Dibaca', caption: 'Dalam perjalanan' },
  { value: 'FINISHED', label: 'Sudah Selesai', caption: 'Telah ditaklukkan' },
];

const statusConfig: Record<ReadingStatusValue, { label: string; short: string; chip: string; accent: string; ring: string }> = {
  WISHLIST: {
    label: 'Ingin Dibaca',
    short: 'Berminat',
    chip: 'bg-amber-50 text-amber-800 ring-amber-200',
    accent: 'from-amber-400 to-orange-400',
    ring: 'border-amber-200',
  },
  READING: {
    label: 'Sedang Dibaca',
    short: 'Dibaca',
    chip: 'bg-violet-50 text-violet-800 ring-violet-200',
    accent: 'from-violet-500 to-indigo-700',
    ring: 'border-violet-200',
  },
  FINISHED: {
    label: 'Sudah Selesai',
    short: 'Selesai',
    chip: 'bg-emerald-50 text-emerald-800 ring-emerald-200',
    accent: 'from-emerald-400 to-teal-600',
    ring: 'border-emerald-200',
  },
};

export default function MyCollectionPage() {
  const { items, loading, error, fetchMyReading, setStatus } = useReadingStatus();
  const { stats, fetchMyStats } = useMyStats();
  const [activeTab, setActiveTab] = useState<TabValue>('ALL');
  const [savingBookId, setSavingBookId] = useState<string | null>(null);

  useEffect(() => {
    fetchMyStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchMyReading(activeTab === 'ALL' ? undefined : activeTab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const tabCounts: Record<TabValue, number> = {
    ALL: stats.wishlist + stats.reading + stats.finished,
    WISHLIST: stats.wishlist,
    READING: stats.reading,
    FINISHED: stats.finished,
  };
  const progress = tabCounts.ALL > 0 ? Math.round((stats.finished / tabCounts.ALL) * 100) : 0;
  const circumference = 2 * Math.PI * 47;
  const dashOffset = circumference - (progress / 100) * circumference;

  async function handleStatusChange(bookId: string, value: ReadingStatusValue) {
    setSavingBookId(bookId);
    try {
      await setStatus(bookId, value);
      await Promise.all([
        fetchMyReading(activeTab === 'ALL' ? undefined : activeTab),
        fetchMyStats(),
      ]);
    } catch (err) {
      console.error('Gagal mengubah status baca:', err);
    } finally {
      setSavingBookId(null);
    }
  }

  return (
    <MemberLayout>
      <section className="editorial-panel editorial-dots mb-6 border-violet-100 bg-[#fbfaff]">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full border border-violet-200/60" />
        <div className="pointer-events-none absolute -left-24 bottom-0 h-48 w-48 rounded-full border border-amber-200/60" />
        <div className="relative grid gap-6 p-6 sm:p-8 lg:grid-cols-[1.15fr_.85fr] lg:p-10">
          <div className="flex flex-col justify-center">
            <div className="editorial-kicker"><span className="h-2 w-2 rounded-full bg-violet-600" />Perpustakaan Pribadi</div>
            <h1 className="editorial-heading mt-5 text-5xl sm:text-6xl xl:text-7xl">Rak Baca<br />Anda.</h1>
            <p className="mt-6 max-w-lg text-base leading-7 text-slate-600 sm:text-lg">
              Setiap cover di halaman ini adalah janji yang menunggu ditepati—atau kenangan yang sudah selesai Anda baca.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-4 text-xs">
              <span className="rounded-full border border-violet-200 bg-white/70 px-4 py-2 font-bold uppercase tracking-wider text-violet-800">PERSONAL SHELF</span>
              <span className="font-semibold text-slate-400">Tersimpan dan terlacak dalam satu ruang.</span>
            </div>
          </div>

          <div className="relative rounded-[2rem] border border-violet-100 bg-white p-6 shadow-card sm:p-7">
            <div className="flex items-center justify-between gap-4 border-b border-violet-100 pb-5">
              <div>
                <p className="text-[9px] font-extrabold uppercase tracking-[0.28em] text-violet-700">Progress Koleksi</p>
                <p className="mt-2 text-sm font-bold text-ink">Seberapa jauh Anda sampai?</p>
              </div>
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-600 text-xs font-black text-white">PB</span>
            </div>
            <div className="mt-6 flex items-center gap-6">
              <div className="relative h-28 w-28 shrink-0">
                <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90" aria-hidden="true">
                  <circle cx="60" cy="60" r="47" fill="none" stroke="#ede9fe" strokeWidth="13" />
                  <circle cx="60" cy="60" r="47" fill="none" stroke="#4f46e5" strokeWidth="13" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={dashOffset} className="transition-all duration-700" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-black tracking-tight text-ink">{progress}</span>
                  <span className="text-[9px] font-extrabold uppercase text-slate-400">persen</span>
                </div>
              </div>
              <div>
                <p className="text-5xl font-black tracking-tight text-ink">{tabCounts.ALL}</p>
                <p className="mt-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Total buku terlacak</p>
                <p className="mt-3 text-xs leading-5 text-slate-500">{stats.finished} selesai dari {tabCounts.ALL} buku yang pernah masuk rak Anda.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {error && (
        <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">{error}</div>
      )}

      <div className="mb-5 flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`group min-w-28 rounded-2xl border px-4 py-3 text-left transition ${
              activeTab === tab.value
                ? 'border-ink bg-ink text-white shadow-card'
                : 'border-violet-100 bg-white text-ink hover:border-violet-300 hover:shadow-soft'
            }`}
            aria-pressed={activeTab === tab.value}
          >
            <span className={`block text-2xl font-black leading-none ${activeTab === tab.value ? 'text-amber-300' : 'text-violet-700'}`}>{tabCounts[tab.value]}</span>
            <span className="mt-2 block text-[10px] font-extrabold uppercase tracking-[0.14em]">{tab.label}</span>
            <span className={`mt-0.5 hidden text-[9px] sm:block ${activeTab === tab.value ? 'text-violet-100/70' : 'text-slate-400'}`}>{tab.caption}</span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          {[0, 1, 2, 3].map((item) => (
            <div key={item} className="flex gap-5 rounded-3xl border border-violet-100 bg-white p-5">
              <div className="h-44 w-28 animate-pulse rounded-2xl bg-violet-50" />
              <div className="flex-1 space-y-4 py-2"><div className="h-5 w-3/4 animate-pulse rounded bg-violet-50" /><div className="h-4 w-1/2 animate-pulse rounded bg-slate-100" /><div className="h-8 w-2/3 animate-pulse rounded-full bg-violet-50" /></div>
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="editorial-panel flex flex-col items-center px-6 py-16 text-center">
          <div className="relative flex h-28 w-28 items-center justify-center"><span className="absolute h-28 w-20 rounded-t-full border border-violet-200 bg-violet-50" /><span className="absolute h-16 w-12 rounded-b-md border border-violet-300 bg-white shadow-soft" /><span className="relative h-6 w-px bg-violet-400" /></div>
          <p className="editorial-kicker mt-6">Rak Kosong</p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-ink">Tunggu cerita apa yang akan masuk?</h2>
          <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">Tandai status baca buku di katalog, dan buku itu akan tampil di sini sebagai arsip pribadi Anda.</p>
          <Link href="/books" className="mt-6 rounded-full bg-violet-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-violet-500">Jelajahi Katalog →</Link>
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          {items.map((item) => {
            const book = item.book;
            const config = statusConfig[item.status];
            return (
              <li key={item.id} className={`group relative overflow-hidden rounded-3xl border ${config.ring} bg-white p-5 shadow-soft transition hover:-translate-y-1 hover:shadow-card sm:p-6`}>
                <div className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${config.accent}`} />
                <div className="flex flex-col gap-5 sm:flex-row">
                  <Link href={`/books/${item.bookId}`} className="relative block h-44 w-28 shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br from-violet-800 to-ink shadow-card">
                    {book?.coverImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={book.coverImage} alt={book?.title || 'Sampul buku'} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-violet-200"><svg className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth={1.25} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg></div>
                    )}
                    <span className="absolute bottom-2 left-2 h-1.5 w-8 rounded-full bg-white/40" />
                  </Link>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <span className={`inline-flex rounded-full px-3 py-1 text-[9px] font-extrabold uppercase tracking-[0.18em] ring-1 ${config.chip}`}>{config.label}</span>
                        <Link href={`/books/${item.bookId}`} className="mt-3 block text-xl font-extrabold leading-tight tracking-tight text-ink transition hover:text-violet-700">{book?.title || 'Buku'}</Link>
                        <p className="mt-1 truncate text-sm text-slate-500">oleh {book?.author || 'Penulis tidak diketahui'}</p>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 border-y border-violet-100 py-3">
                      <span className="flex items-center gap-1.5"><RatingStars rating={book?.averageRating || 0} size="sm" /><strong className="text-xs text-ink">{(book?.averageRating || 0).toFixed(1)}</strong></span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{book?.reviewCount || 0} ulasan</span>
                      {book?.category?.name && <span className="text-[10px] font-bold uppercase tracking-wider text-violet-500">{book.category.name}</span>}
                    </div>

                    <div className="mt-4">
                      <p className="text-[9px] font-extrabold uppercase tracking-[0.2em] text-slate-400">Pindahkan ke</p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {(Object.keys(statusConfig) as ReadingStatusValue[]).map((value) => {
                          const isCurrent = item.status === value;
                          return (
                            <button
                              key={value}
                              onClick={() => handleStatusChange(item.bookId, value)}
                              disabled={isCurrent || savingBookId === item.bookId}
                              className={`rounded-full px-3 py-2 text-[10px] font-extrabold uppercase tracking-wider transition disabled:cursor-default ${
                                isCurrent ? 'bg-ink text-white' : 'bg-lavender text-violet-800 hover:bg-violet-200 disabled:opacity-50'
                              }`}
                            >
                              {savingBookId === item.bookId && !isCurrent ? '…' : statusConfig[value].short}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </MemberLayout>
  );
}
