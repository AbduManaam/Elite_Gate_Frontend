import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginPage } from '../../features/auth';

export const LoginRoute: React.FC = () => {
  const navigate = useNavigate();
  return <LoginPage onLoginSuccess={() => navigate('/', { replace: true })} />;
};
