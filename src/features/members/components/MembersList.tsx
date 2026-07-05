import React, { useState } from 'react';
import { MOCK_MEMBERS } from '../../../shared/mocks/identityMock';

export const MembersList: React.FC = () => {
  const [memberSearchQuery, setMemberSearchQuery] = useState('');

  const filteredMembers = MOCK_MEMBERS.filter((member) => {
    return member.name.toLowerCase().includes(memberSearchQuery.toLowerCase()) ||
           member.email.toLowerCase().includes(memberSearchQuery.toLowerCase()) ||
           member.role.toLowerCase().includes(memberSearchQuery.toLowerCase());
  });

  return (
    <div className="flex flex-col gap-lg text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-md">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface">Team Members</h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-xs">Manage workspace access and permissions.</p>
        </div>
        <button className="bg-[#113346] text-white font-semibold text-xs px-md py-sm rounded flex items-center gap-xs hover:bg-[#123749] transition-colors w-fit cursor-pointer">
          <span className="material-symbols-outlined text-[18px]">add</span>
          Invite Member
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white border border-outline-variant rounded-t-lg p-md flex flex-col sm:flex-row gap-md justify-between items-center shadow-sm">
        <div className="relative w-full sm:w-96">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">
            search
          </span>
          <input
            className="w-full pl-9 pr-3 py-1 text-sm border border-outline-variant bg-surface-container-low rounded focus:border-[#587c94] focus:ring-1 focus:ring-[#587c94] transition-all outline-none"
            placeholder="Search members..."
            type="text"
            value={memberSearchQuery}
            onChange={(e) => setMemberSearchQuery(e.target.value)}
          />
        </div>
        <button className="bg-white border border-outline-variant text-on-surface font-semibold text-xs px-md py-1.5 rounded flex items-center gap-xs hover:bg-surface-container-low transition-colors justify-center cursor-pointer">
          <span className="material-symbols-outlined text-[18px]">filter_list</span>
          Filter
        </button>
      </div>

      {/* Table */}
      <div className="bg-white border-x border-b border-outline-variant rounded-b-lg overflow-x-auto shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#587c94] text-white border-b border-outline-variant text-xs">
              <th className="py-2.5 px-md w-12"></th>
              <th className="py-2.5 px-md font-medium">User</th>
              <th className="py-2.5 px-md font-medium">Role</th>
              <th className="py-2.5 px-md font-medium">Access Scope</th>
              <th className="py-2.5 px-md font-medium">Status</th>
              <th className="py-2.5 px-md text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm text-on-surface divide-y divide-outline-variant">
            {filteredMembers.map((member) => (
              <tr key={member.id} className="hover:bg-surface-container-low transition-colors group">
                <td className="py-3 px-md">
                  <div className="w-8 h-8 rounded-full bg-[#587c94]/10 text-[#587c94] flex items-center justify-center font-bold text-xs">
                    {member.initials}
                  </div>
                </td>
                <td className="py-3 px-md">
                  <div className="font-bold text-on-surface">{member.name}</div>
                  <div className="text-on-surface-variant text-xs">{member.email}</div>
                </td>
                <td className="py-3 px-md">
                  <span className="bg-secondary-container text-on-secondary-container px-sm py-[2px] rounded font-semibold text-xs">
                    {member.role}
                  </span>
                </td>
                <td className="py-3 px-md text-on-surface-variant">{member.accessScope}</td>
                <td className="py-3 px-md">
                  <div className="flex items-center gap-xs">
                    <span className={`w-2 h-2 rounded-full ${member.status === 'Active' ? 'bg-green-500' : 'bg-amber-400'}`}></span>
                    {member.status}
                  </div>
                </td>
                <td className="py-3 px-md text-right">
                  <button className="text-on-surface-variant hover:text-on-surface opacity-0 group-hover:opacity-100 transition-opacity p-xs rounded hover:bg-surface-variant cursor-pointer">
                    <span className="material-symbols-outlined text-[20px]">more_vert</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-right text-xs text-on-surface-variant">
        Showing {filteredMembers.length} of {MOCK_MEMBERS.length} members
      </div>
    </div>
  );
};

export default MembersList;
