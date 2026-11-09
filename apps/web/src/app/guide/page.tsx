import type { Metadata } from 'next';

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
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <span className="badge bg-lavender text-brand-800 ring-1 ring-brand-200">
          Kurasi &amp; Etika
        </span>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
          Panduan Kurasi PERPUS
        </h1>
        <p className="mt-2 leading-relaxed text-slate-500">
          Lima standar yang menjaga PERPUS tetap menjadi ruang resensi yang jujur,
          bermanfaat, dan menyenangkan untuk semua pembaca.
        </p>

        <div className="mt-8 space-y-4">
          {sections.map((section) => (
            <section key={section.number} className="card p-6">
              <div className="flex items-start gap-4">
                <span className="text-3xl font-black text-brand-100">{section.number}</span>
                <div>
                  <h2 className="text-lg font-bold text-ink">{section.title}</h2>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{section.body}</p>
                  <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-600">
                    {section.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
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
