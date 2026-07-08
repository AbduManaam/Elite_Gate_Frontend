import React, { useState } from 'react';
import { useActiveProject } from '../../../shared/hooks/useActiveProject';
import { useRoles } from '../../../shared/hooks/useRoles';
import { useUpstreamsQuery, useDeleteUpstreamMutation, useDisableUpstreamMutation } from '../hooks/useUpstreams';
import { UpstreamTargetsDrawer } from './UpstreamTargetsDrawer';
import { UpstreamFormDrawer } from './UpstreamFormDrawer';
import { UpstreamRecord } from '../api/upstreamsApi';
import { toApiError } from '../../../shared/api/apiError';

export const UpstreamsList: React.FC = () => {
  const { projectId } = useActiveProject();
  const { can } = useRoles();
  const [upstreamSearchQuery, setUpstreamSearchQuery] = useState('');
  const [selectedUpstream, setSelectedUpstream] = useState<UpstreamRecord | null>(null);
  const [formDrawer, setFormDrawer] = useState<{ isOpen: boolean; mode: 'create' | 'edit'; upstream?: UpstreamRecord }>({
    isOpen: false,
    mode: 'create',
  });

  const { data: upstreams, isLoading, error } = useUpstreamsQuery(projectId);
  const deleteUpstream = useDeleteUpstreamMutation(projectId ?? '');
  const disableUpstream = useDisableUpstreamMutation(projectId ?? '');

  // RBAC('editor') gates create/update/disable/delete on the backend.
  const canManage = can('editor');

  const filteredUpstreams = (upstreams ?? []).filter((u) =>
    u.name.toLowerCase().includes(upstreamSearchQuery.toLowerCase()) ||
    u.protocol.toLowerCase().includes(upstreamSearchQuery.toLowerCase())
  );

  const apiError = error ? toApiError(error) : null;

  return (
    <div className="flex flex-col gap-lg text-left">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="font-display-lg text-display-lg text-on-surface">Upstreams</h2>
          <p className="font-body-md text-body-md text-[#587c94] mt-1">
            Manage backend routing destinations and load balancing configurations.
          </p>
        </div>
        <div className="flex gap-md">
          <div className="relative w-72">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">
              filter_list
            </span>
            <input
              className="w-full pl-9 pr-3 py-1.5 rounded border border-outline-variant bg-white focus:border-[#587c94] focus:ring-2 focus:ring-[#587c94]/10 text-sm outline-none placeholder-on-surface-variant transition-all h-[36px]"
              placeholder="Search upstreams..."
              type="text"
              value={upstreamSearchQuery}
              onChange={(e) => setUpstreamSearchQuery(e.target.value)}
            />
          </div>
          {canManage && (
            <button 
              onClick={() => setFormDrawer({ isOpen: true, mode: 'create' })}
              className="bg-[#113346] text-white font-bold px-md py-sm rounded hover:bg-[#123749] transition-colors flex items-center gap-sm h-[36px] cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              New Upstream
            </button>
          )}
        </div>
      </div>

      <div className="bg-white border border-outline-variant rounded-lg overflow-hidden shadow-sm">
        {isLoading && <div className="p-lg text-center text-on-surface-variant text-sm">Loading upstreams…</div>}

        {apiError && (
          <div className="p-lg text-center text-sm">
            {apiError.kind === 'forbidden' ? (
              <span className="text-on-surface-variant">You don't have permission to view upstreams for this project.</span>
            ) : apiError.kind === 'network' ? (
              <span className="text-error">Can't reach the server — check your connection.</span>
            ) : (
              <span className="text-error">{apiError.message}</span>
            )}
          </div>
        )}

        {!isLoading && !apiError && (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant">
                <th className="py-3 px-md font-bold text-[10px] uppercase tracking-wider text-on-surface-variant w-[60px]">Status</th>
                <th className="py-3 px-md font-bold text-[10px] uppercase tracking-wider text-on-surface-variant">Name</th>
                <th className="py-3 px-md font-bold text-[10px] uppercase tracking-wider text-on-surface-variant">Target URL</th>
                <th className="py-3 px-md font-bold text-[10px] uppercase tracking-wider text-on-surface-variant">Protocol</th>
                <th className="py-3 px-md font-bold text-[10px] uppercase tracking-wider text-on-surface-variant">LB Strategy</th>
                <th className="py-3 px-md font-bold text-[10px] uppercase tracking-wider text-on-surface-variant">Health Path</th>
                {canManage && <th className="py-3 px-md font-bold text-[10px] uppercase tracking-wider text-on-surface-variant text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="text-sm text-on-surface divide-y divide-outline-variant">
              {filteredUpstreams.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-xl text-center text-on-surface-variant text-sm">
                    {upstreams?.length === 0 ? 'No upstreams yet. Create one to start routing traffic.' : 'No upstreams match your search.'}
                  </td>
                </tr>
              )}
              {filteredUpstreams.map((upstream) => (
                <tr
                  key={upstream.id}
                  onClick={() => setSelectedUpstream(upstream)}
                  className="hover:bg-surface-container-low transition-colors group cursor-pointer"
                >
                  <td className="py-4 px-md">
                    <div className={`w-2.5 h-2.5 rounded-full ${upstream.enabled ? 'bg-[#10b981] shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 'bg-outline-variant'}`}></div>
                  </td>
                  <td className="py-4 px-md font-medium text-on-surface flex items-center gap-sm">
                    <span className="material-symbols-outlined text-[#587c94] text-[18px]">route</span>
                    {upstream.name}
                  </td>
                  <td className="py-4 px-md text-on-surface-variant font-mono text-xs">{upstream.target_url}</td>
                  <td className="py-4 px-md text-on-surface-variant uppercase text-xs font-bold">{upstream.protocol}</td>
                  <td className="py-4 px-md text-on-surface-variant">{upstream.lb_strategy || '—'}</td>
                  <td className="py-4 px-md text-on-surface-variant font-mono text-xs">{upstream.health_path || '—'}</td>
                  {canManage && (
                    <td className="py-4 px-md text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex justify-end gap-sm opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => setFormDrawer({ isOpen: true, mode: 'edit', upstream })}
                          className="text-on-surface-variant hover:text-[#587c94] transition-colors p-xs cursor-pointer"
                          title="Edit"
                        >
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </button>
                        {upstream.enabled && (
                          <button
                            onClick={() => disableUpstream.mutate(upstream.id)}
                            disabled={disableUpstream.isPending}
                            className="text-on-surface-variant hover:text-[#587c94] transition-colors p-xs cursor-pointer disabled:opacity-40"
                            title="Disable"
                          >
                            <span className="material-symbols-outlined text-[18px]">pause_circle</span>
                          </button>
                        )}
                        <button
                          onClick={() => deleteUpstream.mutate(upstream.id)}
                          disabled={deleteUpstream.isPending}
                          className="text-on-surface-variant hover:text-error transition-colors p-xs cursor-pointer disabled:opacity-40"
                          title="Delete"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className="bg-surface-container-low border-t border-outline-variant p-sm px-md flex justify-between items-center text-xs">
          <p className="text-on-surface-variant">Showing {filteredUpstreams.length} upstreams</p>
        </div>
      </div>

      {/* Target Instances Side Drawer */}
      {selectedUpstream && (
        <div className="fixed inset-0 bg-black/40 z-50 flex justify-end">
          <div className="bg-white h-full shadow-2xl border-l border-outline-variant animate-slide-in overflow-y-auto">
            <UpstreamTargetsDrawer
              projectId={projectId ?? ''}
              upstreamId={selectedUpstream.id}
              upstreamName={selectedUpstream.name}
              onClose={() => setSelectedUpstream(null)}
            />
          </div>
        </div>
      )}

      {/* Upstream Form Drawer */}
      {formDrawer.isOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex justify-end">
          <div className="bg-white h-full shadow-2xl border-l border-outline-variant animate-slide-in overflow-y-auto">
            <UpstreamFormDrawer
              projectId={projectId ?? ''}
              mode={formDrawer.mode}
              upstream={formDrawer.upstream}
              onClose={() => setFormDrawer({ isOpen: false, mode: 'create' })}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default UpstreamsList;