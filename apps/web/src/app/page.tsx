'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { Book, Category } from '@/types';

export default function Home() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [featured, setFeatured] = useState<Book | null>(null);
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [minRating, setMinRating] = useState(false);

  useEffect(() => {
    api
      .get('/categories')
      .then((res) => setCategories(res.data ?? []))
      .catch(() => setCategories([]));
    api
      .get('/books?sortBy=rating&order=desc')
      .then((res) => setFeatured(res.data?.[0] ?? null))
      .catch(() => setFeatured(null));
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

  return (
    <main>
      {/* Hero */}
      <section className="border-b border-brand-100">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:gap-12 lg:py-16 lg:px-8">
          {/* Left column */}
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-4 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.2em] text-brand-700">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-600" />
              Eksplorasi Literatur & Rating Bintang
            </span>

            <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight text-ink sm:text-5xl">
              Temukan, Nilai, & Catat{' '}
              <span className="text-brand-600">Jejak Membaca</span> Buku Favorit Anda
            </h1>

            <p className="mt-4 max-w-lg text-base leading-relaxed text-slate-600">
              Jelajahi ribuan judul dari katalog terkurasi, bandingkan rating bintang dan
              resensi jujur pembaca Indonesia, lalu tandai status membaca Anda —{' '}
              <span className="font-semibold text-ink">Sudah Selesai Dibaca</span>,{' '}
              <span className="font-semibold text-ink">Sedang Dibaca</span>, atau{' '}
              <span className="font-semibold text-ink">Belum Dibaca</span>.
            </p>

            {/* Search */}
            <form onSubmit={handleSearch} role="search" className="mt-6">
              <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-card focus-within:border-brand-400 focus-within:ring-2 focus-within:ring-brand-100">
                <svg
                  className="ml-2 h-6 w-6 shrink-0 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.75}
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m2.35-5.4a7.75 7.75 0 11-15.5 0 7.75 7.75 0 0115.5 0z" />
                </svg>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Cari judul buku, pengarang, subjek katalog, atau nomor ISBN..."
                  aria-label="Cari buku"
                  className="w-full bg-transparent py-2 text-sm outline-none placeholder:text-slate-400"
                />
                <button type="submit" className="btn-primary shrink-0 !rounded-xl !px-5 !py-2.5">
                  Cari
                </button>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-3">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                  Urutkan:
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium outline-none focus:border-brand-400"
                    aria-label="Urutkan hasil"
                  >
                    <option value="rating">Rating Tertinggi</option>
                    <option value="title">Judul A–Z</option>
                    <option value="year">Terbaru</option>
                  </select>
                </label>
                <label className="flex cursor-pointer select-none items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-brand-300">
                  <input
                    type="checkbox"
                    checked={minRating}
                    onChange={(e) => setMinRating(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-400"
                  />
                  Rating 4,5+ Saja
                </label>
              </div>

              {/* Category chips */}
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Kategori:
                </span>
                <Link href={`/books?sortBy=${sortBy}`} className="chip chip-active !text-xs">
                  Semua Kategori
                </Link>
                {categories.slice(0, 5).map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/books?category=${cat.id}&sortBy=${sortBy}`}
                    className="chip !text-xs"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </form>

            {/* Hero stats */}
            <div className="mt-6 grid grid-cols-3 gap-3 border-t border-brand-100 pt-6">
              {[
                { value: '4.850+', label: 'Judul Katalog' },
                { value: '28.400+', label: 'Ulasan Pembaca' },
                { value: '12.190', label: 'Kurva Komunitas' },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-xl font-extrabold text-brand-700 sm:text-2xl">{stat.value}</p>
                  <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-500 sm:text-[11px]">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right column — Sorotan Pekan Ini */}
          <div className="relative">
            <div className="absolute -right-3 -top-3 hidden rounded-2xl bg-amber-400 px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-ink shadow-card sm:block">
              Sorotan
            </div>
            <div className="card p-5 sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <span className="badge bg-brand-600 text-white">Pilihan Editor</span>
                <span className="flex items-center gap-1.5 text-sm font-extrabold text-amber-500">
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  {featuredRating.toFixed(1)}
                  <span className="text-xs font-semibold text-slate-400">({featuredCount} ulasan)</span>
                </span>
              </div>

              <div className="mt-4 flex gap-4">
                <Link
                  href={featured ? `/books/${featured.id}` : '/books'}
                  className="flex h-40 w-28 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-brand-800 via-ink to-slate-900 sm:h-44 sm:w-32"
                >
                  {featured?.coverImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={featured.coverImage}
                      alt={featuredTitle}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <svg className="h-12 w-12 text-brand-300" fill="none" stroke="currentColor" strokeWidth={1.25} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                    </svg>
                  )}
                </Link>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                    Sorotan Pekan Ini
                  </p>
                  <Link
                    href={featured ? `/books/${featured.id}` : '/books'}
                    className="mt-1 block text-xl font-extrabold leading-snug text-ink hover:text-brand-700"
                  >
                    {featuredTitle}
                  </Link>
                  <p className="mt-1 text-sm text-slate-500">{featuredAuthor}</p>
                  <p className="mt-2 text-[11px] font-semibold uppercase tracking-wider text-brand-600">
                    Tetralogi Buru · Klasik Indonesia
                  </p>
                </div>
              </div>

              <div className="mt-4 border-t border-slate-100 pt-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                  Aktivitas Terkini
                </p>
                {/* Aktivitas bar */}
                <div className="mt-2 flex h-14 items-end gap-1.5" aria-hidden="true">
                  {[28, 45, 32, 60, 74, 52, 88].map((h, i) => (
                    <div
                      key={i}
                      className={`flex-1 rounded-t-md ${i === 6 ? 'bg-brand-600' : 'bg-brand-200'}`}
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
                <ul className="mt-3 space-y-1.5 text-xs text-slate-600">
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    +42 ulasan baru minggu ini
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
                    96% resensi selesai dibaca
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                    85/100 skor kurasi
                  </li>
                </ul>
              </div>

              <Link
                href={featured ? `/books/${featured.id}` : '/books'}
                className="btn-primary mt-4 w-full"
              >
                Lihat Detail & Beri Rating
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Langkah */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <span className="badge bg-lavender text-brand-800 ring-1 ring-brand-200">
          Alur Sederhana Membaca
        </span>
        <h2 className="mt-3 max-w-2xl text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
          Bagaimana Cara Mengkurasi & Mencatat Buku?
        </h2>

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          {[
            {
              num: '01',
              title: 'Cari Koleksi Menarik',
              desc: 'Jelajahi kategori, rak, atau cari judul/penulis favorit Anda di katalog.',
              link: 'Filter Kategori Cepat',
              href: '/books',
            },
            {
              num: '02',
              title: 'Tandai Status Membaca',
              desc: 'Sudah Selesai Dibaca, Sedang Dibaca, atau daftar impian Belum Dibaca.',
              link: 'Sinkronisasi Otomatis',
              href: '/my-collection',
            },
            {
              num: '03',
              title: 'Beri Rating & Bagikan Resensi',
              desc: 'Bintang 1–5 dan ulasan jujur untuk membantu kurasi komunitas.',
              link: 'Berkontribusi pada Komunitas',
              href: '/reviews',
            },
          ].map((step) => (
            <div key={step.num} className="card flex flex-col p-6">
              <span className="text-4xl font-black text-brand-100">{step.num}</span>
              <h3 className="mt-2 text-lg font-bold text-ink">{step.title}</h3>
              <p className="mt-1.5 flex-1 text-sm leading-relaxed text-slate-600">{step.desc}</p>
              <Link
                href={step.href}
                className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-brand-700 transition hover:text-brand-800"
              >
                {step.link} →
              </Link>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
