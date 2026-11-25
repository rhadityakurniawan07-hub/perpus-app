'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { Book, ReadingStatusValue, ReportStats } from '@/types';
import CatalogCard from '@/components/CatalogCard';
import RatingStars from '@/components/RatingStars';

const categoryChips = [
  { label: 'Semua Kategori', href: '/books' },
  { label: 'Sastra Klasik', href: '/books?category=cat_fiksi' },
  { label: 'Filsafat & Pemikiran', href: '/books?category=cat_filsafat' },
  { label: 'Sains & Kosmologi', href: '/books?category=cat_sains' },
  { label: 'Teknologi & AI', href: '/books?category=cat_sains' },
  { label: 'Sejarah Dunia', href: '/books?category=cat_sejarah' },
  { label: 'Matematika & Logika', href: '/books?category=cat_sains' },
];

const SHOWCASE_IDS = ['book1', 'book3', 'book6', 'book2', 'book4', 'book5'];
const SHOWCASE_STATUS: ReadingStatusValue[] = [
  'FINISHED',
  'READING',
  'WISHLIST',
  'READING',
  'WISHLIST',
  'WISHLIST',
];

export default function Home() {
  const router = useRouter();
  const [featured, setFeatured] = useState<Book | null>(null);
  const [showcase, setShowcase] = useState<Book[]>([]);
  const [reports, setReports] = useState<ReportStats | null>(null);
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [minRating, setMinRating] = useState(false);

  useEffect(() => {
    api
      .get('/books?sortBy=rating&order=desc')
      .then((res) => setFeatured(res.data?.[0] ?? null))
      .catch(() => setFeatured(null));

    api
      .get('/reports')
      .then((res) => setReports(res.data ?? null))
      .catch(() => setReports(null));

    Promise.all(
      SHOWCASE_IDS.map((id) =>
        api.get(`/books/${id}`).then((r) => r.data as Book).catch(() => null)
      )
    ).then((arr) => setShowcase(arr.filter((b): b is Book => Boolean(b))));
  }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    const q = query.trim();
    if (q) params.set('q', q);
    params.set('sortBy', sortBy);
    if (minRating) params.set('minRating', '4.5');
    router.push(`/books?${params.toString()}`);
  }

  const featuredTitle = featured?.title ?? 'Bumi Manusia';
  const featuredAuthor = featured?.author ?? 'Pramoedya Ananta Toer';
  const featuredRating = featured?.averageRating ?? 4.9;
  const featuredCount = featured?.reviewCount ?? 342;
  const featuredPositive = featured?.positivePercent ?? 98;
  const totalBooks = reports?.totalBooks ?? 4850;
  const totalReviews = reports?.totalReviews ?? 28400;

  return (
    <main>
      {/* ===== HERO ===== */}
      <section
        className="relative overflow-hidden border-b border-ink dark:border-slate-700"
        style={{
          backgroundImage: "url('/hero-library.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-ink/95 via-ink/80 to-ink/30" />
        <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-12 lg:gap-8 lg:px-8 lg:py-16">
          {/* Kiri: headline */}
          <div className="lg:col-span-7 xl:col-span-7">
            <span className="inline-flex items-center gap-2 rounded-full border border-violet-400/30 bg-violet-600/25 px-4 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.25em] text-violet-200 backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
              Kurasi Literatur & Indeks Bacaan
            </span>

            <h1 className="mt-6 text-4xl font-extrabold leading-[1.15] tracking-tight text-white sm:text-5xl xl:text-6xl">
              Temukan Karya Hebat, Beri Rating, & Abadikan{' '}
              <span className="text-violet-300">Jejak Membaca</span>.
            </h1>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-violet-100/85">
              Jelajah ribuan ulasan jujur dari komunitas kurator literatur nusantara. Nilai
              buku dengan bintang, catat kutipan favorit, dan kelompokkan progres bacaan
              tanpa kerumitan.
            </p>
          </div>

          {/* Kanan: Karya Pilihan Redaksi */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl border border-white/15 bg-ink/55 p-5 shadow-hero backdrop-blur-md">
              <div className="flex items-center justify-between gap-2">
                <span className="badge bg-violet-600 text-white shadow-soft">
                  Karya Pilihan Redaksi Minggu Ini
                </span>
                <span className="badge bg-emerald-400/20 text-emerald-300 ring-1 ring-emerald-300/40">
                  ✓ Sudah Selesai
                </span>
              </div>

              <div className="mt-4 flex gap-4">
                <Link
                  href={featured ? `/books/${featured.id}` : '/books'}
                  className="block h-48 w-32 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-violet-700 via-ink to-slate-900 shadow-soft"
                >
                  {featured?.coverImage ? (
                    <Image
                      src={featured.coverImage}
                      alt={featuredTitle}
                      width={128}
                      height={192}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <svg className="h-12 w-12 text-violet-300" fill="none" stroke="currentColor" strokeWidth={1.25} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                      </svg>
                    </div>
                  )}
                </Link>
                <div className="min-w-0 text-white">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-violet-300">
                    {featured?.category?.name ?? 'Nusantara · Sastra'}
                  </p>
                  <Link
                    href={featured ? `/books/${featured.id}` : '/books'}
                    className="mt-1 block text-2xl font-extrabold leading-tight text-white hover:text-violet-200"
                  >
                    {featuredTitle}
                  </Link>
                  <p className="mt-1 text-sm text-violet-100/70">{featuredAuthor}</p>
                  <div className="mt-2 flex items-center gap-2 text-sm text-white">
                    <RatingStars rating={featuredRating} size="sm" />
                    <span className="font-extrabold">{featuredRating.toFixed(1)}</span>
                    <span className="text-xs text-violet-200/70">({featuredCount} ulasan)</span>
                  </div>
                  <p className="mt-1 text-xs font-semibold text-emerald-300">
                    {featuredPositive}% Menyatakan Buku Ini Layak Selesai Dibaca
                  </p>
                </div>
              </div>

              <div className="mt-4 border-l-2 border-violet-400 pl-4 text-sm leading-relaxed text-violet-100/90">
                <p className="italic">
                  "Karya monumental pembaca kesadaran kebangsaan. Penggambaran kemanusiaan
                  yang berani, jujur, dan tak lekang oleh waktu."
                </p>
                <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.2em] text-violet-300/80">
                  Teks Kurator · Redaksi PERPUS
                </p>
              </div>

              <p className="mt-3 flex items-center justify-between border-t border-white/10 pt-3 text-[10px] font-semibold uppercase tracking-wider text-violet-200/70">
                <span>Kurator: Dewan Buku Nusantara</span>
                <span>Rak: {featured?.shelfLocation ?? 'S-03'} · ISBN: {featured?.isbn ?? '-'}</span>
              </p>

              <Link
                href={featured ? `/books/${featured.id}` : '/books'}
                className="mt-3 block w-full rounded-xl bg-violet-600 py-3 text-center text-sm font-bold text-white transition hover:bg-violet-50 dark:bg-violet-900/300"
              >
                Lihat Detail & Ulas Buku Ini
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== DISKUSI & ETIKA LITERASI ===== */}
      <section className="border-t border-violet-100 dark:border-violet-800 bg-white dark:bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 py-14 text-center sm:px-6 lg:px-8">
          <svg className="mx-auto h-10 w-10 text-brand-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9.6 4.5a2.7 2.7 0 00-2.5 1.95L4.6 13.2a2.7 2.7 0 002.62 3.3H10a1 1 0 011 1v2a1 1 0 002 0v-2a2.7 2.7 0 002.7-2.7l-2.05-6.75a2.7 2.7 0 00-2.6-2.67H9.6zm8.5 0a2.7 2.7 0 00-2.5 1.95l-2.5 6.75a2.7 2.7 0 002.62 3.3H19a1 1 0 011 1v2a1 1 0 002 0v-2a2.7 2.7 0 002.7-2.7l-2-6.75A2.7 2.7 0 0021.1 4.5h-3z"/>
          </svg>
          <h2 className="mx-auto mt-4 max-w-2xl text-2xl font-extrabold leading-snug tracking-tight text-black dark:text-white sm:text-3xl">
            "Karena setiap karya layak dibaca, dan setiap pembaca layak didengar."
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-slate-600 dark:text-slate-300">
            Ulasan Anda membantu kurator dan pembaca lain menemukan bacaan yang tepat.
            Tulis resensi pertama Anda hari ini.
          </p>
          <Link href="/books" className="btn-primary mt-6 !px-6 !py-3 !text-base">
            Tulis Ulasan Buku
          </Link>
        </div>
      </section>
    </main>
  );
}