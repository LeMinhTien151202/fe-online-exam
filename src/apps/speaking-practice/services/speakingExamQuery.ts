import { useQuery } from '@tanstack/react-query';
import { studentSpeakingExamApi } from './speakingPracticeApi';

export const SPEAKING_EXAM_KEY = ['student', 'speaking-exams'];

export const useSpeakingSetsQuery = () => {
  return useQuery({
    queryKey: SPEAKING_EXAM_KEY,
    queryFn: () => studentSpeakingExamApi.listSpeakingSets(),
  });
};

export const useSpeakingExamDetailQuery = (id: number | null) => {
  return useQuery({
    queryKey: [...SPEAKING_EXAM_KEY, 'detail', id],
    queryFn: () => studentSpeakingExamApi.examDetail(id as number),
    enabled: id != null,
  });
};
