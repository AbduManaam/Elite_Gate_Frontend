import { useMutation } from '@tanstack/react-query';
import { resetPassword, ResetPasswordResponse } from '../api/authApi';

export interface ResetPasswordVariables {
  token: string;
  newPassword: string;
}

export function useResetPasswordMutation() {
  return useMutation<ResetPasswordResponse, Error, ResetPasswordVariables>({
    mutationFn: ({ token, newPassword }: ResetPasswordVariables) =>
      resetPassword(token, newPassword),
  });
}
