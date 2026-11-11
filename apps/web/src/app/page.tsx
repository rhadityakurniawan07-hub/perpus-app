'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
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
        className="relative overflow-hidden border-b border-ink"
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
              Kurasi Literatur &amp; Indeks Bacaan
            </span>

            <h1 className="mt-6 text-4xl font-extrabold leading-[1.15] tracking-tight text-white sm:text-5xl xl:text-6xl">
              Temukan Karya Hebat, Beri Rating, &amp; Abadikan{' '}
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
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={featured.coverImage}
                      alt={featuredTitle}
                      className="h-full w-full object-cover"
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
                  “Karya monumental pembaca kesadaran kebangsaan. Penggambaran kemanusiaan
                  yang berani, jujur, dan tak lekang oleh waktu.”
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
                className="mt-3 block w-full rounded-xl bg-violet-600 py-3 text-center text-sm font-bold text-white transition hover:bg-violet-500"
              >
                Lihat Detail &amp; Ulas Buku Ini
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SEARCH + CHIPS ===== */}
      <section className="border-b border-brand-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <form onSubmit={handleSearch} role="search">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <svg
                  className="pointer-events-none absolute left-5 top-1/2 h-6 w-6 -translate-y-1/2 text-slate-400"
                  fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m2.35-5.4a7.75 7.75 0 11-15.5 0 7.75 7.75 0 0115.5 0z" />
                </svg>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Cari judul buku, sastrawan, pengarang, ISBN, atau topik..."
                  aria-label="Cari buku"
                  className="w-full rounded-full border border-slate-200 bg-lavender py-3.5 pl-14 pr-4 text-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                />
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-full border border-slate-200 bg-lavender px-4 py-3.5 text-sm font-semibold text-slate-700 outline-none focus:border-brand-400"
                aria-label="Urutkan hasil"
              >
                <option value="rating">Rating Tertinggi</option>
                <option value="title">Judul A–Z</option>
                <option value="year">Terbaru</option>
              </select>
              <label className="hidden cursor-pointer select-none items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-brand-300 sm:flex">
                <input
                  type="checkbox"
                  checked={minRating}
                  onChange={(e) => setMinRating(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-400"
                />
                ✓ 4.5+ Saja
              </label>
            </div>
          </form>

          {/* Chips kategori */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {categoryChips.map((chip) => (
              <Link
                key={chip.label}
                href={chip.href}
                className={`chip !border-violet-200 !bg-violet-50 !text-violet-800 !text-xs transition hover:!border-violet-600 hover:!bg-violet-600 hover:!text-white ${
                  chip.label === 'Semua Kategori' ? '!border-violet-600 !bg-violet-600 !text-white' : ''
                }`}
              >
                {chip.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== REKOMENDASI REDAKSI (6 buku pilihan) ===== */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-14">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="badge bg-violet-100 text-violet-800 ring-1 ring-violet-200">
              Rekomendasi Redaksi
            </span>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
              6 Karya Pilihan Untuk Dibaca
            </h2>
          </div>
          <Link href="/books" className="text-sm font-bold text-brand-700 transition hover:text-brand-800">
            Lihat Semua Katalog →
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {showcase.map((book, idx) => (
            <CatalogCard
              key={book.id}
              book={book}
              readingStatus={SHOWCASE_STATUS[idx] ?? null}
            />
          ))}
        </div>
      </section>

      {/* ===== DISKUSI & ETIKA LITERASI ===== */}
      <section className="border-t border-violet-100 bg-gradient-to-br from-brand-50 via-lavender to-violet-50">
        <div className="mx-auto max-w-7xl px-4 py-14 text-center sm:px-6 lg:px-8">
          <svg className="mx-auto h-10 w-10 text-brand-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9.6 4.5a2.7 2.7 0 00-2.5 1.95L4.6 13.2a2.7 2.7 0 002.62 3.3H10a1 1 0 011 1v2a1 1 0 002 0v-2a2.7 2.7 0 002.7-2.7l-2.05-6.75a2.7 2.7 0 00-2.6-2.67H9.6zm8.5 0a2.7 2.7 0 00-2.5 1.95l-2.5 6.75a2.7 2.7 0 002.62 3.3H19a1 1 0 011 1v2a1 1 0 002 0v-2a2.7 2.7 0 002.7-2.7l-2-6.75A2.7 2.7 0 0021.1 4.5h-3z"/>
          </svg>
          <h2 className="mx-auto mt-4 max-w-2xl text-2xl font-extrabold leading-snug tracking-tight text-ink sm:text-3xl">
            “Karena setiap karya layak dibaca, dan setiap pembaca layak didengar.”
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-slate-600">
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
