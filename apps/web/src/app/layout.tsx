import type { Metadata } from "next";
import "./globals.css";

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
      <body>{children}</body>
    </html>
  );
}
