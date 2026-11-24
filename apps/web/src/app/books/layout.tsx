import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Katalog Buku — PERPUS',
  description: 'Jelajahi katalog koleksi PERPUS. Cari, filter, dan temukan buku berkualitas dengan rating & ulasan pembaca.',
  openGraph: {
    title: 'Katalog Buku — PERPUS',
    description: 'Jelajahi katalog koleksi PERPUS. Cari, filter, dan temukan buku berkualitas.',
    type: 'website',
    url: 'https://perpus.id/books',
  },
};

export default function BooksLayout({ children }: { children: React.ReactNode }) {
  return children;
}