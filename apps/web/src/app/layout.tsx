import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from '@/lib/auth';
import PublicShell from '@/components/PublicShell';
import { ThemeProvider } from 'next-themes';

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: 'PERPUS — Katalog & Ulasan Buku',
  description: 'Temukan buku, beri rating, dan catat jejak membaca Anda di PERPUS. Katalog literasi kontemporer Indonesia.',
  manifest: '/manifest.json',
  openGraph: {
    title: 'PERPUS — Katalog & Ulasan Buku',
    description: 'Temukan buku, beri rating, dan catat jejak membaca Anda di PERPUS.',
    type: 'website',
    url: 'https://perpus.id',
    siteName: 'PERPUS',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PERPUS — Katalog & Ulasan Buku',
    description: 'Temukan buku, beri rating, dan catat jejak membaca Anda di PERPUS.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={jakarta.variable} suppressHydrationWarning>
      <body className="font-sans">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <AuthProvider>
            <PublicShell>{children}</PublicShell>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}