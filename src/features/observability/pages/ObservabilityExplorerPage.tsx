import React from 'react';
import {
  MOCK_SERVICES,
  MOCK_ROUTES,
  MOCK_STATUSES,
  MOCK_METHODS,
  MOCK_LATENCY_P99_BARS,
  MOCK_LATENCY_P50_BARS,
  MOCK_TRACES
} from '../../../shared/mocks/observabilityMock';

export interface ObservabilityExplorerProps {
  readonly className?: string;
}

export const ObservabilityExplorerPage: React.FC<ObservabilityExplorerProps> = ({ className = '' }) => {
  return (
    <div className={`space-y-lg text-left ${className}`}>
      {/* Sandbox/Demo Mode Alert Banner */}
      <div className="bg-[#113346]/10 border border-[#53758C]/20 text-[#113346] px-md py-sm rounded-lg flex items-center gap-sm font-medium">
        <span className="material-symbols-outlined text-[20px] text-[#53758C]">
          info
        </span>
        <span className="text-sm font-semibold">
          Demo Mode: Telemetry queries are currently simulated. Full per-project analytics is pending backend tenant-isolation update.
        </span>
      </div>

      {/* Breadcrumbs */}
      <nav className="flex items-center gap-xs text-label-md font-label-md text-on-surface-variant mb-base text-xs">
        <span>Analytics</span>
        <span className="material-symbols-outlined text-[16px]">chevron_right</span>
        <span>Observability</span>
        <span className="material-symbols-outlined text-[16px]">chevron_right</span>
        <span className="text-on-surface font-medium">Explorer</span>
      </nav>

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-md">
        <div>
          <h2 className="font-display-lg text-display-lg text-on-surface mb-1">
            Metrics Explorer
          </h2>
          <p className="text-on-surface-variant font-body-md text-sm">
            Visualize and analyze system performance metrics across your enterprise infrastructure.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            className="bg-white border border-outline-variant text-[#113346] px-4 py-2 rounded font-semibold text-sm flex items-center gap-2 hover:bg-surface-container-high transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">refresh</span>
            Refresh
          </button>
          <button
            type="button"
            className="bg-[#113346] text-white px-4 py-2 rounded font-semibold text-sm flex items-center gap-2 shadow-sm active:scale-95 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">play_arrow</span>
            Run Query
          </button>
        </div>
      </div>

      {/* Query Builder Bar */}
      <div className="bg-white border border-outline-variant rounded p-4 flex flex-wrap items-center gap-4">
        <div className="flex flex-col gap-1 min-w-[160px] text-left">
          <label className="text-xs font-semibold text-on-surface-variant px-1">Service</label>
          <select className="bg-surface-container-low border border-outline-variant rounded py-1 px-2 text-sm focus:border-primary focus:ring-0 outline-none">
            {MOCK_SERVICES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1 min-w-[160px] text-left">
          <label className="text-xs font-semibold text-on-surface-variant px-1">Route</label>
          <select className="bg-surface-container-low border border-outline-variant rounded py-1 px-2 text-sm focus:border-primary focus:ring-0 outline-none">
            {MOCK_ROUTES.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1 min-w-[120px] text-left">
          <label className="text-xs font-semibold text-on-surface-variant px-1">Status</label>
          <select className="bg-surface-container-low border border-outline-variant rounded py-1 px-2 text-sm focus:border-primary focus:ring-0 outline-none">
            {MOCK_STATUSES.map((st) => (
              <option key={st}>{st}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1 min-w-[120px] text-left">
          <label className="text-xs font-semibold text-on-surface-variant px-1">Method</label>
          <select className="bg-surface-container-low border border-outline-variant rounded py-1 px-2 text-sm focus:border-primary focus:ring-0 outline-none">
            {MOCK_METHODS.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>
        </div>
        <div className="flex-1 flex flex-col gap-1 min-w-[240px] text-left">
          <label className="text-xs font-semibold text-on-surface-variant px-1">Custom Tags</label>
          <div className="relative">
            <input
              className="w-full bg-surface-container-low border border-outline-variant rounded py-1 pl-2 pr-10 text-sm focus:border-primary focus:ring-0 outline-none"
              placeholder="region:us-east-1, env:prod..."
              type="text"
            />
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">
              sell
            </span>
          </div>
        </div>
      </div>

      {/* Visualization Card */}
      <div className="bg-white border border-outline-variant rounded overflow-hidden">
        <div className="p-4 border-b border-outline-variant flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h3 className="font-headline-sm text-headline-sm font-semibold">Request Latency Analysis</h3>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-2 text-xs font-semibold text-[#113346]">
                <span className="w-2 h-2 rounded-full bg-[#113346]"></span>
                P99 Latency
              </span>
              <span className="flex items-center gap-2 text-xs font-semibold text-[#53758C]">
                <span className="w-2 h-2 rounded-full bg-[#53758C]"></span>
                P50 Latency
              </span>
            </div>
          </div>
          <button
            type="button"
            className="p-1 hover:bg-surface-container-high rounded transition-colors text-on-surface-variant flex items-center justify-center cursor-pointer"
          >
            <span className="material-symbols-outlined">more_vert</span>
          </button>
        </div>
        
        {/* Latency Graph Overlay */}
        <div className="p-6 h-80 relative flex items-end gap-2 text-left">
          <div className="absolute inset-x-6 inset-y-6 flex flex-col justify-between pointer-events-none">
            <div className="border-t border-outline-variant border-dashed w-full relative">
              <span className="absolute -top-3 right-0 text-[10px] text-on-surface-variant font-mono">150ms</span>
            </div>
            <div className="border-t border-outline-variant border-dashed w-full relative">
              <span className="absolute -top-3 right-0 text-[10px] text-on-surface-variant font-mono">100ms</span>
            </div>
            <div className="border-t border-outline-variant border-dashed w-full relative">
              <span className="absolute -top-3 right-0 text-[10px] text-on-surface-variant font-mono">50ms</span>
            </div>
            <div className="border-t border-outline-variant w-full relative">
              <span className="absolute -top-3 right-0 text-[10px] text-on-surface-variant font-mono">0ms</span>
            </div>
          </div>

          {/* Bar Chart Bars */}
          <div className="flex-1 h-full flex items-end gap-2 px-6 z-10">
            {MOCK_LATENCY_P99_BARS.map((bar, i) => {
              const p99Height = bar;
              const p50Height = MOCK_LATENCY_P50_BARS[i] || 0;
              return (
                <div key={i} className="flex-1 h-full flex flex-col justify-end gap-[2px]">
                  <div className="bg-[#53758C]/30 rounded-t-sm w-full transition-all duration-300" style={{ height: `${p99Height}%` }}></div>
                  <div className="bg-[#113346] rounded-t-sm w-full transition-all duration-300" style={{ height: `${p50Height}%` }}></div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="px-6 pb-4 flex justify-between text-[10px] text-on-surface-variant font-mono">
          <span>10:00 AM</span>
          <span>10:15 AM</span>
          <span>10:30 AM</span>
          <span>10:45 AM</span>
          <span>11:00 AM</span>
        </div>
      </div>

      {/* Results Table Section */}
      <div className="bg-white border border-outline-variant rounded overflow-hidden">
        <div className="p-4 border-b border-outline-variant bg-surface-container-low flex flex-col sm:flex-row sm:items-center justify-between gap-sm">
          <h3 className="font-headline-sm text-headline-sm font-semibold">Query Results</h3>
          <div className="flex gap-4 items-center">
            <span className="text-xs text-on-surface-variant italic">Showing 42 entries from the last 15 minutes</span>
            <button
              type="button"
              className="text-[#113346] font-semibold text-xs flex items-center gap-1 hover:underline cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
              Export CSV
            </button>
          </div>
        </div>

        {/* Traces Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant text-xs text-on-surface-variant uppercase tracking-wider">
                <th className="px-4 py-3 font-semibold">Timestamp</th>
                <th className="px-4 py-3 font-semibold">Method</th>
                <th className="px-4 py-3 font-semibold">Path</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold text-right">Latency</th>
                <th className="px-4 py-3 font-semibold">Upstream</th>
                <th className="px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {MOCK_TRACES.map((trace, idx) => {
                const { timestamp, method, path, status, statusClass, latency, upstream } = trace;
                return (
                  <tr key={idx} className="hover:bg-surface-container-low transition-colors text-sm group">
                    <td className="px-4 py-3 font-mono text-xs text-on-surface-variant">{timestamp}</td>
                    <td className={`px-4 py-3 font-semibold ${method === 'POST' ? 'text-[#52606b]' : 'text-[#113346]'}`}>
                      {method}
                    </td>
                    <td className="px-4 py-3 text-[#53758C] font-medium">{path}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-[2px] rounded text-xs font-semibold border ${statusClass}`}>
                        {status}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-right">{latency}</td>
                    <td className="px-4 py-3 text-on-surface-variant">{upstream}</td>
                    <td className="px-4 py-3">
                      <a
                        className="text-[#53758C] font-semibold hover:underline flex items-center gap-1 text-xs"
                        href="#trace"
                        onClick={(e) => e.preventDefault()}
                      >
                        View Trace <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Table Pagination */}
        <div className="p-4 bg-surface-container-low flex items-center justify-between border-t border-outline-variant">
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="p-1 border border-outline-variant rounded bg-white hover:bg-surface-container-high disabled:opacity-30 flex items-center justify-center cursor-pointer"
              disabled
            >
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>
            <span className="text-sm font-semibold">Page 1 of 5</span>
            <button
              type="button"
              className="p-1 border border-outline-variant rounded bg-white hover:bg-surface-container-high flex items-center justify-center cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-on-surface-variant">Rows per page</span>
            <select className="bg-white border border-outline-variant rounded py-1 px-2 focus:ring-0 outline-none">
              <option>20</option>
              <option>50</option>
              <option>100</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ObservabilityExplorerPage;
