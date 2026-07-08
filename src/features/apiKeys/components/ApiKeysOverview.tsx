import React, { useState } from 'react';
import { useActiveProject } from '../../../shared/hooks/useActiveProject';
import { useRoles } from '../../../shared/hooks/useRoles';
import {
  useApiKeysQuery,
  useCreateApiKeyMutation,
  useRotateApiKeyMutation,
  useRevokeApiKeyMutation
} from '../../apiKeys/hooks/useApiKeys';
import { ApiKeyRecord } from '../../apiKeys/api/apiKeysApi';

export const ApiKeysOverview: React.FC = () => {
  const { projectId } = useActiveProject();
  const { can } = useRoles();

  const { data: apiKeys, isLoading } = useApiKeysQuery(projectId ?? '');
  const createKey = useCreateApiKeyMutation(projectId ?? '');
  const rotateKey = useRotateApiKeyMutation(projectId ?? '');
  const revokeKey = useRevokeApiKeyMutation(projectId ?? '');

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newKeyDetails, setNewKeyDetails] = useState<{ name: string; key: string } | null>(null);

  const [form, setForm] = useState({
    name: '',
    expires_at: '',
    roles: '',
    scopes: '',
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const rolesArr = form.roles.split(',').map((r) => r.trim()).filter(Boolean);
    const scopesArr = form.scopes.split(',').map((s) => s.trim()).filter(Boolean);

    createKey.mutate({
      name: form.name,
      expires_at: form.expires_at ? new Date(form.expires_at).toISOString() : null,
      roles: rolesArr,
      scopes: scopesArr,
    }, {
      onSuccess: (res) => {
        setIsCreateOpen(false);
        setNewKeyDetails({ name: res.name, key: res.api_key || res.raw_key || '' });
        setForm({ name: '', expires_at: '', roles: '', scopes: '' });
      },
    });
  };

  const handleRotate = (key: ApiKeyRecord) => {
    if (window.confirm(`Are you sure you want to rotate the API key "${key.name}"? The old key will become immediately invalid.`)) {
      rotateKey.mutate(key.id, {
        onSuccess: (res) => {
          setNewKeyDetails({ name: res.name, key: res.api_key || res.raw_key || '' });
        },
      });
    }
  };

  const handleRevoke = (key: ApiKeyRecord) => {
    if (window.confirm(`Are you sure you want to revoke the API key "${key.name}"? This action cannot be undone.`)) {
      revokeKey.mutate(key.id);
    }
  };

  return (
    <div className="bg-white border border-outline-variant rounded-xl shadow-sm overflow-hidden text-left">
      <div className="p-lg border-b border-outline-variant flex justify-between items-center bg-white">
        <div>
          <h3 className="font-headline-md text-headline-md text-on-surface">API Credentials</h3>
          <p className="text-xs text-on-surface-variant mt-1">Manage secure client keys, API key rotation, and client scopes.</p>
        </div>
        {can('editor') && projectId && (
          <button
            onClick={() => setIsCreateOpen(true)}
            className="px-3 py-1.5 bg-[#113346] text-white font-semibold text-xs rounded hover:bg-[#123749] transition-colors cursor-pointer"
          >
            Create API Key
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        {isLoading && <p className="p-lg text-center text-sm text-on-surface-variant">Loading API keys...</p>}
        
        {!isLoading && (!apiKeys || apiKeys.length === 0) && (
          <p className="p-xl text-center text-sm text-on-surface-variant">No client credentials found. Create an API Key to authorize client requests.</p>
        )}

        {!isLoading && apiKeys && apiKeys.length > 0 && (
          <table className="w-full text-left border-collapse">
            <thead className="bg-surface-container-low border-b border-outline-variant text-xs font-semibold text-on-surface-variant">
              <tr>
                <th className="py-2.5 px-md">Name</th>
                <th className="py-2.5 px-md">Status</th>
                <th className="py-2.5 px-md">Roles</th>
                <th className="py-2.5 px-md">Scopes</th>
                <th className="py-2.5 px-md">Expires</th>
                <th className="py-2.5 px-md">Created At</th>
                {can('editor') && <th className="py-2.5 px-md text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="font-mono text-xs text-on-surface divide-y divide-outline-variant">
              {apiKeys.map((key) => (
                <tr key={key.id} className="hover:bg-surface-container-low transition-colors">
                  <td className="py-3 px-md font-semibold text-[#587c94] font-sans">{key.name}</td>
                  <td className="py-3 px-md font-sans">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      key.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {key.status}
                    </span>
                  </td>
                  <td className="py-3 px-md truncate font-sans max-w-[120px]">{key.roles?.join(', ') || '—'}</td>
                  <td className="py-3 px-md truncate font-sans max-w-[120px]">{key.scopes?.join(', ') || '—'}</td>
                  <td className="py-3 px-md font-sans">
                    {key.expires_at ? new Date(key.expires_at).toLocaleDateString() : 'Never'}
                  </td>
                  <td className="py-3 px-md font-sans">{new Date(key.created_at).toLocaleDateString()}</td>
                  {can('editor') && (
                    <td className="py-3 px-md text-right font-sans">
                      <div className="flex justify-end gap-sm">
                        <button
                          onClick={() => handleRotate(key)}
                          disabled={rotateKey.isPending}
                          className="px-2 py-1 text-xs border border-outline-variant rounded hover:bg-surface-container cursor-pointer transition-colors"
                        >
                          Rotate
                        </button>
                        <button
                          onClick={() => handleRevoke(key)}
                          disabled={revokeKey.isPending}
                          className="px-2 py-1 text-xs bg-error/10 hover:bg-error text-error border border-error/20 rounded cursor-pointer transition-all"
                        >
                          Revoke
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

      {/* Create Key Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-md">
          <form onSubmit={handleCreate} className="bg-white border border-outline-variant rounded-xl p-lg shadow-2xl w-[400px] max-w-full flex flex-col gap-md">
            <h3 className="font-headline-md text-headline-md">Create API Key</h3>
            
            <label className="flex flex-col gap-xs text-xs">
              Key Name
              <input
                required
                placeholder="Mobile App Client"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="border border-outline-variant rounded px-2.5 py-1.5 text-sm outline-none"
              />
            </label>

            <label className="flex flex-col gap-xs text-xs">
              Expiration Date (optional)
              <input
                type="date"
                value={form.expires_at}
                onChange={(e) => setForm((f) => ({ ...f, expires_at: e.target.value }))}
                className="border border-outline-variant rounded px-2.5 py-1.5 text-sm outline-none"
              />
            </label>

            <label className="flex flex-col gap-xs text-xs">
              Roles (comma separated)
              <input
                placeholder="read, write"
                value={form.roles}
                onChange={(e) => setForm((f) => ({ ...f, roles: e.target.value }))}
                className="border border-outline-variant rounded px-2.5 py-1.5 text-sm outline-none"
              />
            </label>

            <label className="flex flex-col gap-xs text-xs">
              Scopes (comma separated)
              <input
                placeholder="metrics, gateways"
                value={form.scopes}
                onChange={(e) => setForm((f) => ({ ...f, scopes: e.target.value }))}
                className="border border-outline-variant rounded px-2.5 py-1.5 text-sm outline-none"
              />
            </label>

            {createKey.error && <p className="text-error text-xs">{(createKey.error as any).message}</p>}

            <div className="flex justify-end gap-sm mt-sm">
              <button type="button" onClick={() => setIsCreateOpen(false)} className="px-3 py-1.5 text-xs text-on-surface-variant">
                Cancel
              </button>
              <button
                type="submit"
                disabled={createKey.isPending}
                className="bg-[#113346] text-white px-3 py-1.5 rounded text-xs font-semibold disabled:opacity-50"
              >
                {createKey.isPending ? 'Generating...' : 'Generate Key'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Copy Key Modal */}
      {newKeyDetails && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-md">
          <div className="bg-white border border-outline-variant rounded-xl p-lg shadow-2xl w-[400px] max-w-full flex flex-col gap-md">
            <h3 className="font-headline-md text-headline-md text-green-700 flex items-center gap-sm">
              <span className="material-symbols-outlined">verified_user</span>
              Key Created Successfully
            </h3>
            <p className="text-xs text-on-surface-variant">
              Please copy the API key below. You will not be able to see it again!
            </p>
            
            <div className="flex gap-sm items-center bg-surface-container-low border border-outline-variant rounded p-sm font-mono text-sm break-all select-all">
              <span className="text-on-surface flex-1">{newKeyDetails.key}</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(newKeyDetails.key);
                  alert('Key copied to clipboard!');
                }}
                className="p-1 hover:bg-surface-container rounded cursor-pointer text-on-surface-variant"
                title="Copy to clipboard"
              >
                <span className="material-symbols-outlined text-[20px]">content_copy</span>
              </button>
            </div>

            <div className="flex justify-end mt-sm">
              <button onClick={() => setNewKeyDetails(null)} className="px-4 py-2 bg-[#113346] text-white rounded font-semibold text-xs hover:bg-[#123749] transition-colors cursor-pointer">
                I've copied it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
