import axiosInstance, { IApiEnvelope } from '@/configs/axios';
import {
  IAssignQuestion,
  ICreateExamPayload,
  IExamFilter,
  IExamPartQuestion,
  IExamSetDetail,
  IExamSetListItem,
  IUpdateExamPayload,
} from './types';

export const examApi = {
  // Trả nguyên envelope (data + metaData) để phân trang
  list: (filter: IExamFilter = {}) =>
    axiosInstance.get<IApiEnvelope<IExamSetListItem[]>, IApiEnvelope<IExamSetListItem[]>>('/exam-sets', {
      params: filter,
      _rawEnvelope: true,
    }),

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
