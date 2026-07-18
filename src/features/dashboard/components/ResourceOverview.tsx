import React from 'react';
import { ResourceCard } from './ResourceCard';
import { useWorkspacePath } from '../../../shared/hooks/useWorkspacePath';

interface ResourceOverviewProps {
  readonly routeCount: number;
  readonly upstreamCount: number;
  readonly policyCount: number;
  readonly apiKeyCount: number;
}

export const ResourceOverview: React.FC<ResourceOverviewProps> = ({
  routeCount,
  upstreamCount,
  policyCount,
  apiKeyCount,
}) => {
  const getPath = useWorkspacePath();

  return (
    <div className="flex flex-col gap-sm text-left">
      <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">Gateway Resources</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-md">
        <ResourceCard
          title="Routes"
          count={routeCount}
          icon="share"
          iconBg="bg-[#e3f2fd]"
          iconColor="text-[#0d47a1]"
          linkText="View all routes"
          path={getPath('/connectivity?tab=Routes')}
        />
        <ResourceCard
          title="Upstreams"
          count={upstreamCount}
          icon="dns"
          iconBg="bg-[#e8f5e9]"
          iconColor="text-[#1b5e20]"
          linkText="View all upstreams"
          path={getPath('/connectivity?tab=Upstreams')}
        />
        <ResourceCard
          title="Policies"
          count={policyCount}
          icon="security"
          iconBg="bg-[#f3e5f5]"
          iconColor="text-[#4a148c]"
          linkText="View all policies"
          path={getPath('/connectivity?tab=Policies')}
        />
        <ResourceCard
          title="API Keys"
          count={apiKeyCount}
          icon="key"
          iconBg="bg-[#fff3e0]"
          iconColor="text-[#e65100]"
          linkText="View all API keys"
          path={getPath('/connectivity?tab=API Credentials')}
        />
      </div>
    </div>
  );
};

export default ResourceOverview;
