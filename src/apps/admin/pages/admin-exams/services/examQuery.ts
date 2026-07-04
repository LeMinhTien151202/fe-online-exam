import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { examApi } from './examApi';
import { mapQuestionToBank } from './examBank';
import { questionApi } from '../../admin-questions/services/questionApi';
import { IAssignQuestion, IExamFilter, IUpdateExamPayload } from './types';

export const EXAMS_KEY = ['admin', 'exam-sets'];
export const EXAM_BANK_KEY = ['admin', 'exam-bank'];

export const useExamSetsQuery = (filter: IExamFilter = {}) => {
  return useQuery({
    queryKey: [...EXAMS_KEY, filter],
    queryFn: () => examApi.list(filter),
  });
};

export const useExamDetailQuery = (id: number | null) => {
  return useQuery({
    queryKey: [...EXAMS_KEY, 'detail', id],
    queryFn: () => examApi.detail(id as number),
    enabled: id != null,
  });
};

// Toàn bộ ngân hàng câu hỏi -> map về shape Selection dùng
export const useExamQuestionBank = () => {
  const query = useQuery({
    queryKey: EXAM_BANK_KEY,
    queryFn: () => questionApi.list({ limit: 500 }),
  });
  return {
    ...query,
    bankQuestions: (query.data ?? []).map(mapQuestionToBank),
  };
};

export const useDeleteExamMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => examApi.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: EXAMS_KEY }),
  });
};

export const useToggleExamActiveMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => examApi.toggleActive(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: EXAMS_KEY }),
  });
};

export const useUpdateExamMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: IUpdateExamPayload }) =>
      examApi.update(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: EXAMS_KEY }),
  });
};

export const useUpdateSectionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ sectionId, durationMinutes }: { sectionId: number; durationMinutes: number }) =>
      examApi.updateSection(sectionId, durationMinutes),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: EXAMS_KEY }),
  });
};

export const useUpdatePartMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ partId, payload }: { partId: number; payload: { instruction?: string; audioUrl?: string } }) =>
      examApi.updatePart(partId, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: EXAMS_KEY }),
  });
};

export const useAssignQuestionsMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ partId, questions }: { partId: number; questions: IAssignQuestion[] }) =>
      examApi.assignQuestions(partId, questions),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: EXAMS_KEY }),
  });
};

export const useReorderQuestionsMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ partId, questions }: { partId: number; questions: IAssignQuestion[] }) =>
      examApi.reorderQuestions(partId, questions),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: EXAMS_KEY }),
  });
};

export const useRemoveQuestionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ partId, questionId }: { partId: number; questionId: number }) =>
      examApi.removeQuestion(partId, questionId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: EXAMS_KEY }),
  });
};
