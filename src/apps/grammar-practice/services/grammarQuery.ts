import { useQuery } from '@tanstack/react-query';
import { grammarApi } from './grammarApi';

export const GRAMMAR_QUESTIONS_KEY = ['student', 'grammar-questions'];

export const useGrammarQuestionsQuery = (partNumber: number) => {
  return useQuery({
    queryKey: [...GRAMMAR_QUESTIONS_KEY, partNumber],
    queryFn: () => grammarApi.listByPart(partNumber),
  });
};
