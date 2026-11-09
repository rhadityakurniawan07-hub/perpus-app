'use client';

import { usePathname } from 'next/navigation';
import SiteHeader from '@/components/SiteHeader';
import StatusStrip from '@/components/StatusStrip';
import SiteFooter from '@/components/SiteFooter';

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
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen flex-col bg-lavender">
      <SiteHeader />
      <StatusStrip />
      <div className="flex-1">{children}</div>
      <SiteFooter />
    </div>
  );
}
