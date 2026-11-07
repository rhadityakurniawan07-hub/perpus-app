'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import AdminLayout from '@/components/AdminLayout';

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  const isAuthorized = !!user && user.role === 'ADMIN';

  useEffect(() => {
    if (!loading && !isAuthorized) {
      router.replace('/login');
    }
  }, [loading, isAuthorized, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return <AdminLayout>{children}</AdminLayout>;
}