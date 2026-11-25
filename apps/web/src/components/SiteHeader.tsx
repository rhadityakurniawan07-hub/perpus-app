'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import ThemeToggle from '@/components/ThemeToggle';

const PUBLIC_NAV_ITEMS = [
  { name: 'Jelajah Buku', href: '/books' },
  { name: 'Koleksi Saya', href: '/my-collection' },
  { name: 'Ulasan & Rating', href: '/reviews' },
  { name: 'Kurasi Pilihan', href: '/guide' },
];

const MEMBER_NAV_ITEMS = [
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Koleksi Saya', href: '/my-collection' },
  { name: 'Ulasan & Rating', href: '/reviews' },
  { name: 'Profil', href: '/profile' },
];

const MEMBER_ROUTE_PREFIXES = ['/dashboard', '/my-collection', '/reviews', '/profile'];

export default function SiteHeader() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const isMemberRoute =
    !!pathname &&
    MEMBER_ROUTE_PREFIXES.some(
      (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
    );
  const navItems = isMemberRoute ? MEMBER_NAV_ITEMS : PUBLIC_NAV_ITEMS;

  const isActive = (href: string) =>
    pathname === href || (!!pathname && pathname.startsWith(`${href}/`));

  const displayName = user?.name?.trim() || 'Pembaca';
  const displayRole = user?.role === 'ADMIN' ? 'Kurator' : 'Pembaca';

  return (
    <header className="sticky top-0 z-40 border-b border-brand-100 dark:border-slate-700 bg-white/95 dark:bg-slate-900/95 backdrop-blur">
      {/* Baris utama */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-3 sm:gap-5">
          {/* Logo */}
          <Link
            href={isMemberRoute ? '/dashboard' : '/'}
            aria-label="PERPUS - kembali"
            className="flex shrink-0 items-center gap-2 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white shadow-soft">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              </svg>
            </span>
            <span className="hidden leading-tight sm:block">
              <span className="block text-xl font-extrabold tracking-tight text-ink dark:text-slate-100">
                PERPUS
              </span>
            </span>
          </Link>

          {/* Nav (desktop) */}
          <nav className="hidden items-center gap-1 xl:flex" aria-label="Navigasi utama">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg px-2.5 py-2 text-[12px] font-semibold transition ${
                  isActive(item.href)
? 'text-brand-800 dark:text-brand-300 underline decoration-2 underline-offset-8'
                    : 'text-slate-600 dark:text-slate-300 hover:text-brand-800 dark:hover:text-brand-300'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

{/* User / auth */}
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
            <ThemeToggle />
            {isAuthenticated ? (
              <>
                <div className="hidden items-center gap-2 sm:flex">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">
                    {displayName.charAt(0).toUpperCase()}
                  </span>
                  <span className="hidden leading-tight sm:block">
                    <span className="block max-w-[9rem] truncate text-sm font-semibold text-ink dark:text-slate-100">
                      {displayName}
                    </span>
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                      {displayRole}
                    </span>
                  </span>
                </div>
                <button
                  onClick={() => logout()}
                  className="flex items-center gap-1.5 rounded-xl border border-red-200 px-2.5 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                  </svg>
                  <span className="hidden sm:inline">Keluar</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="hidden rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 transition hover:bg-slate-100 dark:hover:bg-slate-700 dark:bg-slate-700 sm:block"
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
              className="rounded-xl p-2 text-ink dark:text-slate-100 transition hover:bg-slate-100 dark:hover:bg-slate-700 dark:bg-slate-700 lg:hidden"
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
          <nav className="mt-3 grid grid-cols-2 gap-2" aria-label="Navigasi utama mobile">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className={`rounded-xl px-3 py-3 text-center text-xs font-semibold transition ${
                  isActive(item.href)
                    ? 'bg-brand-600 text-white'
                    : 'bg-lavender dark:bg-slate-800 text-brand-800 dark:text-brand-300'
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
              className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-xl border border-red-200 px-3 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
              </svg>
              Keluar
            </button>
          )}
        </div>
      )}
    </header>
  );
}

