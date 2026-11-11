import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Panduan Kurasi — PERPUS',
  description: 'Standar penilaian, etika resensi, dan integritas komunitas pembaca PERPUS.',
};

const sections = [
  {
    number: '01',
    title: 'Standar Penilaian 5 Bintang',
    body: 'Gunakan skala 1–5 secara konsisten: 5 = luar biasa dan layak dibaca semua orang; 4 = sangat baik dengan kekurangan kecil; 3 = cukup baik, layak dicoba; 2 = kurang memuaskan; 1 = tidak direkomendasikan. Fokus pada alasan penilaian, bukan sekadar angka.',
    bullets: [
      '5★ — Karya penting; akan saya rekomendasikan ke siapa pun.',
      '4★ — Sangat baik, dengan catatan kecil.',
      '3★ — Layak, tapi tidak istimewa.',
      '2★ — Mengecewakan; ekspektasi tidak terpenuhi.',
      '1★ — Tidak saya rekomendasikan.',
    ],
  },
  {
    number: '02',
    title: 'Redaksi Komentar Terpublikasi',
    body: 'Ulasan akan ditampilkan untuk publik setelah melewati penyuntingan ringan. Hindari bahasa kasar, serangan personal, spoiler tanpa peringatan, dan klaim faktual yang salah. Komentar yang melanggar dihapus tanpa pemberitahuan.',
    bullets: [
      'Tulis opini berdasarkan pengalaman membaca Anda sendiri.',
      'Beri peringatan spoiler sebelum membahas alur penting.',
      'Hormati penulis dan pembaca lain — tanpa serangan pribadi.',
      'Satu akun = satu suara; hindari ulasan berulang untuk buku yang sama.',
    ],
  },
  {
    number: '03',
    title: 'Integritas Resensi Pustaka',
    body: 'PERPUS mengedepankan resensi yang jujur. Jangan menyalin ulasan dari situs lain, jangan memanipulasi rating (koordinasi voting, akun ganda), dan jangan menerima atau menawarkan imbalan untuk ulasan positif/negatif.',
    bullets: [
      'Tulis ulasan dari pengalaman Anda sendiri.',
      'Jelaskan aspek yang Anda nilai: alur, karakter, gaya bahasa, relevansi.',
      'Akui bila ada bagian yang tidak Anda pahami alih-alih berpura-pura.',
      'Laporkan pelanggaran melalui kanal kontak kurator.',
    ],
  },
  {
    number: '04',
    title: 'Pustakawan & Mitra Kurator',
    body: 'Tim kurator PERPUS — pustakawan, penulis residen, dan komunitas literasi mitra — bertugas menjaga kualitas katalog dan resensi. Kurator meninjau laporan, menyempurnakan metadata buku, dan mempublikasikan resensi pilihan editorial.',
    bullets: [
      'Badge "Pilihan Editor" diberikan berdasarkan kesepakatan kurator.',
      'Skor kurasi (0–100) dihitung dari konsistensi rating dan kualitas ulasan.',
      'Mitra dapat mengusulkan judul baru melalui formulir katalog.',
    ],
  },
  {
    number: '05',
    title: 'Indeks Repositori Publik',
    body: 'Seluruh data katalog dan resensi yang terpublikasi menjadi bagian dari indeks literasi terbuka PERPUS. Data ini dapat dipakai untuk penelitian, rekomendasi bacaan, dan pemetaan tren membaca Indonesia.',
    bullets: [
      'Data katalog bersifat terbuka untuk umum.',
      'Resensi tetap hak cipta penulisnya; cantumkan kredit bila dikutip.',
      'Data pribadi pembaca tidak pernah dipublikasikan.',
    ],
  },
];

export default function GuidePage() {
  return (
    <main className="min-h-screen">
      {/* Hero band */}
      <section className="relative border-b border-ink">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/hero-library.jpg')" }}
        />
        <div className="absolute inset-0 bg-violet-950/80" />
        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <span className="badge bg-violet-600/40 text-violet-100 ring-1 ring-violet-400/40 backdrop-blur">
            Kurasi &amp; Etika
          </span>
          <h1 className="mt-4 max-w-2xl text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl">
            Panduan Kurasi PERPUS
          </h1>
          <p className="mt-3 max-w-xl leading-relaxed text-violet-100/85">
            Lima standar yang menjaga PERPUS tetap menjadi ruang resensi yang jujur,
            bermanfaat, dan menyenangkan untuk semua pembaca.
          </p>
          <Link href="/books" className="mt-6 inline-flex rounded-xl bg-violet-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-violet-500">
            Jelajah Katalog →
          </Link>
        </div>
      </section>

      {/* Sections */}
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="space-y-4">
          {sections.map((section) => (
            <section key={section.number} className="overflow-hidden rounded-3xl border border-violet-100 bg-white shadow-card">
              <div className="flex flex-col gap-4 p-6 sm:flex-row">
                <span className="text-5xl font-black leading-none text-violet-100">{section.number}</span>
                <div>
                  <h2 className="text-lg font-bold text-ink">{section.title}</h2>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{section.body}</p>
                  <ul className="mt-3 space-y-2 text-sm">
                    {section.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-start gap-2 text-slate-600">
                        <span className="mt-0.5 text-violet-600">★</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
