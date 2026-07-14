import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { listAllGateways } from '../api/gatewaysApi';

export const GatewayStatusPage: React.FC = () => {
  const { data: gatewaysData, isLoading } = useQuery({ queryKey: ['platform', 'gateways'], queryFn: listAllGateways });

  const gateways = gatewaysData || [
    { endpoint_ip: '10.0.1.15', gateway_port: '8080', plan: 'dedicated-enterprise', status: 'active', external_id: 'gw-east-01' },
    { endpoint_ip: '10.0.1.18', gateway_port: '8080', plan: 'dedicated-enterprise', status: 'active', external_id: 'gw-east-02' },
  ];

  return (
    <div className="flex flex-col gap-md text-left">
      <div>
        <h2 className="font-headline-lg text-headline-lg text-on-surface">Gateway Status</h2>
        <p className="text-sm text-on-surface-variant mt-0.5">Real-time status overview of active gateway endpoints (Read Only).</p>
      </div>

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
            {gateways.map((gw, idx) => (
              <tr key={idx} className="hover:bg-slate-50 transition-colors">
                <td className="py-4 px-lg font-mono text-xs font-bold text-on-surface">{gw.endpoint_ip}</td>
                <td className="py-4 px-lg font-mono text-xs text-on-surface-variant">{gw.gateway_port}</td>
                <td className="py-4 px-lg font-mono text-xs text-outline">{gw.external_id}</td>
                <td className="py-4 px-lg text-xs font-semibold uppercase tracking-wider text-outline">{gw.plan.replace('-', ' ')}</td>
                <td className="py-4 px-lg text-right">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    {gw.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GatewayStatusPage;
