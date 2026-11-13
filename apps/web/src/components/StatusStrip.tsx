'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/axios';
import { useAuth } from '@/lib/auth';
import { useMyStats } from '@/hooks/useMyStats';

export default function StatusStrip() {
  const { isAuthenticated } = useAuth();
  const { stats, fetchMyStats } = useMyStats();
  const [reports, setReports] = useState<{ totalBooks: number; totalReviews: number } | null>(null);

  useEffect(() => {
    api
      .get('/reports/public')
      .then((res) => setReports(res.data ?? null))
      .catch(() => setReports(null));
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchMyStats();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const books = reports?.totalBooks ?? 4850;
  const reviews = reports?.totalReviews ?? 28400;
  const kurator = 12190;

  return (
    <div className="border-b border-brand-100 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 overflow-hidden px-4 py-1.5 text-[9px] font-bold uppercase tracking-[0.14em] text-slate-500 sm:px-6 sm:text-[10px] lg:px-8">
        <Link href="/guide" className="flex min-w-0 items-center gap-1.5 whitespace-nowrap transition hover:text-brand-700">
          <svg className="h-3.5 w-3.5 text-brand-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className="text-ink">Indeks Nasional</span>
          <span className="hidden text-slate-400 md:inline">· Platform Kurasi Buku &amp; Resensi Komunitas Indonesia</span>
        </Link>

        {isAuthenticated ? (
          <div className="flex items-center gap-x-3 gap-y-0.5 sm:gap-x-4">
            <span className="hidden whitespace-nowrap sm:inline"><span className="text-brand-700">{books.toLocaleString('id-ID')}+</span> Buku Terindeks</span>
            <span className="hidden whitespace-nowrap sm:inline"><span className="text-brand-700">{reviews.toLocaleString('id-ID')}+</span> Ulasan Pembaca</span>
            <span className="hidden whitespace-nowrap xl:inline"><span className="text-brand-700">{kurator.toLocaleString('id-ID')}</span> Kurator Aktif</span>
            <span className="hidden text-slate-300 xl:inline">|</span>
            <span className="hidden xl:inline text-slate-400">
              ★ {stats.reviews ?? 0} Rating Anda
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-x-3 sm:gap-x-4">
            <span className="hidden whitespace-nowrap sm:inline"><span className="text-brand-700">{books.toLocaleString('id-ID')}+</span> Buku Terindeks</span>
            <span className="hidden whitespace-nowrap sm:inline"><span className="text-brand-700">{reviews.toLocaleString('id-ID')}+</span> Ulasan Pembaca</span>
            <span className="hidden whitespace-nowrap xl:inline"><span className="text-brand-700">{kurator.toLocaleString('id-ID')}</span> Kurator Aktif</span>
          </div>
        )}
      </div>
    </div>
  );
}
