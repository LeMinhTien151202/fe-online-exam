import { useQuery } from '@tanstack/react-query';
import { readingApi } from './readingApi';

export const READING_QUESTIONS_KEY = ['student', 'reading-questions'];

export const useReadingQuestionsQuery = (fePart: number) => {
  return useQuery({
    queryKey: [...READING_QUESTIONS_KEY, fePart],
    queryFn: () => readingApi.listByPart(fePart),
  });
};
