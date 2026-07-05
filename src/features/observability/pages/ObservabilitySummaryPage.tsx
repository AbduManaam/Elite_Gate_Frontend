import React from 'react';
import {
  MOCK_KPIS,
  MOCK_STATUS_CHART_BARS,
  MOCK_TOP_SERVICES_ERRORS,
  MOCK_TRAFFIC_MARKERS
} from '../../../shared/mocks/observabilityMock';

export interface ObservabilitySummaryProps {
  readonly className?: string;
}

export const ObservabilitySummaryPage: React.FC<ObservabilitySummaryProps> = ({ className = '' }) => {
  return (
    <div className={`space-y-lg text-left ${className}`}>
      {/* Sandbox/Demo Mode Alert Banner */}
      <div className="bg-[#113346]/10 border border-[#53758C]/20 text-[#113346] px-md py-sm rounded-lg flex items-center gap-sm font-medium">
        <span className="material-symbols-outlined text-[20px] text-[#53758C]">
          info
        </span>
        <span className="text-sm font-semibold">
          Demo Mode: Live metrics queries are currently simulated. Full per-project telemetry is pending backend tenant-isolation update.
        </span>
      </div>

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

        {/* Date Selector and Filter Buttons */}
        <div className="flex items-center gap-sm">
          <button
            type="button"
            className="flex items-center bg-white border border-outline-variant rounded-lg px-md py-sm cursor-pointer hover:bg-surface-container-low transition-colors text-sm"
          >
            <span className="material-symbols-outlined mr-sm text-outline text-[18px]">
              calendar_today
            </span>
            <span className="font-body-md pr-md">Last 24 hours</span>
            <span className="material-symbols-outlined text-outline text-[18px]">
              expand_more
            </span>
          </button>
          <button
            type="button"
            className="p-sm bg-white border border-outline-variant rounded-lg hover:bg-surface-container-low transition-colors text-on-surface flex items-center justify-center cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">filter_list</span>
          </button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
        {MOCK_KPIS.map((kpi, idx) => {
          const {
            label,
            value,
            diff,
            diffStatus,
            p95,
            warningText,
            successIndicatorColor,
            successText,
            sparklineHeights
          } = kpi;

          return (
            <div
              key={`${label}-${idx}`}
              className="bg-white border border-outline-variant rounded-xl p-lg flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-sm">
                  <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                    {label}
                  </span>
                  {diff && (
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        diffStatus === 'up'
                          ? 'text-green-600 bg-green-50'
                          : diffStatus === 'warning'
                          ? 'text-amber-600 bg-amber-50'
                          : 'text-outline bg-surface-container-low'
                      }`}
                    >
                      {diff}
                    </span>
                  )}
                </div>
                <div className="text-headline-md font-headline-md text-on-surface text-[24px]">
                  {value}
                </div>
              </div>

              {/* Sparkline Visual Simulation */}
              {sparklineHeights && (
                <div className="h-12 mt-md flex items-end gap-[3px]">
                  {sparklineHeights.map((h, i) => (
                    <div
                      key={i}
                      className="w-full bg-[#53758C]/10 rounded-t-sm transition-all duration-300"
                      style={{
                        height: `${h}%`,
                        backgroundColor: i === sparklineHeights.length - 1 ? '#53758C' : undefined
                      }}
                    ></div>
                  ))}
                </div>
              )}

              {/* Avg Latency custom slider */}
              {p95 && (
                <div className="mt-md flex items-center gap-sm">
                  <div className="flex-1 bg-surface-container h-1 rounded-full overflow-hidden">
                    <div className="bg-[#53758C] h-full" style={{ width: '42%' }}></div>
                  </div>
                  <span className="text-xs text-outline font-medium">{p95}</span>
                </div>
              )}

              {/* Error rate alert indicator */}
              {warningText && (
                <div className="mt-md flex items-center gap-base">
                  <span className="w-2 h-2 rounded-full bg-error"></span>
                  <span className="text-xs text-on-surface-variant font-medium">
                    {warningText}
                  </span>
                </div>
              )}

              {/* SLA success state */}
              {successText && (
                <div className="mt-md flex items-center gap-base">
                  <span className={`w-2 h-2 rounded-full ${successIndicatorColor}`}></span>
                  <span className="text-xs text-on-surface-variant font-medium">
                    {successText}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Main Grid: Status Chart & Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-gutter">
        {/* Time-Series Chart Card */}
        <div className="lg:col-span-7 bg-white border border-outline-variant rounded-xl p-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-xl gap-sm">
            <div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold text-lg">
                Requests by Status Code
              </h3>
              <p className="text-sm text-on-surface-variant">
                Real-time aggregate across all regions
              </p>
            </div>
            <div className="flex gap-md">
              <div className="flex items-center gap-xs">
                <span className="w-3 h-3 rounded-full bg-[#53758C]"></span>
                <span className="text-xs text-on-surface-variant font-medium">2xx</span>
              </div>
              <div className="flex items-center gap-xs">
                <span className="w-3 h-3 rounded-full bg-amber-400"></span>
                <span className="text-xs text-on-surface-variant font-medium">4xx</span>
              </div>
              <div className="flex items-center gap-xs">
                <span className="w-3 h-3 rounded-full bg-error"></span>
                <span className="text-xs text-on-surface-variant font-medium">5xx</span>
              </div>
            </div>
          </div>

          {/* Chart Graphic Overlay */}
          <div className="relative h-64 w-full bg-surface-container-low rounded-lg border border-dashed border-outline-variant overflow-hidden">
            <div className="absolute inset-0 flex flex-col justify-between p-md pointer-events-none">
              <div className="border-b border-outline-variant/30 w-full h-px"></div>
              <div className="border-b border-outline-variant/30 w-full h-px"></div>
              <div className="border-b border-outline-variant/30 w-full h-px"></div>
              <div className="border-b border-outline-variant/30 w-full h-px"></div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-40 flex items-end px-md gap-4">
              {MOCK_STATUS_CHART_BARS.map((height, i) => (
                <div
                  key={i}
                  className="flex-1 bg-[#53758C]/40 rounded-t-sm transition-all duration-300 hover:bg-[#53758C]/70 cursor-pointer"
                  style={{
                    height: `${height}%`,
                    backgroundColor: i === 5 ? '#53758C' : undefined // Highlighting one bar
                  }}
                ></div>
              ))}
            </div>
          </div>
          <div className="mt-md flex justify-between text-xs text-on-surface-variant px-sm font-medium">
            <span>00:00</span>
            <span>04:00</span>
            <span>08:00</span>
            <span>12:00</span>
            <span>16:00</span>
            <span>20:00</span>
            <span>23:59</span>
          </div>
        </div>

        {/* Top Services Card */}
        <div className="lg:col-span-3 bg-white border border-outline-variant rounded-xl p-lg flex flex-col">
          <h3 className="font-headline-sm text-headline-sm text-on-surface mb-lg font-semibold text-lg">
            Top Services by Error Rate
          </h3>
          <div className="flex-1 space-y-md">
            {MOCK_TOP_SERVICES_ERRORS.map((service, idx) => {
              const { name, rate, percentValue, statusColor } = service;
              return (
                <div key={idx} className="group cursor-pointer">
                  <div className="flex items-center justify-between mb-xs">
                    <span className="font-body-md text-sm font-medium text-on-surface group-hover:text-[#53758C] transition-colors">
                      {name}
                    </span>
                    <span className={`text-xs font-semibold ${idx === 0 ? 'text-error' : 'text-amber-500'}`}>
                      {rate}
                    </span>
                  </div>
                  <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden">
                    <div className={`${statusColor} h-full`} style={{ width: `${percentValue}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
          <button
            type="button"
            className="mt-xl text-center w-full py-sm text-xs font-semibold text-[#53758C] hover:bg-[#53758C]/5 rounded-lg transition-colors border border-[#53758C]/20 cursor-pointer"
          >
            View all services
          </button>
        </div>
      </div>

      {/* Map Section */}
      <div className="bg-white border border-outline-variant rounded-xl p-lg overflow-hidden relative">
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
            <span className="w-2 h-2 rounded-full bg-green-500 mr-sm animate-pulse"></span>
            <span className="text-on-surface">Live Updates: Active</span>
          </div>
        </div>

        {/* World Map Overlay */}
        <div className="h-96 w-full rounded-lg bg-surface-container overflow-hidden relative border border-outline-variant">
          <div
            className="absolute inset-0 opacity-40 grayscale"
            style={{
              backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuAmWoxJTiT_jfHgK3z9Nv6Fl3FfXes9bGoNl9rvIHrpvu9lHZX5IgZ_E_ESxse4GXSAGNRTHfzi-z2tXLVoOD7PtS_naDVvcr05dnW87c46rR8o-Utgnv5UVFm6K08spDVEAGjIOgemtFUXxQR_s6syI1mhtpqXd61qyr3qN4Q5NL-cTsDqi0iIonL9DLUg8OrVnxOqimkVWeYA3chwZ2DJqZIHCWJWHnL_Hu9cPIy3IDkTAjcKlUX7vjdYigiBaix8G-tEODuWyFYb')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          ></div>

          {/* Pulse Markers */}
          {MOCK_TRAFFIC_MARKERS.map((marker, index) => {
            const { label, rate, style, isAlert } = marker;
            return (
              <div key={index} className="absolute" style={style}>
                <div className="relative flex items-center justify-center">
                  <div
                    className={`absolute w-8 h-8 rounded-full animate-ping opacity-20 ${
                      isAlert ? 'bg-amber-500' : 'bg-[#53758C]'
                    }`}
                  ></div>
                  <div
                    className={`w-3 h-3 rounded-full border-2 border-white shadow-lg ${
                      isAlert ? 'bg-amber-500' : 'bg-[#53758C]'
                    }`}
                  ></div>
                  <span className="ml-4 bg-white/90 backdrop-blur px-sm py-xs rounded border border-outline-variant text-[11px] font-bold shadow-sm whitespace-nowrap text-on-surface">
                    {label}: {rate}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Legend */}
          <div className="absolute bottom-lg left-lg bg-white/80 backdrop-blur-md border border-outline-variant p-md rounded-lg shadow-sm">
            <div className="space-y-sm text-left">
              <div className="flex items-center gap-md">
                <div className="w-24 h-2 rounded-full bg-gradient-to-r from-[#53758C]/30 to-[#53758C]"></div>
                <span className="text-xs text-on-surface-variant font-medium">Traffic Intensity</span>
              </div>
              <div className="flex items-center gap-sm">
                <span className="w-3 h-3 rounded-full bg-amber-500"></span>
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
          <a href="#privacy" className="hover:text-[#53758C] transition-colors" onClick={(e) => e.preventDefault()}>
            Privacy Policy
          </a>
          <a href="#reference" className="hover:text-[#53758C] transition-colors" onClick={(e) => e.preventDefault()}>
            API Reference
          </a>
          <a href="#feedback" className="hover:text-[#53758C] transition-colors" onClick={(e) => e.preventDefault()}>
            Feedback
          </a>
        </div>
      </footer>
    </div>
  );
};

export default ObservabilitySummaryPage;
