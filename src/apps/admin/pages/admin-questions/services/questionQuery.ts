import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { questionApi } from './questionApi';
import {
  FileFolderType,
  ICreateQuestionPayload,
  IQuestionFilter,
  IUpdateQuestionPayload,
} from './types';

export const QUESTIONS_KEY = ['admin', 'questions'];

export const useQuestionsQuery = (filter: IQuestionFilter) => {
  return useQuery({
    queryKey: [...QUESTIONS_KEY, filter],
    queryFn: () => questionApi.list(filter),
    enabled: filter.skillId != null,
  });
};

export const useQuestionDetailQuery = (id: number | null) => {
  return useQuery({
    queryKey: [...QUESTIONS_KEY, 'detail', id],
    queryFn: () => questionApi.detail(id as number),
    enabled: id != null,
  });
};

export const useCreateQuestionsMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    // Nhận MẢNG payload (form gộp nhiều câu) -> gọi tuần tự nhiều POST
    mutationFn: async (payloads: ICreateQuestionPayload[]) => {
      const results = [];
      for (const payload of payloads) {
        results.push(await questionApi.create(payload));
      }
      return results;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUESTIONS_KEY });
    },
  });
};

export const useUpdateQuestionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: IUpdateQuestionPayload }) =>
      questionApi.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUESTIONS_KEY });
    },
  });
};

export const useDeleteQuestionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => questionApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUESTIONS_KEY });
    },
  });
};

export const useUploadFileMutation = () => {
  return useMutation({
    mutationFn: ({ file, folderType, prefix }: { file: File; folderType: FileFolderType; prefix?: string }) =>
      questionApi.upload(file, folderType, prefix),
  });
};
