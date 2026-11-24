import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Masuk Panel Admin — PERPUS',
  description: 'Halaman masuk untuk akun Admin PERPUS.',
  robots: { index: false, follow: false },
};

export default function AdminLoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}