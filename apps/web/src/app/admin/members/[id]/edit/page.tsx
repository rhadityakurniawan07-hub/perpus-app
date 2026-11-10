'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/axios';
import { User } from '@/types';
import MemberForm from '@/components/MemberForm';
import RatingStars from '@/components/RatingStars';

type ReadingStatusValue = 'WISHLIST' | 'READING' | 'FINISHED';

interface ReadingBook {
  id: string;
  title: string;
  author: string;
  coverImage: string | null;
  averageRating: number;
  reviewCount: number;
}

interface AdminReadingStatus {
  id: string;
  status: ReadingStatusValue;
  updatedAt: string;
  book: ReadingBook;
}

interface AdminReview {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
  book: {
    id: string;
    title: string;
    author: string;
    coverImage: string | null;
  };
}

interface MemberDetail extends User {
  createdAt: string;
  updatedAt: string;
  readingStatuses?: AdminReadingStatus[];
  reviews?: AdminReview[];
}

const statusLabel: Record<ReadingStatusValue, string> = {
  WISHLIST: 'Ingin Dibaca',
  READING: 'Sedang Dibaca',
  FINISHED: 'Sudah Selesai',
};

const statusDot: Record<ReadingStatusValue, string> = {
  WISHLIST: 'bg-amber-400',
  READING: 'bg-violet-500',
  FINISHED: 'bg-emerald-500',
};

export default function EditMemberPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [member, setMember] = useState<MemberDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMember();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  async function fetchMember() {
    try {
      const response = await api.get(`/members/${params.id}`);
      if (!response.data) {
        setError('Anggota tidak ditemukan.');
      } else {
        setMember(response.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Gagal memuat data anggota.');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(data: Record<string, unknown>) {
    try {
      await api.patch(`/members/${params.id}`, data);
      router.push('/admin/members?msg=updated');
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        (Array.isArray(err.response?.data?.message)
          ? err.response.data.message.join(', ')
          : null) ||
        'Gagal memperbarui data anggota.';
      throw new Error(message);
    }
  }

  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="inline-block w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full animate-spin" />
        <p className="mt-2 text-slate-500">Memuat data anggota...</p>
      </div>
    );
  }

  if (error || !member) {
    return (
      <div className="max-w-xl">
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          {error || 'Anggota tidak ditemukan.'}
        </div>
        <button
          onClick={() => router.push('/admin/members')}
          className="mt-4 text-sm font-semibold text-brand-700 hover:text-brand-800"
        >
          ← Kembali ke daftar anggota
        </button>
      </div>
    );
  }

  const readingStatuses = member.readingStatuses ?? [];
  const reviews = member.reviews ?? [];

  return (
    <div>
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-ink">Edit Anggota</h1>
          <p className="text-slate-500">
            Perbarui data anggota <span className="font-semibold text-ink">"{member.name}"</span>
          </p>
        </div>
        <Link href="/admin/members" className="btn-ghost w-fit">
          ← Kembali
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Form */}
        <div className="card p-6 lg:col-span-2">
          <MemberForm
            mode="edit"
            initialData={member}
            submitLabel="Simpan Perubahan"
            onSubmit={handleSubmit}
          />
        </div>

        {/* Reading & Reviewing */}
        <div className="flex flex-col gap-6 lg:col-span-3">
          {/* Reading Statuses */}
          <section className="card p-6">
            <div className="mb-4 flex items-center justify-between gap-2">
              <div>
                <h2 className="text-lg font-bold text-ink">Riwayat Membaca</h2>
                <p className="text-xs text-slate-500">Jejak status baca anggota</p>
              </div>
              <span className="badge bg-violet-100 text-xs font-bold text-violet-800">
                {readingStatuses.length} buku
              </span>
            </div>

            {readingStatuses.length === 0 ? (
              <p className="py-6 text-center text-sm text-slate-500">
                Belum ada status baca yang ditandai.
              </p>
            ) : (
              <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {readingStatuses.map((item) => (
                  <li key={item.id} className="flex gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3">
                    <div className="flex h-20 w-14 shrink-0 items-center justify-center overflow-hidden rounded-md bg-gradient-to-br from-brand-800 via-ink to-slate-900 text-brand-200">
                      {item.book.coverImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.book.coverImage}
                          alt={item.book.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                        </svg>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/books/${item.book.id}`}
                        className="block truncate text-sm font-bold text-ink hover:text-brand-700"
                      >
                        {item.book.title}
                      </Link>
                      <p className="mt-0.5 truncate text-[11px] text-slate-500">{item.book.author}</p>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <span className="badge bg-white text-[10px] font-bold text-slate-700 ring-1 ring-slate-200">
                          <span className={`mr-1 inline-block h-2 w-2 rounded-full align-middle ${statusDot[item.status]}`} />
                          {statusLabel[item.status]}
                        </span>
                        <RatingStars rating={item.book.averageRating || 0} size="sm" />
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Reviews */}
          <section className="card p-6">
            <div className="mb-4 flex items-center justify-between gap-2">
              <div>
                <h2 className="text-lg font-bold text-ink">Ulasan yang Ditulis</h2>
                <p className="text-xs text-slate-500">Jejak ulasan yang diberikan anggota</p>
              </div>
              <span className="badge bg-amber-100 text-xs font-bold text-amber-800">
                {reviews.length} ulasan
              </span>
            </div>

            {reviews.length === 0 ? (
              <p className="py-6 text-center text-sm text-slate-500">
                Belum ada ulasan yang ditulis.
              </p>
            ) : (
              <ul className="divide-y divide-slate-100">
                {reviews.map((review) => (
                  <li key={review.id} className="py-4 first:pt-0 last:pb-0">
                    <Link
                      href={`/books/${review.book.id}`}
                      className="block truncate text-sm font-bold text-ink hover:text-brand-700"
                    >
                      {review.book.title}
                    </Link>
                    <p className="mt-0.5 truncate text-xs text-slate-500">{review.book.author}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <RatingStars rating={review.rating} size="sm" />
                      <span className="text-[11px] font-semibold text-slate-400">
                        · {new Date(review.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                    {review.comment && (
                      <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-slate-600">
                        “{review.comment}”
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
