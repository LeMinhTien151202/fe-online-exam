import { useMutation } from "@tanstack/react-query";
import { registerUser } from "../services/registerApi";

export const useRegister = () => {
  return useMutation({
    mutationFn: registerUser,
  });
};
