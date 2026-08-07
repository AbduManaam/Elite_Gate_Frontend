import React from 'react';
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
  LineChart,
  Line,
} from 'recharts';
import type { DashboardSummary } from '../api/metricsApi';

export interface ProjectAnalyticsSectionProps {
  /** Summary metrics payload returned from the API/query hook */
  readonly summary: DashboardSummary | undefined;
  /** True when metrics are actively loading */
  readonly isLoading: boolean;
}

/** Formats unix timestamp in milliseconds to HH:MM for chart axis ticks. */
function fmtTime(ts: number): string {
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

/** Formats numerical KPI values with appropriate unit suffix. */
function fmtKPI(value: number | undefined | null, unit: string | undefined | null): string {
  if (value === undefined || value === null || Number.isNaN(value)) return '0';
  const u = unit ?? '';
  if (u === 'ms') return `${value.toFixed(1)} ms`;
  if (u === 'req/s') return `${value.toFixed(2)} req/s`;
  if (u === '%') return `${value.toFixed(1)}%`;
  return String(Math.round(value));
}

/** Returns status code indicator color for HTTP status breakdown bars. */
function statusColor(status: string, i: number): string {
  const map: Record<string, string> = {
    '2xx': '#22c55e',
    '200': '#22c55e',
    '4xx': '#eab308',
    '5xx': '#ef4444',
  };
  return map[status] ?? ['#53758C', '#8b5cf6', '#06b6d4', '#f97316'][i % 4];
}

/** Reshapes status breakdown series into single object per timestamp for stacked bar chart. */
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

/**
  * Project Analytics section displaying project-scoped request rates, latencies,
  * status code distributions, top routes, top upstreams, and target health.
  */
export const ProjectAnalyticsSection: React.FC<ProjectAnalyticsSectionProps> = ({
  summary,
  isLoading,
}) => {
  const kpiCards = summary
    ? [
        { label: 'Request Rate', raw: summary.request_rate, icon: 'speed', color: 'text-[#53758C]' },
        { label: 'Error Rate', raw: summary.error_rate_pct || summary.error_rate, icon: 'error_outline', color: 'text-error' },
        { label: 'Latency P50', raw: summary.latency_p50, icon: 'timer', color: 'text-[#53758C]' },
        { label: 'Latency P95', raw: summary.latency_p95, icon: 'timer', color: 'text-[#53758C]' },
      ]
    : [];

  return (
    <section className="space-y-lg">
      {/* Section Header */}
      <div className="border-b border-outline-variant/60 pb-md">
        <h3 className="font-display-md text-xl font-bold text-on-surface flex items-center gap-xs">
          <span className="material-symbols-outlined text-primary text-[22px]">analytics</span>
          Project Analytics
        </h3>
        <p className="text-xs text-on-surface-variant mt-0.5">
          Request volume, latency percentiles, HTTP status code breakdown, top routes and upstream target health.
        </p>
      </div>

      {/* Summary KPI Cards Grid (4 columns) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white border border-outline-variant rounded-xl p-lg animate-pulse flex flex-col gap-3">
                <div className="h-3 w-24 bg-surface-container rounded" />
                <div className="h-7 w-20 bg-surface-container rounded" />
                <div className="h-4 w-12 bg-surface-container rounded" />
              </div>
            ))
          : kpiCards.map(({ label, raw, icon, color }) => (
              <div
                key={label}
                className="bg-white border border-outline-variant rounded-xl p-lg flex flex-col justify-between shadow-xs hover:border-outline transition-colors"
              >
                <div className="flex items-center justify-between mb-sm">
                  <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                    {label}
                  </span>
                  <span className={`material-symbols-outlined text-[18px] ${color}`}>{icon}</span>
                </div>
                <div className="text-[24px] font-bold text-on-surface">
                  {fmtKPI(raw?.value, raw?.unit)}
                </div>
                <div className="text-[11px] text-on-surface-variant mt-1">{raw?.unit ?? ''}</div>
              </div>
            ))}
      </div>

      {/* Traffic & Latency Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter">
        {/* Request Rate Trend */}
        <div className="bg-white border border-outline-variant rounded-xl p-lg flex flex-col shadow-xs">
          <div className="flex justify-between items-start mb-lg">
            <div>
              <h4 className="font-semibold text-base text-on-surface">Request Rate Trend</h4>
              <p className="text-xs text-on-surface-variant">Requests/sec over the selected timeframe</p>
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

        {/* HTTP Status Code Breakdown */}
        <div className="bg-white border border-outline-variant rounded-xl p-lg flex flex-col shadow-xs">
          <div className="flex justify-between items-start mb-lg">
            <div>
              <h4 className="font-semibold text-base text-on-surface">HTTP Status Code Breakdown</h4>
              <p className="text-xs text-on-surface-variant">Request status distribution over time</p>
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
        <div className="bg-white border border-outline-variant rounded-xl p-lg flex flex-col shadow-xs">
          <div className="flex justify-between items-start mb-lg">
            <div>
              <h4 className="font-semibold text-base text-on-surface">Average Latency</h4>
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
        <div className="bg-white border border-outline-variant rounded-xl p-lg flex flex-col shadow-xs">
          <div className="flex justify-between items-start mb-lg">
            <div>
              <h4 className="font-semibold text-base text-on-surface">Total Requests</h4>
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
        {/* Top Routes */}
        <div className="bg-white border border-outline-variant rounded-xl p-lg flex flex-col shadow-xs">
          <div className="mb-lg">
            <h4 className="font-semibold text-base text-on-surface">Top Routes</h4>
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

        {/* Top Upstreams */}
        <div className="bg-white border border-outline-variant rounded-xl p-lg flex flex-col shadow-xs">
          <div className="mb-lg">
            <h4 className="font-semibold text-base text-on-surface">Top Upstreams</h4>
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
        <div className="bg-white border border-outline-variant rounded-xl p-lg flex flex-col shadow-xs">
          <div className="mb-lg">
            <h4 className="font-semibold text-base text-on-surface">Upstream Target Health</h4>
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
                      <span
                        className={`inline-flex items-center gap-1 font-semibold px-2 py-0.5 rounded-full text-[10px] ${
                          target.healthy ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                        }`}
                      >
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
    </section>
  );
};
