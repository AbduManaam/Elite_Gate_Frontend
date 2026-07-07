import React, { useState } from 'react';
import LoginForm from '../components/LoginForm';
import SignupForm from '../components/SignupForm';

export interface LoginPageProps {
  readonly onLoginSuccess: () => void;
  readonly className?: string;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, className = '' }) => {
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  return (
    <div className={`bg-[#001710] text-[#cbe9dc] min-h-screen font-body-md relative w-full flex flex-col justify-center select-none ${className}`}>
      {/* Ambient Motion: Scanning Line in isolated non-overflowing container */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="scanning-line animate-scan-line"></div>
      </div>

      {/* Background Grid */}
      <div className="absolute inset-0 opacity-5 pointer-events-none z-0">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid-bg" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#0F4032" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-bg)" />
        </svg>
      </div>

      {/* Main Content */}
      <main className="relative z-10 min-h-screen flex items-center justify-center p-margin-mobile md:p-margin-desktop">
        <div className="w-full max-w-[1100px] flex flex-col md:flex-row items-center gap-xl md:gap-[120px]">

          {/* Left Side: Branding & Messaging */}
          <div className="w-full md:w-1/2 flex flex-col justify-center text-left">
            {/* Entrance Animation: Logo fade and scale */}
            <div className="flex items-center gap-sm mb-lg animate-fade-in-scale">
              <div className="relative w-48 h-48 mb-sm">
                {/* Ambient Motion: Pulse Glow on Logo */}
                <img
                  alt="Elite Gate Logo"
                  className="w-full h-full object-contain animate-pulse-glow"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCOdQwzvRONWSkcJhvu1gd7GmDu44-9zIHA_YY1tkebqZIEuX-_ksC_NVhzj3TMy5Tqt7qgFqEZZy-PP7s9ySur-0X4BruW4iD0aci8Kuzu_omp3QwMeKWWme4b-CVoewGDEl7GN_V_gWGiNYR9CSnSXGvSCR6nrxrR24ejKn-XeZg7fI-nDRMnSDnoeu7kxP948dv9yoPG6BbgMqYBBFg_QXb5Dz2SaxYQPwp2ceclL10cMOWffknoF1JOMjFksjubpDfAAgnRfKOr"
                />
              </div>
            </div>
            {/* Entrance Animation: Delayed reveal. Text is colored white/green for readability on dark background */}
            <h1 className="font-display-lg text-display-lg text-[#cbe9dc] mb-xl leading-[1.1] tracking-tight animate-fade-in-up stagger-1">
              Next-gen API Gateway for <span className="text-white italic font-semibold">hybrid-cloud</span> architectures.
            </h1>
          </div>

          {/* Right Side: Form wrapper (login/signup toggled dynamically) */}
          <div className="w-full md:w-auto md:min-w-[420px] relative z-10">
            {authMode === 'login' ? (
              <LoginForm onLoginSuccess={onLoginSuccess} onToggleSignup={() => setAuthMode('signup')} />
            ) : (
              <SignupForm onSignupSuccess={onLoginSuccess} onToggleLogin={() => setAuthMode('login')} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;
