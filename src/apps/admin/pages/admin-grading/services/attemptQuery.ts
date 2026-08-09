import { useQuery } from '@tanstack/react-query';
import { attemptApi } from './attemptApi';
import { IAttemptListFilter } from './types';

export const ATTEMPTS_ADMIN_KEY = ['admin', 'attempts'];

export const useAttemptsQuery = (filter: IAttemptListFilter = {}) => {
  return useQuery({
    queryKey: [...ATTEMPTS_ADMIN_KEY, filter],
    queryFn: () => attemptApi.list(filter),
  });
};
