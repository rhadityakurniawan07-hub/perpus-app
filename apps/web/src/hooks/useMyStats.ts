'use client';

import { useState, useCallback } from 'react';
import api, { getErrorMessage } from '@/lib/axios';
import { MyStats } from '@/types';

export function useMyStats() {
  const [stats, setStats] = useState<MyStats>({
    wishlist: 0,
    reading: 0,
    finished: 0,
    reviews: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchMyStats = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/reviews/my-stats');
      setStats(response.data);
      setError('');
      return response.data as MyStats;
    } catch (err) {
      setError(getErrorMessage(err));
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { stats, loading, error, setError, fetchMyStats };
}
