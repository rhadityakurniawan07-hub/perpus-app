'use client';

import { useState, useCallback } from 'react';
import api, { getErrorMessage } from '@/lib/axios';
import { Book } from '@/types';

export interface BookQuery {
  search?: string;
  category?: string;
  available?: string;
  sortBy?: string;
  order?: string;
}

export function useBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchBooks = useCallback(async (params?: BookQuery) => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (params?.search) query.append('search', params.search);
      if (params?.category) query.append('category', params.category);
      if (params?.available) query.append('available', params.available);
      query.append('sortBy', params?.sortBy || 'title');
      query.append('order', params?.order || 'asc');

      const response = await api.get(`/books?${query.toString()}`);
      setBooks(response.data);
      setError('');
      return response.data as Book[];
    } catch (err) {
      setError(getErrorMessage(err));
      return [] as Book[];
    } finally {
      setLoading(false);
    }
  }, []);

  const refetch = useCallback(() => fetchBooks(), [fetchBooks]);

  return { books, setBooks, loading, error, setError, fetchBooks, refetch };
}