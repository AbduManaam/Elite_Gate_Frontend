import React from 'react';
import { useParams } from 'react-router-dom';
import { useActiveProject } from '../../../shared/hooks/useActiveProject';
import { useGatewaysQuery } from '../hooks/useGateways';

export const GatewayStatusPage: React.FC = () => {
  const { projectId: paramsProjectId } = useParams<{ projectId: string }>();
  const { projectId: activeProjectId } = useActiveProject();
  const projectId = paramsProjectId || activeProjectId || '';

  const { data: gateways = [], isLoading, isError, error } = useGatewaysQuery(projectId);

  return (
    <div className="flex flex-col gap-md text-left">
      <div>
        <h2 className="font-headline-lg text-headline-lg text-on-surface">Gateway Status</h2>
        <p className="text-sm text-on-surface-variant mt-0.5">Real-time status overview of active gateway endpoints (Read Only).</p>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="bg-white border border-outline-variant rounded-xl p-8 flex flex-col items-center justify-center gap-3 text-on-surface-variant shadow-xs">
          <span className="material-symbols-outlined animate-spin text-2xl text-primary">sync</span>
          <p className="text-sm font-medium">Loading project gateways...</p>
        </div>
      )}

      {/* Error state */}
      {isError && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-center gap-3 text-sm font-medium shadow-xs">
          <span className="material-symbols-outlined text-red-500 text-xl">error</span>
          <span>Failed to load gateways: {(error as Error)?.message || 'An error occurred while fetching gateways.'}</span>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !isError && gateways.length === 0 && (
        <div className="bg-white border border-outline-variant rounded-xl p-8 flex flex-col items-center justify-center text-center shadow-xs">
          <span className="material-symbols-outlined text-outline text-4xl mb-2">dns</span>
          <h3 className="text-sm font-semibold text-on-surface">No Gateways Found</h3>
          <p className="text-xs text-on-surface-variant mt-1">This project does not currently have any active or provisioned gateways.</p>
        </div>
      )}

      {/* Table view */}
      {!isLoading && !isError && gateways.length > 0 && (
        <div className="bg-white border border-outline-variant rounded-xl overflow-x-auto shadow-xs">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-container-low border-b border-outline-variant text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
              <tr>
                <th className="py-3 px-lg">Endpoint address</th>
                <th className="py-3 px-lg">Port</th>
                <th className="py-3 px-lg">Node Identifier</th>
                <th className="py-3 px-lg">Tier</th>
                <th className="py-3 px-lg text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {gateways.map((gw, idx) => {
                const portDisplay = gw.public_port || gw.gateway_port || '-';
                const nodeIdentifier = gw.external_id || gw.id || '-';
                const planDisplay = (gw.plan || '-').replace(/-/g, ' ');
                const isRunning = gw.status === 'active' || gw.status === 'running';

                return (
                  <tr key={gw.id || idx} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-lg font-mono text-xs font-bold text-on-surface">
                      {gw.endpoint_ip || gw.public_host || '-'}
                    </td>
                    <td className="py-4 px-lg font-mono text-xs text-on-surface-variant">
                      {portDisplay}
                    </td>
                    <td className="py-4 px-lg font-mono text-xs text-outline">
                      {nodeIdentifier}
                    </td>
                    <td className="py-4 px-lg text-xs font-semibold uppercase tracking-wider text-outline">
                      {planDisplay}
                    </td>
                    <td className="py-4 px-lg text-right">
                      <span
                        className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
                          isRunning
                            ? 'bg-green-50 text-green-700 border-green-200'
                            : 'bg-slate-50 text-slate-700 border-slate-200'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isRunning ? 'bg-green-500' : 'bg-slate-400'
                          }`}
                        />
                        {gw.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default GatewayStatusPage;

