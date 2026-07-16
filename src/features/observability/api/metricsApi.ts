import { apiClient } from '../../../lib/api/client';

export type MetricName =
  | 'request_rate'
  | 'error_rate'
  | 'latency_p50'
  | 'latency_p95'
  | 'active_requests'
  | 'status_breakdown'
  | 'total_requests'
  | 'latency_avg'
  | 'error_rate_pct'
  | 'top_routes'
  | 'top_upstreams'
  | 'upstream_health'
  | 'active_requests_sparkline';

export interface TimeSeriesPoint {
  /** Unix timestamp in milliseconds */
  timestamp: number;
  value: number;
}

export interface MetricSeries {
  label: string;
  points: TimeSeriesPoint[];
}

export interface KPIValue {
  value: number;
  unit: string;
}

export interface UpstreamHealthStatus {
  upstream: string;
  healthy: boolean;
}

/**
 * Full observability dashboard payload - every KPI + trend chart + status
 * breakdown in one round-trip. Matches the backend's
 * GET /projects/:projectId/metrics/summary response.
 */
export interface DashboardSummary {
  project_id: string;
  generated_at: string;
  request_rate: KPIValue;
  error_rate: KPIValue;
  latency_p50: KPIValue;
  latency_p95: KPIValue;
  active_requests: KPIValue;
  
  total_requests: KPIValue;
  latency_avg: KPIValue;
  error_rate_pct: KPIValue;

  request_rate_trend: TimeSeriesPoint[];
  status_breakdown: MetricSeries[];
  top_routes: MetricSeries[];
  top_upstreams: MetricSeries[];
  upstream_health: UpstreamHealthStatus[];
  active_requests_sparkline: TimeSeriesPoint[];
  latency_avg_trend?: TimeSeriesPoint[];
}

/**
 * Fetches the full dashboard summary for the given project.
 * Corresponds to GET /admin/v1/projects/:projectId/metrics/summary.
 *
 * @param projectId - Active project UUID
 * @returns DashboardSummary containing all KPIs, trend series, and status breakdown
 */
export async function getDashboardSummary(projectId: string): Promise<DashboardSummary> {
  const { data } = await apiClient.get<DashboardSummary>(
    `/v1/projects/${projectId}/metrics/summary`
  );
  return data;
}

/**
 * Fetches a time-series for a single metric over a rolling window.
 * Corresponds to GET /admin/v1/projects/:projectId/metrics/query-range.
 *
 * @param projectId - Active project UUID
 * @param metric    - Whitelisted metric name
 * @param range     - Rolling window e.g. "1h", "24h" (default "1h")
 * @param step      - Resolution step e.g. "60s" (default "60s")
 * @returns Array of (timestamp, value) points ready for charting
 */
export async function queryMetricRange(
  projectId: string,
  metric: MetricName,
  range = '1h',
  step = '60s'
): Promise<TimeSeriesPoint[]> {
  const { data } = await apiClient.get<{ points: TimeSeriesPoint[] }>(
    `/v1/projects/${projectId}/metrics/query-range`,
    { params: { metric, range, step } }
  );
  return data.points;
}

/**
 * Fetches a single instant scalar value for a metric.
 * Corresponds to GET /admin/v1/projects/:projectId/metrics/query.
 *
 * @param projectId - Active project UUID
 * @param metric    - Whitelisted metric name
 * @returns Current scalar value for the requested metric
 */
export async function queryMetricInstant(
  projectId: string,
  metric: MetricName
): Promise<number> {
  const { data } = await apiClient.get<{ value: number }>(
    `/v1/projects/${projectId}/metrics/query`,
    { params: { metric } }
  );
  return data.value;
}

/**
 * Fetches platform system level range metrics (CPU/Memory).
 * Corresponds to GET /admin/v1/platform/metrics/system/range.
 */
export async function querySystemRange(
  service: string,
  metric: 'cpu' | 'memory',
  range = '1h',
  step = '60s'
): Promise<TimeSeriesPoint[]> {
  const { data } = await apiClient.get<{ points: TimeSeriesPoint[] }>(
    `/v1/platform/metrics/system/range`,
    { params: { service, metric, range, step } }
  );
  return data.points;
}

export interface PlatformHealthResponse {
  projects: { active: number; suspended: number; total: number };
  gateways: { active: number; provisioning: number; decommissioned: number; total: number };
  gateway_health: { gateway_id: string; status: 'healthy' | 'unreachable' }[];
}

export interface PlatformMetricsResponse {
  total_tenants: number;
  total_routes: number;
  total_upstreams: number;
  active_api_keys: number;
  revoked_api_keys: number;
  total_admin_users: number;
}

export async function getPlatformHealth(): Promise<PlatformHealthResponse> {
    const { data } = await apiClient.get<PlatformHealthResponse>('/v1/platform/health');
    return data;
}

export async function getPlatformMetrics(): Promise<PlatformMetricsResponse> {
    const { data } = await apiClient.get<PlatformMetricsResponse>('/v1/platform/metrics');
    return data;
}

