import { useQuery } from '@tanstack/react-query';
import { studentListeningExamApi } from './listeningPracticeApi';

export const LISTENING_EXAM_KEY = ['student', 'listening-exams'];

export const useListeningSetsQuery = () => {
  return useQuery({
    queryKey: LISTENING_EXAM_KEY,
    queryFn: () => studentListeningExamApi.listListeningSets(),
  });
};

export const useListeningExamDetailQuery = (id: number | null) => {
  return useQuery({
    queryKey: [...LISTENING_EXAM_KEY, 'detail', id],
    queryFn: () => studentListeningExamApi.examDetail(id as number),
    enabled: id != null,
  });
};
