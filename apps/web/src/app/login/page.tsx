'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [next, setNext] = useState('');
  const { login } = useAuth();

  useEffect(() => {
    setNext(window.location.search);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const params = new URLSearchParams(window.location.search);
      await login(email, password, params.get('next') || undefined);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      className="relative flex min-h-screen items-center justify-center bg-cover bg-center px-4 py-12 sm:px-6 lg:px-8"
      style={{ backgroundImage: "url('/hero-library.jpg')" }}
    >
      <div className="absolute inset-0 bg-violet-950/80" />
      <div className="relative w-full max-w-md">
        <div className="rounded-3xl border border-white/10 bg-ink/70 p-8 shadow-hero backdrop-blur-md">
          <Link href="/" className="mx-auto flex w-fit items-center gap-2">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-600 text-white">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              </svg>
            </span>
            <span className="text-2xl font-extrabold tracking-tight text-white">PERPUS</span>
          </Link>

          <h1 className="mt-6 text-center text-2xl font-extrabold text-white">Selamat Datang Kembali</h1>
          <p className="mt-1 text-center text-sm text-violet-200/80">
            Atau{' '}
            <Link href={`/register${next}`} className="font-semibold text-violet-300 transition hover:text-white">
              daftar akun baru
            </Link>
          </p>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-violet-200/70">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-brand-400 focus:bg-white/10"
                placeholder="nama@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-violet-200/70">
                Kata Sandi
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-brand-400 focus:bg-white/10"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full rounded-xl bg-violet-600 py-3 text-sm font-bold text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60 ${
                loading ? 'cursor-wait' : ''
              }`}
            >
              {loading ? 'Memproses...' : 'Masuk'}
            </button>
          </form>

          <div className="mt-5 text-center text-sm">
            <Link href="/books" className="text-violet-300 transition hover:text-white">
              ← Kembali ke Katalog
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
