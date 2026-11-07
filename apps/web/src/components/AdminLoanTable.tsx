'use client';

import { Loan } from '@/types';

export const loanStatusLabels: Record<Loan['status'], string> = {
  PENDING: 'Menunggu',
  APPROVED: 'Disetujui',
  REJECTED: 'Ditolak',
  CANCELLED: 'Dibatalkan',
  BORROWED: 'Dipinjam',
  RETURNED: 'Dikembalikan',
  OVERDUE: 'Terlambat',
};

export const loanStatusClasses: Record<Loan['status'], string> = {
  PENDING: 'bg-blue-100 text-blue-800',
  APPROVED: 'bg-indigo-100 text-indigo-800',
  REJECTED: 'bg-red-100 text-red-800',
  CANCELLED: 'bg-gray-100 text-gray-800',
  BORROWED: 'bg-yellow-100 text-yellow-800',
  RETURNED: 'bg-green-100 text-green-800',
  OVERDUE: 'bg-red-100 text-red-800',
};

export function isPastDue(loan: Loan): boolean {
  if (!loan.dueDate) return false;
  if (loan.status !== 'BORROWED') return false;
  return new Date(loan.dueDate) < new Date();
}

interface AdminLoanTableProps {
  loans: Loan[];
  onApprove?: (loan: Loan) => void;
  onReject?: (loan: Loan) => void;
  onReturn?: (loan: Loan) => void;
  dateLabel?: 'request' | 'borrow';
}

function formatDate(value?: string) {
  return value ? new Date(value).toLocaleDateString('id-ID') : '-';
}

export default function AdminLoanTable({
  loans,
  onApprove,
  onReject,
  onReturn,
  dateLabel = 'request',
}: AdminLoanTableProps) {
  if (loans.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-lg">Tidak ada data transaksi.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Anggota
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Buku
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {dateLabel === 'borrow' ? 'Tgl Pinjam' : 'Tgl Pengajuan'}
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Jatuh Tempo
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            {(onApprove || onReject || onReturn) && (
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aksi
              </th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {loans.map((loan) => {
            const pastDue = isPastDue(loan);
            return (
              <tr key={loan.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="text-sm font-medium text-gray-900">
                    {loan.user?.name || '-'}
                  </div>
                  <div className="text-xs text-gray-500">{loan.user?.email || ''}</div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 max-w-52">
                  <div className="truncate">{loan.book?.title || '-'}</div>
                  <div className="text-xs text-gray-500 truncate">
                    {loan.book?.author || ''}
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">
                  {formatDate(dateLabel === 'borrow' ? loan.borrowDate : loan.requestDate)}
                </td>
                <td className="px-4 py-3 text-sm whitespace-nowrap">
                  <span className={pastDue ? 'text-red-600 font-semibold' : 'text-gray-500'}>
                    {formatDate(loan.dueDate)}
                    {pastDue && ' (Lewat)'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${loanStatusClasses[loan.status]}`}
                  >
                    {loanStatusLabels[loan.status]}
                  </span>
                </td>
                {(onApprove || onReject || onReturn) && (
                  <td className="px-4 py-3 text-right text-sm whitespace-nowrap">
                    {onApprove && loan.status === 'PENDING' && (
                      <button
                        onClick={() => onApprove(loan)}
                        className="text-green-600 hover:text-green-800 font-medium mr-3"
                      >
                        Setuju
                      </button>
                    )}
                    {onReject && loan.status === 'PENDING' && (
                      <button
                        onClick={() => onReject(loan)}
                        className="text-red-600 hover:text-red-800 font-medium mr-3"
                      >
                        Tolak
                      </button>
                    )}
                    {onReturn && loan.status === 'BORROWED' && (
                      <button
                        onClick={() => onReturn(loan)}
                        className="text-purple-600 hover:text-purple-800 font-medium"
                      >
                        Kembalikan
                      </button>
                    )}
                    {loan.status !== 'PENDING' && loan.status !== 'BORROWED' && (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}