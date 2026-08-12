import { useMutation } from '@tanstack/react-query';
import { verifyEmail, type VerifyEmailResponse } from '../api/authApi';

export function useVerifyEmailMutation() {
  return useMutation<VerifyEmailResponse, Error, string>({
    mutationFn: (token: string) => verifyEmail(token),
  });
}
