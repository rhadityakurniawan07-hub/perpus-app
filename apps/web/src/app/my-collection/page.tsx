'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import MemberLayout from '@/components/MemberLayout';
import RatingStars from '@/components/RatingStars';
import { useReadingStatus } from '@/hooks/useReadingStatus';
import { ReadingStatusValue } from '@/types';

type TabValue = ReadingStatusValue | 'ALL';

const tabs: { value: TabValue; label: string }[] = [
  { value: 'ALL', label: 'Semua' },
  { value: 'WISHLIST', label: 'Ingin Dibaca' },
  { value: 'READING', label: 'Sedang Dibaca' },
  { value: 'FINISHED', label: 'Sudah Selesai' },
];

const statusStyles: Record<ReadingStatusValue, string> = {
  WISHLIST: 'bg-amber-100 text-amber-800',
  READING: 'bg-violet-100 text-violet-800',
  FINISHED: 'bg-emerald-100 text-emerald-800',
};

const statusLabel: Record<ReadingStatusValue, string> = {
  WISHLIST: 'Ingin Dibaca',
  READING: 'Sedang Dibaca',
  FINISHED: 'Sudah Selesai',
};

export default function MyCollectionPage() {
  const { items, loading, fetchMyReading, setStatus } = useReadingStatus();
  const [activeTab, setActiveTab] = useState<TabValue>('ALL');

  useEffect(() => {
    fetchMyReading(activeTab === 'ALL' ? undefined : activeTab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  async function handleStatusChange(bookId: string, value: ReadingStatusValue) {
    try {
      await setStatus(bookId, value);
      await fetchMyReading(activeTab === 'ALL' ? undefined : activeTab);
    } catch (err) {
      console.error('Gagal mengubah status baca:', err);
    }
  }

  return (
    <MemberLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-ink">Koleksi Saya</h1>
        <p className="text-slate-500">Pantau dan atur status baca buku-buku pilihan Anda.</p>
      </div>

      {/* Tabs */}
      <div className="mb-5 flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`chip ${activeTab === tab.value ? 'chip-active' : ''}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-16 text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-brand-600 border-t-transparent" />
          <p className="mt-3 text-sm text-slate-500">Memuat koleksi...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="card py-16 text-center">
          <svg className="mx-auto mb-4 h-14 w-14 text-slate-300" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21l-7.5-4.5L4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
          </svg>
          <p className="font-semibold text-ink">Belum ada buku di koleksi Anda</p>
          <p className="mt-1 text-sm text-slate-500">Tandai status baca saat melihat detail buku.</p>
          <Link href="/books" className="btn-primary mt-4">Jelajahi Katalog</Link>
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {items.map((item) => (
            <li key={item.id} className="card flex gap-4 p-4">
              <div className="flex h-28 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-brand-700 to-ink text-brand-200">
                {item.book?.coverImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.book.coverImage}
                    alt={item.book.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <svg className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                  </svg>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <Link
                      href={`/books/${item.bookId}`}
                      className="block truncate font-bold text-ink hover:text-brand-700"
                    >
                      {item.book?.title || 'Buku'}
                    </Link>
                    <p className="truncate text-sm text-slate-500">{item.book?.author}</p>
                  </div>
                  <span className={`badge shrink-0 ${statusStyles[item.status]}`}>
                    {statusLabel[item.status]}
                  </span>
                </div>

                <div className="mt-2 flex items-center gap-2">
                  <RatingStars rating={item.book?.averageRating || 0} size="sm" />
                  <span className="text-xs text-slate-500">
                    {(item.book?.averageRating || 0).toFixed(1)} ({item.book?.reviewCount || 0})
                  </span>
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <label className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                    Ubah:
                  </label>
                  <select
                    value={item.status}
                    onChange={(e) => handleStatusChange(item.bookId, e.target.value as ReadingStatusValue)}
                    className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs font-medium outline-none focus:border-brand-400"
                  >
                    <option value="WISHLIST">Ingin Dibaca</option>
                    <option value="READING">Sedang Dibaca</option>
                    <option value="FINISHED">Sudah Selesai</option>
                  </select>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </MemberLayout>
  );
}
