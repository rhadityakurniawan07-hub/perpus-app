'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { useMyStats } from '@/hooks/useMyStats';
import { useEffect } from 'react';

export default function StatusStrip() {
  const { isAuthenticated } = useAuth();
  const { stats, fetchMyStats } = useMyStats();

  useEffect(() => {
    if (isAuthenticated) {
      fetchMyStats();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  return (
    <div className="border-b border-ink bg-ink text-white">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-6 gap-y-1 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] sm:px-6 sm:text-[11px] lg:px-8">
        <p className="flex flex-wrap items-center gap-x-4 gap-y-0.5 text-white/80">
          <span>Komunitas Pemirsa & Resensi Buku Indonesia</span>
          <span className="hidden text-white/40 sm:inline">·</span>
          <span className="hidden sm:inline">Ribuan review terpercaya</span>
          <span className="hidden text-white/40 sm:inline">·</span>
          <span className="hidden lg:inline">Tanda bacaan favorit</span>
        </p>

        {isAuthenticated ? (
          <div className="flex flex-wrap items-center gap-x-4 gap-y-0.5">
            <span className="flex items-center gap-1.5 text-amber-300">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
              Sedang Dibaca: {stats.reading} Buku
            </span>
            <span className="flex items-center gap-1.5 text-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Sudah Selesai: {stats.finished} Buku
            </span>
            <span className="flex items-center gap-1.5 text-violet-300">
              <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
              Rating Diberikan: {stats.reviews} Ulasan
            </span>
          </div>
        ) : (
          <Link href="/register" className="flex items-center gap-1.5 text-brand-200 transition hover:text-white">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-400" />
            Gabung komunitas untuk memantau jejak membaca →
          </Link>
        )}
      </div>
    </div>
  );
}
