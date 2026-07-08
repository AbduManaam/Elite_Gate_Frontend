import React, { useState } from 'react';
import { useActiveProject } from '../../../shared/hooks/useActiveProject';
import { useRoles } from '../../../shared/hooks/useRoles';
import {
  usePoliciesQuery,
  useCreatePolicyMutation,
  useUpdatePolicyMutation,
  useDeletePolicyMutation
} from '../../policies/hooks/usePolicies';
import { PolicyRecord, PolicyInput } from '../../policies/api/policiesApi';

export const PoliciesOverview: React.FC = () => {
  const { projectId } = useActiveProject();
  const { can } = useRoles();

  const { data: policies, isLoading } = usePoliciesQuery(projectId);
  const createPolicy = useCreatePolicyMutation(projectId ?? '');
  const updatePolicy = useUpdatePolicyMutation(projectId ?? '');
  const deletePolicy = useDeletePolicyMutation(projectId ?? '');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState<PolicyRecord | null>(null);
  const [form, setForm] = useState<PolicyInput>({
    name: '',
    auth_required: false,
    rate_limit_rpm: 100,
    allowed_origins: ['*'],
    allowed_roles: [],
    allowed_scopes: [],
  });

  const [originsText, setOriginsText] = useState('*');

  const openCreate = () => {
    setEditingPolicy(null);
    setForm({
      name: '',
      auth_required: false,
      rate_limit_rpm: 100,
      allowed_origins: ['*'],
      allowed_roles: [],
      allowed_scopes: [],
    });
    setOriginsText('*');
    setIsModalOpen(true);
  };

  const openEdit = (p: PolicyRecord) => {
    setEditingPolicy(p);
    setForm({
      name: p.name,
      auth_required: p.auth_required,
      rate_limit_rpm: p.rate_limit_rpm,
      allowed_origins: p.allowed_origins ?? [],
      allowed_roles: p.allowed_roles ?? [],
      allowed_scopes: p.allowed_scopes ?? [],
    });
    setOriginsText(p.allowed_origins?.join(', ') ?? '*');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const origins = originsText.split(',').map((s) => s.trim()).filter(Boolean);
    const payload = { ...form, allowed_origins: origins };

    if (editingPolicy) {
      updatePolicy.mutate({ id: editingPolicy.id, input: payload }, {
        onSuccess: () => setIsModalOpen(false),
      });
    } else {
      createPolicy.mutate(payload, {
        onSuccess: () => setIsModalOpen(false),
      });
    }
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete policy "${name}"?`)) {
      deletePolicy.mutate(id);
    }
  };

  return (
    <div className="bg-white border border-outline-variant rounded-xl shadow-sm overflow-hidden text-left">
      <div className="p-lg border-b border-outline-variant flex justify-between items-center bg-white">
        <div>
          <h3 className="font-headline-md text-headline-md text-on-surface">Policies</h3>
          <p className="text-xs text-on-surface-variant mt-1">Configure rate limits, authentication, and access control templates.</p>
        </div>
        {can('editor') && projectId && (
          <button
            onClick={openCreate}
            className="px-3 py-1.5 bg-[#113346] text-white font-semibold text-xs rounded hover:bg-[#123749] transition-colors cursor-pointer"
          >
            Create Policy
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        {isLoading && <p className="p-lg text-center text-sm text-on-surface-variant">Loading policies...</p>}
        
        {!isLoading && (!policies || policies.length === 0) && (
          <p className="p-xl text-center text-sm text-on-surface-variant">No policies created yet. Create one to apply rate limits or auth rules to routes.</p>
        )}

        {!isLoading && policies && policies.length > 0 && (
          <table className="w-full text-left border-collapse">
            <thead className="bg-surface-container-low border-b border-outline-variant text-xs font-semibold text-on-surface-variant">
              <tr>
                <th className="py-2.5 px-md">Policy Name</th>
                <th className="py-2.5 px-md">Rate Limit</th>
                <th className="py-2.5 px-md">Auth Required</th>
                <th className="py-2.5 px-md">Allowed Origins</th>
                {can('editor') && <th className="py-2.5 px-md text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="font-mono text-xs text-on-surface divide-y divide-outline-variant">
              {policies.map((p) => (
                <tr key={p.id} className="hover:bg-surface-container-low transition-colors">
                  <td className="py-3 px-md font-semibold text-[#587c94] font-sans">{p.name}</td>
                  <td className="py-3 px-md">{p.rate_limit_rpm} RPM</td>
                  <td className="py-3 px-md font-sans">{p.auth_required ? 'Yes' : 'No'}</td>
                  <td className="py-3 px-md truncate max-w-xs">{p.allowed_origins?.join(', ') || '*'}</td>
                  {can('editor') && (
                    <td className="py-3 px-md text-right font-sans">
                      <div className="flex justify-end gap-sm">
                        <button
                          onClick={() => openEdit(p)}
                          className="px-2 py-1 text-xs border border-outline-variant rounded hover:bg-surface-container cursor-pointer transition-colors"
                        >
                          Edit
                        </button>
                        {can('owner') && (
                          <button
                            onClick={() => handleDelete(p.id, p.name)}
                            disabled={deletePolicy.isPending}
                            className="px-2 py-1 text-xs bg-error/10 hover:bg-error text-error hover:text-white border border-error/20 rounded cursor-pointer transition-all"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-md">
          <form onSubmit={handleSubmit} className="bg-white border border-outline-variant rounded-xl p-lg shadow-2xl w-[400px] max-w-full flex flex-col gap-md">
            <h3 className="font-headline-md text-headline-md">{editingPolicy ? 'Edit Policy' : 'New Policy'}</h3>
            
            <label className="flex flex-col gap-xs text-xs">
              Policy Name
              <input
                required
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="border border-outline-variant rounded px-2.5 py-1.5 text-sm outline-none"
              />
            </label>

            <label className="flex flex-col gap-xs text-xs">
              Rate Limit (Requests per minute)
              <input
                type="number"
                min={1}
                required
                value={form.rate_limit_rpm}
                onChange={(e) => setForm((f) => ({ ...f, rate_limit_rpm: parseInt(e.target.value) || 100 }))}
                className="border border-outline-variant rounded px-2.5 py-1.5 text-sm outline-none"
              />
            </label>

            <label className="flex items-center gap-sm text-sm py-1 cursor-pointer">
              <input
                type="checkbox"
                checked={form.auth_required}
                onChange={(e) => setForm((f) => ({ ...f, auth_required: e.target.checked }))}
                className="w-4 h-4 rounded border-outline-variant text-[#113346] focus:ring-[#113346]"
              />
              Require Authentication (JWT)
            </label>

            <label className="flex flex-col gap-xs text-xs">
              CORS Allowed Origins (comma separated)
              <input
                required
                value={originsText}
                onChange={(e) => setOriginsText(e.target.value)}
                className="border border-outline-variant rounded px-2.5 py-1.5 text-sm outline-none"
              />
            </label>

            {createPolicy.error && <p className="text-error text-xs">{(createPolicy.error as any).message}</p>}
            {updatePolicy.error && <p className="text-error text-xs">{(updatePolicy.error as any).message}</p>}

            <div className="flex justify-end gap-sm mt-sm">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-3 py-1.5 text-xs text-on-surface-variant">
                Cancel
              </button>
              <button
                type="submit"
                disabled={createPolicy.isPending || updatePolicy.isPending}
                className="bg-[#113346] text-white px-3 py-1.5 rounded text-xs font-semibold disabled:opacity-50"
              >
                {createPolicy.isPending || updatePolicy.isPending ? 'Saving...' : 'Save Policy'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
