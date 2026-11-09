/**
 * Utilitas reseed 6 buku contoh PERPUS dari Google Books API.
 * Menjaga id buku & relasi ulasan/reading-status (tidak diubah).
 * Jalankan dari folder `apps/api`:  bun scripts/reseed-google-books.ts
 *
 * Daftar volumeId di bawah dipilih manual (Google Books search sangat luas),
 * bukan hasil auto-match, agar data yang masuk adalah edisi yang benar.
 */
import { PrismaClient } from '@perpus-app/prisma-client';

const prisma = new PrismaClient();

const TARGETS: { id: string; volumeId: string; expectedTitle: string }[] = [
  { id: 'book1', volumeId: '9DA5DwAAQBAJ', expectedTitle: 'Bumi Manusia' },
  { id: 'book2', volumeId: 'UHOlEQAAQBAJ', expectedTitle: 'FONDASI KECERDASAN BUATAN MODERN' },
  { id: 'book3', volumeId: 'vEzyEQAAQBAJ', expectedTitle: 'Kosmos' },
  { id: 'book4', volumeId: '_Bz5DwAAQBAJ', expectedTitle: 'Meditasi' },
  { id: 'book5', volumeId: 'I4LRDwAAQBAJ', expectedTitle: 'Kalkulus Diferensial' },
  { id: 'book6', volumeId: 'aY-ohLcYdhQC', expectedTitle: 'Nusantara' },
];

function normalize(item: any) {
  const info = item?.volumeInfo ?? {};
  const identifiers: Array<{ type: string; identifier: string }> =
    info.industryIdentifiers ?? [];
  const isbn =
    identifiers.find((i) => i.type === 'ISBN_13')?.identifier ??
    identifiers.find((i) => i.type === 'ISBN_10')?.identifier ??
    null;

  let coverImage: string | null =
    info.imageLinks?.thumbnail ?? info.imageLinks?.smallThumbnail ?? null;
  if (coverImage) {
    coverImage = coverImage.replace(/^http:\/\//i, 'https://');
  }

  const year = info.publishedDate
    ? parseInt(String(info.publishedDate).slice(0, 4), 10) || null
    : null;

  return {
    title: info.title ?? 'Tanpa Judul',
    author: (info.authors ?? []).join(', ') || 'Tidak diketahui',
    publisher: info.publisher ?? '',
    year,
    isbn,
    description: info.description ?? '',
    coverImage,
  };
}

async function fetchVolume(volumeId: string, apiKey: string) {
  const url =
    `https://www.googleapis.com/books/v1/volumes/${encodeURIComponent(volumeId)}` +
    `?key=${encodeURIComponent(apiKey)}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} untuk volumeId ${volumeId}`);
  }
  return res.json();
}

async function main() {
  const apiKey = process.env.GOOGLE_BOOKS_API_KEY;
  if (!apiKey || !apiKey.trim()) {
    console.error('GOOGLE_BOOKS_API_KEY belum diisi di apps/api/.env');
    process.exit(1);
  }

  console.log('=== Reseed Google Books (volumeId terkurasi) ===');
  let ok = 0;

  for (const entry of TARGETS) {
    try {
      const item = await fetchVolume(entry.volumeId, apiKey.trim());
      const norm = normalize(item);

      // ISBN unik: jika dipakai buku lain, abaikan saja (jangan gagal)
      let isbnToSet: string | null = norm.isbn;
      if (isbnToSet) {
        const existing = await prisma.book.findUnique({
          where: { isbn: isbnToSet },
          select: { id: true },
        });
        if (existing && existing.id !== entry.id) {
          console.warn(
            `[ISBN] ${entry.id}: isbn ${isbnToSet} sudah dipakai ${existing.id}, dilewati`
          );
          isbnToSet = null;
        }
      }

      await prisma.book.update({
        where: { id: entry.id },
        data: {
          title: norm.title,
          author: norm.author,
          publisher: norm.publisher,
          year: norm.year ?? 2000,
          isbn: isbnToSet,
          description: norm.description || undefined,
          coverImage: norm.coverImage,
        },
      });

      ok += 1;
      console.log(
        `[OK] ${entry.id} -> "${norm.title}" | ${norm.author} | ${norm.year ?? '-'} | isbn=${isbnToSet ?? '-'} | cover=${norm.coverImage ? 'ya' : 'tidak'}`
      );
    } catch (err: any) {
      console.error(`[FAIL] ${entry.id} (${entry.volumeId}): ${err?.message ?? err}`);
    }
  }

  console.log(`Selesai: ${ok}/${TARGETS.length} buku berhasil di-reseed.`);
  await prisma.$disconnect();
}

main().catch(async (err) => {
  console.error(err);
  await prisma.$disconnect();
  process.exit(1);
});
