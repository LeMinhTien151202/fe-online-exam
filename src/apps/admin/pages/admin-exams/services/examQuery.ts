import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { examApi } from './examApi';
import { mapQuestionToBank } from './examBank';
import { questionApi } from '../../admin-questions/services/questionApi';
import { IQuestion } from '../../admin-questions/services/types';
import { FE_SKILL_TO_ID, IAssignQuestion, IExamFilter, IUpdateExamPayload } from './types';

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

// Trần `limit` của backend cho /questions (>500 sẽ bị trả 400).
const QUESTION_PAGE_SIZE = 500;

// Lấy HẾT câu hỏi của 1 kỹ năng: lặp trang tới khi trang trả về ít hơn PAGE_SIZE.
const fetchAllQuestionsForSkill = async (skillId: number) => {
  const all: IQuestion[] = [];
  for (let page = 1; ; page += 1) {
    const batch = await questionApi.list({ skillId, page, limit: QUESTION_PAGE_SIZE });
    all.push(...batch);
    if (batch.length < QUESTION_PAGE_SIZE) break;
  }
  return all;
};

// Toàn bộ ngân hàng câu hỏi -> map về shape Selection dùng.
// Lấy theo TỪNG kỹ năng rồi gộp, tránh bị 1 lần gọi phẳng chặn giới hạn -> rớt kỹ năng.
export const useExamQuestionBank = () => {
  const query = useQuery({
    queryKey: EXAM_BANK_KEY,
    queryFn: async () => {
      const skillIds = Object.values(FE_SKILL_TO_ID);
      const perSkill = await Promise.all(skillIds.map(fetchAllQuestionsForSkill));
      return perSkill.flat();
    },
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
