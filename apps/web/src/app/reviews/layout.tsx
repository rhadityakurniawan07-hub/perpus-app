import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ulasan & Rating — PERPUS',
  description: 'Arsip ulasan dan rating yang Anda tulis. Catat kesan, simpan ketidaksetujuan.',
  robots: { index: false, follow: false },
};

export default function ReviewsLayout({ children }: { children: React.ReactNode }) {
  return children;
}