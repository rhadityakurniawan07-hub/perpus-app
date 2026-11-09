import { notFound } from 'next/navigation';
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
    <main className="min-h-screen bg-lavender">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <BookDetail book={book} />
      </div>
    </main>
  );
}
