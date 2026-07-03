import axiosInstance from '@/configs/axios';
import {
  FileFolderType,
  ICreateQuestionPayload,
  IQuestion,
  IQuestionFilter,
  IUpdateQuestionPayload,
  IUploadedFile,
} from './types';

// Ghi chú: axios interceptor đã tự bóc `res.data.data`, nên các hàm dưới trả thẳng phần data.
// Riêng list: interceptor trả về mảng `data` (metaData phân trang không đi kèm ở tầng này).

export const questionApi = {
  list: (filter: IQuestionFilter = {}) =>
    axiosInstance.get<IQuestion[], IQuestion[]>('/questions', { params: filter }),

  detail: (id: number) => axiosInstance.get<IQuestion, IQuestion>(`/questions/${id}`),

  create: (payload: ICreateQuestionPayload) =>
    axiosInstance.post<IQuestion, IQuestion>('/questions', payload),

  update: (id: number, payload: IUpdateQuestionPayload) =>
    axiosInstance.patch<IQuestion, IQuestion>(`/questions/${id}`, payload),

  remove: (id: number) =>
    axiosInstance.delete<{ message: string }, { message: string }>(`/questions/${id}`),

  // multipart/form-data, field `file`; query folder_type=images|audio
  upload: (file: File, folderType: FileFolderType, prefix?: string) => {
    const formData = new FormData();
    formData.append('file', file);
    return axiosInstance.post<IUploadedFile, IUploadedFile>('/files/upload', formData, {
      params: { folder_type: folderType, ...(prefix ? { prefix } : {}) },
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  deleteFile: (keyOrUrl: { key?: string; url?: string }) =>
    axiosInstance.delete<{ key: string }, { key: string }>('/files', { params: keyOrUrl }),
};
