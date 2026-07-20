import { useMutation } from '@tanstack/react-query';
import { signup, SignupResponse } from '../api/authApi';
import { useAuthStore } from '../../../store/authStore';

export interface SignupVariables {
  username: string;
  email: string;
  password: string;
  company: string;
}

export function useSignupMutation() {
  const setSession = useAuthStore((s) => s.setSession);

  return useMutation<SignupResponse, Error, SignupVariables>({
    mutationFn: ({ username, email, password, company }: SignupVariables) =>
      signup(username, email, password, company),
    onSuccess: (data) => {
      setSession(data.access_token);
    },
  });
}
