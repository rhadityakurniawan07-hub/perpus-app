"use client";

import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import AdminLayout from '@/components/AdminLayout';

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname() || '';

  // Halaman /admin/login berada di luar panel admin (tidak butuh auth)
  const isAdminLoginRoute = pathname === '/admin/login';

  const isAuthorized = !!user && user.role === 'ADMIN';

  useEffect(() => {
    if (isAdminLoginRoute) return;
    if (!loading && !isAuthorized) {
      router.replace('/admin/login');
    }
  }, [loading, isAuthorized, router, isAdminLoginRoute]);

  if (isAdminLoginRoute) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-lavender">
        <div className="h-9 w-9 animate-spin rounded-full border-4 border-brand-600 border-t-transparent" />
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return <AdminLayout>{children}</AdminLayout>;
}