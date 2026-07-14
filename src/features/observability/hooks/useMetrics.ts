import { useQuery } from '@tanstack/react-query';
import {
  getDashboardSummary,
  queryMetricRange,
  queryMetricInstant,
  querySystemRange,
  MetricName,
} from '../api/metricsApi';

/**
 * Fetches the full dashboard summary in a single request.
 * Powers the Observability Summary page overview panel.
 * Automatically refetches every 30s while the tab is active.
 *
 * @param projectId - Active project UUID, or null to disable the query
 */
export function useDashboardSummaryQuery(projectId: string | null) {
  return useQuery({
    queryKey: ['metrics', projectId, 'summary'],
    queryFn: () => getDashboardSummary(projectId as string),
    enabled: !!projectId,
    staleTime: 15_000,
    refetchInterval: 30_000,
  });
}

/**
 * Fetches a rolling time-series for a single metric.
 * Used by the Explorer page for drill-down chart views.
 *
 * @param projectId - Active project UUID, or null to disable the query
 * @param metric    - Whitelisted metric name
 * @param range     - Rolling window e.g. "1h", "24h" (default "1h")
 */
export function useMetricRangeQuery(
  projectId: string | null,
  metric: MetricName,
  range = '1h'
) {
  return useQuery({
    queryKey: ['metrics', projectId, metric, 'range', range],
    queryFn: () => queryMetricRange(projectId as string, metric, range),
    enabled: !!projectId,
    staleTime: 15_000,
    refetchInterval: 30_000,
  });
}

/**
 * Fetches a single current scalar value for a metric.
 * Suitable for live KPI badges that need frequent updates.
 *
 * @param projectId - Active project UUID, or null to disable the query
 * @param metric    - Whitelisted metric name
 */
export function useMetricInstantQuery(projectId: string | null, metric: MetricName) {
  return useQuery({
    queryKey: ['metrics', projectId, metric, 'instant'],
    queryFn: () => queryMetricInstant(projectId as string, metric),
    enabled: !!projectId,
    staleTime: 10_000,
    refetchInterval: 15_000,
  });
}

/**
 * Fetches platform system level range metrics (CPU/Memory) scoped to a project.
 */
export function useSystemRangeQuery(service: string, metric: 'cpu' | 'memory', range = '1h', step = '60s') {
  return useQuery({
    queryKey: ['metrics', 'system', service, metric, range, step],
    queryFn: () => querySystemRange(service, metric, range, step),
    staleTime: 15_000,
    refetchInterval: 30_000,
  });
}

