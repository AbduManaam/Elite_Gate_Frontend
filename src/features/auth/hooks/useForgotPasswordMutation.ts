import { useMutation } from '@tanstack/react-query';
import { forgotPassword, ForgotPasswordResponse } from '../api/authApi';

export interface ForgotPasswordVariables {
  email: string;
}

export function useForgotPasswordMutation() {
  return useMutation<ForgotPasswordResponse, Error, ForgotPasswordVariables>({
    mutationFn: ({ email }: ForgotPasswordVariables) => forgotPassword(email),
  });
}
