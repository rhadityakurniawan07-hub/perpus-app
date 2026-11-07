'use client';

import Link from 'next/link';
import { Book } from '@/types';

interface BookTableProps {
  books: Book[];
  onDelete: (book: Book) => void;
}

export default function BookTable({ books, onDelete }: BookTableProps) {
  if (books.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-lg">Belum ada buku.</p>
        <p className="text-sm mt-1">Tambahkan buku pertama Anda.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Judul
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Penulis
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Kategori
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tahun
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Stok
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {books.map((book) => (
            <tr key={book.id} className="hover:bg-gray-50">
              <td className="px-4 py-3">
                <div className="text-sm font-medium text-gray-900">{book.title}</div>
                {book.isbn && <div className="text-xs text-gray-500">ISBN: {book.isbn}</div>}
              </td>
              <td className="px-4 py-3 text-sm text-gray-500">{book.author}</td>
              <td className="px-4 py-3 text-sm text-gray-500">
                {book.category?.name || '-'}
              </td>
              <td className="px-4 py-3 text-sm text-gray-500">{book.year}</td>
              <td className="px-4 py-3 text-sm">
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    book.availableStock > 0
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {book.availableStock}/{book.totalStock}
                </span>
              </td>
              <td className="px-4 py-3 text-right text-sm whitespace-nowrap">
                <Link
                  href={`/admin/books/${book.id}/edit`}
                  className="text-blue-600 hover:text-blue-800 font-medium mr-4"
                >
                  Edit
                </Link>
                <button
                  onClick={() => onDelete(book)}
                  className="text-red-600 hover:text-red-800 font-medium"
                >
                  Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}