import React, { useState } from 'react';
import LoginForm from '../components/LoginForm';
import SignupForm from '../components/SignupForm';
import loginBanner from '../../../assets/login_gateway_banner.png';
import logoImg from '../../../assets/logo.png';

export interface LoginPageProps {
  readonly onLoginSuccess: () => void;
  readonly className?: string;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, className = '' }) => {
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  return (
    <div className={`bg-[#f3f5f8] text-[#171c1f] min-h-screen font-body-md w-full flex items-center justify-center p-4 md:p-8 select-none ${className}`}>
      {/* Outer rounded card */}
      <div className="w-full max-w-[1020px] bg-white rounded-[32px] overflow-hidden shadow-[0_24px_64px_rgba(0,0,0,0.06)] flex flex-col md:flex-row min-h-[620px] items-stretch">
        
        {/* Left Side: Brand Banner */}
        <div 
          className="hidden md:flex md:w-1/2 flex-col justify-between px-12 pb-12 pt-6 relative bg-center select-none"
          style={{ 
            backgroundImage: `url(${loginBanner})`,
            backgroundSize: '115% 100%'
          }}
        >
          {/* Top Brand Logo */}
          <div className="flex items-center gap-2">
            <img src={logoImg} alt="Elite Gateway Logo" className="w-16 h-16 object-contain" />
            <span 
              className="font-semibold tracking-[0.25em] text-white text-base"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              ELITE <span className="text-[#E5835C]">GATEWAY</span>
            </span>
          </div>

          {/* Bottom Headline */}
          <div className="text-left mt-auto">
            <h1 
              className="text-3xl font-semibold leading-[1.15] text-[#ECA384] tracking-tight"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              Secure Your Digital<br />Ecosystem
            </h1>
          </div>
        </div>

        {/* Right Side: Authentication Forms */}
        <div className="w-full md:w-1/2 bg-white flex flex-col justify-center">
          {authMode === 'login' ? (
            <LoginForm onLoginSuccess={onLoginSuccess} onToggleSignup={() => setAuthMode('signup')} />
          ) : (
            <SignupForm onSignupSuccess={onLoginSuccess} onToggleLogin={() => setAuthMode('login')} />
          )}
        </div>

      </div>
    </div>
  );
};

export default LoginPage;
