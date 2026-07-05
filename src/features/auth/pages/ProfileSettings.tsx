import React, { useState } from 'react';
import { MOCK_SESSIONS, MOCK_PERSONAL_TOKENS, SessionData, PersonalTokenData } from '../../../shared/mocks/settingsMock';

export const ProfileSettings: React.FC = () => {
  const [profileName, setProfileName] = useState('Abdu Manaam');
  const [personalTokens, setPersonalTokens] = useState<readonly PersonalTokenData[]>(MOCK_PERSONAL_TOKENS);
  const [sessions, setSessions] = useState<readonly SessionData[]>(MOCK_SESSIONS);

  const handleRevokeSession = (sessionId: string) => {
    setSessions((prev) => prev.filter((session) => session.id !== sessionId));
  };

  const handleRevokeToken = (tokenId: string) => {
    setPersonalTokens((prev) => prev.filter((token) => token.id !== tokenId));
  };

  return (
    <div className="w-full max-w-[1600px] flex flex-col gap-stack-lg mx-auto text-left">
      {/* Header */}
      <div className="mb-lg">
        <h2 className="font-headline-lg text-headline-lg text-on-surface">User Profile</h2>
        <p className="font-body-md text-body-md text-on-surface-variant mt-xs">Manage your personal information and security preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        {/* Left Column: Profile Card */}
        <div className="lg:col-span-4 flex flex-col gap-gutter">
          <div className="bg-white border border-outline-variant rounded-xl p-lg shadow-sm">
            <div className="flex flex-col items-center text-center pb-md border-b border-outline-variant">
              <div className="relative mb-md">
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-primary-container p-[2px]">
                  <div className="w-full h-full rounded-full overflow-hidden bg-surface-container flex items-center justify-center font-bold text-xl text-[#587c94]">
                    AM
                  </div>
                </div>
                <button className="absolute bottom-0 right-0 bg-[#587c94] text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-[#123749] transition-colors border-2 border-white cursor-pointer">
                  <span className="material-symbols-outlined text-[16px]">edit</span>
                </button>
              </div>
              <h3 className="font-headline-md text-headline-md text-on-surface">{profileName}</h3>
              <p className="text-xs text-on-surface-variant mt-xs">admin@elitegate.io</p>
              <span className="mt-sm inline-flex items-center gap-xs px-2 py-1 rounded bg-secondary-container text-on-secondary-container font-semibold text-xs border border-outline-variant">
                <span className="material-symbols-outlined text-[14px]">shield_person</span> Super Admin
              </span>
            </div>
            
            <div className="pt-md flex flex-col gap-md">
              <div>
                <label className="font-mono text-xs text-on-surface-variant block mb-xs font-semibold">Full Name</label>
                <input
                  className="w-full bg-white border border-outline-variant rounded-lg px-md py-1.5 text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                />
              </div>
              <div>
                <label className="font-mono text-xs text-on-surface-variant block mb-xs font-semibold">Email Address</label>
                <input
                  className="w-full bg-slate-100 border border-outline-variant rounded-lg px-md py-1.5 text-sm text-outline cursor-not-allowed"
                  disabled
                  type="email"
                  value="admin@elitegate.io"
                />
              </div>
              <div className="pt-sm">
                <button className="w-full bg-white border border-outline-variant text-on-surface py-1.5 rounded-lg hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-sm cursor-pointer text-sm font-semibold">
                  <span className="material-symbols-outlined text-[18px]">key</span>
                  Reset Password
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Security */}
        <div className="lg:col-span-8 flex flex-col gap-gutter">
          {/* MFA Card */}
          <div className="bg-white border border-outline-variant rounded-xl p-lg shadow-sm flex items-start justify-between gap-md">
            <div className="flex gap-md">
              <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary shrink-0">
                <span className="material-symbols-outlined text-[#587c94]">phonelink_lock</span>
              </div>
              <div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-sm">
                  Multi-Factor Authentication
                  <span className="inline-flex items-center px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-mono text-[9px] uppercase border border-emerald-200">
                    Enabled
                  </span>
                </h3>
                <p className="text-xs text-on-surface-variant mt-xs max-w-lg">
                  Your account is protected with an additional layer of security. Authentication is currently configured via Authenticator App.
                </p>
              </div>
            </div>
            <button className="bg-white border border-outline-variant text-on-surface font-semibold px-md py-1.5 rounded-lg hover:bg-surface-container-low transition-colors shrink-0 text-xs cursor-pointer">
              Manage
            </button>
          </div>

          {/* Access Tokens */}
          <div className="bg-white border border-outline-variant rounded-xl shadow-sm overflow-hidden">
            <div className="p-lg border-b border-outline-variant flex justify-between items-center bg-white">
              <div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface">Personal Access Tokens</h3>
                <p className="text-xs text-on-surface-variant mt-xs">Tokens you have generated that can be used to access the API.</p>
              </div>
              <button className="bg-[#113346] text-white font-semibold px-md py-1.5 rounded-lg hover:bg-[#123749] transition-colors flex items-center gap-xs text-xs cursor-pointer">
                <span className="material-symbols-outlined text-[18px]">add</span> Generate New Token
              </button>
            </div>
            
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low font-semibold text-xs text-on-surface-variant border-b border-outline-variant">
                    <th className="px-lg py-2 uppercase tracking-wider font-medium">Token Name</th>
                    <th className="px-lg py-2 uppercase tracking-wider font-medium">Last Used</th>
                    <th className="px-lg py-2 uppercase tracking-wider font-medium">Expires</th>
                    <th className="px-lg py-2 uppercase tracking-wider text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-xs text-on-surface divide-y divide-outline-variant">
                  {personalTokens.map((token) => (
                    <tr key={token.id} className="hover:bg-surface-container-low transition-colors group">
                      <td className="px-lg py-3 font-medium">
                        <div className="flex items-center gap-sm">
                          <span className="material-symbols-outlined text-outline text-[18px]">terminal</span>
                          <span>{token.name}</span>
                        </div>
                      </td>
                      <td className="px-lg py-3 text-on-surface-variant">{token.lastUsed}</td>
                      <td className="px-lg py-3 text-on-surface-variant">{token.expires}</td>
                      <td className="px-lg py-3 text-right">
                        <button
                          onClick={() => handleRevokeToken(token.id)}
                          className="text-outline hover:text-error transition-colors p-1 rounded-full hover:bg-error-container cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Active Sessions */}
          <div className="bg-white border border-outline-variant rounded-xl p-lg shadow-sm">
            <div className="mb-md">
              <h3 className="font-headline-sm text-headline-sm text-on-surface">Active Sessions</h3>
              <p className="text-xs text-on-surface-variant mt-xs">Devices currently logged into your account.</p>
            </div>
            <div className="flex flex-col gap-sm">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className={`flex items-center justify-between p-md border border-outline-variant rounded-lg hover:bg-surface-container-low transition-colors ${
                    session.isCurrent ? 'border-l-4 border-l-[#587c94] bg-surface-container-low/30' : ''
                  }`}
                >
                  <div className="flex items-start gap-md">
                    <span className={`material-symbols-outlined text-[24px] ${session.isCurrent ? 'text-[#587c94]' : 'text-outline'}`}>
                      {session.icon}
                    </span>
                    <div>
                      <p className="text-sm text-on-surface font-semibold flex items-center gap-sm">
                        {session.device}
                        {session.isCurrent && (
                          <span className="text-[9px] bg-[#587c94] text-white px-2 py-0.5 rounded-full uppercase tracking-wider font-mono">
                            Current
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-on-surface-variant mt-xs">IP: {session.ip} • {session.location}</p>
                      <p className="text-xs text-outline mt-xs italic">{session.lastActive}</p>
                    </div>
                  </div>
                  {!session.isCurrent && (
                    <button
                      onClick={() => handleRevokeSession(session.id)}
                      className="text-on-surface-variant text-xs font-semibold hover:text-error transition-colors px-2 py-1 border border-transparent hover:border-error-container rounded hover:bg-error-container cursor-pointer"
                    >
                      Revoke
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
