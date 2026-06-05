import { useMutation } from "@tanstack/react-query";
import { loginUser } from "../services/loginApi";

export const useLogin = () => {
  return useMutation({
    mutationFn: loginUser,
  });
};
