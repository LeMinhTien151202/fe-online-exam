import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { materialApi } from './materialApi';
import { ICreateMaterialPayload, IMaterialFilter } from './types';

export const MATERIALS_KEY = ['admin', 'study-materials'];

export const useMaterialsQuery = (filter: IMaterialFilter = {}) => {
  return useQuery({
    queryKey: [...MATERIALS_KEY, filter],
    queryFn: () => materialApi.list(filter),
  });
};

export const useCreateMaterialMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ICreateMaterialPayload) => materialApi.create(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: MATERIALS_KEY }),
  });
};

export const useDeleteMaterialMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => materialApi.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: MATERIALS_KEY }),
  });
};
