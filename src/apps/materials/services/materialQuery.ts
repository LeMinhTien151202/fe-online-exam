import { useQuery } from '@tanstack/react-query';
import { materialApi } from './materialApi';
import { IMaterialFilter } from './types';

export const MATERIALS_KEY = ['student', 'study-materials'];

export const useStudyMaterialsQuery = (filter: IMaterialFilter = {}) => {
  return useQuery({
    queryKey: [...MATERIALS_KEY, filter],
    queryFn: () => materialApi.list(filter),
  });
};
