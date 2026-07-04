import axiosInstance from '@/configs/axios';
import {
  IAssignQuestion,
  ICreateExamPayload,
  IExamFilter,
  IExamPartQuestion,
  IExamSetDetail,
  IExamSetListItem,
  IUpdateExamPayload,
} from './types';

// Interceptor đã bóc res.data.data. List trả về mảng (metaData phân trang không đi kèm ở tầng này).
export const examApi = {
  list: (filter: IExamFilter = {}) =>
    axiosInstance.get<IExamSetListItem[], IExamSetListItem[]>('/exam-sets', { params: filter }),

  detail: (id: number) => axiosInstance.get<IExamSetDetail, IExamSetDetail>(`/exam-sets/${id}`),

  // BE tự sinh sections + parts, trả về full tree
  create: (payload: ICreateExamPayload) =>
    axiosInstance.post<IExamSetDetail, IExamSetDetail>('/exam-sets', payload),

  update: (id: number, payload: IUpdateExamPayload) =>
    axiosInstance.patch<IExamSetListItem, IExamSetListItem>(`/exam-sets/${id}`, payload),

  toggleActive: (id: number) =>
    axiosInstance.patch<IExamSetListItem, IExamSetListItem>(`/exam-sets/${id}/toggle-active`),

  remove: (id: number) =>
    axiosInstance.delete<{ message: string }, { message: string }>(`/exam-sets/${id}`),

  // Gán câu hỏi vào 1 part
  assignQuestions: (partId: number, questions: IAssignQuestion[]) =>
    axiosInstance.post<IExamPartQuestion[], IExamPartQuestion[]>(`/exam-parts/${partId}/questions`, {
      questions,
    }),

  reorderQuestions: (partId: number, questions: IAssignQuestion[]) =>
    axiosInstance.patch<IExamPartQuestion[], IExamPartQuestion[]>(
      `/exam-parts/${partId}/questions/reorder`,
      { questions }
    ),

  removeQuestion: (partId: number, questionId: number) =>
    axiosInstance.delete<{ message: string }, { message: string }>(
      `/exam-parts/${partId}/questions/${questionId}`
    ),

  updateSection: (sectionId: number, durationMinutes: number) =>
    axiosInstance.patch(`/exam-sections/${sectionId}`, { durationMinutes }),

  updatePart: (partId: number, payload: { instruction?: string; audioUrl?: string }) =>
    axiosInstance.patch(`/exam-parts/${partId}`, payload),
};
