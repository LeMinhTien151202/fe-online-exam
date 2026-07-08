import { useQuery } from '@tanstack/react-query';
import { studentExamApi } from './readingPracticeApi';

export const READING_EXAM_KEY = ['student', 'reading-exams'];

export const useReadingSetsQuery = () => {
  return useQuery({
    queryKey: READING_EXAM_KEY,
    queryFn: () => studentExamApi.listReadingSets(),
  });
};

export const useReadingExamDetailQuery = (id: number | null) => {
  return useQuery({
    queryKey: [...READING_EXAM_KEY, 'detail', id],
    queryFn: () => studentExamApi.examDetail(id as number),
    enabled: id != null,
  });
};
