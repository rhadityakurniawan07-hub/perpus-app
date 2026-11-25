'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import SiteHeader from '@/components/SiteHeader';
import { ErrorBoundary } from '@/components/ErrorBoundary';

export default function MemberLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      const target = `${pathname || '/'}`;
      router.replace(`/login?next=${encodeURIComponent(target)}`);
    }
  }, [loading, isAuthenticated, pathname, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-lavender dark:bg-slate-900">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-violet-200 border-t-violet-700" />
          <p className="mt-4 text-[10px] font-extrabold uppercase tracking-[0.25em] text-slate-400">Membuka PERPUS</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-lavender dark:bg-slate-900">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-violet-200 border-t-violet-700" />
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">Mengalihkan ke halaman masuk...</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-lavender dark:bg-slate-900">
        <SiteHeader />
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </ErrorBoundary>
  );
}
