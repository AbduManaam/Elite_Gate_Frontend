import React, { useState } from 'react';
import MembersList from '../components/MembersList';
import { ApiKeysList } from '../../apiKeys';

export const MembersPage: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'Team Members' | 'API Credentials'>('Team Members');

  return (
    <div className="flex-1 flex flex-col w-full">
      {/* Tab Navigation */}
      <div className="flex border-b border-outline-variant mb-xl gap-lg">
        <button
          onClick={() => setActiveSubTab('Team Members')}
          className={`px-lg py-sm font-semibold text-sm transition-colors cursor-pointer border-b-2 ${
            activeSubTab === 'Team Members'
              ? 'text-[#587c94] border-[#587c94]'
              : 'text-on-surface-variant hover:text-[#587c94] border-transparent'
          }`}
        >
          Team Members
        </button>
        <button
          onClick={() => setActiveSubTab('API Credentials')}
          className={`px-lg py-sm font-semibold text-sm transition-colors cursor-pointer border-b-2 ${
            activeSubTab === 'API Credentials'
              ? 'text-[#587c94] border-[#587c94]'
              : 'text-on-surface-variant hover:text-[#587c94] border-transparent'
          }`}
        >
          API Credentials
        </button>
      </div>

      {activeSubTab === 'Team Members' ? (
        <MembersList />
      ) : (
        <ApiKeysList />
      )}
    </div>
  );
};

export default MembersPage;
