import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { settingApi } from './settingApi';

export const SETTINGS_KEY = ['admin', 'settings'];

export const useSettingsQuery = () => {
  return useQuery({
    queryKey: SETTINGS_KEY,
    queryFn: settingApi.getAll,
  });
};

export const useUpdateSettingMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ key, value }: { key: string; value: string }) => settingApi.update(key, value),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: SETTINGS_KEY }),
  });
};
