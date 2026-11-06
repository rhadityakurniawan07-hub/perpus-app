import Link from 'next/link';
import Image from 'next/image';
import { Book } from '@/types';

interface BookCardProps {
  book: Book;
}

export default function BookCard({ book }: BookCardProps) {
  const isAvailable = book.availableStock > 0;

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <div className="relative h-48 bg-gray-200">
        {book.coverImage ? (
          <Image
            src={book.coverImage}
            alt={book.title}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            <svg
              className="w-16 h-16"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 6.253v13m0-13C6.777 6.253 3 10.25 3 15c0 4.777 3.777 8.747 9 8.747s9-3.97 9-8.747c0-4.747-3.777-8.747-9-8.747zM9 17l9-5 9 5"
              />
            </svg>
          </div>
        )}
        <span
          className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-semibold ${
            isAvailable
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {isAvailable ? 'Tersedia' : 'Habis'}
        </span>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1 line-clamp-2">{book.title}</h3>
        <p className="text-sm text-gray-600 mb-1">Oleh: {book.author}</p>
        <p className="text-sm text-gray-500 mb-2">{book.publisher}</p>

        <div className="flex items-center justify-between mb-3">
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
            {book.category?.name || 'Tanpa Kategori'}
          </span>
          <span className="text-xs text-gray-500">{book.year}</span>
        </div>

        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-gray-600">
            Stok: {book.availableStock}/{book.totalStock}
          </span>
        </div>

        <Link
          href={`/books/${book.id}`}
          className="block w-full text-center bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          Lihat Detail
        </Link>
      </div>
    </div>
  );
}