import { useQuery } from '@tanstack/react-query';
import { studentWritingExamApi } from './writingPracticeApi';

export const WRITING_EXAM_KEY = ['student', 'writing-exams'];

export const useWritingSetsQuery = () => {
  return useQuery({
    queryKey: WRITING_EXAM_KEY,
    queryFn: () => studentWritingExamApi.listWritingSets(),
  });
};

export const useWritingExamDetailQuery = (id: number | null) => {
  return useQuery({
    queryKey: [...WRITING_EXAM_KEY, 'detail', id],
    queryFn: () => studentWritingExamApi.examDetail(id as number),
    enabled: id != null,
  });
};
