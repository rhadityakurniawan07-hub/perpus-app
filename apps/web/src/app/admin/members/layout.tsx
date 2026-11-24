import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kelola Anggota — PERPUS',
  description: 'CRUD & status anggota. Tambah, edit, nonaktifkan/aktifkan, hapus.',
  robots: { index: false, follow: false },
};

export default function AdminMembersLayout({ children }: { children: React.ReactNode }) {
  return children;
}