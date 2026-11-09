import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from '@/lib/auth';
import PublicShell from '@/components/PublicShell';

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PERPUS — Katalog & Ulasan Buku",
  description: "Temukan buku, beri rating, dan catat jejak membaca Anda di PERPUS.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={jakarta.variable}>
      <body className="font-sans">
        <AuthProvider>
          <PublicShell>{children}</PublicShell>
        </AuthProvider>
      </body>
    </html>
  );
}
