'use client';

import { useState, FormEvent } from 'react';
import { User } from '@/types';

interface MemberFormProps {
  mode: 'create' | 'edit';
  initialData?: User;
  submitLabel: string;
  onSubmit: (data: Record<string, unknown>) => Promise<void>;
}

const inputClass =
  'mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500';
const labelClass = 'block text-sm font-medium text-gray-700';

export default function MemberForm({ mode, initialData, submitLabel, onSubmit }: MemberFormProps) {
  const [name, setName] = useState(initialData?.name || '');
  const [email, setEmail] = useState(initialData?.email || '');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'ACTIVE' | 'INACTIVE'>(
    initialData?.status || 'ACTIVE'
  );
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Nama wajib diisi.');
      return;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Format email tidak valid.');
      return;
    }
    if (mode === 'create' && password.length < 6) {
      setError('Password minimal 6 karakter.');
      return;
    }

    const payload: Record<string, unknown> = {
      name: name.trim(),
      email: email.trim(),
      status,
    };
    // Password hanya dikirim saat membuat anggota baru.
    // Backend update tidak meng-hash password, jadi tidak dikirim saat edit.
    if (mode === 'create') payload.password = password;

    setSaving(true);
    try {
      await onSubmit(payload);
    } catch (err: any) {
      setError(err.message || 'Gagal menyimpan data anggota.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="name" className={labelClass}>
          Nama Lengkap *
        </label>
        <input
          id="name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputClass}
          placeholder="Nama anggota"
        />
      </div>

      <div>
        <label htmlFor="email" className={labelClass}>
          Email *
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClass}
          placeholder="nama@email.com"
        />
      </div>

      {mode === 'create' && (
        <div>
          <label htmlFor="password" className={labelClass}>
            Password *
          </label>
          <input
            id="password"
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
            placeholder="Minimal 6 karakter"
          />
          <p className="mt-1 text-xs text-gray-500">
            Password akan di-hash otomatis oleh server.
          </p>
        </div>
      )}

      <div>
        <label htmlFor="status" className={labelClass}>
          Status Akun
        </label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value as 'ACTIVE' | 'INACTIVE')}
          className={inputClass}
        >
          <option value="ACTIVE">Aktif</option>
          <option value="INACTIVE">Nonaktif</option>
        </select>
        <p className="mt-1 text-xs text-gray-500">
          Anggota nonaktif tidak bisa masuk ke sistem.
        </p>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className={`px-6 py-2 rounded-md text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 ${
            saving ? 'opacity-75 cursor-not-allowed' : ''
          }`}
        >
          {saving ? 'Menyimpan...' : submitLabel}
        </button>
        <button
          type="button"
          onClick={() => window.history.back()}
          className="px-6 py-2 rounded-md text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
        >
          Batal
        </button>
      </div>
    </form>
  );
}