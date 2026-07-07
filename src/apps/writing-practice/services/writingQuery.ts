import { useQuery } from '@tanstack/react-query';
import { writingApi } from './writingApi';

export const WRITING_QUESTIONS_KEY = ['student', 'writing-questions'];

export const useWritingQuestionsQuery = (partNumber: number) => {
  return useQuery({
    queryKey: [...WRITING_QUESTIONS_KEY, partNumber],
    queryFn: () => writingApi.listByPart(partNumber),
  });
};
