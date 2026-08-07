import React, { useState } from 'react';
import { useDashboardSummaryQuery, useProjectSystemRangeQuery } from '../hooks/useMetrics';
import { useGatewaysQuery } from '../../gateways/hooks/useGateways';
import { useActiveProject } from '../../../shared/hooks/useActiveProject';
import { ProjectAnalyticsSection } from '../components/ProjectAnalyticsSection';
import { GatewayHealthSection } from '../components/GatewayHealthSection';

export interface ObservabilitySummaryProps {
  readonly className?: string;
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

/**
 * Analytics page component for displaying project metrics and gateway health.
 * Serves route /projects/:projectId/analytics.
 */
export const ObservabilitySummaryPage: React.FC<ObservabilitySummaryProps> = ({ className = '' }) => {
  const { projectId, projectRole } = useActiveProject();
  const [timeRange, setTimeRange] = useState(RANGE_OPTIONS.find((opt) => opt.value === '1h') || RANGE_OPTIONS[0]);
  const [isOpenRangeDropdown, setIsOpenRangeDropdown] = useState(false);
  const [selectedService, setSelectedService] = useState(SERVICES[0]);
  const [isOpenFilterDropdown, setIsOpenFilterDropdown] = useState(false);

  const { data: summary, isLoading: isSummaryLoading, error } = useDashboardSummaryQuery(projectId);
  const { data: cpuTrend, isLoading: isCpuLoading } = useProjectSystemRangeQuery(
    projectId,
    selectedService,
    'cpu',
    timeRange.value,
    timeRange.step,
    projectRole
  );
  const { data: memTrend, isLoading: isMemLoading } = useProjectSystemRangeQuery(
    projectId,
    selectedService,
    'memory',
    timeRange.value,
    timeRange.step,
    projectRole
  );
  const { data: gateways, isLoading: isGatewaysLoading } = useGatewaysQuery(projectId ?? '');

  const isLoading = isSummaryLoading || isCpuLoading || isMemLoading || isGatewaysLoading;

  return (
    <div className={`space-y-xl text-left ${className}`}>
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-md">
        <div>
          <h2 className="font-display-lg text-display-lg text-on-surface">Analytics</h2>
          <p className="text-sm text-on-surface-variant mt-1">
            Real-time project telemetry, traffic performance, and gateway cluster health metrics.
          </p>
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
              title="Filter by Service"
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

      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-md py-sm rounded-lg flex items-center gap-sm text-sm font-semibold">
          <span className="material-symbols-outlined text-[20px]">error_outline</span>
          Failed to load metrics: {(error as Error).message || 'Unknown error'}
        </div>
      )}

      {/* Section 1: Project Analytics */}
      <ProjectAnalyticsSection summary={summary} isLoading={isLoading} />

      {/* Section 2: Gateway Health */}
      <GatewayHealthSection
        summary={summary}
        cpuTrend={cpuTrend}
        memTrend={memTrend}
        gateways={gateways}
        isLoading={isLoading}
      />

      {/* Page Footer */}
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
