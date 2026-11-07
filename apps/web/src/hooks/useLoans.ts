'use client';

import { useState, useCallback } from 'react';
import api, { getErrorMessage } from '@/lib/axios';
import { Loan } from '@/types';

interface UseLoansOptions {
  /** true = hanya pinjaman milik user login (`/loans/my-loans`) */
  mine?: boolean;
  /** Filter status tertentu di sisi server (`?status=...`) */
  status?: string;
}

export function useLoans(options?: UseLoansOptions) {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchLoans = useCallback(async () => {
    setLoading(true);
    try {
      const url = options?.mine ? '/loans/my-loans' : '/loans';
      const params = new URLSearchParams();
      if (options?.status) params.append('status', options.status);
      const query = params.toString();
      const response = await api.get(query ? `${url}?${query}` : url);
      setLoans(response.data);
      setError('');
      return response.data as Loan[];
    } catch (err) {
      setError(getErrorMessage(err));
      return [] as Loan[];
    } finally {
      setLoading(false);
    }
  }, [options?.mine, options?.status]);

  const refetch = useCallback(() => fetchLoans(), [fetchLoans]);

  return { loans, setLoans, loading, error, setError, fetchLoans, refetch };
}