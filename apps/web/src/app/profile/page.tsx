'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import api from '@/lib/axios';
import { User } from '@/types';
import MemberLayout from '@/components/MemberLayout';
import { useMyStats } from '@/hooks/useMyStats';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState<User | null>(user);
  const [loading, setLoading] = useState(true);
  const { stats, fetchMyStats } = useMyStats();

  useEffect(() => {
    fetchProfile();
    fetchMyStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchProfile() {
    try {
      const response = await api.get('/auth/me');
      setProfile(response.data);
    } catch (error) {
      console.error('Gagal mengambil profil:', error);
      setProfile(user ?? null);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <MemberLayout>
        <div className="grid min-h-[28rem] place-items-center">
          <div className="text-center">
            <div className="relative mx-auto h-24 w-24"><span className="absolute inset-0 rounded-full border border-violet-100" /><span className="absolute inset-3 animate-spin rounded-full border-4 border-violet-200 border-t-violet-700" /></div>
            <p className="mt-6 text-[10px] font-extrabold uppercase tracking-[0.25em] text-slate-400">Membuka dossier</p>
          </div>
        </div>
      </MemberLayout>
    );
  }

  if (!profile) {
    return (
      <MemberLayout>
        <section className="editorial-panel editorial-dots flex min-h-[32rem] flex-col items-center justify-center px-6 py-16 text-center">
          <div className="relative flex h-28 w-28 items-center justify-center rounded-full border border-violet-200 bg-violet-50">
            <span className="text-4xl font-black text-violet-300">P</span>
            <span className="absolute -right-1 -top-1 flex h-8 w-8 items-center justify-center rounded-full border-4 border-white bg-amber-400 text-sm font-black text-ink">?</span>
          </div>
          <p className="editorial-kicker mt-7">Akses Diperlukan</p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-ink sm:text-5xl">Masuk untuk melihat<br />dossier Anda.</h1>
          <p className="mt-4 max-w-md text-sm leading-6 text-slate-500">Profil, progres membaca, dan arsip ulasan tersimpan aman di dalam akun PERPUS Anda.</p>
          <Link href="/login" className="mt-6 rounded-full bg-violet-600 px-6 py-3 text-sm font-bold text-white transition hover:bg-violet-500">Masuk ke PERPUS →</Link>
        </section>
      </MemberLayout>
    );
  }

  const displayRole = profile.role === 'ADMIN' ? 'Kurator' : 'Pembaca';
  const joinedAt = profile.createdAt
    ? new Date(profile.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    : '-';
  const totalReading = stats.wishlist + stats.reading + stats.finished;
  const completionRate = totalReading > 0 ? Math.round((stats.finished / totalReading) * 100) : 0;
  const passportStats = [
    { value: stats.wishlist, label: 'Ingin Dibaca', tone: 'text-amber-300' },
    { value: stats.reading, label: 'Sedang Dibaca', tone: 'text-violet-300' },
    { value: stats.finished, label: 'Selesai', tone: 'text-emerald-300' },
    { value: stats.reviews, label: 'Ulasan', tone: 'text-sky-300' },
  ];

  return (
    <MemberLayout>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="editorial-kicker"><span className="h-2 w-2 rounded-full bg-amber-400" />Member Dossier</div>
          <h1 className="editorial-heading mt-3 text-4xl sm:text-5xl">Profil<br />Pembaca</h1>
        </div>
        <p className="max-w-xs text-right text-[10px] font-extrabold uppercase leading-5 tracking-[0.22em] text-slate-400">Identitas · Bacaan · Suara</p>
      </div>

      <section className="editorial-panel grid overflow-hidden border-violet-100 lg:grid-cols-12">
        <div className="relative flex flex-col justify-between overflow-hidden bg-ink p-7 text-white sm:p-8 lg:col-span-4 lg:min-h-[42rem] lg:p-9">
          <div className="pointer-events-none absolute -left-24 top-20 h-72 w-72 rounded-full border border-violet-400/20" />
          <div className="pointer-events-none absolute -right-24 bottom-10 h-72 w-72 rounded-full border border-amber-300/20" />
          <div className="relative">
            <div className="flex items-center justify-between border-b border-white/10 pb-5">
              <p className="text-[9px] font-extrabold uppercase tracking-[0.32em] text-amber-300">Member Card</p>
              <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-[9px] font-extrabold uppercase tracking-wider text-emerald-300">{profile.status === 'ACTIVE' ? 'Aktif' : 'Tidak Aktif'}</span>
            </div>
            <div className="mt-9">
              <div className="flex h-32 w-32 items-center justify-center rounded-[2rem] border border-white/15 bg-gradient-to-br from-violet-500 to-violet-900 text-5xl font-black text-white shadow-2xl">{profile.name?.charAt(0).toUpperCase() || 'P'}</div>
              <h2 className="mt-7 break-words text-3xl font-black leading-tight tracking-tight">{profile.name}</h2>
              <p className="mt-2 break-all text-sm leading-6 text-violet-100/70">{profile.email}</p>
              <span className="mt-5 inline-flex rounded-full border border-amber-300/30 bg-amber-300/10 px-4 py-2 text-[10px] font-extrabold uppercase tracking-[0.22em] text-amber-300">{displayRole}</span>
            </div>
          </div>

          <div className="relative mt-10">
            <p className="text-sm leading-6 text-violet-100/70">“Pembaca yang baik bukan hanya menghabiskan buku, tetapi membawa buku itu kembali ke dalam dirinya.”</p>
            <div className="mt-6 border-t border-white/10 pt-5">
              <p className="text-[8px] font-extrabold uppercase tracking-[0.3em] text-violet-200">Member sejak</p>
              <p className="mt-1 font-bold text-white">{joinedAt}</p>
            </div>
          </div>
        </div>

        <div className="relative bg-[#fffdf8] p-6 sm:p-8 lg:col-span-8 lg:p-10">
          <div className="absolute right-7 top-6 hidden text-[90px] font-black leading-none text-amber-100 lg:block">P</div>
          <p className="editorial-kicker text-amber-700"><span className="h-1.5 w-1.5 rounded-full bg-amber-500" />Identitas Baca</p>
          <h2 className="mt-3 max-w-lg text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">Sebuah catatan singkat tentang diri Anda di PERPUS.</h2>

          <div className="mt-8 grid grid-cols-2 gap-3">
            {passportStats.map((item) => (
              <div key={item.label} className="rounded-2xl border border-amber-100 bg-white p-4 shadow-soft sm:p-5">
                <p className={`text-3xl font-black ${item.tone}`}>{item.value}</p>
                <p className="mt-1 text-[9px] font-extrabold uppercase leading-4 tracking-[0.14em] text-slate-500">{item.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-3xl border border-violet-100 bg-white p-5 shadow-soft sm:p-6">
            <div className="flex items-end justify-between gap-4 border-b border-violet-100 pb-4">
              <div>
                <p className="text-[9px] font-extrabold uppercase tracking-[0.22em] text-slate-400">Rasio selesai</p>
                <p className="mt-1 text-sm font-bold text-ink">Selesai dari seluruh buku di rak</p>
              </div>
              <p className="text-3xl font-black text-violet-700">{completionRate}<span className="text-base align-top">%</span></p>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-violet-50"><div className="h-full rounded-full bg-gradient-to-r from-violet-600 to-amber-400" style={{ width: `${completionRate}%` }} /></div>
          </div>

          <dl className="mt-6 grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
            <div className="border-b border-violet-100 pb-4"><dt className="text-[9px] font-extrabold uppercase tracking-[0.22em] text-slate-400">Nama Lengkap</dt><dd className="mt-1.5 font-extrabold text-ink">{profile.name}</dd></div>
            <div className="border-b border-violet-100 pb-4"><dt className="text-[9px] font-extrabold uppercase tracking-[0.22em] text-slate-400">Peran</dt><dd className="mt-1.5 font-extrabold text-ink">{displayRole}</dd></div>
            <div className="border-b border-violet-100 pb-4"><dt className="text-[9px] font-extrabold uppercase tracking-[0.22em] text-slate-400">Email</dt><dd className="mt-1.5 break-all font-semibold text-slate-700">{profile.email}</dd></div>
            <div className="border-b border-violet-100 pb-4"><dt className="text-[9px] font-extrabold uppercase tracking-[0.22em] text-slate-400">Status Akun</dt><dd className="mt-1.5 font-extrabold text-ink">{profile.status === 'ACTIVE' ? 'Aktif' : 'Tidak Aktif'}</dd></div>
          </dl>

          <div className="mt-7 flex flex-wrap items-center justify-between gap-4 border-t border-violet-100 pt-6">
            <p className="max-w-xs text-xs leading-5 text-slate-500">Ingin meninggalkan ruang baca ini? Anda bisa keluar dari akun kapan saja.</p>
            <button onClick={logout} className="rounded-full border border-red-200 bg-red-50 px-5 py-3 text-xs font-extrabold uppercase tracking-wider text-red-700 transition hover:border-red-300 hover:bg-red-100">Keluar dari Akun →</button>
          </div>
        </div>
      </section>
    </MemberLayout>
  );
}
