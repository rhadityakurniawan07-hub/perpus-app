'use client';

import { useState, useCallback, useRef } from 'react';
import api, { getErrorMessage } from '@/lib/axios';
import { Book } from '@/types';

export interface BookQuery {
  search?: string;
  category?: string;
  available?: string;
  minRating?: string;
  sortBy?: string;
  order?: string;
  page?: number;
  limit?: number;
}

const PAGE_SIZE = 12;

export function useBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const currentParamsRef = useRef<BookQuery>({});

  const fetchBooks = useCallback(async (params?: BookQuery & { append?: boolean }) => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (params?.search) query.append('search', params.search);
      if (params?.category) query.append('category', params.category);
      if (params?.available) query.append('available', params.available);
      if (params?.minRating) query.append('minRating', params.minRating);
      query.append('sortBy', params?.sortBy || 'title');
      query.append('order', params?.order || 'asc');
      query.append('page', String(params?.page || 1));
      query.append('limit', String(params?.limit || PAGE_SIZE));

      // Store current params for loadMore
      const { append: _append, page: _page, limit: _limit, ...rest } = params || {};
      currentParamsRef.current = rest;

      const response = await api.get(`/books?${query.toString()}`);
      const responseData = response.data;

      // Support both paginated response { data, meta } and plain array
      const data: Book[] = Array.isArray(responseData) ? responseData : (responseData?.data ?? []);
      const meta = responseData?.meta;
      const totalCount = meta?.total ?? data.length;

      if (params?.append) {
        setBooks((prev) => [...prev, ...data]);
      } else {
        setBooks(data);
      }
      setTotal(totalCount);
      const currentPage = params?.page || 1;
      setPage(currentPage);
      setHasMore(currentPage * (params?.limit || PAGE_SIZE) < totalCount);
      setError('');
      return data;
    } catch (err) {
      setError(getErrorMessage(err));
      return [] as Book[];
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMore = useCallback(() => {
    if (!hasMore || loading) return;
    fetchBooks({ ...currentParamsRef.current, page: page + 1, append: true });
  }, [hasMore, loading, page, fetchBooks]);

  const reset = useCallback(() => {
    setBooks([]);
    setPage(1);
    setTotal(0);
    setHasMore(true);
  }, []);

  return { books, setBooks, loading, error, setError, fetchBooks, loadMore, hasMore, total, page, reset };
}