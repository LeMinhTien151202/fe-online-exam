import { useQuery } from '@tanstack/react-query';
import { listeningApi } from './listeningApi';

export const LISTENING_QUESTIONS_KEY = ['student', 'listening-questions'];

export const useListeningQuestionsQuery = (partNumber: number) => {
  return useQuery({
    queryKey: [...LISTENING_QUESTIONS_KEY, partNumber],
    queryFn: () => listeningApi.listByPart(partNumber),
  });
};
