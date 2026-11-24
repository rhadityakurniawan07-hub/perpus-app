import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Masuk — PERPUS',
  description: 'Masuk ke akun PERPUS untuk memberi rating, ulasan, dan mencatat jejak membaca.',
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}