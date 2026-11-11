import Link from 'next/link';

const columns = [
  {
    title: 'Eksplorasi',
    links: [
      { label: 'Katalog Literatur', href: '/books' },
      { label: 'Daftar Bacaan Editor', href: '/' },
      { label: 'Resensi Mendalam', href: '/reviews' },
      { label: 'Panduan Kurasi', href: '/guide' },
    ],
  },
  {
    title: 'Kategori Literatur',
    links: [
      { label: 'Fiksi Sastra & Klasik', href: '/books?category=cat_fiksi' },
      { label: 'Filsafat & Pemikiran', href: '/books?category=cat_filsafat' },
      { label: 'Sains & Kosmologi', href: '/books?category=cat_sains' },
      { label: 'Sejarah & Dokumenter', href: '/books?category=cat_sejarah' },
    ],
  },
  {
    title: 'Komunitas Pembaca',
    links: [
      { label: 'Klub Buku Bulanan', href: '/guide' },
      { label: 'Pedoman Kurator', href: '/guide' },
      { label: 'Etika Penulisan Resensi', href: '/guide' },
      { label: 'Kontak Redaksi', href: '/guide' },
    ],
  },
];

export default function SiteFooter() {
  return (
    <footer className="bg-ink text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          {/* Brand */}
          <div className="md:col-span-4">
            <Link href="/" className="flex items-center gap-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-white">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                </svg>
              </span>
              <span>
                <span className="block text-2xl font-extrabold leading-none text-white">PERPUS</span>
                <span className="mt-1 block text-[9px] font-bold uppercase tracking-[0.3em] text-brand-300">
                  Kurasi &amp; Ulasan
                </span>
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
              Arsip literasi kontemporer dan ruang diskursus kritis pembaca setia buku di
              nusantara. Jelajahkan katalog, martil rating, dan abadikan opini Anda.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="badge bg-emerald-900/60 text-emerald-300 ring-1 ring-emerald-700/60">
                ✓ Kurasi Terpercaya
              </span>
            </div>
          </div>

          {/* Columns */}
          {columns.map((col) => (
            <div key={col.title} className="md:col-span-2 md:first:col-start-7">
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white/70">
                {col.title}
              </h3>
              <ul className="mt-3 space-y-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-400 transition hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-slate-500 sm:flex-row">
          <p>© {new Date().getFullYear()} PERPUS. Hak cipta dilindungi undang-undang.</p>
          <nav className="flex items-center gap-5" aria-label="Tautan footer">
            <Link href="/guide" className="transition hover:text-white">
              Kebijakan Privasi
            </Link>
            <Link href="/guide" className="transition hover:text-white">
              Syarat &amp; Ketentuan
            </Link>
            <Link href="/guide" className="transition hover:text-white">
              Bantuan
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
