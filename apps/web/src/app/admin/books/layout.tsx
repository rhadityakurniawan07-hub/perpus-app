import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kelola Buku — PERPUS',
  description: 'CRUD buku, impor dari Google Books, kelola stok & lokasi rak.',
  robots: { index: false, follow: false },
};

export default function AdminBooksLayout({ children }: { children: React.ReactNode }) {
  return children;
}