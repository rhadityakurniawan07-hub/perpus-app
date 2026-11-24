import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Koleksi Saya — PERPUS',
  description: 'Buku berdasarkan status baca: Ingin Dibaca, Sedang Dibaca, Sudah Selesai.',
  robots: { index: false, follow: false },
};

export default function MyCollectionLayout({ children }: { children: React.ReactNode }) {
  return children;
}