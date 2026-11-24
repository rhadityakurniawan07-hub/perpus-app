import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard Admin — PERPUS',
  description: 'Statistik katalog & ulasan, buku rating tertinggi, ulasan terbaru.',
  robots: { index: false, follow: false },
};

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return children;
}