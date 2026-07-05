import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { userApi } from './userApi';
import { ICreateUserPayload, IUpdateUserPayload, IUserFilter } from './types';

export const USERS_KEY = ['admin', 'users'];

export const useUsersQuery = (filter: IUserFilter = {}) => {
  return useQuery({
    queryKey: [...USERS_KEY, filter],
    queryFn: () => userApi.list(filter),
  });
};

export const useCreateUserMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ICreateUserPayload) => userApi.create(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: USERS_KEY }),
  });
};

export const useUpdateUserMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: IUpdateUserPayload }) => userApi.update(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: USERS_KEY }),
  });
};

export const useLockUserMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => userApi.lock(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: USERS_KEY }),
  });
};
