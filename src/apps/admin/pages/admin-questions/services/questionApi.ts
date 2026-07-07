import axiosInstance, { IApiEnvelope } from '@/configs/axios';
import {
  FileFolderType,
  ICreateQuestionPayload,
  IQuestion,
  IQuestionFilter,
  IUpdateQuestionPayload,
  IUploadedFile,
} from './types';

export const questionApi = {
  // Trả mảng (dùng cho ngân hàng câu hỏi khi dựng đề — lấy nhiều, không cần metaData)
  list: (filter: IQuestionFilter = {}) =>
    axiosInstance.get<IQuestion[], IQuestion[]>('/questions', { params: filter }),

  // Trả nguyên envelope (data + metaData) cho bảng quản lý câu hỏi có phân trang
  listPaged: (filter: IQuestionFilter = {}) =>
    axiosInstance.get<IApiEnvelope<IQuestion[]>, IApiEnvelope<IQuestion[]>>('/questions', {
      params: filter,
      _rawEnvelope: true,
    }),

  detail: (id: number) => axiosInstance.get<IQuestion, IQuestion>(`/questions/${id}`),

  create: (payload: ICreateQuestionPayload) =>
    axiosInstance.post<IQuestion, IQuestion>('/questions', payload),

  update: (id: number, payload: IUpdateQuestionPayload) =>
    axiosInstance.patch<IQuestion, IQuestion>(`/questions/${id}`, payload),

  remove: (id: number) =>
    axiosInstance.delete<{ message: string }, { message: string }>(`/questions/${id}`),

  // multipart/form-data, field `file`; query folder_type=images|audio
  // KHÔNG tự set 'Content-Type': để null cho axios tự sinh 'multipart/form-data; boundary=...'
  // (nếu ép 'multipart/form-data' thủ công sẽ thiếu boundary -> server trả 400).
  upload: (file: File, folderType: FileFolderType, prefix?: string) => {
    const formData = new FormData();
    formData.append('file', file);
    return axiosInstance.post<IUploadedFile, IUploadedFile>('/files/upload', formData, {
      params: { folder_type: folderType, ...(prefix ? { prefix } : {}) },
      headers: { 'Content-Type': null },
    });
  },

  deleteFile: (keyOrUrl: { key?: string; url?: string }) =>
    axiosInstance.delete<{ key: string }, { key: string }>('/files', { params: keyOrUrl }),
};
