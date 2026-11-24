import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Daftar — PERPUS',
  description: 'Gabung komunitas pembaca PERPUS. Daftar akun baru untuk memberi rating & ulasan.',
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return children;
}