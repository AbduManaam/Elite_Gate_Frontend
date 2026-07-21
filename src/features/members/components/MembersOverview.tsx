import React, { useState } from 'react';
import { useActiveProject } from '../../../shared/hooks/useActiveProject';
import { useRoles } from '../../../shared/hooks/useRoles';
import {
  useMembersQuery,
  useInviteMemberMutation,
  useChangeMemberRoleMutation,
  useRemoveMemberMutation
} from '../../members/hooks/useMembers';
import { lookupMemberByEmail, UserLookupResult } from '../../members/api/membersApi';
import { ProjectMember } from '../../members/api/membersApi';
import { ConfirmModal } from '../../../shared/components/ui/ConfirmModal';
import { toApiError } from '../../../shared/api/apiError';

export const MembersOverview: React.FC = () => {
  const { projectId } = useActiveProject();
  const { can } = useRoles();

  const { data: members, isLoading } = useMembersQuery(projectId ?? '');
  const inviteMember = useInviteMemberMutation(projectId ?? '');
  const changeRole = useChangeMemberRoleMutation(projectId ?? '');
  const removeMember = useRemoveMemberMutation(projectId ?? '');

  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [emailQuery, setEmailQuery] = useState('');
  const [lookupResult, setLookupResult] = useState<UserLookupResult | null>(null);
  const [lookupError, setLookupError] = useState('');
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [selectedRole, setSelectedRole] = useState('viewer');

  const [editingMember, setEditingMember] = useState<ProjectMember | null>(null);
  const [editRoleForm, setEditRoleForm] = useState('viewer');
  const [memberToRemove, setMemberToRemove] = useState<ProjectMember | null>(null);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailQuery) return;
    setIsLookingUp(true);
    setLookupError('');
    setLookupResult(null);
    try {
      const res = await lookupMemberByEmail(projectId ?? '', emailQuery);
      setLookupResult(res);
    } catch (err: unknown) {
      setLookupError(toApiError(err).message || 'No user found with this email.');
    } finally {
      setIsLookingUp(false);
    }
  };

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lookupResult) return;
    inviteMember.mutate({
      email: lookupResult.user.email,
      role: selectedRole,
    }, {
      onSuccess: () => {
        setIsInviteOpen(false);
        setEmailQuery('');
        setLookupResult(null);
      },
    });
  };

  const handleRemove = (m: ProjectMember) => {
    setMemberToRemove(m);
  };

  const handleRemoveConfirm = () => {
    if (!memberToRemove) return;
    removeMember.mutate(memberToRemove.admin_user_id, {
      onSuccess: () => {
        setMemberToRemove(null);
      },
    });
  };

  const handleRoleChangeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember) return;
    changeRole.mutate({
      memberId: editingMember.admin_user_id,
      role: editRoleForm,
    }, {
      onSuccess: () => {
        setEditingMember(null);
      },
    });
  };

  return (
    <div className="bg-white border border-outline-variant rounded-xl shadow-sm overflow-hidden text-left">
      <div className="p-lg border-b border-outline-variant flex flex-col items-start sm:flex-row sm:justify-between sm:items-center gap-md bg-white">
        <div className="min-w-0">
          <h3 className="font-headline-md text-headline-md text-on-surface">Team Collaboration</h3>
          <p className="text-xs text-[#587c94] mt-1">Manage project members, lookup active users, and assign access roles.</p>
        </div>
        {can('owner') && projectId && (
          <button
            onClick={() => {
              setIsInviteOpen(true);
              setLookupResult(null);
              setLookupError('');
              setEmailQuery('');
            }}
            className="px-3 py-1.5 bg-[#113346] text-white font-semibold text-xs rounded hover:bg-[#123749] transition-colors cursor-pointer w-full sm:w-auto shrink-0 whitespace-nowrap text-center"
          >
            Invite Member
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        {isLoading && <p className="p-lg text-center text-sm text-on-surface-variant">Loading members...</p>}
        
        {!isLoading && (!members || members.length === 0) && (
          <p className="p-xl text-center text-sm text-on-surface-variant">No members found.</p>
        )}

        {!isLoading && members && members.length > 0 && (
          <table className="w-full text-left border-collapse">
            <thead className="bg-surface-container-low border-b border-outline-variant text-xs font-semibold text-on-surface-variant">
              <tr>
                <th className="py-2.5 px-md">Email / Username</th>
                <th className="py-2.5 px-md">Role Badge</th>
                <th className="py-2.5 px-md">Joined At</th>
                {can('owner') && <th className="py-2.5 px-md text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="font-mono text-xs text-on-surface divide-y divide-outline-variant">
              {members.map((m) => (
                <tr key={m.admin_user_id} className="hover:bg-surface-container-low transition-colors">
                  <td className="py-3 px-md font-sans">
                    <div className="flex flex-col">
                      <span className="font-semibold text-on-surface">{m.email}</span>
                      <span className="text-[10px] text-on-surface-variant">Username: {m.username}</span>
                    </div>
                  </td>
                  <td className="py-3 px-md font-sans">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      m.role === 'owner' ? 'bg-purple-100 text-purple-800' : m.role === 'editor' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {m.role}
                    </span>
                  </td>
                  <td className="py-3 px-md font-sans">
                    {m.joined_at && !Number.isNaN(new Date(m.joined_at).getTime())
                      ? new Date(m.joined_at).toLocaleDateString()
                      : '—'}
                  </td>
                  {can('owner') && (
                    <td className="py-3 px-md text-right font-sans">
                      <div className="flex justify-end gap-sm">
                        <button
                          onClick={() => {
                            setEditingMember(m);
                            setEditRoleForm(m.role);
                          }}
                          className="px-2 py-1 text-xs border border-outline-variant rounded hover:bg-surface-container cursor-pointer transition-colors"
                        >
                          Change Role
                        </button>
                        <button
                          onClick={() => handleRemove(m)}
                          disabled={removeMember.isPending}
                          className="px-2 py-1 text-xs bg-error/10 hover:bg-error text-error border border-error/20 rounded cursor-pointer transition-all"
                        >
                          Remove
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Invite Member Modal */}
      {isInviteOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-md">
          <div className="bg-white border border-outline-variant rounded-xl p-lg shadow-2xl w-[400px] max-w-full flex flex-col gap-md">
            <h3 className="font-headline-md text-headline-md">Invite Member</h3>
            
            <form onSubmit={handleLookup} className="flex gap-sm items-end">
              <label className="flex flex-col gap-xs text-xs flex-1">
                Lookup User Email
                <input
                  required
                  type="email"
                  placeholder="name@company.com"
                  value={emailQuery}
                  onChange={(e) => setEmailQuery(e.target.value)}
                  className="border border-outline-variant rounded px-2.5 py-1.5 text-sm outline-none"
                />
              </label>
              <button
                type="submit"
                disabled={isLookingUp}
                className="px-3 py-2 bg-[#113346] text-white rounded text-xs font-semibold h-[38px] cursor-pointer disabled:opacity-50"
              >
                {isLookingUp ? 'Searching...' : 'Lookup'}
              </button>
            </form>

            {lookupError && <p className="text-error text-xs">{lookupError}</p>}

            {lookupResult && (
              <form onSubmit={handleInviteSubmit} className="flex flex-col gap-md pt-sm border-t border-outline-variant">
                <div className="bg-surface-container-low border border-outline-variant rounded p-sm text-xs font-sans">
                  <p className="font-semibold text-on-surface">Found User Details:</p>
                  <p className="text-on-surface-variant mt-1">Username: {lookupResult.user.username}</p>
                  <p className="text-on-surface-variant">Email: {lookupResult.user.email}</p>
                </div>

                <label className="flex flex-col gap-xs text-xs">
                  Assign Project Membership Role
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="border border-outline-variant rounded px-2.5 py-1.5 text-sm outline-none bg-transparent"
                  >
                    <option value="viewer">Viewer (Read-only access)</option>
                    <option value="editor">Editor (Full configuration access)</option>
                    <option value="owner">Owner (Full configuration + team management)</option>
                  </select>
                </label>

                {inviteMember.error && <p className="text-error text-xs">{toApiError(inviteMember.error).message}</p>}

                <div className="flex justify-end gap-sm mt-sm">
                  <button type="button" onClick={() => setIsInviteOpen(false)} className="px-3 py-1.5 text-xs text-on-surface-variant">
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={inviteMember.isPending}
                    className="bg-[#113346] text-white px-3 py-1.5 rounded text-xs font-semibold disabled:opacity-50"
                  >
                    {inviteMember.isPending ? 'Inviting...' : 'Add to Project'}
                  </button>
                </div>
              </form>
            )}

            {!lookupResult && (
              <div className="flex justify-end mt-sm">
                <button onClick={() => setIsInviteOpen(false)} className="px-3 py-1.5 text-xs border border-outline-variant rounded hover:bg-surface-container cursor-pointer transition-colors">
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Change Role Modal */}
      {editingMember && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-md">
          <form onSubmit={handleRoleChangeSubmit} className="bg-white border border-outline-variant rounded-xl p-lg shadow-2xl w-[400px] max-w-full flex flex-col gap-md">
            <h3 className="font-headline-md text-headline-md">Change Member Role</h3>
            <p className="text-xs text-on-surface-variant">User: <span className="font-bold">{editingMember.email}</span></p>
            
            <label className="flex flex-col gap-xs text-xs">
              Project Membership Role
              <select
                value={editRoleForm}
                onChange={(e) => setEditRoleForm(e.target.value)}
                className="border border-outline-variant rounded px-2.5 py-1.5 text-sm outline-none bg-transparent"
              >
                <option value="viewer">Viewer (Read-only access)</option>
                <option value="editor">Editor (Full configuration access)</option>
                <option value="owner">Owner (Full configuration + team management)</option>
              </select>
            </label>

            {changeRole.error && <p className="text-error text-xs">{toApiError(changeRole.error).message}</p>}

            <div className="flex justify-end gap-sm mt-sm">
              <button type="button" onClick={() => setEditingMember(null)} className="px-3 py-1.5 text-xs text-on-surface-variant">
                Cancel
              </button>
              <button
                type="submit"
                disabled={changeRole.isPending}
                className="bg-[#113346] text-white px-3 py-1.5 rounded text-xs font-semibold disabled:opacity-50"
              >
                {changeRole.isPending ? 'Updating...' : 'Update Role'}
              </button>
            </div>
          </form>
        </div>
      )}

      <ConfirmModal
        isOpen={memberToRemove !== null}
        title="Remove Team Member"
        isDanger
        message={
          <span>
            Are you sure you want to remove <span className="font-bold">{memberToRemove?.email}</span> from this project?
          </span>
        }
        description="Removing this user will immediately revoke their access to this project. They will no longer be able to view or edit gateway configuration settings."
        confirmLabel="Remove Access"
        cancelLabel="Cancel"
        onConfirm={handleRemoveConfirm}
        onClose={() => setMemberToRemove(null)}
        isPending={removeMember.isPending}
      />
    </div>
  );
};
