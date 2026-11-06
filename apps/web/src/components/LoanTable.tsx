'use client';

import { Loan } from '@/types';

interface LoanTableProps {
  loans: Loan[];
  showBorrowDate?: boolean;
  showReturnDate?: boolean;
  showStatus?: boolean;
}

export default function LoanTable({
  loans,
  showBorrowDate = true,
  showReturnDate = true,
  showStatus = true,
}: LoanTableProps) {
  if (loans.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Belum ada data peminjaman
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Buku
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tgl Pinjam
            </th>
            {showBorrowDate && (
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Jatuh Tempo
              </th>
            )}
            {showReturnDate && (
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tgl Kembali
              </th>
            )}
            {showStatus && (
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {loans.map((loan) => (
            <tr key={loan.id} className="hover:bg-gray-50">
              <td className="px-6 py-4">
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {loan.book?.title || '-'}
                  </div>
                  <div className="text-sm text-gray-500">
                    {loan.book?.author || ''}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {loan.borrowDate
                  ? new Date(loan.borrowDate).toLocaleDateString('id-ID')
                  : '-'}
              </td>
              {showBorrowDate && (
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {loan.dueDate
                    ? new Date(loan.dueDate).toLocaleDateString('id-ID')
                    : '-'}
                </td>
              )}
              {showReturnDate && (
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {loan.returnDate
                    ? new Date(loan.returnDate).toLocaleDateString('id-ID')
                    : '-'}
                </td>
              )}
              {showStatus && (
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      loan.status === 'BORROWED'
                        ? 'bg-yellow-100 text-yellow-800'
                        : loan.status === 'RETURNED'
                          ? 'bg-green-100 text-green-800'
                          : loan.status === 'OVERDUE'
                            ? 'bg-red-100 text-red-800'
                            : loan.status === 'PENDING'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {loan.status === 'BORROWED'
                      ? 'Dipinjam'
                      : loan.status === 'RETURNED'
                        ? 'Dikembalikan'
                        : loan.status === 'OVERDUE'
                          ? 'Terlambat'
                          : loan.status === 'PENDING'
                            ? 'Menunggu'
                            : loan.status}
                  </span>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
