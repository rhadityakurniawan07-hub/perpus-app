'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';

const navItems = [
  { name: 'Jelajah Buku', href: '/books' },
  { name: 'Koleksi Saya', href: '/my-collection' },
  { name: 'Ulasan & Diskusi', href: '/reviews' },
  { name: 'Kurasi Pilihan', href: '/guide' },
];

export default function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const [query, setQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [adminHint, setAdminHint] = useState(false);
  const clickCountRef = useRef(0);
  const clickTimeoutRef = useRef<number | null>(null);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  function handleLogoClick() {
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
    }

    clickCountRef.current = Math.min(clickCountRef.current + 1, 3);

    if (clickCountRef.current === 3) {
      clickCountRef.current = 0;
      setAdminHint(true);
      window.setTimeout(() => setAdminHint(false), 1200);
      router.push('/admin/login');
      return;
    }

    if (clickCountRef.current === 1) {
      router.push('/');
    }

    clickTimeoutRef.current = window.setTimeout(() => {
      clickCountRef.current = 0;
    }, 800);
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    setMenuOpen(false);
    router.push(q ? `/books?q=${encodeURIComponent(q)}` : '/books');
  }

  const displayName = user?.name?.trim() || 'Pembaca';
  const displayRole = user?.role === 'ADMIN' ? 'Kurator' : 'Pembaca';

  return (
    <header className="sticky top-0 z-40 border-b border-brand-100 bg-white/95 backdrop-blur">
      {adminHint && (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed top-20 left-1/2 z-50 -translate-x-1/2 rounded-full border border-brand-400 bg-ink px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.3em] text-brand-200 shadow-card"
        >
          Admin Area
        </div>
      )}

      {/* Baris utama */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center gap-3 sm:gap-5">
          {/* Logo (triple-click = Easter Egg: buka Admin Login) */}
          <button
            type="button"
            onClick={handleLogoClick}
            aria-label="PERPUS - kembali ke beranda"
            className="flex shrink-0 items-center gap-2 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white shadow-soft">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              </svg>
            </span>
            <span className="leading-tight">
              <span className="block text-xl font-extrabold tracking-tight text-ink">
                PERPUS
              </span>
            </span>
          </button>

          {/* Nav (desktop) */}
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Navigasi utama">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg px-2.5 py-2 text-[12px] font-semibold transition ${
                  isActive(item.href)
                    ? 'text-brand-800 underline decoration-2 underline-offset-8'
                    : 'text-slate-600 hover:text-brand-800'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Search (desktop) */}
          <form onSubmit={handleSearch} className="hidden min-w-0 flex-1 md:block" role="search">
            <div className="relative">
              <svg
                className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
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
                placeholder="Cari judul buku, pengarang, ISBN..."
                aria-label="Cari buku"
                className="w-full rounded-full border border-slate-200 bg-lavender py-2 pl-11 pr-4 text-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-200"
              />
            </div>
          </form>

          {/* Bookmark + user / auth */}
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
            <Link
              href="/my-collection"
              aria-label="Koleksi saya"
              title="Koleksi saya"
              className="hidden rounded-xl p-2 text-slate-500 transition hover:bg-brand-50 hover:text-brand-700 sm:block"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21l-7.5-4.5L4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
              </svg>
            </Link>

            {isAuthenticated ? (
              <>
                <div className="hidden items-center gap-2 sm:flex">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">
                    {displayName.charAt(0).toUpperCase()}
                  </span>
            <span className="hidden leading-tight sm:block">
                    <span className="block max-w-[9rem] truncate text-sm font-semibold text-ink">
                      {displayName}
                    </span>
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-brand-600">
                      {displayRole}
                    </span>
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="hidden rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 sm:block"
                >
                  Keluar
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="hidden rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 sm:block"
                >
                  Masuk
                </Link>
                <Link href="/register" className="btn-primary !px-3 !py-2 text-xs sm:text-sm hidden sm:block">
                  Daftar
                </Link>
              </>
            )}

            {/* Hamburger */}
            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Menu navigasi"
              aria-expanded={menuOpen}
              className="rounded-xl p-2 text-ink transition hover:bg-slate-100 lg:hidden"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-slate-100 bg-white px-4 pb-4 pt-2 lg:hidden">
          <form onSubmit={handleSearch} className="relative md:hidden" role="search">
            <svg
              className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
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
              placeholder="Cari judul, pengarang, ISBN..."
              aria-label="Cari buku"
              className="w-full rounded-full border border-slate-200 bg-lavender py-2 pl-11 pr-4 text-sm outline-none focus:border-brand-400"
            />
          </form>
          <nav className="mt-3 grid grid-cols-2 gap-2" aria-label="Navigasi utama mobile">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className={`rounded-xl px-3 py-3 text-center text-xs font-semibold transition ${
                  isActive(item.href)
                    ? 'bg-brand-600 text-white'
                    : 'bg-lavender text-brand-800'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
          {isAuthenticated && (
            <button
              onClick={() => {
                setMenuOpen(false);
                logout();
              }}
              className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm font-semibold text-red-600"
            >
              Keluar
            </button>
          )}
        </div>
      )}
    </header>
  );
}
