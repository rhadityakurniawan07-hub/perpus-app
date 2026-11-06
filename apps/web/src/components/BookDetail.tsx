import Link from 'next/link';
import Image from 'next/image';
import { Book } from '@/types';

interface BookDetailProps {
  book: Book;
  onBorrow?: () => void;
  isAuthenticated?: boolean;
}

export default function BookDetail({ book, onBorrow, isAuthenticated = false }: BookDetailProps) {
  const isAvailable = book.availableStock > 0;

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="md:flex">
        <div className="md:w-1/3 bg-gray-200">
          {book.coverImage ? (
            <div className="relative h-96 md:h-full">
              <Image
                src={book.coverImage}
                alt={book.title}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-96 md:h-full text-gray-400">
              <svg
                className="w-32 h-32"
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
        </div>

        <div className="md:w-2/3 p-6 lg:p-8">
          <div className="mb-4">
            <span
              className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                isAvailable
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {isAvailable ? 'Tersedia' : 'Tidak Tersedia'}
            </span>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">{book.title}</h1>
          <p className="text-lg text-gray-600 mb-1">Oleh: {book.author}</p>
          <p className="text-gray-500 mb-4">{book.publisher}</p>

          <div className="grid grid-cols-2 gap-4 mb-6 bg-gray-50 p-4 rounded-lg">
            <div>
              <span className="text-sm text-gray-500">Kategori</span>
              <p className="font-semibold">{book.category?.name || '-'}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Tahun Terbit</span>
              <p className="font-semibold">{book.year}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">ISBN</span>
              <p className="font-semibold">{book.isbn || '-'}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Lokasi Rak</span>
              <p className="font-semibold">{book.shelfLocation || '-'}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Total Stok</span>
              <p className="font-semibold">{book.totalStock}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Stok Tersedia</span>
              <p className="font-semibold text-green-600">{book.availableStock}</p>
            </div>
          </div>

          {book.description ? (
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Deskripsi</h2>
              <p className="text-gray-700 leading-relaxed">{book.description}</p>
            </div>
          ) : null}

          <div className="flex gap-3">
            <Link
              href="/books"
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Kembali
            </Link>
            {isAuthenticated ? (
              <button
                onClick={onBorrow}
                disabled={!isAvailable}
                className={`px-6 py-2 rounded-md transition-colors font-medium ${
                  isAvailable
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Ajukan Peminjaman
              </button>
            ) : (
              <Link
                href="/login"
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
              >
                Login untuk Pinjam
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}