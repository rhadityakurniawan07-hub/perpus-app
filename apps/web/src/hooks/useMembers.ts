'use client';

import { useState, useCallback } from 'react';
import api, { getErrorMessage } from '@/lib/axios';
import { User } from '@/types';

export function useMembers() {
  const [members, setMembers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/members');
      setMembers(response.data);
      setError('');
      return response.data as User[];
    } catch (err) {
      setError(getErrorMessage(err));
      return [] as User[];
    } finally {
      setLoading(false);
    }
  }, []);

  const refetch = useCallback(() => fetchMembers(), [fetchMembers]);

  return { members, setMembers, loading, error, setError, fetchMembers, refetch };
}