import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from '@/lib/auth';

export const metadata: Metadata = {
  title: "PinjamanBuku - Sistem Informasi Perpustakaan",
  description: "Website sistem informasi perpustakaan untuk mempermudah pengelolaan buku dan transaksi peminjaman",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
