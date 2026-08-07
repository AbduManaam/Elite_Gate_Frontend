import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
} from 'recharts';
import type { DashboardSummary, TimeSeriesPoint } from '../api/metricsApi';
import type { GatewayRecord } from '../../gateways/api/gatewaysApi';

export interface GatewayHealthSectionProps {
  /** Summary metrics payload */
  readonly summary: DashboardSummary | undefined;
  /** CPU usage rolling trend data */
  readonly cpuTrend: TimeSeriesPoint[] | undefined;
  /** Memory usage rolling trend data */
  readonly memTrend: TimeSeriesPoint[] | undefined;
  /** Active project gateways list */
  readonly gateways: GatewayRecord[] | undefined;
  /** True when metrics or gateway state is loading */
  readonly isLoading: boolean;
}

/** Formats unix timestamp in milliseconds to HH:MM for chart axis ticks. */
function fmtTime(ts: number): string {
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

/**
 * Gateway Health section displaying active concurrency/connections, gateway container status,
 * system CPU utilization, and memory usage.
 */
export const GatewayHealthSection: React.FC<GatewayHealthSectionProps> = ({
  summary,
  cpuTrend,
  memTrend,
  gateways,
  isLoading,
}) => {
  const activeGateway = gateways?.find((gw) => gw.status !== 'decommissioned') ?? gateways?.[0];

  return (
    <section className="space-y-lg pt-md">
      {/* Section Header */}
      <div className="border-b border-outline-variant/60 pb-md">
        <h3 className="font-display-md text-xl font-bold text-on-surface flex items-center gap-xs">
          <span className="material-symbols-outlined text-[#22c55e] text-[22px]">dns</span>
          Gateway Health
        </h3>
        <p className="text-xs text-on-surface-variant mt-0.5">
          Active requests, ingress gateway container status, system CPU, and memory utilization.
        </p>
      </div>

      {/* Top Metrics Row: Active Connections & Gateway Container Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
        {/* Active Requests / Connections Card */}
        <div className="bg-white border border-outline-variant rounded-xl p-lg flex flex-col shadow-xs">
          <div className="flex justify-between items-start mb-lg">
            <div>
              <h4 className="font-semibold text-base text-on-surface">Active Requests</h4>
              <p className="text-xs text-on-surface-variant">Concurrency and active connections</p>
            </div>
            <div className="flex items-center gap-xs">
              <span className="material-symbols-outlined text-[18px] text-green-600">bolt</span>
            </div>
          </div>
          <div className="h-64 flex flex-col justify-between">
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                Current Connections
              </span>
              <span className="text-[36px] font-bold text-on-surface leading-tight mt-xs">
                {isLoading ? '...' : (summary?.active_requests?.value ?? 0)}
              </span>
              <span className="text-[11px] text-on-surface-variant">
                {summary?.active_requests?.unit ?? 'requests'}
              </span>
            </div>
            <div className="h-28 w-full mt-lg">
              {isLoading ? (
                <div className="h-full bg-surface-container-low rounded-lg animate-pulse" />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={summary?.active_requests_sparkline ?? []}>
                    <Tooltip labelFormatter={(ts) => fmtTime(ts as number)} />
                    <Line type="monotone" dataKey="value" stroke="#22c55e" dot={false} strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>

        {/* CPU Usage Chart */}
        <div className="bg-white border border-outline-variant rounded-xl p-lg flex flex-col shadow-xs">
          <div className="flex justify-between items-start mb-lg">
            <div>
              <h4 className="font-semibold text-base text-on-surface">Gateway CPU Usage</h4>
              <p className="text-xs text-on-surface-variant">System CPU utilization over time</p>
            </div>
            <div className="flex items-center gap-xs">
              <span className="w-3 h-3 rounded-full bg-[#f97316]" />
              <span className="text-xs text-on-surface-variant font-medium">CPU %</span>
            </div>
          </div>
          <div className="h-64 w-full">
            {isLoading ? (
              <div className="h-full bg-surface-container-low rounded-lg animate-pulse" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={cpuTrend ?? []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#53758C20" />
                  <XAxis dataKey="timestamp" tickFormatter={fmtTime} stroke="#53758C" fontSize={11} />
                  <YAxis unit="%" stroke="#53758C" fontSize={11} />
                  <Tooltip labelFormatter={(ts) => fmtTime(ts as number)} />
                  <Line type="monotone" dataKey="value" name="CPU" stroke="#f97316" dot={false} strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Memory Usage Chart */}
        <div className="bg-white border border-outline-variant rounded-xl p-lg flex flex-col shadow-xs">
          <div className="flex justify-between items-start mb-lg">
            <div>
              <h4 className="font-semibold text-base text-on-surface">Gateway Memory Usage</h4>
              <p className="text-xs text-on-surface-variant">System memory consumption over time</p>
            </div>
            <div className="flex items-center gap-xs">
              <span className="w-3 h-3 rounded-full bg-[#06b6d4]" />
              <span className="text-xs text-on-surface-variant font-medium">Memory</span>
            </div>
          </div>
          <div className="h-64 w-full">
            {isLoading ? (
              <div className="h-full bg-surface-container-low rounded-lg animate-pulse" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={memTrend ?? []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#53758C20" />
                  <XAxis dataKey="timestamp" tickFormatter={fmtTime} stroke="#53758C" fontSize={11} />
                  <YAxis tickFormatter={(v) => `${(v / 1024 / 1024).toFixed(0)}MB`} stroke="#53758C" fontSize={11} />
                  <Tooltip
                    labelFormatter={(ts) => fmtTime(ts as number)}
                    formatter={(value) => [`${(Number(value) / 1024 / 1024).toFixed(1)} MB`, 'Memory']}
                  />
                  <Area type="monotone" dataKey="value" name="Memory" stroke="#06b6d4" fill="#06b6d433" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Gateway Node Container Status Card */}
      <div className="bg-white border border-outline-variant rounded-xl p-lg shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-md">
        <div className="flex items-center gap-md">
          <div className="w-10 h-10 rounded-lg bg-surface-container-low border border-outline-variant flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-[24px]">dns</span>
          </div>
          <div>
            <div className="flex items-center gap-sm">
              <h4 className="font-semibold text-sm text-on-surface">
                {activeGateway ? `Gateway Container (${activeGateway.external_id || activeGateway.id.substring(0, 8)})` : 'Gateway Container'}
              </h4>
              <span
                className={`inline-flex items-center gap-1 font-semibold px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wide border ${
                  activeGateway?.status === 'running' || activeGateway?.status === 'active'
                    ? 'bg-green-50 text-green-700 border-green-200'
                    : activeGateway?.status === 'provisioning'
                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                    : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    activeGateway?.status === 'running' || activeGateway?.status === 'active'
                      ? 'bg-green-500'
                      : activeGateway?.status === 'provisioning'
                      ? 'bg-amber-500 animate-pulse'
                      : 'bg-slate-400'
                  }`}
                />
                {activeGateway?.status ?? 'Healthy / Running'}
              </span>
            </div>
            <p className="text-xs text-on-surface-variant mt-0.5">
              Engine: Gin Proxy Container | Host: {activeGateway?.public_host || activeGateway?.endpoint_ip || 'localhost'} | Port: {String(activeGateway?.public_port || activeGateway?.gateway_port || '8080')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-md text-xs text-on-surface-variant font-medium">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase text-outline font-bold">Plan</span>
            <span className="capitalize">{activeGateway?.plan || 'Standard'}</span>
          </div>
          <div className="h-6 w-[1px] bg-outline-variant" />
          <div className="flex flex-col">
            <span className="text-[10px] uppercase text-outline font-bold">Created</span>
            <span>{activeGateway?.created_at ? new Date(activeGateway.created_at).toLocaleDateString() : 'Active'}</span>
          </div>
        </div>
      </div>
    </section>
  );
};
