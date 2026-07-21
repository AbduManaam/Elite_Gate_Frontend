import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { listAllGateways, restartGateway, reloadAllGateways, forceDecommissionGateway, type GatewayRecord } from '../api/gatewaysApi';
import { ConfirmModal } from '../../../shared/components/ui/ConfirmModal';

export const PlatformGatewaysPage: React.FC = () => {
  const { data: gatewaysData, refetch } = useQuery({ queryKey: ['platform', 'gateways'], queryFn: listAllGateways });

  const restartMut = useMutation({
    mutationFn: restartGateway,
    onSuccess: () => refetch(),
  });

  const reloadAllMut = useMutation({
    mutationFn: reloadAllGateways,
    onSuccess: () => refetch(),
  });

  const forceDecommMut = useMutation({
    mutationFn: forceDecommissionGateway,
    onSuccess: () => refetch(),
  });

  const [activeGateway, setActiveGateway] = useState<GatewayRecord | null>(null);
  const [modalAction, setModalAction] = useState<'restart' | 'reload_all' | 'force_decomm' | null>(null);

  // Fallback demo gateways if backend is not running
  const gateways: GatewayRecord[] = gatewaysData || [
    { id: 'gw-01', project_id: 'proj-01', endpoint_ip: '10.0.1.15', gateway_port: '8080', public_host: 'gw1.example.com', public_port: '443', plan: 'dedicated-enterprise', status: 'active', external_id: 'gw-east-01' },
    { id: 'gw-02', project_id: 'proj-01', endpoint_ip: '10.0.1.18', gateway_port: '8080', public_host: 'gw2.example.com', public_port: '443', plan: 'dedicated-enterprise', status: 'active', external_id: 'gw-east-02' },
    { id: 'gw-03', project_id: 'proj-02', endpoint_ip: '10.0.2.4', gateway_port: '8080', public_host: 'gw3.example.com', public_port: '443', plan: 'dedicated-enterprise', status: 'active', external_id: 'gw-west-01' },
  ];

  const handleActionClick = (gw: GatewayRecord | null, action: 'restart' | 'reload_all' | 'force_decomm') => {
    setActiveGateway(gw);
    setModalAction(action);
  };

  const handleConfirmSubmit = () => {
    const onSuccess = () => {
      setModalAction(null);
      setActiveGateway(null);
    };

    if (modalAction === 'restart' && activeGateway) {
      restartMut.mutate(activeGateway.id, { onSuccess });
    } else if (modalAction === 'reload_all') {
      reloadAllMut.mutate(undefined, { onSuccess });
    } else if (modalAction === 'force_decomm' && activeGateway) {
      forceDecommMut.mutate(activeGateway.id, { onSuccess });
    }
  };

  return (
    <div className="flex flex-col gap-md text-left">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">Platform Gateways</h2>
          <p className="text-sm text-on-surface-variant mt-0.5">Manage and reload gateway routing nodes across all regions.</p>
        </div>
        <button
          onClick={() => handleActionClick(null, 'reload_all')}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#113346] hover:bg-[#123749] text-white text-xs font-semibold rounded-lg shadow-sm cursor-pointer transition-colors"
        >
          <span className="material-symbols-outlined text-[16px]">restart_alt</span>
          Reload All Gateways
        </button>
      </div>

      <div className="bg-white border border-outline-variant rounded-xl overflow-x-auto shadow-xs">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface-container-low border-b border-outline-variant text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
            <tr>
              <th className="py-3 px-lg">Gateway IP</th>
              <th className="py-3 px-lg">Host Port</th>
              <th className="py-3 px-lg">External Reference</th>
              <th className="py-3 px-lg">Tier</th>
              <th className="py-3 px-lg">Status</th>
              <th className="py-3 px-lg text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
            {gateways.map((gw) => (
              <tr key={gw.id} className="hover:bg-slate-50 transition-colors">
                <td className="py-4 px-lg font-mono text-xs font-bold text-[#113346]">{gw.endpoint_ip}</td>
                <td className="py-4 px-lg font-mono text-xs text-on-surface-variant">{gw.gateway_port}</td>
                <td className="py-4 px-lg font-mono text-xs text-outline">{gw.external_id}</td>
                <td className="py-4 px-lg text-xs font-semibold uppercase tracking-wider text-outline">{gw.plan.replace('-', ' ')}</td>
                <td className="py-4 px-lg">
                  <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    {gw.status}
                  </span>
                </td>
                <td className="py-4 px-lg text-right flex justify-end gap-2">
                  <button
                    onClick={() => handleActionClick(gw, 'restart')}
                    className="px-3 py-1.5 border border-outline-variant text-xs font-semibold rounded-lg hover:bg-slate-100 transition-colors cursor-pointer text-on-surface"
                  >
                    Restart Node
                  </button>
                  <button
                    onClick={() => handleActionClick(gw, 'force_decomm')}
                    className="px-3 py-1.5 border border-red-100 text-error text-xs font-semibold rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    Force Decommission
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmModal
        isOpen={modalAction === 'restart'}
        title="Restart Gateway Node"
        confirmLabel="Restart Node"
        cancelLabel="Cancel"
        message={
          <span>
            Restart gateway instance <span className="font-bold">"{activeGateway?.endpoint_ip}"</span>?
          </span>
        }
        description="This will temporarily take the gateway container offline to reload runtime configurations. Active connections will be terminated."
        onConfirm={handleConfirmSubmit}
        onClose={() => setModalAction(null)}
        isPending={restartMut.isPending}
      />

      <ConfirmModal
        isOpen={modalAction === 'reload_all'}
        title="Reload All Gateways"
        confirmLabel="Trigger Global Reload"
        cancelLabel="Cancel"
        message={<span>Reload configurations across the entire cluster?</span>}
        description="This triggers a config synchronization for all ingress nodes. This operation is safe and does not drop active traffic."
        onConfirm={handleConfirmSubmit}
        onClose={() => setModalAction(null)}
        isPending={reloadAllMut.isPending}
      />

      <ConfirmModal
        isOpen={modalAction === 'force_decomm'}
        title="Force Decommission Gateway"
        isDanger
        confirmLabel="Decommission Node"
        cancelLabel="Cancel"
        message={
          <span>
            Decommission instance <span className="font-bold">"{activeGateway?.endpoint_ip}"</span>?
          </span>
        }
        description="This immediately disconnects the node from load balancers and triggers node disposal. This action is irreversible."
        onConfirm={handleConfirmSubmit}
        onClose={() => setModalAction(null)}
        isPending={forceDecommMut.isPending}
        requireConfirmText="decommission"
      />
    </div>
  );
};

export default PlatformGatewaysPage;
