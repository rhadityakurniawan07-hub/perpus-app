'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import api from '@/lib/axios';
import { User } from '@/types';
import MemberLayout from '@/components/MemberLayout';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState<User | null>(user);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    try {
      const response = await api.get('/auth/me');
      setProfile(response.data);
    } catch (error) {
      console.error('Gagal mengambil profil:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <MemberLayout>
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </MemberLayout>
    );
  }

  return (
    <MemberLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Profil</h1>
        <p className="text-gray-600">Informasi akun Anda</p>
      </div>

      <div className="max-w-2xl">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-6">
            <div className="flex-shrink-0">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-3xl font-bold text-blue-600">
                  {profile?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
            <div className="ml-6">
              <h2 className="text-xl font-semibold text-gray-900">{profile?.name}</h2>
              <p className="text-gray-500">{profile?.email}</p>
              <span
                className={`mt-2 inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                  profile?.role === 'ADMIN'
                    ? 'bg-purple-100 text-purple-800'
                    : 'bg-blue-100 text-blue-800'
                }`}
              >
                {profile?.role === 'ADMIN' ? 'Admin' : 'Anggota'}
              </span>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <dl className="grid grid-cols-1 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Nama Lengkap</dt>
                <dd className="mt-1 text-sm text-gray-900">{profile?.name}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="mt-1 text-sm text-gray-900">{profile?.email}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Role</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {profile?.role === 'ADMIN' ? 'Admin' : 'Anggota'}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      profile?.status === 'ACTIVE'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {profile?.status === 'ACTIVE' ? 'Aktif' : 'Tidak Aktif'}
                  </span>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Bergabung</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {profile?.createdAt
                    ? new Date(profile.createdAt).toLocaleDateString('id-ID')
                    : '-'}
                </dd>
              </div>
            </dl>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={logout}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
            >
              Keluar dari Akun
            </button>
          </div>
        </div>
      </div>
    </MemberLayout>
  );
}