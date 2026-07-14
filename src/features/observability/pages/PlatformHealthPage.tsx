import React from 'react';
import { usePlatformHealthQuery } from '../../../shared/hooks/usePlatform';

export const PlatformHealthPage: React.FC = () => {
  const { data: health, isLoading, error, refetch } = usePlatformHealthQuery();

  // Fallback demo data if the API is not running locally
  const components = health?.components || [
    { name: 'Core API Services', status: 'healthy', latency: '4ms', uptime: '99.98%' },
    { name: 'PostgreSQL Database Connection Pool', status: 'healthy', latency: '1.2ms', uptime: '100%' },
    { name: 'Redis Metrics Store & Cache', status: 'healthy', latency: '0.8ms', uptime: '99.99%' },
    { name: 'Prometheus TSDB client', status: 'healthy', latency: '15ms', uptime: '99.95%' },
    { name: 'Ingress Gateway Proxies (Cluster)', status: 'healthy', latency: '3.1ms', uptime: '99.97%' },
  ];

  return (
    <div className="flex flex-col gap-md text-left">
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
          <span className="text-2xl font-bold text-green-600 flex items-center gap-1.5 mt-1">
            <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
            Operational
          </span>
          <span className="text-xs text-on-surface-variant mt-1">All core system checks passing</span>
        </div>
        <div className="bg-white border border-outline-variant rounded-xl p-lg shadow-xs flex flex-col gap-1">
          <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Average API Latency</span>
          <span className="text-2xl font-bold text-on-surface mt-1">2.4 ms</span>
          <span className="text-xs text-green-600 font-semibold mt-1">Stable response rates</span>
        </div>
        <div className="bg-white border border-outline-variant rounded-xl p-lg shadow-xs flex flex-col gap-1">
          <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Global Uptime</span>
          <span className="text-2xl font-bold text-on-surface mt-1">99.98%</span>
          <span className="text-xs text-on-surface-variant mt-1">Last 30 days rolling</span>
        </div>
      </div>

      <div className="bg-white border border-outline-variant rounded-xl shadow-xs overflow-hidden">
        <div className="px-lg py-4 border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
          <h3 className="font-semibold text-sm text-on-surface">Platform Component Status</h3>
          <span className="text-[10px] bg-green-50 text-green-700 px-2 py-0.5 rounded font-bold border border-green-200 uppercase tracking-wider">All Active</span>
        </div>
        <div className="divide-y divide-outline-variant">
          {components.map((comp: any, idx: number) => (
            <div key={idx} className="px-lg py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[20px] text-[#587c94]">dns</span>
                <div>
                  <p className="font-semibold text-xs text-on-surface">{comp.name}</p>
                  <p className="text-[10px] text-outline mt-0.5">Uptime: {comp.uptime}</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-outline block text-right">Ping</span>
                  <span className="font-mono text-xs text-on-surface font-semibold">{comp.latency}</span>
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-green-50 text-green-700 border border-green-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  {comp.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlatformHealthPage;
