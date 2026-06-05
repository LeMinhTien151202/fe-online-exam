import { useQuery, useMutation } from "@tanstack/react-query";
import { getProfile, updateProfile } from "../services/profileApi";

export const useProfile = () => {
  const profileQuery = useQuery({
    queryKey: ["user-profile"],
    queryFn: getProfile,
  });

  const updateMutation = useMutation({
    mutationFn: updateProfile,
  });

  return {
    profile: profileQuery.data,
    isLoading: profileQuery.isLoading,
    updateProfile: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
  };
};
