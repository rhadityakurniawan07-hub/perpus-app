'use client';

import { useState, useCallback } from 'react';
import api, { getErrorMessage } from '@/lib/axios';
import { BookReviewSummary, Review } from '@/types';

export function useBookReviews(bookId?: string) {
  const [summary, setSummary] = useState<BookReviewSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchReviews = useCallback(
    async (id?: string) => {
      const target = id || bookId;
      if (!target) return null;
      setLoading(true);
      try {
        const response = await api.get(`/books/${target}/reviews`);
        setSummary(response.data);
        setError('');
        return response.data as BookReviewSummary;
      } catch (err) {
        setError(getErrorMessage(err));
        return null;
      } finally {
        setLoading(false);
      }
    },
    [bookId]
  );

  const submitReview = useCallback(
    async (id: string, rating: number, comment?: string) => {
      const response = await api.post(`/books/${id}/reviews`, { rating, comment });
      await fetchReviews(id);
      return response.data as Review;
    },
    [fetchReviews]
  );

  return { summary, loading, error, setError, fetchReviews, submitReview };
}

export function useMyReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchMyReviews = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/reviews/mine');
      setReviews(response.data);
      setError('');
      return response.data as Review[];
    } catch (err) {
      setError(getErrorMessage(err));
      return [] as Review[];
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteReview = useCallback(
    async (reviewId: string) => {
      await api.delete(`/reviews/${reviewId}`);
      await fetchMyReviews();
    },
    [fetchMyReviews]
  );

  return { reviews, loading, error, setError, fetchMyReviews, deleteReview };
}
