import React from 'react';
import { GatewayRecord } from '../api/gatewaysApi';

interface AllGatewaysModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly allGateways: readonly GatewayRecord[] | undefined;
  readonly isLoading: boolean;
  readonly projects: readonly { id: string; name: string }[];
}

export const AllGatewaysModal: React.FC<AllGatewaysModalProps> = ({
  isOpen,
  onClose,
  allGateways,
  isLoading,
  projects,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-md backdrop-blur-xs animate-fade-in-scale">
      <div className="bg-white border border-outline-variant rounded-xl shadow-2xl w-[700px] max-w-full flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-md py-4 border-b border-outline-variant flex justify-between items-center bg-[#fafbfc]">
          <h3 className="font-bold text-sm text-[#113346] flex items-center gap-sm">
            <span className="material-symbols-outlined text-[#587c94] text-[20px]">dns</span>
            All Gateways Across Projects
          </h3>
          <button
            onClick={onClose}
            className="material-symbols-outlined text-outline hover:text-on-surface cursor-pointer text-[20px] transition-colors focus:outline-none"
          >
            close
          </button>
        </div>

        {/* Modal Content */}
        <div className="overflow-x-auto max-h-[400px]">
          {isLoading ? (
            <p className="p-lg text-center text-xs text-on-surface-variant animate-pulse">Loading all gateways...</p>
          ) : !allGateways || allGateways.length === 0 ? (
            <p className="p-xl text-center text-xs text-on-surface-variant">No active gateways found in the system.</p>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#f0f4f8] border-b border-outline-variant text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                <tr>
                  <th className="py-2.5 px-md">Status</th>
                  <th className="py-2.5 px-md">Gateway ID</th>
                  <th className="py-2.5 px-md">Endpoint</th>
                  <th className="py-2.5 px-md">Plan</th>
                  <th className="py-2.5 px-md">Project</th>
                </tr>
              </thead>
              <tbody className="font-mono text-xs text-on-surface divide-y divide-outline-variant">
                {allGateways.map((gw) => {
                  const proj = projects.find((p) => p.id === gw.project_id);
                  return (
                    <tr key={gw.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-2.5 px-md">
                        <div className="flex items-center gap-1.5 font-sans font-medium text-[11px]">
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            gw.status === 'active' ? 'bg-green-500 animate-pulse' : gw.status === 'provisioning' ? 'bg-amber-500 animate-pulse' : 'bg-red-500'
                          }`} />
                          <span className="capitalize">{gw.status}</span>
                        </div>
                      </td>
                      <td className="py-2.5 px-md font-semibold text-[#587c94]">{gw.external_id}</td>
                      <td className="py-2.5 px-md">{gw.endpoint_ip}:{gw.gateway_port}</td>
                      <td className="py-2.5 px-md capitalize font-sans font-semibold text-[11px]">{gw.plan}</td>
                      <td className="py-2.5 px-md font-sans text-on-surface-variant font-medium max-w-[120px] truncate">
                        {proj ? proj.name : 'Unknown Project'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-[#fafbfc] border-t border-outline-variant p-md flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-outline-variant rounded-lg text-xs font-semibold hover:bg-slate-50 cursor-pointer transition-colors focus:outline-none"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
