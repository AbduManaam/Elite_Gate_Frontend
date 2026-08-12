import { useMutation } from '@tanstack/react-query';
import { resendVerification, ResendVerificationResponse } from '../api/authApi';

export function useResendVerificationMutation() {
  return useMutation<ResendVerificationResponse, Error, string>({
    mutationFn: (email: string) => resendVerification(email),
  });
}
