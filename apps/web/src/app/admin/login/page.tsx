'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { adminLogin, user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      // Sudah login: arahkan ke panel admin
      router.replace('/admin/dashboard');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, isAuthenticated]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await adminLogin(email, password);
    } catch (err: any) {
      setError(err?.message || 'Email atau password salah.');
      setLoading(false);
    }
  }

  if (authLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-ink">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-400 border-t-transparent" />
      </main>
    );
  }

  return (
    <main
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ink px-4 py-12 sm:px-6 lg:px-8"
      aria-label="Halaman masuk admin"
    >
      {/* Dekorasi latar: bintang & gradasi violet */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full opacity-60"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <radialGradient id="violetGlow" cx="20%" cy="15%" r="60%">
            <stop offset="0%" stopColor="#6D28D9" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#1E1B4B" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="violetGlow2" cx="85%" cy="85%" r="60%">
            <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#1E1B4B" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#violetGlow)" />
        <rect width="100%" height="100%" fill="url(#violetGlow2)" />
        {[
          [140, 110], [260, 200], [380, 80], [520, 150], [720, 90], [900, 180], [1080, 120], [180, 300],
          [320, 260], [480, 320], [640, 240], [840, 300], [1020, 260], [120, 460], [290, 420], [450, 480],
          [680, 400], [880, 470], [1050, 430], [200, 650], [380, 610], [560, 680], [740, 620], [920, 700], [1100, 630],
        ].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r={1.5 + (i % 3) * 0.7} fill="#C4B5FD" opacity={0.6 + (i % 4) * 0.1} />
        ))}
      </svg>

      <div className="relative z-10 grid w-full max-w-4xl grid-cols-1 overflow-hidden rounded-3xl border border-brand-800 bg-ink/70 shadow-[0_30px_80px_rgba(124,58,237,0.35)] backdrop-blur-md md:grid-cols-2">
        {/* Panel kiri: branding admin */}
        <div className="hidden flex-col justify-between border-r border-white/10 bg-black/30 p-8 md:flex">
          <div>
            <Link href="/" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-brand-300 transition hover:text-brand-200">
              ← Katalog Publik
            </Link>

            <div className="mt-10 flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-violet-800 shadow-[0_0_25px_rgba(124,58,237,0.45)]">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                </svg>
              </span>
              <div className="leading-tight">
                <span className="block text-2xl font-extrabold tracking-tight text-white">PERPUS</span>
                <span className="block text-[10px] font-bold uppercase tracking-[0.3em] text-brand-400">
                  Admin Area
                </span>
              </div>
            </div>

            <h1 className="mt-10 text-3xl font-extrabold leading-tight text-white">
              Hanya untuk <br />
              <span className="bg-gradient-to-r from-brand-300 to-violet-300 bg-clip-text text-transparent">
                Kurator &amp; Admin
              </span>
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              Halaman ini bukan halaman masuk publik. Akses dibatasi untuk akun dengan peran <span className="font-semibold text-brand-200">Admin</span> saja. Tamu yang mencoba masuk akan ditolak.
            </p>
          </div>

          <div className="rounded-2xl border border-brand-800/60 bg-brand-950/40 p-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-brand-300">
              Peringatan
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Semua aktivitas di area ini tercatat. Jangan bagikan kredensial Anda kepada siapa pun.
            </p>
          </div>
        </div>

        {/* Panel kanan: form login */}
        <div className="flex flex-col justify-center p-6 sm:p-10">
          <div className="mb-6 flex items-center gap-2 md:hidden">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-violet-800">
              <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              </svg>
            </span>
            <div>
              <span className="block text-lg font-extrabold text-white">PERPUS</span>
              <span className="block text-[9px] font-bold uppercase tracking-[0.3em] text-brand-400">Admin Area</span>
            </div>
          </div>

          <h2 className="text-xl font-extrabold text-white">Masuk ke Panel Admin</h2>
          <p className="mt-1 text-sm text-slate-400">
            Gunakan akun <span className="font-semibold text-brand-200">Admin</span> Anda untuk mengelola katalog &amp; anggota.
          </p>

          <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div role="alert" className="rounded-xl border border-red-800/60 bg-red-950/40 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-300">
                  Email Admin
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@perpus.id"
                  className="mt-1.5 block w-full rounded-xl border border-brand-800/50 bg-black/40 px-4 py-3 text-sm text-white placeholder-slate-600 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-700/60"
                />
              </div>

              <div>
                <label htmlFor="password" className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-300">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="mt-1.5 block w-full rounded-xl border border-brand-800/50 bg-black/40 px-4 py-3 text-sm text-white placeholder-slate-600 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-700/60"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`group relative flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-500 to-violet-700 py-3 text-sm font-extrabold uppercase tracking-widest text-white shadow-[0_0_30px_rgba(124,58,237,0.35)] transition hover:from-brand-400 hover:to-violet-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 focus-visible:ring-offset-ink ${
                loading ? 'cursor-wait opacity-70' : ''
              }`}
            >
              {loading ? 'Memverifikasi…' : 'Masuk Panel Admin'}
              <svg className="h-4 w-4 transition group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>

            <div className="text-center">
              <Link href="/" className="text-xs font-medium text-slate-500 transition hover:text-brand-300">
                ← Kembali ke katalog publik
              </Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
