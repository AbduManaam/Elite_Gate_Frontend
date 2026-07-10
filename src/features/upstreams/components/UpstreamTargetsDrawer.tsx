import React, { useState } from 'react';
import { useUpstreamTargetsQuery, useAddUpstreamTargetMutation, useRemoveUpstreamTargetMutation } from '../hooks/useUpstreamTargets';
import { toApiError } from '../../../shared/api/apiError';

interface UpstreamTargetsDrawerProps {
  readonly projectId: string;
  readonly upstreamId: string;
  readonly upstreamName: string;
  readonly onClose: () => void;
}

export const UpstreamTargetsDrawer: React.FC<UpstreamTargetsDrawerProps> = ({
  projectId,
  upstreamId,
  upstreamName,
  onClose,
}) => {
  const { data: targets, isLoading, error } = useUpstreamTargetsQuery(projectId, upstreamId);
  const addTarget = useAddUpstreamTargetMutation(projectId, upstreamId);
  const removeTarget = useRemoveUpstreamTargetMutation(projectId, upstreamId);

  const [form, setForm] = useState({
    target_url: '',
    weight: 1,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.target_url) return;
    addTarget.mutate(form, {
      onSuccess: () => {
        setForm({ target_url: '', weight: 1 });
      },
    });
  };

  const apiError = error ? toApiError(error) : null;
  const addError = addTarget.error ? toApiError(addTarget.error) : null;

  return (
    <div className="flex flex-col h-full w-screen sm:w-[450px] max-w-full bg-white text-left p-lg justify-between border-l border-outline-variant shadow-2xl">
      <div className="flex flex-col gap-lg overflow-y-auto flex-1">
        {/* Header */}
        <div className="flex justify-between items-start border-b border-outline-variant pb-md">
          <div>
            <h3 className="font-headline-md text-headline-md text-on-surface">Target Instances</h3>
            <p className="text-xs text-on-surface-variant mt-1">Upstream: <span className="font-mono font-bold text-[#587c94]">{upstreamName}</span></p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-surface-container rounded cursor-pointer transition-colors text-on-surface-variant">
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Add Target Form */}
        <form onSubmit={handleSubmit} className="bg-surface-container-low border border-outline-variant rounded-lg p-md flex flex-col gap-md">
          <h4 className="font-semibold text-xs text-on-surface uppercase tracking-wider">Add Load Balancer Target</h4>
          
          <div className="flex flex-col sm:flex-row gap-md">
            <label className="flex flex-col gap-xs text-xs flex-1 min-w-0">
              Target URL / Host:Port
              <input
                required
                placeholder="10.0.0.1:8080"
                value={form.target_url}
                onChange={(e) => setForm((f) => ({ ...f, target_url: e.target.value }))}
                className="w-full border border-outline-variant bg-white rounded px-2.5 py-1.5 font-mono text-sm focus:border-[#587c94] outline-none"
              />
            </label>
            <label className="flex flex-col gap-xs text-xs w-full sm:w-[80px]">
              Weight
              <input
                type="number"
                min={1}
                required
                value={form.weight}
                onChange={(e) => setForm((f) => ({ ...f, weight: parseInt(e.target.value) || 1 }))}
                className="border border-outline-variant bg-white rounded px-2.5 py-1.5 font-mono text-sm focus:border-[#587c94] outline-none"
              />
            </label>
          </div>

          {addError && <p className="text-error text-xs">{addError.message}</p>}

          <button
            type="submit"
            disabled={addTarget.isPending}
            className="bg-[#113346] text-white px-md py-1.5 rounded font-semibold text-xs hover:bg-[#123749] transition-colors self-end cursor-pointer disabled:opacity-50"
          >
            {addTarget.isPending ? 'Adding...' : 'Add Target'}
          </button>
        </form>

        {/* Target Instances List */}
        <div className="flex flex-col gap-sm">
          <h4 className="font-semibold text-xs text-on-surface uppercase tracking-wider">Active Targets</h4>

          {isLoading && <p className="text-center text-xs text-on-surface-variant py-md">Loading targets...</p>}
          
          {apiError && <p className="text-center text-xs text-error py-md">{apiError.message}</p>}

          {!isLoading && !apiError && (targets ?? []).length === 0 && (
            <p className="text-center text-xs text-on-surface-variant border border-dashed border-outline-variant rounded p-md py-lg">
              No targets configured. Add one above.
            </p>
          )}

          {!isLoading && !apiError && (targets ?? []).length > 0 && (
            <div className="border border-outline-variant rounded-lg overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-surface-container-low font-semibold text-on-surface-variant border-b border-outline-variant">
                  <tr>
                    <th className="py-2 px-md">Status</th>
                    <th className="py-2 px-md">Target</th>
                    <th className="py-2 px-md text-right">Weight</th>
                    <th className="py-2 px-md w-[40px]" />
                  </tr>
                </thead>
                <tbody className="font-mono divide-y divide-outline-variant text-on-surface">
                  {targets?.map((t) => (
                    <tr key={t.id} className="hover:bg-surface-container-low transition-colors group">
                      <td className="py-2.5 px-md">
                        <div className="flex items-center gap-1.5 font-sans font-medium text-[10px]">
                          <span className={`w-2 h-2 rounded-full ${t.enabled ? 'bg-green-600' : 'bg-outline-variant'}`} />
                          {t.enabled ? 'Online' : 'Offline'}
                        </div>
                      </td>
                      <td className="py-2.5 px-md font-medium">{t.target_url}</td>
                      <td className="py-2.5 px-md text-right">{t.weight}</td>
                      <td className="py-2.5 px-md text-right">
                        <button
                          onClick={() => removeTarget.mutate(t.id)}
                          disabled={removeTarget.isPending}
                          className="text-outline hover:text-error opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer p-0.5"
                          title="Remove target"
                        >
                          <span className="material-symbols-outlined text-[16px]">close</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-outline-variant pt-md flex justify-end">
        <button onClick={onClose} className="px-md py-1.5 border border-outline-variant rounded font-semibold text-xs hover:bg-surface-container transition-colors cursor-pointer">
          Close
        </button>
      </div>
    </div>
  );
};
