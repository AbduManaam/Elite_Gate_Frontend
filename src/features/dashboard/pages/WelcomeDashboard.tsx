import React from 'react';
// import { useActiveProject } from '../../../shared/hooks/useActiveProject';
import { useRoutesQuery } from '../../routes/hooks/useRoutes';
import { useUpstreamsQuery } from '../../upstreams/hooks/useUpstreams';
import { usePoliciesQuery } from '../../policies/hooks/usePolicies';
import { useApiKeysQuery } from '../../apiKeys/hooks/useApiKeys';
import { useGatewaysQuery } from '../../gateways/hooks/useGateways';
import { useProjectSummaryQuery } from '../../../shared/hooks/useProjectSummary';

import DashboardHeader from '../components/DashboardHeader';
import QuickActions from '../components/QuickActions';
import ResourceOverview from '../components/ResourceOverview';
import DocumentationCard from '../components/DocumentationCard';
import ProjectShortcuts from '../components/ProjectShortcuts';
import EnvironmentInfo from '../components/EnvironmentInfo';
import DashboardSkeleton from '../components/DashboardSkeleton';
import DashboardEmptyState from '../components/DashboardEmptyState';
import { useParams } from 'react-router-dom';

export interface WelcomeDashboardProps {
  readonly className?: string;
}

export const WelcomeDashboard: React.FC<WelcomeDashboardProps> = ({ className = '' }) => {
  const { projectId } = useParams<{ projectId: string }>();

  // Queries
  const routesQuery = useRoutesQuery(projectId ?? '');
  const upstreamsQuery = useUpstreamsQuery(projectId ?? '');
  const policiesQuery = usePoliciesQuery(projectId ?? '');
  const apiKeysQuery = useApiKeysQuery(projectId ?? '');
  const gatewaysQuery = useGatewaysQuery(projectId ?? '');
  const summaryQuery = useProjectSummaryQuery(projectId);

  const isLoading =
    routesQuery.isLoading ||
    upstreamsQuery.isLoading ||
    policiesQuery.isLoading ||
    apiKeysQuery.isLoading ||
    gatewaysQuery.isLoading ||
    summaryQuery.isLoading;

  const isError =
    routesQuery.isError ||
    upstreamsQuery.isError ||
    policiesQuery.isError ||
    apiKeysQuery.isError ||
    gatewaysQuery.isError;

  const handleRetry = () => {
    routesQuery.refetch();
    upstreamsQuery.refetch();
    policiesQuery.refetch();
    apiKeysQuery.refetch();
    gatewaysQuery.refetch();
    summaryQuery.refetch();
  };

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (isError) {
    return (
      <div className="bg-red-50 border border-red-100 rounded-xl p-xl max-w-xl mx-auto my-xl text-center flex flex-col items-center gap-md">
        <span className="material-symbols-outlined text-red-600 text-[36px]">
          error
        </span>
        <div>
          <h3 className="text-lg font-bold text-on-surface">Failed to load dashboard data</h3>
          <p className="text-xs text-on-surface-variant mt-1">
            Some network requests to the admin API failed. Please try again.
          </p>
        </div>
        <button
          onClick={handleRetry}
          className="bg-[#113346] hover:bg-brand-hover text-white px-lg py-2 rounded-lg text-xs font-semibold cursor-pointer transition-colors shadow-sm"
          type="button"
        >
          Retry Loading
        </button>
      </div>
    );
  }

  const routes = routesQuery.data ?? [];
  const upstreams = upstreamsQuery.data ?? [];
  const policies = policiesQuery.data ?? [];
  const apiKeys = apiKeysQuery.data?.keys ?? [];
  const gateways = gatewaysQuery.data ?? [];

  const routeCount = routes.length;
  const upstreamCount = upstreams.length;
  const policyCount = policies.length;
  const apiKeyCount = apiKeys.length;
  const gatewayCount = gateways.length;

  const hasNoResources =
    routeCount === 0 &&
    upstreamCount === 0 &&
    policyCount === 0 &&
    apiKeyCount === 0;

  if (hasNoResources) {
    return (
      <DashboardEmptyState
        routeCount={routeCount}
        upstreamCount={upstreamCount}
        policyCount={policyCount}
        apiKeyCount={apiKeyCount}
      />
    );
  }



  // Environment metadata from active project / summary
  const summary = summaryQuery.data;
  const region = summary?.metrics ? 'ap-south-1' : 'us-east-1'; // placeholder or customized
  const createdAtFormatted = summary?.created_at
    ? new Date(summary.created_at).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
    : 'May 10, 2025';

  return (
    <div className={`flex flex-col gap-lg ${className}`}>
      {/* 1. Header */}
      <DashboardHeader />

      {/* 2. Quick Actions */}
      <QuickActions />

      {/* 3. Gateway Resources counts grid */}
      <ResourceOverview
        routeCount={routeCount}
        upstreamCount={upstreamCount}
        policyCount={policyCount}
        apiKeyCount={apiKeyCount}
      />

      {/* 4. Horizontal operational content cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
        <ProjectShortcuts />
        <DocumentationCard />
        <EnvironmentInfo
          projectId={projectId ?? 'prj_8f3d9a2b'}
          region={region}
          createdAt={createdAtFormatted}
          role={summary?.role ?? 'owner'}
        />
      </div>
    </div>
  );
};

export default WelcomeDashboard;
