import React from 'react';
import { useUpstreamHealthQuery } from '../hooks/useUpstreams';

export interface UpstreamHealthBadgeProps {
  /** Active project UUID */
  readonly projectId: string | null;
  /** Unique upstream ID */
  readonly upstreamId: string;
  /** Whether the upstream configuration is enabled */
  readonly enabled: boolean;
}

/** Formats a timestamp into HH:MM:SS format for health tooltips. */
function formatCheckTime(ts?: number): string {
  if (!ts) return '';
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

/**
 * Renders real-time health telemetry status for an upstream target.
 * Displays Checking..., Healthy, Unhealthy, Unknown, or Disabled status with failure tooltips.
 */
export const UpstreamHealthBadge: React.FC<UpstreamHealthBadgeProps> = ({
  projectId,
  upstreamId,
  enabled,
}) => {
  const { data, isLoading, isFetching, error, dataUpdatedAt } = useUpstreamHealthQuery(
    projectId,
    upstreamId,
    enabled
  );

  // 1. Upstream configuration is disabled
  if (!enabled) {
    return (
      <div
        className="inline-flex items-center gap-1.5 font-medium text-xs text-on-surface-variant"
        title="Upstream configuration is disabled. Health checks are paused."
        aria-label="Upstream health: Disabled"
      >
        <span className="w-2 h-2 rounded-full bg-outline-variant" />
        <span>Disabled</span>
      </div>
    );
  }

  // 2. Health check is loading or initial fetch in progress
  if (isLoading || (!data && isFetching)) {
    return (
      <div
        className="inline-flex items-center gap-1.5 font-medium text-xs text-blue-700"
        title="Performing upstream health check..."
        aria-label="Upstream health: Checking"
      >
        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
        <span className="font-semibold">Checking...</span>
      </div>
    );
  }

  const lastChecked = formatCheckTime(dataUpdatedAt);

  // 3. API Error or unsupported health state -> Unknown
  if (error || !data || data.status === 'unsupported') {
    const errorMsg = error instanceof Error ? error.message : data?.detail || data?.error || 'Health check unavailable';
    const tooltip = `Health state unknown (${errorMsg})${lastChecked ? ` • Last checked: ${lastChecked}` : ''}`;
    return (
      <div
        className="inline-flex items-center gap-1.5 font-medium text-xs text-slate-700"
        title={tooltip}
        aria-label="Upstream health: Unknown"
      >
        <span className="w-2 h-2 rounded-full bg-slate-400" />
        <span>Unknown</span>
        {isFetching && <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping" title="Refreshing health..." />}
      </div>
    );
  }

  // 4. Healthy target
  if (data.status === 'healthy') {
    const codeStr = data.status_code ? ` (HTTP ${data.status_code})` : '';
    const tooltip = `Healthy${codeStr}${lastChecked ? ` • Last checked: ${lastChecked}` : ''}`;
    return (
      <div
        className="inline-flex items-center gap-1.5 font-medium text-xs text-green-700"
        title={tooltip}
        aria-label="Upstream health: Healthy"
      >
        <span className="w-2 h-2 rounded-full bg-green-600" />
        <span className="font-semibold">Healthy</span>
        {isFetching && <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping" title="Refreshing health..." />}
      </div>
    );
  }

  // 5. Unhealthy target (Backend/tunnel stopped, connection refused, DNS error, non-200)
  const failureReason = data.error || data.detail || (data.status_code ? `HTTP ${data.status_code} health check failed` : 'Target unreachable or failed health check');
  const tooltip = `Unhealthy: ${failureReason}${lastChecked ? ` • Last checked: ${lastChecked}` : ''}`;

  return (
    <div
      className="inline-flex items-center gap-1.5 font-medium text-xs text-red-700"
      title={tooltip}
      aria-label={`Upstream health: Unhealthy (${failureReason})`}
    >
      <span className="w-2 h-2 rounded-full bg-red-600" />
      <span className="font-semibold">Unhealthy</span>
      {isFetching && <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping" title="Refreshing health..." />}
    </div>
  );
};
