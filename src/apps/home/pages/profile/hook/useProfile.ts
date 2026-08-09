import {
  useMutation,
  useQuery,
  useQueryClient } from "@tanstack/react-query";
import { getProfile, updateProfile } from "../services/profileApi";
import { toast } from '../../../../../configs/toast';

import { useAppSelector } from "@/shared/store/hooks";

export const PROFILE_QUERY_KEY = ["profile", "me"];

export const useProfile = () => {
  const queryClient = useQueryClient();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const profileQuery = useQuery({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: getProfile,
    enabled: isAuthenticated,
  });

  const updateMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: (data) => {
      queryClient.setQueryData(PROFILE_QUERY_KEY, data);
      toast.success("Cập nhật hồ sơ thành công!");
    },
  });

  return {
    profile: profileQuery.data,
    isLoading: profileQuery.isLoading,
    updateProfile: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
  };
};
