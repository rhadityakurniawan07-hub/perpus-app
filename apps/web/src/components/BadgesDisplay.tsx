'use client';

import { useEffect, useState } from 'react';
import api, { getErrorMessage } from '@/lib/axios';

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
}

interface BadgesDisplayProps {
  userId?: string;
}

export default function BadgesDisplay({ userId }: BadgesDisplayProps) {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }
    fetchBadges();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  async function fetchBadges() {
    setLoading(true);
    try {
      const response = await api.get('/reviews/badges');
      setBadges(response.data || []);
    } catch {
      setBadges([]);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="animate-pulse rounded-2xl border border-slate-200 bg-white p-4">
            <div className="mx-auto h-10 w-10 rounded-full bg-slate-200" />
            <div className="mt-2 h-3 w-3/4 mx-auto rounded bg-slate-200" />
          </div>
        ))}
      </div>
    );
  }

  const earnedCount = badges.filter((b) => b.earned).length;

  return (
    <div>
      <p className="mt-2 text-sm text-slate-500">
        {earnedCount} dari {badges.length} lencana diraih
      </p>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {badges.map((badge) => (
          <div
            key={badge.id}
            className={`flex flex-col items-center rounded-2xl border p-4 text-center transition ${
              badge.earned
                ? 'border-amber-200 bg-amber-50 shadow-soft'
                : 'border-slate-200 bg-slate-50 opacity-50 grayscale'
            }`}
          >
            <span className="text-3xl">{badge.icon}</span>
            <p className="mt-2 text-xs font-bold text-ink">{badge.name}</p>
            <p className="mt-0.5 text-[10px] text-slate-500">{badge.description}</p>
            {badge.earned && (
              <span className="mt-2 rounded-full bg-amber-100 px-2 py-0.5 text-[9px] font-bold text-amber-700">
                Diraih ✓
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}