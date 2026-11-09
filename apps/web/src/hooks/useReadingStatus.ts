'use client';

import { useState, useCallback } from 'react';
import api, { getErrorMessage } from '@/lib/axios';
import { ReadingStatusItem, ReadingStatusValue, BookUserState } from '@/types';

export function useReadingStatus() {
  const [items, setItems] = useState<ReadingStatusItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchMyReading = useCallback(async (status?: ReadingStatusValue) => {
    setLoading(true);
    try {
      const query = status ? `?status=${status}` : '';
      const response = await api.get(`/reading/me${query}`);
      setItems(response.data);
      setError('');
      return response.data as ReadingStatusItem[];
    } catch (err) {
      setError(getErrorMessage(err));
      return [] as ReadingStatusItem[];
    } finally {
      setLoading(false);
    }
  }, []);

  const setStatus = useCallback(
    async (bookId: string, status: ReadingStatusValue) => {
      const response = await api.put(`/books/${bookId}/reading-status`, { status });
      return response.data;
    },
    []
  );

  const fetchBookUserState = useCallback(async (bookId: string) => {
    const response = await api.get(`/books/${bookId}/me`);
    return response.data as BookUserState;
  }, []);

  return { items, setItems, loading, error, setError, fetchMyReading, setStatus, fetchBookUserState };
}
