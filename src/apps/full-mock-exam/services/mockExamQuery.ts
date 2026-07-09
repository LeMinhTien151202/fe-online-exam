import { useQuery } from '@tanstack/react-query';
import { mockExamApi } from './mockExamApi';

export const MOCK_EXAM_KEY = ['student', 'mock-exams'];

export const useMockExamSetsQuery = () => {
  return useQuery({
    queryKey: MOCK_EXAM_KEY,
    queryFn: () => mockExamApi.list(),
  });
};

export const useMockExamDetailQuery = (id: number | null) => {
  return useQuery({
    queryKey: [...MOCK_EXAM_KEY, 'detail', id],
    queryFn: () => mockExamApi.detail(id as number),
    enabled: id != null,
  });
};
