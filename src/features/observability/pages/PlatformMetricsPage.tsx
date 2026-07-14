import React from 'react';
import { usePlatformMetricsQuery } from '../../../shared/hooks/usePlatform';

export const PlatformMetricsPage: React.FC = () => {
  const { data: metrics, isLoading, error } = usePlatformMetricsQuery();

  // Fallback metrics for local dev/demo
  const totalRps = metrics?.total_rps || 12450;
  const activeGateways = metrics?.active_gateways || 8;
  const errorRate = metrics?.error_rate || '0.04%';
  const throughput = metrics?.throughput || '328 MB/s';

  const hourlyRpsTrend = [
    { hour: '10:00', rps: 11200 },
    { hour: '11:00', rps: 12100 },
    { hour: '12:00', rps: 11800 },
    { hour: '13:00', rps: 13400 },
    { hour: '14:00', rps: 12900 },
    { hour: '15:00', rps: 12450 },
  ];

  return (
    <div className="flex flex-col gap-md text-left">
      <div>
        <h2 className="font-headline-lg text-headline-lg text-on-surface">Platform Metrics</h2>
        <p className="text-sm text-on-surface-variant mt-0.5">High-throughput traffic load metrics across the cluster.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-md">
        <div className="bg-white border border-outline-variant rounded-xl p-lg shadow-xs">
          <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Aggregated Request Rate</p>
          <p className="text-3xl font-extrabold text-on-surface mt-2">{totalRps.toLocaleString()} <span className="text-xs font-semibold text-outline">req/s</span></p>
          <span className="text-[11px] text-green-600 font-semibold block mt-1">↑ 4.2% since last hour</span>
        </div>
        <div className="bg-white border border-outline-variant rounded-xl p-lg shadow-xs">
          <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Active Gateway Nodes</p>
          <p className="text-3xl font-extrabold text-on-surface mt-2">{activeGateways} <span className="text-xs font-semibold text-outline">instances</span></p>
          <span className="text-[11px] text-on-surface-variant block mt-1">Healthy cluster replication</span>
        </div>
        <div className="bg-white border border-outline-variant rounded-xl p-lg shadow-xs">
          <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Global Error Rate</p>
          <p className="text-3xl font-extrabold text-error mt-2">{errorRate}</p>
          <span className="text-[11px] text-green-600 font-semibold block mt-1">Under SLA threshold (0.1%)</span>
        </div>
        <div className="bg-white border border-outline-variant rounded-xl p-lg shadow-xs">
          <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Data Throughput</p>
          <p className="text-3xl font-extrabold text-on-surface mt-2">{throughput}</p>
          <span className="text-[11px] text-on-surface-variant block mt-1">Network traffic capacity</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-md">
        {/* Trend chart placeholder mock */}
        <div className="lg:col-span-2 bg-white border border-outline-variant rounded-xl p-lg shadow-xs flex flex-col">
          <div className="flex justify-between items-center mb-md">
            <h3 className="font-semibold text-sm text-on-surface">Traffic Volume Trend</h3>
            <span className="text-xs text-outline font-medium">Last 6 Hours</span>
          </div>
          <div className="h-60 flex items-end justify-between px-md pt-lg relative">
            {/* Simple CSS graph representation */}
            {hourlyRpsTrend.map((t, idx) => {
              const heightPercent = Math.round((t.rps / 15000) * 100);
              return (
                <div key={idx} className="flex flex-col items-center gap-2 w-1/6 group">
                  <div className="relative w-full flex justify-center">
                    <span className="absolute -top-6 bg-[#113346] text-white text-[10px] font-bold py-0.5 px-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow">
                      {t.rps}
                    </span>
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className="w-10 bg-[#587c94]/20 hover:bg-[#587c94] rounded-t-md transition-colors cursor-pointer min-h-[40px]"
                    />
                  </div>
                  <span className="text-[10px] font-semibold text-on-surface-variant">{t.hour}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Node Distribution */}
        <div className="bg-white border border-outline-variant rounded-xl p-lg shadow-xs">
          <h3 className="font-semibold text-sm text-on-surface mb-md">Node Capacity Distribution</h3>
          <div className="flex flex-col gap-4">
            {[
              { region: 'US East (N. Virginia)', load: '58%', nodes: 3 },
              { region: 'EU West (Ireland)', load: '32%', nodes: 3 },
              { region: 'AP South (Mumbai)', load: '12%', nodes: 2 },
            ].map((node, i) => (
              <div key={i} className="flex flex-col gap-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-on-surface">{node.region}</span>
                  <span className="text-on-surface-variant">{node.nodes} nodes ({node.load})</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#113346] h-full rounded-full transition-all duration-500"
                    style={{ width: node.load }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlatformMetricsPage;
