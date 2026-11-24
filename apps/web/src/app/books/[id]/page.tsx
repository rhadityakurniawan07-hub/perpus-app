import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import BookDetail from '@/components/BookDetail';
import api from '@/lib/axios';
import { Book } from '@/types';

async function getBook(id: string): Promise<Book | null> {
  try {
    const response = await api.get(`/books/${id}`);
    return response.data;
  } catch (error) {
    console.error('Gagal mengambil detail buku:', error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const book = await getBook(params.id);
  if (!book) return { title: 'Buku Tidak Ditemukan — PERPUS' };
  return {
    title: `${book.title} — PERPUS`,
    description: book.description?.slice(0, 160) || `Detail buku ${book.title} oleh ${book.author}`,
    openGraph: {
      title: `${book.title} — PERPUS`,
      description: book.description?.slice(0, 160) || `Detail buku ${book.title}`,
      type: 'article',
      images: book.coverImage ? [{ url: book.coverImage }] : [],
    },
  };
}

export default async function BookDetailPage({ params }: { params: { id: string } }) {
  const book = await getBook(params.id);
  if (!book) {
    notFound();
  }
  return (
    <main className="min-h-screen bg-lavender">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <BookDetail book={book!} />
      </div>
    </main>
  );
}