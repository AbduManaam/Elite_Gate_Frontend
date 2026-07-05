import React, { useState } from 'react';

export interface LoginFormProps {
  readonly onLogin: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Please initialize all security fields.');
      return;
    }
    // Simple mock authentication success
    onLogin();
  };

  return (
    <div className="bg-surface-container-low border border-outline-variant/30 rounded-xl p-xl shadow-2xl relative overflow-hidden animate-fade-in-up stagger-2">
      {/* Subtle Form Glow */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/5 blur-[100px] rounded-full"></div>
      
      <div className="mb-lg relative z-10 text-left">
        <h2 className="font-headline-md text-headline-md text-on-surface mb-xs tracking-tight">Access Terminal</h2>
        <p className="font-body-md text-sm text-on-surface-variant">Initialize secure authentication sequence.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-md relative z-10 text-left">
        {error && (
          <div className="text-error font-body-sm text-sm border border-error/20 bg-error/5 p-sm rounded animate-reveal-sequential">
            {error}
          </div>
        )}
        
        {/* User Name Input (Reveal Sequential) */}
        <div className="flex flex-col gap-xs animate-reveal-sequential stagger-3">
          <label className="font-label-mono text-[11px] uppercase tracking-widest text-[#94A39E]" htmlFor="email">
            User Name
          </label>
          <div className="relative group input-glow">
            <span className="material-symbols-outlined absolute left-sm top-1/2 transform -translate-y-1/2 text-[#94A39E] transition-colors duration-300 group-focus-within:text-primary">
              terminal
            </span>
            <input
              className="w-full bg-[#00120b] border border-[#0F4032] text-on-surface font-label-mono text-sm rounded pl-xl py-3 focus:border-primary focus:ring-1 focus:ring-primary/20 focus:outline-none transition-all duration-300 placeholder:text-[#3C4A46]"
              id="email"
              placeholder="User Name"
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setError('');
              }}
            />
          </div>
        </div>

        {/* Password Input (Reveal Sequential) */}
        <div className="flex flex-col gap-xs animate-reveal-sequential stagger-4">
          <div className="flex justify-between items-center">
            <label className="font-label-mono text-[11px] uppercase tracking-widest text-[#94A39E]" htmlFor="password">
              Password
            </label>
            <a
              className="font-label-mono text-[11px] text-primary hover:text-primary-fixed-dim transition-colors duration-300"
              href="#recover"
              onClick={(e) => e.preventDefault()}
            >
              RECOVER
            </a>
          </div>
          <div className="relative group input-glow">
            <span className="material-symbols-outlined absolute left-sm top-1/2 transform -translate-y-1/2 text-[#94A39E] transition-colors duration-300 group-focus-within:text-primary">
              key
            </span>
            <input
              className="w-full bg-[#00120b] border border-[#0F4032] text-on-surface font-body-md text-sm rounded pl-xl py-3 focus:border-primary focus:ring-1 focus:ring-primary/20 focus:outline-none transition-all duration-300 placeholder:text-[#3C4A46]"
              id="password"
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
            />
          </div>
        </div>

        {/* Primary Action */}
        <button
          type="submit"
          className="w-full mt-sm bg-primary text-[#00120b] font-bold text-sm py-3 rounded-lg hover:brightness-110 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(195,255,146,0.4)] transition-all duration-300 animate-reveal-sequential stagger-5 flex justify-center items-center gap-sm active:scale-[0.98] cursor-pointer"
        >
          LOGIN
          <span className="material-symbols-outlined text-[18px]">bolt</span>
        </button>

        <div className="relative my-md animate-reveal-sequential stagger-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#0F4032]"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-surface-container-low px-sm font-label-mono text-[10px] text-[#94A39E] tracking-widest">
              FEDERATED AUTH
            </span>
          </div>
        </div>

        {/* Secondary Action */}
        <button
          type="button"
          onClick={onLogin}
          className="w-full bg-transparent border border-[#0F4032] text-on-surface font-label-mono text-[13px] py-3 rounded-lg hover:bg-surface-variant hover:scale-[1.01] transition-all duration-300 animate-reveal-sequential stagger-5 flex justify-center items-center gap-sm cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">fingerprint</span>
          SSO LOGIN
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
