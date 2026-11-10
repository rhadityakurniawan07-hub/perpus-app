/**
 * Utilitas: seed banyak buku populer dari Google Books.
 * Jalankan dari folder `apps/api`:  bun scripts/seed-popular-books.ts
 * Aman dijalankan ulang (cek ISBN duplikat).
 */
import { PrismaClient } from '@perpus-app/prisma-client';

const prisma = new PrismaClient();

const QUERIES = [
  'Bumi Manusia Pramoedya',
  'Laskar Pelangi Andrea Hirata',
  'Negeri 5 Menara',
  'Gadis Kretek',
  'Wonder R.J. Palacio',
  'Filosofi Teras',
  'Atomic Habits James Clear',
  'Sapiens Yuval Noah Harari',
  'A Brief History of Time',
  'The Psychology of Money',
  'Rich Dad Poor Dad',
  'Cinta Tak Harus Indah',
  'Soekarno Cindy Adams',
  'The Alchemist Paulo Coelho',
  'The Great Gatsby',
  'Fahrenheit 451',
  'Pride and Prejudice',
  'To Kill a Mockingbird',
  'Atomic Habits',
  'Petualangan Sherina',
  'Python',
  'Ilmu Komputer',
];

const CATEGORY_RULES: Array<[RegExp, string]> = [
  [/(fiction|novel|literature|poetry|drama|fantasy|mystery|romance|short story)/i, 'cat_fiksi'],
  [/(science|technology|medicine|medical|computer|programming|engineering|mathematics|math|psychology|biology|chemistry|physics|nature|business|economics)/i, 'cat_sains'],
  [/(history|biography|memoir|war|military)/i, 'cat_sejarah'],
  [/(philosophy|religion|spirituality|ethics|theology|islam|christian|buddha)/i, 'cat_filsafat'],
  [/(social|politics|education|law|legal|sociology)/i, 'cat_sosial'],
];

function guessCategoryId(text: string) {
  const lower = text.toLowerCase();
  for (const [regex, id] of CATEGORY_RULES) {
    if (regex.test(lower)) return id;
  }
  return 'cat_google-books';
}

async function fetchTop(query: string, apiKey: string) {
  const url =
    'https://www.googleapis.com/books/v1/volumes' +
    `?q=${encodeURIComponent(query)}&maxResults=1&key=${encodeURIComponent(apiKey)}`;
  const res = await fetch(url);
  if (!res.ok) {
    console.log(`[HTTP ${res.status}] ${query}`);
    return null;
  }
  const data: any = await res.json();
  return data?.items?.[0] ?? null;
}

async function ensureGoogleBooksCategory() {
  const existing = await prisma.category.findUnique({
    where: { name: 'Google Books' },
    select: { id: true },
  });
  if (existing) return existing.id;

  const created = await prisma.category.create({
    data: {
      id: 'cat_google-books',
      name: 'Google Books',
      description: 'Buku yang diimpor dari Google Books',
    },
    select: { id: true },
  });
  return created.id;
}

async function main() {
  const apiKey = process.env.GOOGLE_BOOKS_API_KEY;
  if (!apiKey || !apiKey.trim()) {
    console.error('GOOGLE_BOOKS_API_KEY belum diisi di apps/api/.env');
    process.exit(1);
  }

  await ensureGoogleBooksCategory();

  let added = 0;
  let skipped = 0;
  let failed = 0;

  for (const query of QUERIES) {
    try {
      const item = await fetchTop(query, apiKey.trim());
      if (!item) { failed += 1; continue; }

      const info = item.volumeInfo ?? {};
      const identifiers: Array<{ type: string; identifier: string }> =
        info.industryIdentifiers ?? [];
      const isbn =
        identifiers.find((i) => i.type === 'ISBN_13')?.identifier ??
        identifiers.find((i) => i.type === 'ISBN_10')?.identifier ??
        null;

      if (isbn) {
        const existing = await prisma.book.findUnique({
          where: { isbn },
          select: { id: true },
        });
        if (existing) {
          console.log(`[SKIP] "${info.title}" (isbn ${isbn}) sudah ada`);
          skipped += 1;
          continue;
        }
      }

      const year = info.publishedDate
        ? parseInt(String(info.publishedDate).slice(0, 4), 10) || new Date().getFullYear()
        : new Date().getFullYear();

      const catText = (info.categories ?? []).join(' ') + ' ' + (info.title ?? '');
      const categoryId = guessCategoryId(catText);

      let coverImage: string | null =
        info.imageLinks?.thumbnail ?? info.imageLinks?.smallThumbnail ?? null;
      if (coverImage) {
        coverImage = coverImage.replace(/^http:\/\//i, 'https://');
      }

      await prisma.book.create({
        data: {
          title: info.title || 'Tanpa Judul',
          author: (info.authors ?? []).join(', ') || 'Tidak diketahui',
          publisher: info.publisher || '-',
          categoryId,
          isbn,
          year,
          description: info.description || undefined,
          coverImage: coverImage || undefined,
          totalStock: 5,
          availableStock: 5,
          shelfLocation: 'Impor Google Books',
        },
      });

      console.log(`[OK] "${info.title}" — ${isbn ?? 'tanpa ISBN'}`);
      added += 1;
    } catch (err: any) {
      console.error(`[ERR] ${query}: ${err?.message ?? err}`);
      failed += 1;
    }
  }

  console.log(`\nSelesai. Ditambahkan=${added}  Skip=${skipped}  Gagal=${failed}`);
  await prisma.$disconnect();
}

main().catch(async (err) => {
  console.error(err);
  await prisma.$disconnect();
  process.exit(1);
});
