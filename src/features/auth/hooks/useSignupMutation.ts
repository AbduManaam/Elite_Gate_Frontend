import { useMutation } from '@tanstack/react-query';
import { signup, SignupResponse } from '../api/authApi';

export interface SignupVariables {
  username: string;
  email: string;
  password: string;
  company: string;
}

export function useSignupMutation() {
  return useMutation<SignupResponse, Error, SignupVariables>({
    mutationFn: ({ username, email, password, company }: SignupVariables) =>
      signup(username, email, password, company),
  });
}
