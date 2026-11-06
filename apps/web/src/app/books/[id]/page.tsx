import { notFound } from 'next/navigation';
import Link from 'next/link';
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

export default async function BookDetailPage({ params }: { params: { id: string } }) {
  const book = await getBook(params.id);

  if (!book) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <BookDetail
          book={book}
          isAuthenticated={false}
        />
      </div>
    </main>
  );
}