'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';

const navItems = [
  { name: 'Dashboard', href: '/admin/dashboard' },
  { name: 'Kelola Buku', href: '/admin/books' },
  { name: 'Anggota', href: '/admin/members' },
  { name: 'Transaksi', href: '/admin/loans' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  function handleLogout() {
    logout();
    router.push('/login');
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-gray-900 text-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/admin/dashboard" className="text-xl font-bold text-white">
                  PERPUS
                  <span className="ml-2 text-xs font-medium bg-blue-600 px-2 py-0.5 rounded-full">
                    Admin
                  </span>
                </Link>
              </div>
              <div className="hidden sm:ml-8 sm:flex sm:space-x-1">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                      pathname === item.href || pathname.startsWith(item.href + '/')
                        ? 'bg-gray-800 text-white'
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/books"
                className="text-sm text-gray-300 hover:text-white hidden sm:block"
              >
                Lihat Situs
              </Link>
              <span className="text-sm text-gray-300">{user?.name}</span>
              <button
                onClick={handleLogout}
                className="text-sm bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded-md"
              >
                Keluar
              </button>
            </div>
          </div>
        </div>
        <div className="sm:hidden pb-3 px-2 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                pathname === item.href || pathname.startsWith(item.href + '/')
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
    </div>
  );
}