import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { RoutesList } from '../../routes';
import { UpstreamsList } from '../../upstreams';
import { GatewaysOverview } from '../components/GatewaysOverview';
import { PoliciesOverview } from '../components/PoliciesOverview';
import { ApiCredentialsPage } from '../../apiKeys/components/ApiCredentialsPage';
import { MembersOverview } from '../../members/components/MembersOverview';
import { ProjectWorkspace } from '../../projects/components/ProjectWorkspace';
import { useActiveProject } from '../../../shared/hooks/useActiveProject';
import { useProjectsQuery } from '../../../shared/hooks/useProjects';
import { useRoles } from '../../../shared/hooks/useRoles';
import {
  useGatewaysQuery,
  useAllGatewaysQuery,
  useProvisionGatewayMutation,
  useReloadConfigMutation,
} from '../hooks/useGateways';
import { AllGatewaysModal } from '../components/AllGatewaysModal';

export const GatewaysPage: React.FC = () => {
  const { projectId } = useActiveProject();
  const { data: projectsData } = useProjectsQuery();
  const projects = projectsData?.items ?? [];
  const currentProject = projects.find((p) => p.id === projectId);

  const { can } = useRoles();
  const { data: gateways } = useGatewaysQuery(projectId ?? '');
  const { data: allGateways, isLoading: isAllGatewaysLoading } = useAllGatewaysQuery();
  const activeGateway = gateways?.find((gw) => gw.status !== 'decommissioned');

  const provisionGateway = useProvisionGatewayMutation(projectId ?? '');
  const reloadConfig = useReloadConfigMutation(projectId ?? '');

  const [isAllGatewaysOpen, setIsAllGatewaysOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const activeSubTab = searchParams.get('tab') || 'Projects';
  const setActiveSubTab = (tab: string) => {
    setSearchParams({ tab });
  };

  const handleProvisionGateway = () => {
    if (!projectId) return;
    provisionGateway.mutate('dedicated');
  };

  const handleReloadConfig = () => {
    if (!projectId) return;
    reloadConfig.mutate(undefined);
  };

  const subTabs = [
    'Projects',
    'Gateway services',
    'Routes',
    'Upstreams',
    'Policies',
    'API Credentials',
    'Team Collaboration'
  ];

  return (
    <div className="flex flex-col w-full text-left">
      {/* Page Header Section */}
      <div className="bg-white border-b border-outline-variant pt-lg px-margin-mobile lg:px-margin-desktop -mx-margin-mobile lg:-mx-margin-desktop -mt-margin-mobile lg:-mt-margin-desktop mb-margin-mobile lg:mb-margin-desktop">

        
        {/* Title & Actions */}
        <div className="flex justify-between items-center mb-lg">
          <div className="flex items-center gap-sm">
            <h1 className="font-display-lg text-display-lg text-on-surface">{currentProject ? currentProject.name : 'serverless-default'}</h1>
            <span className="px-sm py-xs bg-surface-container rounded text-on-surface-variant font-mono text-[11px] ml-sm border border-outline-variant">
              Control Plane
            </span>
          </div>
        </div>

        {/* Sub-nav Tabs & Actions Container */}
        <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-md md:gap-lg pr-margin-mobile lg:pr-margin-desktop mb-sm md:mb-0">
          <div className="flex items-center gap-xl overflow-x-auto scrollbar-none border-b border-transparent flex-1">
            {subTabs.map((tab) => {
              const isActive = activeSubTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveSubTab(tab)}
                  className={`font-semibold text-sm pb-sm whitespace-nowrap transition-all cursor-pointer border-b-2 border-transparent ${
                    isActive
                      ? 'text-[#587c94] border-[#587c94]'
                      : 'text-on-surface-variant hover:text-[#587c94]'
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          {/* Contextual top actions for Gateway services tab */}
          {activeSubTab === 'Gateway services' && (
            <div className="flex items-center gap-sm pb-2 self-end md:self-auto flex-wrap">
              {activeGateway ? (
                <>
                  <button
                    onClick={() => setIsAllGatewaysOpen(true)}
                    className="border border-outline-variant hover:bg-surface-container text-on-surface-variant hover:text-on-surface px-4 py-2 rounded-lg font-semibold text-xs flex items-center gap-2 cursor-pointer transition-all duration-200 whitespace-nowrap shrink-0"
                  >
                    <span className="material-symbols-outlined text-[18px]">view_list</span>
                    View All Gateways
                  </button>
                  {can('editor') && (
                    <button
                      onClick={handleReloadConfig}
                      disabled={reloadConfig.isPending}
                      className="bg-[#113346] hover:bg-brand-hover text-white px-4 py-2 rounded-lg font-semibold text-xs flex items-center gap-2 cursor-pointer transition-all duration-200 shadow-sm disabled:opacity-50 whitespace-nowrap shrink-0"
                    >
                      <span className="material-symbols-outlined text-[18px]">refresh</span>
                      {reloadConfig.isPending ? 'Reloading...' : 'Reload Configuration'}
                    </button>
                  )}
                </>
              ) : (
                can('editor') && (
                  <button
                    onClick={handleProvisionGateway}
                    disabled={provisionGateway.isPending}
                    className="bg-[#113346] hover:bg-brand-hover text-white px-4 py-2 rounded-lg font-semibold text-xs flex items-center gap-2 cursor-pointer transition-all duration-200 shadow-sm disabled:opacity-50 whitespace-nowrap shrink-0"
                  >
                    <span className="material-symbols-outlined text-[18px]">add</span>
                    {provisionGateway.isPending ? 'Provisioning...' : 'Provision Dedicated Gateway'}
                  </button>
                )
              )}
            </div>
          )}
        </div>
      </div>

      {/* Render sub-tab content */}
      <div className="w-full">
        {activeSubTab === 'Projects' && (
          <ProjectWorkspace />
        )}

        {activeSubTab === 'Gateway services' && (
          <GatewaysOverview 
            showOnlyGateways={true} 
            onViewAllGateways={() => setIsAllGatewaysOpen(true)}
          />
        )}

        {activeSubTab === 'Routes' && (
          <RoutesList />
        )}

        {activeSubTab === 'Upstreams' && (
          <UpstreamsList />
        )}

        {activeSubTab === 'Policies' && (
          <PoliciesOverview />
        )}

        {activeSubTab === 'API Credentials' && (
          <ApiCredentialsPage />
        )}

        {activeSubTab === 'Team Collaboration' && (
          <MembersOverview />
        )}
      </div>

      {/* All Gateways Modal */}
      <AllGatewaysModal
        isOpen={isAllGatewaysOpen}
        onClose={() => setIsAllGatewaysOpen(false)}
        allGateways={allGateways}
        isLoading={isAllGatewaysLoading}
        projects={projects}
      />
    </div>
  );
};

export default GatewaysPage;
