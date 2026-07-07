import { useQuery } from '@tanstack/react-query';
import { speakingApi } from './speakingApi';

export const SPEAKING_QUESTIONS_KEY = ['student', 'speaking-questions'];

export const useSpeakingQuestionsQuery = (partNumber: number) => {
  return useQuery({
    queryKey: [...SPEAKING_QUESTIONS_KEY, partNumber],
    queryFn: () => speakingApi.listByPart(partNumber),
  });
};
