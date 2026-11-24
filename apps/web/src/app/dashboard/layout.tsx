import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard Anggota — PERPUS',
  description: 'Ringkasan statistik baca & ulasan pribadi. Sedang dibaca, sudah selesai, ulasan saya.',
  robots: { index: false, follow: false },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return children;
}