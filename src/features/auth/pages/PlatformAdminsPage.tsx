import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { addTeamMemberAdmin } from '../api/authApi';

export const PlatformAdminsPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const registerMut = useMutation({
    mutationFn: () => addTeamMemberAdmin(username, password),
    onSuccess: () => {
      setSuccessMsg(`Successfully added platform admin "${username}".`);
      setUsername('');
      setPassword('');
      setConfirmPassword('');
      setErrorMsg('');
      setTimeout(() => setSuccessMsg(''), 5000);
    },
    onError: (err: any) => {
      setErrorMsg(err.response?.data?.error || 'Failed to add admin user.');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    if (password.length < 8) {
      setErrorMsg('Password must be at least 8 characters long.');
      return;
    }

    registerMut.mutate();
  };

  return (
    <div className="flex flex-col gap-md text-left max-w-xl">
      <div>
        <h2 className="font-headline-lg text-headline-lg text-on-surface">Add Platform Admin</h2>
        <p className="text-sm text-on-surface-variant mt-0.5">Register a new administrator with complete system privileges.</p>
      </div>

      <div className="bg-white border border-outline-variant rounded-xl p-lg shadow-xs flex flex-col gap-md">
        <h3 className="font-semibold text-sm text-on-surface">Create Administrator Credentials</h3>

        {errorMsg && (
          <div className="text-error text-xs font-semibold bg-red-50 border border-red-200 p-sm rounded-lg">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="text-green-600 text-xs font-semibold bg-green-50 border border-green-200 p-sm rounded-lg">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-md">
          <label className="flex flex-col gap-1.5 text-xs font-semibold text-on-surface-variant uppercase tracking-wide">
            Admin Email / Username
            <input
              required
              type="email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="operator@elitegate.com"
              className="border border-outline-variant rounded-lg px-3 py-2 text-sm text-on-surface font-normal outline-none focus:border-[#587c94] focus:ring-1 focus:ring-[#587c94] transition-all"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-xs font-semibold text-on-surface-variant uppercase tracking-wide">
            Secret Password
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="border border-outline-variant rounded-lg px-3 py-2 text-sm text-on-surface font-normal outline-none focus:border-[#587c94] focus:ring-1 focus:ring-[#587c94] transition-all"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-xs font-semibold text-on-surface-variant uppercase tracking-wide">
            Confirm Secret Password
            <input
              required
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="border border-outline-variant rounded-lg px-3 py-2 text-sm text-on-surface font-normal outline-none focus:border-[#587c94] focus:ring-1 focus:ring-[#587c94] transition-all"
            />
          </label>

          <button
            type="submit"
            disabled={registerMut.isPending}
            className="mt-sm py-2.5 bg-[#113346] hover:bg-[#123749] text-white text-xs font-semibold rounded-lg shadow-sm cursor-pointer transition-colors disabled:opacity-50"
          >
            {registerMut.isPending ? 'Provisioning Account…' : 'Add Platform Admin'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PlatformAdminsPage;
