'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import api, { getErrorMessage } from '@/lib/axios';
import AdminLayout from '@/components/AdminLayout';

interface ModerationReview {
  id: string;
  rating: number;
  comment?: string | null;
  status: string;
  createdAt: string;
  user?: { id: string; name: string; email?: string };
  book?: { id: string; title: string };
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<ModerationReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [banner, setBanner] = useState('');
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'HIDDEN'>('ALL');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, []);

  async function fetchReviews() {
    setLoading(true);
    try {
      const endpoint = filter === 'PENDING'
        ? '/reviews/moderation/pending'
        : '/reviews/moderation';
      const response = await api.get(endpoint);
      setReviews(response.data);
      setError('');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  async function handleModerate(reviewId: string, status: 'APPROVED' | 'HIDDEN') {
    setBusy(true);
    try {
      await api.patch(`/reviews/${reviewId}/moderate`, { status });
      setReviews((prev) =>
        prev.map((r) => (r.id === reviewId ? { ...r, status } : r))
      );
      setBanner(`Ulasan berhasil ${status === 'APPROVED' ? 'disetujui' : 'disembunyikan'}.`);
      setError('');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  const filteredReviews = filter === 'ALL'
    ? reviews
    : reviews.filter((r) => r.status === filter);

  const statusColors: Record<string, string> = {
    PENDING: 'bg-amber-100 text-amber-800',
    APPROVED: 'bg-emerald-100 text-emerald-800',
    HIDDEN: 'bg-red-100 text-red-800',
  };

  const statusLabels: Record<string, string> = {
    PENDING: 'Menunggu',
    APPROVED: 'Disetujui',
    HIDDEN: 'Disembunyikan',
  };

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-ink">Moderasi Ulasan</h1>
        <p className="text-slate-500">Kelola ulasan pembaca — setujui atau sembunyikan</p>
      </div>

      {banner && (
        <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-700">
          {banner}
        </div>
      )}
      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          {error}
        </div>
      )}

      {/* Filter */}
      <div className="mb-6 flex flex-wrap gap-2">
        {(['ALL', 'PENDING', 'APPROVED', 'HIDDEN'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
              filter === f
                ? 'border-ink bg-ink text-white'
                : 'border-slate-200 bg-white text-slate-700 hover:border-slate-400'
            }`}
          >
            {f === 'ALL' ? 'Semua' : statusLabels[f]}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-16 text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-brand-600 border-t-transparent" />
          <p className="mt-3 text-slate-500">Memuat ulasan...</p>
        </div>
      ) : filteredReviews.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500">
          Tidak ada ulasan untuk ditampilkan.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReviews.map((review) => (
            <div key={review.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-600 text-xs font-bold text-white">
                      {(review.user?.name || '?').charAt(0).toUpperCase()}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-ink">{review.user?.name || 'Pembaca'}</p>
                      <p className="text-xs text-slate-400">{review.user?.email}</p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <p className="text-sm font-semibold text-ink">
                      Buku: {review.book?.title || 'Tidak diketahui'}
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-amber-500">{'★'.repeat(review.rating)}</span>
                      <span className="text-xs text-slate-400">
                        {new Date(review.createdAt).toLocaleDateString('id-ID')}
                      </span>
                    </div>
                    {review.comment && (
                      <p className="mt-2 text-sm text-slate-600">"{review.comment}"</p>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${statusColors[review.status] || 'bg-slate-100 text-slate-600'}`}>
                    {statusLabels[review.status] || review.status}
                  </span>
                  <div className="flex gap-2">
                    {review.status !== 'APPROVED' && (
                      <button
                        onClick={() => handleModerate(review.id, 'APPROVED')}
                        disabled={busy}
                        className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-500 disabled:opacity-50"
                      >
                        Setujui
                      </button>
                    )}
                    {review.status !== 'HIDDEN' && (
                      <button
                        onClick={() => handleModerate(review.id, 'HIDDEN')}
                        disabled={busy}
                        className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-red-500 disabled:opacity-50"
                      >
                        Sembunyikan
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}