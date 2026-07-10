import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { studentExamApi } from './studentExamApi';
import { IAttemptFilter, ISubmitExamPayload } from './types';

export const ATTEMPTS_KEY = ['student', 'attempts'];

// Nộp bài. onSuccess: làm mới lịch sử attempt + tập đã-làm để dashboard/landing cập nhật.
export const useSubmitExamMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ examId, payload }: { examId: number; payload: ISubmitExamPayload }) =>
      studentExamApi.submit(examId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ATTEMPTS_KEY });
    },
  });
};

export const useMyAttemptsQuery = (filter: IAttemptFilter = {}) => {
  return useQuery({
    queryKey: [...ATTEMPTS_KEY, filter],
    queryFn: () => studentExamApi.myAttempts(filter),
  });
};

export const useMyDoneExamsQuery = () => {
  return useQuery({
    queryKey: [...ATTEMPTS_KEY, 'done'],
    queryFn: () => studentExamApi.myDone(),
  });
};
