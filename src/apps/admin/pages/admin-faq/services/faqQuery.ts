import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { faqApi } from './faqApi';
import { ICreateFaqPayload, IFaqFilter, IUpdateFaqPayload } from './types';

export const FAQS_KEY = ['admin', 'faqs'];

export const useFaqsQuery = (filter: IFaqFilter = {}) => {
  return useQuery({
    queryKey: [...FAQS_KEY, filter],
    queryFn: () => faqApi.list(filter),
  });
};

export const useCreateFaqMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ICreateFaqPayload) => faqApi.create(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: FAQS_KEY }),
  });
};

export const useUpdateFaqMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: IUpdateFaqPayload }) => faqApi.update(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: FAQS_KEY }),
  });
};

export const useDeleteFaqMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => faqApi.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: FAQS_KEY }),
  });
};
