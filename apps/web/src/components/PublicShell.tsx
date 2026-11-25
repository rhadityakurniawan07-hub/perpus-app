'use client';

import { usePathname } from 'next/navigation';
import SiteHeader from '@/components/SiteHeader';
import StatusStrip from '@/components/StatusStrip';
import SiteFooter from '@/components/SiteFooter';
import { ErrorBoundary } from '@/components/ErrorBoundary';

// Area anggota & admin memakai layout mereka sendiri (MemberLayout/AdminLayout),
// jadi chrome publik (header + strip status + footer) hanya tampil di halaman publik.
const HIDE_PATHS = [
  '/admin',
  '/dashboard',
  '/loans',
  '/history',
  '/profile',
  '/my-collection',
  '/reviews',
];

export default function PublicShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() || '/';
  const hideChrome = HIDE_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );

  if (hideChrome) {
    return <ErrorBoundary>{children}</ErrorBoundary>;
  }

  return (
    <ErrorBoundary>
      <div className="flex min-h-screen flex-col bg-lavender dark:bg-slate-900">
        <SiteHeader />
        <StatusStrip />
        <div className="flex-1">{children}</div>
        <SiteFooter />
      </div>
    </ErrorBoundary>
  );
}

