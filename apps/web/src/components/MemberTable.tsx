'use client';

import Link from 'next/link';
import { User } from '@/types';

interface MemberTableProps {
  members: User[];
  onToggleStatus: (member: User) => void;
  onDelete: (member: User) => void;
}

export default function MemberTable({ members, onToggleStatus, onDelete }: MemberTableProps) {
  if (members.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-lg">Belum ada anggota.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nama
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Bergabung
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {members.map((member) => (
            <tr key={member.id} className="hover:bg-gray-50">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-9 h-9 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-sm font-semibold">
                    {member.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-sm font-medium text-gray-900">{member.name}</div>
                </div>
              </td>
              <td className="px-4 py-3 text-sm text-gray-500">{member.email}</td>
              <td className="px-4 py-3 text-sm text-gray-500">
                {member.createdAt
                  ? new Date(member.createdAt).toLocaleDateString('id-ID')
                  : '-'}
              </td>
              <td className="px-4 py-3">
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    member.status === 'ACTIVE'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {member.status === 'ACTIVE' ? 'Aktif' : 'Nonaktif'}
                </span>
              </td>
              <td className="px-4 py-3 text-right text-sm whitespace-nowrap">
                <Link
                  href={`/admin/members/${member.id}/edit`}
                  className="text-blue-600 hover:text-blue-800 font-medium mr-3"
                >
                  Edit
                </Link>
                <button
                  onClick={() => onToggleStatus(member)}
                  className={`font-medium mr-3 ${
                    member.status === 'ACTIVE'
                      ? 'text-orange-600 hover:text-orange-800'
                      : 'text-green-600 hover:text-green-800'
                  }`}
                >
                  {member.status === 'ACTIVE' ? 'Nonaktifkan' : 'Aktifkan'}
                </button>
                <button
                  onClick={() => onDelete(member)}
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