import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
} from 'recharts';
import { useDashboardSummaryQuery, useSystemRangeQuery } from '../hooks/useMetrics';
import { useActiveProject } from '../../../shared/hooks/useActiveProject';

export interface ObservabilitySummaryProps {
  readonly className?: string;
}

/** Formats a unix-millis timestamp to HH:MM for axis ticks. */
function fmtTime(ts: number): string {
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

/** Formats a numeric value with its unit for display in KPI cards. */
function fmtKPI(value: number, unit: string): string {
  if (unit === 'ms') return `${value.toFixed(1)} ms`;
  if (unit === 'req/s') return `${value.toFixed(2)} req/s`;
  if (unit === '%') return `${value.toFixed(1)}%`;
  return String(Math.round(value));
}

function statusColor(status: string, i: number) {
  const map: Record<string, string> = {
    '2xx': '#22c55e', '200': '#22c55e',
    '4xx': '#eab308',
    '5xx': '#ef4444',
  };
  return map[status] ?? ['#53758C', '#8b5cf6', '#06b6d4', '#f97316'][i % 4];
}

// status_breakdown comes back as N separate series (one per status code),
// each with its own points[]. This reshapes it into one row per timestamp
// so a stacked BarChart can read it: { timestamp, "200": v1, "500": v2, ... }
function pivotByTimestamp(series: { label: string; points: { timestamp: number; value: number }[] }[]) {
  const byTs: Record<number, Record<string, number>> = {};
  for (const s of series) {
    for (const p of s.points) {
      byTs[p.timestamp] = byTs[p.timestamp] || { timestamp: p.timestamp };
      byTs[p.timestamp][s.label] = p.value;
    }
  }
  return Object.values(byTs).sort((a, b) => (a.timestamp as number) - (b.timestamp as number));
}

const RANGE_OPTIONS = [
  { label: 'Last 5 minutes', value: '5m', step: '10s' },
  { label: 'Last 15 minutes', value: '15m', step: '15s' },
  { label: 'Last 30 minutes', value: '30m', step: '30s' },
  { label: 'Last 45 minutes', value: '45m', step: '45s' },
  { label: 'Last 1 hour', value: '1h', step: '60s' },
  { label: 'Last 3 hours', value: '3h', step: '60s' },
  { label: 'Last 12 hours', value: '12h', step: '5m' },
  { label: 'Last 24 hours', value: '24h', step: '10m' },
  { label: 'Last 3 days', value: '72h', step: '30m' },
  { label: 'Last 7 days', value: '168h', step: '1h' },
];

const SERVICES = ['elitegate-gateway', 'user-service', 'order-service'];

export const ObservabilitySummaryPage: React.FC<ObservabilitySummaryProps> = ({ className = '' }) => {
  const { projectId } = useActiveProject();
  const [timeRange, setTimeRange] = useState(RANGE_OPTIONS.find(opt => opt.value === '1h') || RANGE_OPTIONS[0]);
  const [isOpenRangeDropdown, setIsOpenRangeDropdown] = useState(false);
  const [selectedService, setSelectedService] = useState(SERVICES[0]);
  const [isOpenFilterDropdown, setIsOpenFilterDropdown] = useState(false);

  const { data: summary, isLoading, error } = useDashboardSummaryQuery(projectId);
  const { data: cpuTrend } = useSystemRangeQuery(projectId, selectedService, 'cpu', timeRange.value, timeRange.step);
  const { data: memTrend } = useSystemRangeQuery(projectId, selectedService, 'memory', timeRange.value, timeRange.step);

  /** KPI card definitions derived from the live summary payload. */
  const kpiCards = summary
    ? [
      { label: 'Request Rate', raw: summary.request_rate, icon: 'speed', color: 'text-[#53758C]' },
      { label: 'Error Rate', raw: summary.error_rate_pct || summary.error_rate, icon: 'error_outline', color: 'text-error' },
      { label: 'Latency P50', raw: summary.latency_p50, icon: 'timer', color: 'text-[#53758C]' },
      { label: 'Latency P95', raw: summary.latency_p95, icon: 'timer', color: 'text-[#53758C]' },
      { label: 'Active Requests', raw: summary.active_requests, icon: 'bolt', color: 'text-green-600' },
    ]
    : [];

  return (
    <div className={`space-y-lg text-left ${className}`}>
      {/* Breadcrumbs & Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-md">
        <div>
          <h2 className="font-display-lg text-display-lg text-on-surface">
            Observability Summary
          </h2>
        </div>

        <div className="flex items-center gap-sm">
          {/* Time Range Selector */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsOpenRangeDropdown(!isOpenRangeDropdown)}
              className="flex items-center bg-white border border-outline-variant rounded-lg px-md py-sm cursor-pointer hover:bg-surface-container-low transition-colors text-sm"
            >
              <span className="material-symbols-outlined mr-sm text-outline text-[18px]">calendar_today</span>
              <span className="font-body-md pr-md">{timeRange.label}</span>
              <span className="material-symbols-outlined text-outline text-[18px]">expand_more</span>
            </button>
            {isOpenRangeDropdown && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsOpenRangeDropdown(false)} />
                <div className="absolute right-0 mt-xs w-48 bg-white border border-outline-variant rounded-lg shadow-lg z-20 py-xs text-left">
                  {RANGE_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        setTimeRange(opt);
                        setIsOpenRangeDropdown(false);
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

          {/* Filter Selector */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsOpenFilterDropdown(!isOpenFilterDropdown)}
              className="p-sm bg-white border border-outline-variant rounded-lg hover:bg-surface-container-low transition-colors text-on-surface flex items-center justify-center cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">filter_list</span>
            </button>
            {isOpenFilterDropdown && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsOpenFilterDropdown(false)} />
                <div className="absolute right-0 mt-xs w-48 bg-white border border-outline-variant rounded-lg shadow-lg z-20 py-xs text-left">
                  <div className="px-md py-sm border-b border-outline-variant/60 text-[10px] font-bold text-outline uppercase tracking-wider">
                    Filter by Service
                  </div>
                  {SERVICES.map((svc) => (
                    <button
                      key={svc}
                      type="button"
                      onClick={() => {
                        setSelectedService(svc);
                        setIsOpenFilterDropdown(false);
                      }}
                      className={`w-full text-left px-md py-sm text-xs font-semibold hover:bg-surface-container-low transition-colors ${
                        selectedService === svc ? 'text-primary bg-surface-container-low/50 font-bold' : 'text-on-surface-variant'
                      }`}
                    >
                      {svc}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-md py-sm rounded-lg flex items-center gap-sm text-sm font-semibold">
          <span className="material-symbols-outlined text-[20px]">error_outline</span>
          Failed to load metrics: {(error as Error).message || 'Unknown error'}
        </div>
      )}

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-gutter">
        {isLoading
          ? Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-white border border-outline-variant rounded-xl p-lg animate-pulse flex flex-col gap-3">
              <div className="h-3 w-24 bg-surface-container rounded" />
              <div className="h-7 w-20 bg-surface-container rounded" />
              <div className="h-12 bg-surface-container rounded" />
            </div>
          ))
          : kpiCards.map(({ label, raw, icon, color }) => (
            <div
              key={label}
              className="bg-white border border-outline-variant rounded-xl p-lg flex flex-col justify-between shadow-sm"
            >
              <div className="flex items-center justify-between mb-sm">
                <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                  {label}
                </span>
                <span className={`material-symbols-outlined text-[18px] ${color}`}>{icon}</span>
              </div>
              <div className="text-[24px] font-bold text-on-surface">
                {fmtKPI(raw.value, raw.unit)}
              </div>
              <div className="text-[11px] text-on-surface-variant mt-1">{raw.unit}</div>
            </div>
          ))}
      </div>

      {/* Main Charts Grid: Request Rate Trend & Status Code Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter">
        {/* Request Rate Trend Chart */}
        <div className="bg-white border border-outline-variant rounded-xl p-lg flex flex-col shadow-sm">
          <div className="flex justify-between items-start mb-lg">
            <div>
              <h3 className="font-semibold text-lg text-on-surface">Request Rate Trend</h3>
              <p className="text-xs text-on-surface-variant">Requests/sec over the last hour</p>
            </div>
            <div className="flex items-center gap-xs">
              <span className="w-3 h-3 rounded-full bg-[#53758C]" />
              <span className="text-xs text-on-surface-variant font-medium">req/s</span>
            </div>
          </div>

          <div className="h-64 w-full">
            {isLoading ? (
              <div className="h-full bg-surface-container-low rounded-lg animate-pulse" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={summary?.request_rate_trend ?? []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#53758C20" />
                  <XAxis dataKey="timestamp" tickFormatter={fmtTime} stroke="#53758C" fontSize={11} />
                  <YAxis stroke="#53758C" fontSize={11} />
                  <Tooltip labelFormatter={(ts) => fmtTime(ts as number)} />
                  <Area type="monotone" dataKey="value" name="req/s" stroke="#53758C" fill="#53758C33" strokeWidth={2} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* HTTP Status Code Breakdown (Stacked BarChart) */}
        <div className="bg-white border border-outline-variant rounded-xl p-lg flex flex-col shadow-sm">
          <div className="flex justify-between items-start mb-lg">
            <div>
              <h3 className="font-semibold text-lg text-on-surface">HTTP Status Code Breakdown</h3>
              <p className="text-xs text-on-surface-variant">Requests status split over time</p>
            </div>
          </div>

          <div className="h-64 w-full">
            {isLoading ? (
              <div className="h-full bg-surface-container-low rounded-lg animate-pulse" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={pivotByTimestamp(summary?.status_breakdown ?? [])}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#53758C20" />
                  <XAxis dataKey="timestamp" tickFormatter={fmtTime} stroke="#53758C" fontSize={11} />
                  <YAxis stroke="#53758C" fontSize={11} />
                  <Tooltip labelFormatter={(ts) => fmtTime(ts as number)} />
                  {(summary?.status_breakdown ?? []).map((s, i) => (
                    <Bar key={s.label} dataKey={s.label} stackId="status" fill={statusColor(s.label, i)} />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Performance Trends: Average Latency & Total Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter">
        {/* Average Latency */}
        <div className="bg-white border border-outline-variant rounded-xl p-lg flex flex-col shadow-sm">
          <div className="flex justify-between items-start mb-lg">
            <div>
              <h3 className="font-semibold text-lg text-on-surface">Average Latency</h3>
              <p className="text-xs text-on-surface-variant">Historical average latency trend</p>
            </div>
            <div className="flex items-center gap-xs">
              <span className="w-3 h-3 rounded-full bg-[#8b5cf6]" />
              <span className="text-xs text-on-surface-variant font-medium">ms</span>
            </div>
          </div>
          <div className="h-64 w-full">
            {isLoading ? (
              <div className="h-full bg-surface-container-low rounded-lg animate-pulse" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={summary?.latency_avg_trend ?? []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#53758C20" />
                  <XAxis dataKey="timestamp" tickFormatter={fmtTime} stroke="#53758C" fontSize={11} />
                  <YAxis stroke="#53758C" fontSize={11} />
                  <Tooltip labelFormatter={(ts) => fmtTime(ts as number)} />
                  <Line type="monotone" dataKey="value" name="avg latency" stroke="#8b5cf6" dot={false} strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Total Requests */}
        <div className="bg-white border border-outline-variant rounded-xl p-lg flex flex-col shadow-sm">
          <div className="flex justify-between items-start mb-lg">
            <div>
              <h3 className="font-semibold text-lg text-on-surface">Total Requests</h3>
              <p className="text-xs text-on-surface-variant">Cumulative request rate trend</p>
            </div>
            <div className="flex items-center gap-xs">
              <span className="w-3 h-3 rounded-full bg-[#06b6d4]" />
              <span className="text-xs text-on-surface-variant font-medium">req/s</span>
            </div>
          </div>
          <div className="h-64 w-full">
            {isLoading ? (
              <div className="h-full bg-surface-container-low rounded-lg animate-pulse" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={summary?.request_rate_trend ?? []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#53758C20" />
                  <XAxis dataKey="timestamp" tickFormatter={fmtTime} stroke="#53758C" fontSize={11} />
                  <YAxis stroke="#53758C" fontSize={11} />
                  <Tooltip labelFormatter={(ts) => fmtTime(ts as number)} />
                  <Area type="monotone" dataKey="value" name="req/s" stroke="#06b6d4" fill="#06b6d433" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      {/* Sub Charts & Metrics Grid: Top Routes, Top Upstreams & Upstream Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
        {/* Top Routes (Horizontal BarChart) */}
        <div className="bg-white border border-outline-variant rounded-xl p-lg flex flex-col shadow-sm">
          <div className="mb-lg">
            <h3 className="font-semibold text-lg text-on-surface">Top Routes</h3>
            <p className="text-xs text-on-surface-variant">Most active routes by request volume</p>
          </div>

          <div className="h-64 w-full">
            {isLoading ? (
              <div className="h-full bg-surface-container-low rounded-lg animate-pulse" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={summary?.top_routes?.map(r => ({ name: r.label, value: r.points[0]?.value ?? 0 })) ?? []}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#53758C20" />
                  <XAxis type="number" stroke="#53758C" fontSize={11} />
                  <YAxis dataKey="name" type="category" width={120} stroke="#53758C" fontSize={11} />
                  <Tooltip />
                  <Bar dataKey="value" name="req/s" fill="#53758C" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Top Upstreams (Horizontal BarChart) */}
        <div className="bg-white border border-outline-variant rounded-xl p-lg flex flex-col shadow-sm">
          <div className="mb-lg">
            <h3 className="font-semibold text-lg text-on-surface">Top Upstreams</h3>
            <p className="text-xs text-on-surface-variant">Most active upstream services by request volume</p>
          </div>

          <div className="h-64 w-full">
            {isLoading ? (
              <div className="h-full bg-surface-container-low rounded-lg animate-pulse" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={summary?.top_upstreams?.map(u => ({ name: u.label, value: u.points[0]?.value ?? 0 })) ?? []}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#53758C20" />
                  <XAxis type="number" stroke="#53758C" fontSize={11} />
                  <YAxis dataKey="name" type="category" width={120} stroke="#53758C" fontSize={11} />
                  <Tooltip />
                  <Bar dataKey="value" name="req/s" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Upstream Health Status with Donut */}
        <div className="bg-white border border-outline-variant rounded-xl p-lg flex flex-col shadow-sm">
          <div className="mb-lg">
            <h3 className="font-semibold text-lg text-on-surface">Upstream Target Health</h3>
            <p className="text-xs text-on-surface-variant">Real-time load balancer targets status</p>
          </div>

          {isLoading ? (
            <div className="flex-1 flex flex-col gap-sm">
              <div className="h-32 bg-surface-container-low rounded-lg animate-pulse" />
              <div className="h-20 bg-surface-container-low rounded-lg animate-pulse" />
            </div>
          ) : (
            <div className="flex flex-col h-64 justify-between">
              {/* Donut Chart */}
              <div className="h-32 w-full flex items-center justify-center">
                <div className="w-1/2 h-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Healthy', value: summary?.upstream_health?.filter(u => u.healthy).length ?? 0 },
                          { name: 'Unhealthy', value: summary?.upstream_health?.filter(u => !u.healthy).length ?? 0 },
                        ]}
                        dataKey="value"
                        innerRadius={30}
                        outerRadius={45}
                        paddingAngle={4}
                      >
                        <Cell fill="#22c55e" />
                        <Cell fill="#ef4444" />
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Custom side-legend next to pie */}
                <div className="w-1/2 flex flex-col gap-xs pl-sm text-[11px] font-semibold">
                  <div className="flex items-center gap-sm">
                    <span className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-on-surface truncate">
                      Healthy: {summary?.upstream_health?.filter(u => u.healthy).length ?? 0}
                    </span>
                  </div>
                  <div className="flex items-center gap-sm">
                    <span className="w-2 h-2 rounded-full bg-red-500" />
                    <span className="text-on-surface truncate">
                      Unhealthy: {summary?.upstream_health?.filter(u => !u.healthy).length ?? 0}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status List */}
              <div className="h-28 overflow-y-auto mt-sm pt-sm border-t border-outline-variant space-y-xs">
                {summary?.upstream_health && summary.upstream_health.length > 0 ? (
                  summary.upstream_health.map((target, idx) => (
                    <div key={idx} className="flex items-center justify-between py-1 text-xs">
                      <span className="font-mono text-on-surface truncate pr-md text-[11px]">{target.upstream}</span>
                      <span className={`inline-flex items-center gap-1 font-semibold px-2 py-0.5 rounded-full text-[10px] ${target.healthy ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                        }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${target.healthy ? 'bg-green-500' : 'bg-red-500'}`} />
                        {target.healthy ? 'Healthy' : 'Unhealthy'}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="h-full flex items-center justify-center text-xs text-on-surface-variant">
                    No active upstream targets found.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Platform & Concurrency Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
        {/* Active Requests */}
        <div className="bg-white border border-outline-variant rounded-xl p-lg flex flex-col shadow-sm">
          <div className="flex justify-between items-start mb-lg">
            <div>
              <h3 className="font-semibold text-lg text-on-surface">Active Requests</h3>
              <p className="text-xs text-on-surface-variant">Concurrency and active connections</p>
            </div>
            <div className="flex items-center gap-xs">
              <span className="material-symbols-outlined text-[18px] text-green-600">bolt</span>
            </div>
          </div>
          <div className="h-64 flex flex-col justify-between">
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Current Connections</span>
              <span className="text-[36px] font-bold text-on-surface leading-tight mt-xs">
                {isLoading ? '...' : (summary?.active_requests?.value ?? 0)}
              </span>
              <span className="text-[11px] text-on-surface-variant">{summary?.active_requests?.unit ?? 'requests'}</span>
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

        {/* CPU Usage */}
        <div className="bg-white border border-outline-variant rounded-xl p-lg flex flex-col shadow-sm">
          <div className="flex justify-between items-start mb-lg">
            <div>
              <h3 className="font-semibold text-lg text-on-surface">CPU Usage</h3>
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

        {/* Memory Usage */}
        <div className="bg-white border border-outline-variant rounded-xl p-lg flex flex-col shadow-sm">
          <div className="flex justify-between items-start mb-lg">
            <div>
              <h3 className="font-semibold text-lg text-on-surface">Memory Usage</h3>
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
                  <Tooltip labelFormatter={(ts) => fmtTime(ts as number)} formatter={(value) => [`${(Number(value) / 1024 / 1024).toFixed(1)} MB`, 'Memory']} />
                  <Area type="monotone" dataKey="value" name="Memory" stroke="#06b6d4" fill="#06b6d433" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>



      {/* Footer Meta */}
      <footer className="mt-xl pt-lg border-t border-outline-variant flex flex-col md:flex-row md:items-center justify-between text-xs text-outline">
        <p>© 2026 Elite Gate Console. All systems operational.</p>
        <div className="flex items-center gap-xl mt-md md:mt-0 font-medium">
          <a href="#privacy" className="hover:text-[#53758C] transition-colors" onClick={(e) => e.preventDefault()}>Privacy Policy</a>
          <a href="#reference" className="hover:text-[#53758C] transition-colors" onClick={(e) => e.preventDefault()}>API Reference</a>
          <a href="#feedback" className="hover:text-[#53758C] transition-colors" onClick={(e) => e.preventDefault()}>Feedback</a>
        </div>
      </footer>
    </div>
  );
};

export default ObservabilitySummaryPage;

