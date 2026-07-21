import React from 'react';
import { usePlatformHealthQuery } from '../../../shared/hooks/usePlatform';

export const PlatformHealthPage: React.FC = () => {
  const { data: health, isLoading, error, refetch } = usePlatformHealthQuery();

  const components = health?.gateway_health ?? [];
  const isDegraded = components.some((c) => c.status === 'unreachable');
  const allActive = components.length > 0 && !isDegraded;

  if (isLoading) return <div className="text-center py-10 text-on-surface-variant font-medium">Loading platform health...</div>;
  if (error) return <div className="text-center py-10 text-error font-medium">Failed to load platform health.</div>;

  return (
    <div className="flex flex-col gap-md text-left animate-fade-in">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">Platform Health</h2>
          <p className="text-sm text-on-surface-variant mt-0.5">Real-time status of backend microservices and databases.</p>
        </div>
        <button
          onClick={() => refetch()}
          className="flex items-center gap-1.5 px-4 py-2 border border-outline-variant hover:bg-surface-container rounded-lg font-semibold text-xs text-on-surface-variant cursor-pointer transition-colors"
        >
          <span className="material-symbols-outlined text-[16px]">refresh</span>
          Refresh Stats
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
        <div className="bg-white border border-outline-variant rounded-xl p-lg shadow-xs flex flex-col gap-1">
          <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Core Status</span>
          <span className={`text-2xl font-bold flex items-center gap-1.5 mt-1 ${isDegraded ? 'text-amber-600' : 'text-green-600'}`}>
            <span className={`w-3 h-3 rounded-full ${isDegraded ? 'bg-amber-500 animate-pulse' : 'bg-green-500 animate-pulse'}`} />
            {isDegraded ? 'Degraded' : 'Operational'}
          </span>
          <span className="text-xs text-on-surface-variant mt-1">
            {isDegraded ? 'Some gateway instances are unreachable' : 'All gateway checks passing'}
          </span>
        </div>
        <div className="bg-white border border-outline-variant rounded-xl p-lg shadow-xs flex flex-col gap-1">
          <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Projects Overview</span>
          <span className="text-2xl font-bold text-on-surface mt-1">
            {health?.projects?.active ?? 0} <span className="text-xs text-outline font-normal">Active</span> / {health?.projects?.suspended ?? 0} <span className="text-xs text-outline font-normal">Suspended</span>
          </span>
          <span className="text-xs text-on-surface-variant mt-1">Total: {health?.projects?.total ?? 0} projects</span>
        </div>
        <div className="bg-white border border-outline-variant rounded-xl p-lg shadow-xs flex flex-col gap-1">
          <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Gateway Cluster</span>
          <span className="text-2xl font-bold text-on-surface mt-1">
            {health?.gateways?.active ?? 0} <span className="text-xs text-outline font-normal">Active</span> / {health?.gateways?.provisioning ?? 0} <span className="text-xs text-outline font-normal">Provisioning</span>
          </span>
          <span className="text-xs text-on-surface-variant mt-1">Decommissioned: {health?.gateways?.decommissioned ?? 0}</span>
        </div>
      </div>

      <div className="bg-white border border-outline-variant rounded-xl shadow-xs overflow-hidden">
        <div className="px-lg py-4 border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
          <h3 className="font-semibold text-sm text-on-surface">Platform Component Status</h3>
          <span className={`text-[10px] px-2 py-0.5 rounded font-bold border uppercase tracking-wider ${
            allActive 
              ? 'bg-green-50 text-green-700 border-green-200' 
              : 'bg-amber-50 text-amber-700 border-amber-200'
          }`}>
            {allActive ? 'All Active' : isDegraded ? 'Issues Detected' : 'No Nodes Probed'}
          </span>
        </div>
        <div className="divide-y divide-outline-variant">
          {components.length === 0 ? (
            <div className="p-lg text-center text-sm text-on-surface-variant">No gateway components are currently active or probed.</div>
          ) : (
            components.map((comp, idx: number) => (
              <div key={idx} className="px-lg py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[20px] text-[#587c94]">dns</span>
                  <div>
                    <p className="font-semibold text-xs text-on-surface">Gateway Node ({comp.gateway_id ? comp.gateway_id.substring(0, 8) : 'Unknown'}...)</p>
                    <p className="text-[10px] text-outline mt-0.5">Type: Ingress Router Proxy</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${
                    comp.status === 'healthy'
                      ? 'bg-green-50 text-green-700 border-green-200'
                      : 'bg-red-50 text-red-700 border-red-200'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${comp.status === 'healthy' ? 'bg-green-500' : 'bg-red-500'}`} />
                    {comp.status === 'healthy' ? 'Healthy' : 'Unreachable'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PlatformHealthPage;
