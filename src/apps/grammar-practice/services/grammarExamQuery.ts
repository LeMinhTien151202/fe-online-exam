import { useQuery } from '@tanstack/react-query';
import { studentGrammarExamApi } from './grammarPracticeApi';

export const GRAMMAR_EXAM_KEY = ['student', 'grammar-exams'];

export const useGrammarSetsQuery = () => {
  return useQuery({
    queryKey: GRAMMAR_EXAM_KEY,
    queryFn: () => studentGrammarExamApi.listGrammarSets(),
  });
};

export const useGrammarExamDetailQuery = (id: number | null) => {
  return useQuery({
    queryKey: [...GRAMMAR_EXAM_KEY, 'detail', id],
    queryFn: () => studentGrammarExamApi.examDetail(id as number),
    enabled: id != null,
  });
};
