import React, { useState } from 'react';
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
  BarChart,
  Bar,
} from 'recharts';
import { useActiveProject } from '../../../shared/hooks/useActiveProject';
import { useDashboardSummaryQuery, useProjectSystemRangeQuery } from '../../observability/hooks/useMetrics';
import { useGatewaysQuery } from '../hooks/useGateways';

const TIME_RANGES = [
  { label: 'Last 5 minutes', value: '5m', step: '10s' },
  { label: 'Last 15 minutes', value: '15m', step: '15s' },
  { label: 'Last 30 minutes', value: '30m', step: '30s' },
  { label: 'Last 1 hour', value: '1h', step: '60s' },
  { label: 'Last 3 hours', value: '3h', step: '60s' },
  { label: 'Last 12 hours', value: '12h', step: '5m' },
  { label: 'Last 24 hours', value: '24h', step: '10m' },
  { label: 'Last 7 days', value: '168h', step: '1h' },
];

function fmtTime(ts: number): string {
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function fmtKPI(value: number | undefined | null, unit: string | undefined | null): string {
  if (value === undefined || value === null || Number.isNaN(value)) return '0';
  const u = unit ?? '';
  if (u === 'ms') return `${value.toFixed(1)} ms`;
  if (u === 'req/s') return `${value.toFixed(2)} req/s`;
  if (u === '%') return `${value.toFixed(1)}%`;
  return String(Math.round(value));
}

function pivotStatusBreakdown(series: { label: string; points: { timestamp: number; value: number }[] }[]) {
  const byTs: Record<number, Record<string, number>> = {};
  for (const s of series) {
    for (const p of s.points) {
      byTs[p.timestamp] = byTs[p.timestamp] || { timestamp: p.timestamp };
      byTs[p.timestamp][s.label] = p.value;
    }
  }
  return Object.values(byTs).sort((a, b) => (a.timestamp as number) - (b.timestamp as number));
}

export const GatewayMonitoringPage: React.FC = () => {
  const { projectId, projectRole } = useActiveProject();
  const [timeRange, setTimeRange] = useState(TIME_RANGES[3]); // Default 1h
  const [isRangeOpen, setIsRangeOpen] = useState(false);

  // Queries
  const { data: gateways, isLoading: isGatewaysLoading } = useGatewaysQuery(projectId ?? '');

  // Strictly select only a genuinely active/running gateway
  const activeGateway = gateways?.find(
    (gw) => gw.status === 'active' || gw.status === 'running'
  );
  const hasNoGateway = !isGatewaysLoading && !activeGateway;

  const {
    data: summary,
    isLoading: isSummaryLoading,
    error: summaryError,
  } = useDashboardSummaryQuery(projectId);

  // Pass service = 'elitegate-gateway' so backend automatically resolves the project gateway job
  const { data: cpuTrend, isLoading: isCpuLoading } = useProjectSystemRangeQuery(
    projectId,
    'elitegate-gateway',
    'cpu',
    timeRange.value,
    timeRange.step,
    projectRole
  );

  const { data: memTrend, isLoading: isMemLoading } = useProjectSystemRangeQuery(
    projectId,
    'elitegate-gateway',
    'memory',
    timeRange.value,
    timeRange.step,
    projectRole
  );

  const isLoading = isGatewaysLoading || isSummaryLoading || isCpuLoading || isMemLoading;

  return (
    <div className="flex flex-col gap-lg text-left space-y-lg">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-md border-b border-outline-variant/60 pb-md">
        <div>
          <div className="flex items-center gap-sm">
            <h2 className="font-display-lg text-display-lg text-on-surface">Gateway Monitoring</h2>
            <span className="bg-surface-container-high text-on-surface-variant font-semibold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded border border-outline-variant">
              Read Only
            </span>
          </div>
          <p className="text-sm text-on-surface-variant mt-1">
            Read-only runtime and performance metrics for this project&apos;s dedicated gateway.
          </p>
        </div>

        {/* Time Range Filter */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsRangeOpen(!isRangeOpen)}
            className="flex items-center bg-white border border-outline-variant rounded-lg px-md py-sm cursor-pointer hover:bg-surface-container-low transition-colors text-sm"
          >
            <span className="material-symbols-outlined mr-sm text-outline text-[18px]">calendar_today</span>
            <span className="font-medium pr-md text-xs">{timeRange.label}</span>
            <span className="material-symbols-outlined text-outline text-[18px]">expand_more</span>
          </button>
          {isRangeOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setIsRangeOpen(false)} />
              <div className="absolute right-0 mt-xs w-48 bg-white border border-outline-variant rounded-lg shadow-lg z-20 py-xs text-left">
                {TIME_RANGES.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      setTimeRange(opt);
                      setIsRangeOpen(false);
                    }}
                    className={`w-full text-left px-md py-sm text-xs font-semibold hover:bg-surface-container-low transition-colors ${
                      timeRange.value === opt.value ? 'text-primary bg-surface-container-low/50 font-bold' : 'text-on-surface-variant'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* No Gateway Banner */}
      {hasNoGateway && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 p-lg rounded-xl flex items-center gap-md">
          <span className="material-symbols-outlined text-amber-600 text-[24px]">warning</span>
          <div>
            <h4 className="font-semibold text-sm">No Active Gateway Provisioned</h4>
            <p className="text-xs text-amber-700 mt-0.5">
              This project does not currently have an active dedicated gateway. Telemetry will become available once a gateway is provisioned and running.
            </p>
          </div>
        </div>
      )}

      {/* Error Banner */}
      {summaryError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-md py-sm rounded-lg flex items-center gap-sm text-sm font-semibold">
          <span className="material-symbols-outlined text-[20px]">error_outline</span>
          Failed to load gateway metrics: {(summaryError as Error).message || 'Unknown error'}
        </div>
      )}

      {/* Section 1: Gateway Overview KPIs */}
      <section className="space-y-md">
        <div className="border-b border-outline-variant/40 pb-xs">
          <h3 className="font-semibold text-sm text-on-surface uppercase tracking-wider text-outline">
            Gateway Overview
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-md">
          {/* Gateway Status */}
          <div className="bg-white border border-outline-variant rounded-xl p-md flex flex-col justify-between shadow-xs">
            <span className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">Gateway Status</span>
            <div className="mt-xs">
              <span className={`inline-flex items-center gap-1.5 font-bold px-2.5 py-1 rounded-full text-xs border ${
                activeGateway?.status === 'running' || activeGateway?.status === 'active'
                  ? 'bg-green-50 text-green-700 border-green-200'
                  : 'bg-slate-50 text-slate-700 border-slate-200'
              }`}>
                <span className={`w-2 h-2 rounded-full ${
                  activeGateway?.status === 'running' || activeGateway?.status === 'active'
                    ? 'bg-green-500'
                    : 'bg-slate-400'
                }`} />
                {activeGateway?.status ? activeGateway.status.toUpperCase() : 'NO GATEWAY'}
              </span>
            </div>
            <span className="text-[10px] text-on-surface-variant mt-xs truncate">
              {activeGateway?.public_host || activeGateway?.endpoint_ip || 'No active cluster node'}
            </span>
          </div>

          {/* Active Requests */}
          <div className="bg-white border border-outline-variant rounded-xl p-md flex flex-col justify-between shadow-xs">
            <span className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">Active Requests</span>
            <span className="text-2xl font-extrabold text-on-surface mt-xs">
              {isLoading ? '...' : (summary?.active_requests?.value ?? 0)}
            </span>
            <span className="text-[10px] text-on-surface-variant mt-xs">In-flight HTTP requests</span>
          </div>

          {/* Request Rate */}
          <div className="bg-white border border-outline-variant rounded-xl p-md flex flex-col justify-between shadow-xs">
            <span className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">Request Rate</span>
            <span className="text-2xl font-extrabold text-on-surface mt-xs">
              {isLoading ? '...' : fmtKPI(summary?.request_rate?.value, summary?.request_rate?.unit)}
            </span>
            <span className="text-[10px] text-on-surface-variant mt-xs">Throughput</span>
          </div>

          {/* Error Rate */}
          <div className="bg-white border border-outline-variant rounded-xl p-md flex flex-col justify-between shadow-xs">
            <span className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">Error Rate</span>
            <span className="text-2xl font-extrabold text-red-600 mt-xs">
              {isLoading ? '...' : fmtKPI(summary?.error_rate_pct?.value ?? summary?.error_rate?.value, '%')}
            </span>
            <span className="text-[10px] text-on-surface-variant mt-xs">HTTP 4xx/5xx errors</span>
          </div>

          {/* P50 Latency */}
          <div className="bg-white border border-outline-variant rounded-xl p-md flex flex-col justify-between shadow-xs">
            <span className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">P50 Latency</span>
            <span className="text-2xl font-extrabold text-on-surface mt-xs">
              {isLoading ? '...' : fmtKPI(summary?.latency_p50?.value, 'ms')}
            </span>
            <span className="text-[10px] text-on-surface-variant mt-xs">Median response</span>
          </div>

          {/* P95 Latency */}
          <div className="bg-white border border-outline-variant rounded-xl p-md flex flex-col justify-between shadow-xs">
            <span className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider">P95 Latency</span>
            <span className="text-2xl font-extrabold text-on-surface mt-xs">
              {isLoading ? '...' : fmtKPI(summary?.latency_p95?.value, 'ms')}
            </span>
            <span className="text-[10px] text-on-surface-variant mt-xs">95th percentile</span>
          </div>
        </div>
      </section>

      {/* Section 2: Traffic Performance Charts */}
      <section className="space-y-md">
        <div className="border-b border-outline-variant/40 pb-xs">
          <h3 className="font-semibold text-sm text-on-surface uppercase tracking-wider text-outline">
            Traffic Performance
          </h3>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-md">
          {/* Request Rate Trend */}
          <div className="bg-white border border-outline-variant rounded-xl p-lg flex flex-col shadow-xs">
            <h4 className="font-semibold text-sm text-on-surface mb-xs">Request Rate Trend</h4>
            <p className="text-xs text-on-surface-variant mb-md">Throughput in req/s over time</p>
            <div className="h-48 w-full">
              {isLoading ? (
                <div className="h-full bg-surface-container-low rounded-lg animate-pulse" />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={summary?.request_rate_trend ?? []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#53758C20" />
                    <XAxis dataKey="timestamp" tickFormatter={fmtTime} stroke="#53758C" fontSize={10} />
                    <YAxis stroke="#53758C" fontSize={10} />
                    <Tooltip labelFormatter={(ts) => fmtTime(ts as number)} />
                    <Area type="monotone" dataKey="value" stroke="#53758C" fill="#53758C33" strokeWidth={2} dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* HTTP Status Trend */}
          <div className="bg-white border border-outline-variant rounded-xl p-lg flex flex-col shadow-xs">
            <h4 className="font-semibold text-sm text-on-surface mb-xs">HTTP Status Breakdown</h4>
            <p className="text-xs text-on-surface-variant mb-md">Status codes over time</p>
            <div className="h-48 w-full">
              {isLoading ? (
                <div className="h-full bg-surface-container-low rounded-lg animate-pulse" />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={pivotStatusBreakdown(summary?.status_breakdown ?? [])}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#53758C20" />
                    <XAxis dataKey="timestamp" tickFormatter={fmtTime} stroke="#53758C" fontSize={10} />
                    <YAxis stroke="#53758C" fontSize={10} />
                    <Tooltip labelFormatter={(ts) => fmtTime(ts as number)} />
                    {(summary?.status_breakdown ?? []).map((s) => (
                      <Bar key={s.label} dataKey={s.label} stackId="status" fill={s.label.startsWith('2') ? '#22c55e' : s.label.startsWith('4') ? '#eab308' : '#ef4444'} />
                    ))}
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Latency Trend */}
          <div className="bg-white border border-outline-variant rounded-xl p-lg flex flex-col shadow-xs">
            <h4 className="font-semibold text-sm text-on-surface mb-xs">Average Latency Trend</h4>
            <p className="text-xs text-on-surface-variant mb-md">Latency in ms over time</p>
            <div className="h-48 w-full">
              {isLoading ? (
                <div className="h-full bg-surface-container-low rounded-lg animate-pulse" />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={summary?.latency_avg_trend ?? []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#53758C20" />
                    <XAxis dataKey="timestamp" tickFormatter={fmtTime} stroke="#53758C" fontSize={10} />
                    <YAxis stroke="#53758C" fontSize={10} />
                    <Tooltip labelFormatter={(ts) => fmtTime(ts as number)} />
                    <Line type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Gateway Resources */}
      <section className="space-y-md">
        <div className="border-b border-outline-variant/40 pb-xs">
          <h3 className="font-semibold text-sm text-on-surface uppercase tracking-wider text-outline">
            Gateway System Resources
          </h3>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-md">
          {/* CPU Usage */}
          <div className="bg-white border border-outline-variant rounded-xl p-lg flex flex-col shadow-xs">
            <div className="flex justify-between items-center mb-md">
              <div>
                <h4 className="font-semibold text-sm text-on-surface">Gateway CPU Usage</h4>
                <p className="text-xs text-on-surface-variant">System CPU utilization over time</p>
              </div>
              <span className="text-xs font-semibold text-on-surface-variant">CPU %</span>
            </div>
            <div className="h-52 w-full">
              {isLoading ? (
                <div className="h-full bg-surface-container-low rounded-lg animate-pulse" />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={cpuTrend ?? []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#53758C20" />
                    <XAxis dataKey="timestamp" tickFormatter={fmtTime} stroke="#53758C" fontSize={10} />
                    <YAxis unit="%" stroke="#53758C" fontSize={10} />
                    <Tooltip labelFormatter={(ts) => fmtTime(ts as number)} />
                    <Line type="monotone" dataKey="value" stroke="#f97316" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Memory Usage */}
          <div className="bg-white border border-outline-variant rounded-xl p-lg flex flex-col shadow-xs">
            <div className="flex justify-between items-center mb-md">
              <div>
                <h4 className="font-semibold text-sm text-on-surface">Gateway Memory Usage</h4>
                <p className="text-xs text-on-surface-variant">System memory consumption over time</p>
              </div>
              <span className="text-xs font-semibold text-on-surface-variant">Memory</span>
            </div>
            <div className="h-52 w-full">
              {isLoading ? (
                <div className="h-full bg-surface-container-low rounded-lg animate-pulse" />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={memTrend ?? []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#53758C20" />
                    <XAxis dataKey="timestamp" tickFormatter={fmtTime} stroke="#53758C" fontSize={10} />
                    <YAxis tickFormatter={(v) => `${(v / 1024 / 1024).toFixed(0)}MB`} stroke="#53758C" fontSize={10} />
                    <Tooltip
                      labelFormatter={(ts) => fmtTime(ts as number)}
                      formatter={(value) => [`${(Number(value) / 1024 / 1024).toFixed(1)} MB`, 'Memory']}
                    />
                    <Area type="monotone" dataKey="value" stroke="#06b6d4" fill="#06b6d433" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GatewayMonitoringPage;
