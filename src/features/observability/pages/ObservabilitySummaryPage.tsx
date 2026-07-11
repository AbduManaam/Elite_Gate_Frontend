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
} from 'recharts';
import { useDashboardSummaryQuery } from '../hooks/useMetrics';
import { useActiveProject } from '../../../shared/hooks/useActiveProject';
import { MOCK_TRAFFIC_MARKERS } from '../../../shared/mocks/observabilityMock';

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

export const ObservabilitySummaryPage: React.FC<ObservabilitySummaryProps> = ({ className = '' }) => {
  const { projectId } = useActiveProject();
  const { data: summary, isLoading, error } = useDashboardSummaryQuery(projectId);

  /** KPI card definitions derived from the live summary payload. */
  const kpiCards = summary
    ? [
        { label: 'Request Rate',    raw: summary.request_rate,   icon: 'speed',          color: 'text-[#53758C]' },
        { label: 'Error Rate',      raw: summary.error_rate_pct || summary.error_rate, icon: 'error_outline',  color: 'text-error'     },
        { label: 'Latency P50',     raw: summary.latency_p50,    icon: 'timer',          color: 'text-[#53758C]' },
        { label: 'Latency P95',     raw: summary.latency_p95,    icon: 'timer',          color: 'text-[#53758C]' },
        { label: 'Active Requests', raw: summary.active_requests, icon: 'bolt',          color: 'text-green-600' },
      ]
    : [];

  return (
    <div className={`space-y-lg text-left ${className}`}>
      {/* Breadcrumbs & Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-md">
        <div>
          <nav className="flex items-center gap-xs text-label-md font-label-md text-on-surface-variant mb-base text-xs">
            <span>Analytics</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="hover:text-[#53758C] cursor-pointer">Observability</span>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-[#53758C] font-semibold">Summary</span>
          </nav>
          <h2 className="font-display-lg text-display-lg text-on-surface">
            Observability Summary
          </h2>
        </div>

        <div className="flex items-center gap-sm">
          <button
            type="button"
            className="flex items-center bg-white border border-outline-variant rounded-lg px-md py-sm cursor-pointer hover:bg-surface-container-low transition-colors text-sm"
          >
            <span className="material-symbols-outlined mr-sm text-outline text-[18px]">calendar_today</span>
            <span className="font-body-md pr-md">Last 1 hour</span>
            <span className="material-symbols-outlined text-outline text-[18px]">expand_more</span>
          </button>
          <button
            type="button"
            className="p-sm bg-white border border-outline-variant rounded-lg hover:bg-surface-container-low transition-colors text-on-surface flex items-center justify-center cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">filter_list</span>
          </button>
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

      {/* Sub Charts & Metrics Grid: Top Routes & Upstream Health */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-gutter">
        {/* Top Routes (Horizontal BarChart) */}
        <div className="lg:col-span-6 bg-white border border-outline-variant rounded-xl p-lg flex flex-col shadow-sm">
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

        {/* Upstream Health Status */}
        <div className="lg:col-span-4 bg-white border border-outline-variant rounded-xl p-lg flex flex-col shadow-sm">
          <div className="mb-lg">
            <h3 className="font-semibold text-lg text-on-surface">Upstream Target Health</h3>
            <p className="text-xs text-on-surface-variant">Real-time load balancer targets status</p>
          </div>

          <div className="flex-1 overflow-y-auto space-y-md">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="animate-pulse flex items-center justify-between py-1 border-b border-outline-variant">
                  <div className="h-4 w-32 bg-surface-container rounded" />
                  <div className="h-4 w-12 bg-surface-container rounded" />
                </div>
              ))
            ) : (summary?.upstream_health && summary.upstream_health.length > 0) ? (
              summary.upstream_health.map((target, idx) => (
                <div key={idx} className="flex items-center justify-between py-2 border-b border-outline-variant last:border-b-0">
                  <span className="text-sm font-mono text-on-surface truncate pr-md">{target.upstream}</span>
                  <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${
                    target.healthy ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
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
      </div>

      {/* Map Section */}
      <div className="bg-white border border-outline-variant rounded-xl p-lg overflow-hidden relative shadow-sm">
        <div className="flex items-center justify-between mb-lg relative z-10">
          <div>
            <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold text-lg">
              Global Traffic Distribution
            </h3>
            <p className="text-sm text-on-surface-variant">
              Request density by regional data centers
            </p>
          </div>
          <div className="flex items-center bg-surface-container-low border border-outline-variant rounded-full px-md py-xs text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-green-500 mr-sm animate-pulse" />
            <span className="text-on-surface">Live Updates: Active</span>
          </div>
        </div>

        <div className="h-96 w-full rounded-lg bg-surface-container overflow-hidden relative border border-outline-variant">
          <div
            className="absolute inset-0 opacity-40 grayscale"
            style={{
              backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuAmWoxJTiT_jfHgK3z9Nv6Fl3FfXes9bGoNl9rvIHrpvu9lHZX5IgZ_E_ESxse4GXSAGNRTHfzi-z2tXLVoOD7PtS_naDVvcr05dnW87c46rR8o-Utgnv5UVFm6K08spDVEAGjIOgemtFUXxQR_s6syI1mhtpqXd61qyr3qN4Q5NL-cTsDqi0iIonL9DLUg8OrVnxOqimkVWeYA3chwZ2DJqZIHCWJWHnL_Hu9cPIy3IDkTAjcKlUX7vjdYigiBaix8G-tEODuWyFYb')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          {MOCK_TRAFFIC_MARKERS.map((marker, index) => {
            const { label, rate, style, isAlert } = marker;
            return (
              <div key={index} className="absolute" style={style}>
                <div className="relative flex items-center justify-center">
                  <div className={`absolute w-8 h-8 rounded-full animate-ping opacity-20 ${isAlert ? 'bg-amber-500' : 'bg-[#53758C]'}`} />
                  <div className={`w-3 h-3 rounded-full border-2 border-white shadow-lg ${isAlert ? 'bg-amber-500' : 'bg-[#53758C]'}`} />
                  <span className="ml-4 bg-white/90 backdrop-blur px-sm py-xs rounded border border-outline-variant text-[11px] font-bold shadow-sm whitespace-nowrap text-on-surface">
                    {label}: {rate}
                  </span>
                </div>
              </div>
            );
          })}
          <div className="absolute bottom-lg left-lg bg-white/80 backdrop-blur-md border border-outline-variant p-md rounded-lg shadow-sm">
            <div className="space-y-sm text-left">
              <div className="flex items-center gap-md">
                <div className="w-24 h-2 rounded-full bg-gradient-to-r from-[#53758C]/30 to-[#53758C]" />
                <span className="text-xs text-on-surface-variant font-medium">Traffic Intensity</span>
              </div>
              <div className="flex items-center gap-sm">
                <span className="w-3 h-3 rounded-full bg-amber-500" />
                <span className="text-xs text-on-surface-variant font-medium">Performance Alert</span>
              </div>
            </div>
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

