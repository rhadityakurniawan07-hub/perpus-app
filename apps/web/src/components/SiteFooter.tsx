import Link from 'next/link';

const columns = [
  {
    title: 'Kategori Pilihan',
    links: [
      'Fiksi Sastra & Klasik',
      'Filsafat & Humaniora',
      'Sains Hayati & Teknologi',
      'Sejarah & Dokumenter',
      'Kajian Sosial & Budaya',
    ],
  },
  {
    title: 'Kurasi & Etika',
    links: [
      'Standar Penilaian 5 Bintang',
      'Redaksi Komentar Terpublikasi',
      'Integritas Resensi Pustaka',
      'Pustakawan & Mitra Kurator',
      'Indeks Repositori Publik',
    ],
  },
  {
    title: 'Literasi & Jaringan',
    links: [
      'Klub Diskusi Buku Bulanan',
      'Program Penulis Siang',
      'Sentra Katalog',
      'Pusat Bantuan Katalog',
      'Kontak Kurator',
    ],
  },
];

export default function SiteFooter() {
  return (
    <footer className="bg-ink text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                </svg>
              </span>
              <span>
                <span className="block text-xl font-extrabold text-white">PERPUS</span>
                <span className="block text-[9px] font-bold uppercase tracking-[0.25em] text-brand-300">
                  Katalog & Ulasan
                </span>
              </span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-slate-400">
              PERPUS adalah arsip literasi digital dan kurasi pustaka — katalog buku
              terbuka dengan rating bintang pembaca, resensi tersunting, dan jejak membaca
              pribadi Anda. Baca, nilai, dan berbagi untuk komunitas.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="badge bg-emerald-900/60 text-emerald-300 ring-1 ring-emerald-700/60">
                ✓ Pustaka Terverifikasi
              </span>
              <span className="badge bg-brand-900/60 text-brand-300 ring-1 ring-brand-700/60">
                ✓ Akses Terbuka
              </span>
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white/60">
                {col.title}
              </h3>
              <ul className="mt-3 space-y-2">
                {col.links.map((link) => (
                  <li key={link}>
                    <Link
                      href="/guide"
                      className="text-sm text-slate-400 transition hover:text-white"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-slate-500 sm:flex-row">
          <p>© {new Date().getFullYear()} PERPUS — Katalog & Ulasan. Seluruh hak cipta dilindungi.</p>
          <nav className="flex items-center gap-5" aria-label="Tautan footer">
            <Link href="/guide" className="transition hover:text-white">
              Kebijakan Privasi
            </Link>
            <Link href="/guide" className="transition hover:text-white">
              Syarat Penggunaan
            </Link>
            <Link href="/guide" className="transition hover:text-white">
              API Terbuka
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
