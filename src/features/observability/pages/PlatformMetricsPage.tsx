import React from 'react';
import { usePlatformMetricsQuery } from '../../../shared/hooks/usePlatform';

export const PlatformMetricsPage: React.FC = () => {
  const { data: metrics, isLoading, error, refetch } = usePlatformMetricsQuery();

  if (isLoading) return <div className="text-center py-10 text-on-surface-variant font-medium">Loading platform metrics...</div>;
  if (error) return <div className="text-center py-10 text-error font-medium">Failed to load platform metrics.</div>;

  const totalTenants = metrics?.total_tenants ?? 0;
  const totalRoutes = metrics?.total_routes ?? 0;
  const totalUpstreams = metrics?.total_upstreams ?? 0;
  const activeApiKeys = metrics?.active_api_keys ?? 0;
  const revokedApiKeys = metrics?.revoked_api_keys ?? 0;
  const totalAdminUsers = metrics?.total_admin_users ?? 0;

  return (
    <div className="flex flex-col gap-md text-left animate-fade-in">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">Platform Metrics</h2>
          <p className="text-sm text-on-surface-variant mt-0.5">High-level point-in-time statistics across the entire gateway cluster.</p>
        </div>
        <button
          onClick={() => refetch()}
          className="flex items-center gap-1.5 px-4 py-2 border border-outline-variant hover:bg-surface-container rounded-lg font-semibold text-xs text-on-surface-variant cursor-pointer transition-colors"
        >
          <span className="material-symbols-outlined text-[16px]">refresh</span>
          Refresh Stats
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-md">
        <div className="bg-white border border-outline-variant rounded-xl p-lg shadow-xs flex flex-col gap-1">
          <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Total Tenants</span>
          <span className="text-3xl font-extrabold text-on-surface mt-2">{totalTenants.toLocaleString()}</span>
          <span className="text-xs text-on-surface-variant mt-1">Provisioned organizational tenants</span>
        </div>
        <div className="bg-white border border-outline-variant rounded-xl p-lg shadow-xs flex flex-col gap-1">
          <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Total Routes</span>
          <span className="text-3xl font-extrabold text-on-surface mt-2">{totalRoutes.toLocaleString()}</span>
          <span className="text-xs text-on-surface-variant mt-1">Configured reverse proxy routes</span>
        </div>
        <div className="bg-white border border-outline-variant rounded-xl p-lg shadow-xs flex flex-col gap-1">
          <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Total Upstreams</span>
          <span className="text-3xl font-extrabold text-on-surface mt-2">{totalUpstreams.toLocaleString()}</span>
          <span className="text-xs text-on-surface-variant mt-1">Active upstream backend services</span>
        </div>
        <div className="bg-white border border-outline-variant rounded-xl p-lg shadow-xs flex flex-col gap-1">
          <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Active API Keys</span>
          <span className="text-3xl font-extrabold text-green-600 mt-2">{activeApiKeys.toLocaleString()}</span>
          <span className="text-xs text-on-surface-variant mt-1">Live credentials in circulation</span>
        </div>
        <div className="bg-white border border-outline-variant rounded-xl p-lg shadow-xs flex flex-col gap-1">
          <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Revoked API Keys</span>
          <span className="text-3xl font-extrabold text-error mt-2">{revokedApiKeys.toLocaleString()}</span>
          <span className="text-xs text-on-surface-variant mt-1">Decommissioned client credentials</span>
        </div>
        <div className="bg-white border border-outline-variant rounded-xl p-lg shadow-xs flex flex-col gap-1">
          <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Total Admin Users</span>
          <span className="text-3xl font-extrabold text-on-surface mt-2">{totalAdminUsers.toLocaleString()}</span>
          <span className="text-xs text-on-surface-variant mt-1">Registered console administrators</span>
        </div>
      </div>

      <div className="bg-slate-50 border border-outline-variant rounded-xl p-lg text-center mt-md text-sm text-on-surface-variant font-medium flex flex-col items-center justify-center py-10">
        <span className="material-symbols-outlined text-[36px] text-[#587c94] mb-2">monitoring</span>
        <p>Time-series traffic charts are not available under flat Point-in-time statistics.</p>
        <p className="text-xs text-outline mt-1">Prometheus metrics integration is scheduled for the next release phase.</p>
      </div>
    </div>
  );
};

export default PlatformMetricsPage;
