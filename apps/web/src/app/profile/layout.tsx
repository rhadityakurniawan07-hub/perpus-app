import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Profil — PERPUS',
  description: 'Informasi akun Anda di PERPUS. Progres membaca, arsip ulasan, dan statistik pribadi.',
  robots: { index: false, follow: false },
};

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return children;
}