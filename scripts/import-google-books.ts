#!/usr/bin/env node
/**
 * Google Books Mass Import Script
 *
 * Usage: bun run scripts/import-google-books.ts [options]
 *
 * Options:
 *   --query <q>       Search query (default: "bestseller")
 *   --max <n>         Max books to import (default: 100)
 *   --delay <ms>      Delay between imports (default: 1000ms)
 *   --category <id>   Default category ID for imported books
 *
 * Environment:
 *   DATABASE_URL       PostgreSQL connection string
 *   GOOGLE_BOOKS_API_KEY  Google Books API key (optional)
 */

import { PrismaClient } from '@perpus-app/prisma-client';

const prisma = new PrismaClient();

// Parse CLI args
const args = process.argv.slice(2);
function getArg(name: string, defaultValue: string): string {
  const idx = args.indexOf(`--${name}`);
  if (idx !== -1 && args[idx + 1]) return args[idx + 1];
  return defaultValue;
}

const query = getArg('query', 'bestseller 2024');
const maxBooks = parseInt(getArg('max', '100'), 10);
const delayMs = parseInt(getArg('delay', '1000'), 10);
const defaultCategory = getArg('category', '');

// Google Books API endpoint
const GOOGLE_BOOKS_API = 'https://www.googleapis.com/books/v1/volumes';

interface GoogleBookVolume {
  id: string;
  volumeInfo: {
    title?: string;
    authors?: string[];
    publisher?: string;
    publishedDate?: string;
    description?: string;
    industryIdentifiers?: { type: string; identifier: string }[];
    imageLinks?: { thumbnail?: string; smallThumbnail?: string };
    categories?: string[];
    language?: string;
    pageCount?: number;
  };
}

interface GoogleBooksResponse {
  totalItems: number;
  items?: GoogleBookVolume[];
}

async function fetchGoogleBooks(q: string, startIndex: number, maxResults: number): Promise<GoogleBooksResponse> {
  const apiKey = process.env.GOOGLE_BOOKS_API_KEY || '';
  const url = `${GOOGLE_BOOKS_API}?q=${encodeURIComponent(q)}&startIndex=${startIndex}&maxResults=${maxResults}${apiKey ? `&key=${apiKey}` : ''}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Google Books API error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

function extractIsbn(volume: GoogleBookVolume): string | null {
  const identifiers = volume.volumeInfo.industryIdentifiers || [];
  const isbn13 = identifiers.find((i) => i.type === 'ISBN_13');
  const isbn10 = identifiers.find((i) => i.type === 'ISBN_10');
  return isbn13?.identifier || isbn10?.identifier || null;
}

function extractYear(volume: GoogleBookVolume): number {
  const publishedDate = volume.volumeInfo.publishedDate || '';
  const yearMatch = publishedDate.match(/(\d{4})/);
  return yearMatch ? parseInt(yearMatch[1], 10) : new Date().getFullYear();
}

async function importBook(volume: GoogleBookVolume, categoryId: string): Promise<{ success: boolean; reason?: string }> {
  const info = volume.volumeInfo;
  const title = info.title || 'Tanpa Judul';
  const author = info.authors?.[0] || 'Tidak diketahui';
  const publisher = info.publisher || 'Tidak diketahui';
  const isbn = extractIsbn(volume);
  const year = extractYear(volume);
  const description = info.description || null;
  const coverImage = info.imageLinks?.thumbnail?.replace('http://', 'https://') || null;

  // Check if ISBN already exists
  if (isbn) {
    const existing = await prisma.book.findUnique({ where: { isbn } });
    if (existing) {
      return { success: false, reason: `ISBN ${isbn} sudah ada (${existing.id})` };
    }
  }

  // Get or create category
  let catId = categoryId;
  if (!catId && info.categories && info.categories.length > 0) {
    const catName = info.categories[0];
    const cat = await prisma.category.upsert({
      where: { name: catName },
      update: {},
      create: { name: catName, description: `Kategori dari Google Books: ${catName}` },
    });
    catId = cat.id;
  }

  if (!catId) {
    // Use first available category
    const firstCat = await prisma.category.findFirst();
    if (!firstCat) {
      return { success: false, reason: 'Tidak ada kategori tersedia' };
    }
    catId = firstCat.id;
  }

  try {
    await prisma.book.create({
      data: {
        title,
        author,
        publisher,
        categoryId: catId,
        isbn: isbn || undefined,
        year,
        description: description || undefined,
        coverImage: coverImage || undefined,
        totalStock: 0,
        availableStock: 0,
        shelfLocation: null,
      },
    });
    return { success: true };
  } catch (error: any) {
    return { success: false, reason: error.message || 'Unknown error' };
  }
}

async function main() {
  console.log(`🔍 Searching Google Books for: "${query}"`);
  console.log(`📊 Max books to import: ${maxBooks}`);
  console.log(`⏱️  Delay between imports: ${delayMs}ms`);
  console.log('---');

  let imported = 0;
  let skipped = 0;
  let failed = 0;
  let startIndex = 0;
  const batchSize = 40; // Google Books API max per request

  while (imported + skipped + failed < maxBooks) {
    const remaining = maxBooks - (imported + skipped + failed);
    const fetchCount = Math.min(batchSize, remaining);

    console.log(`\n📥 Fetching books ${startIndex + 1} to ${startIndex + fetchCount}...`);

    let response: GoogleBooksResponse;
    try {
      response = await fetchGoogleBooks(query, startIndex, fetchCount);
    } catch (error: any) {
      console.error(`❌ Failed to fetch: ${error.message}`);
      break;
    }

    if (!response.items || response.items.length === 0) {
      console.log('📭 No more results from Google Books.');
      break;
    }

    for (const volume of response.items) {
      if (imported + skipped + failed >= maxBooks) break;

      const title = volume.volumeInfo.title || 'Tanpa Judul';
      const result = await importBook(volume, defaultCategory);

      if (result.success) {
        imported++;
        console.log(`✅ [${imported + skipped + failed}/${maxBooks}] Imported: ${title}`);
      } else if (result.reason?.includes('sudah ada')) {
        skipped++;
        console.log(`⏭️  [${imported + skipped + failed}/${maxBooks}] Skipped: ${title} — ${result.reason}`);
      } else {
        failed++;
        console.log(`❌ [${imported + skipped + failed}/${maxBooks}] Failed: ${title} — ${result.reason}`);
      }

      // Rate limiting delay
      if (imported + skipped + failed < maxBooks) {
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }

    startIndex += response.items.length;

    if (startIndex >= (response.totalItems || 0)) {
      console.log('\n📭 Reached end of Google Books results.');
      break;
    }
  }

  console.log('\n---');
  console.log(`📊 Import Summary:`);
  console.log(`   ✅ Imported: ${imported}`);
  console.log(`   ⏭️  Skipped: ${skipped}`);
  console.log(`   ❌ Failed: ${failed}`);
  console.log(`   📚 Total processed: ${imported + skipped + failed}`);

  await prisma.$disconnect();
}

main().catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});