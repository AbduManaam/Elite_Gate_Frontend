import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { RoutesList } from '../../routes';
import { UpstreamsList } from '../../upstreams';
import { GatewaysOverview } from '../components/GatewaysOverview';
import { PoliciesOverview } from '../components/PoliciesOverview';
import { ApiKeysOverview } from '../../apiKeys/components/ApiKeysOverview';
import { MembersOverview } from '../../members/components/MembersOverview';
import { LetsGetStartedBanner } from '../components/LetsGetStartedBanner';
import { ConfigureApiModal } from '../components/ConfigureApiModal';
import { ProjectWorkspace } from '../../projects/components/ProjectWorkspace';
import { useActiveProject } from '../../../shared/hooks/useActiveProject';
import { useProjectsQuery } from '../../../shared/hooks/useProjects';

export const GatewaysPage: React.FC = () => {
  const { projectId } = useActiveProject();
  const { data: projectsData } = useProjectsQuery();
  const projects = projectsData?.items ?? [];
  const currentProject = projects.find((p) => p.id === projectId);

  const [isConfigureApiOpen, setIsConfigureApiOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const activeSubTab = searchParams.get('tab') || 'Overview';
  const setActiveSubTab = (tab: string) => {
    setSearchParams({ tab });
  };

  const subTabs = [
    'Overview',
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
      <div className="bg-white border-b border-outline-variant pt-lg px-margin-desktop -mx-margin-desktop -mt-margin-desktop mb-margin-desktop">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-xs font-label-md text-label-md text-on-surface-variant mb-md">
          <a className="hover:text-[#587c94] transition-colors cursor-pointer">API Gateway</a>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <a className="hover:text-[#587c94] transition-colors cursor-pointer">Control planes</a>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <span className="text-on-surface font-semibold">{currentProject ? currentProject.name : 'serverless-default'}</span>
        </nav>
        
        {/* Title & Actions */}
        <div className="flex justify-between items-center mb-lg">
          <div className="flex items-center gap-sm">
            <h1 className="font-display-lg text-display-lg text-on-surface">{currentProject ? currentProject.name : 'serverless-default'}</h1>
            <span className="px-sm py-xs bg-surface-container rounded text-on-surface-variant font-mono text-[11px] ml-sm border border-outline-variant">
              Control Plane
            </span>
          </div>
        </div>

        {/* Sub-nav Tabs */}
        <div className="flex items-center gap-xl overflow-x-auto border-b border-transparent">
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
      </div>

      {/* Render sub-tab content */}
      <div className="w-full">
        {activeSubTab === 'Overview' && (
          <LetsGetStartedBanner
            onAddServiceRoute={() => setIsConfigureApiOpen(true)}
          />
        )}

        {activeSubTab === 'Projects' && (
          <ProjectWorkspace />
        )}

        {activeSubTab === 'Gateway services' && (
          <GatewaysOverview showOnlyGateways={true} />
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
          <ApiKeysOverview />
        )}

        {activeSubTab === 'Team Collaboration' && (
          <MembersOverview />
        )}
      </div>

      {/* Configure New API Modal Wizard */}
      {isConfigureApiOpen && (
        <ConfigureApiModal
          projectId={projectId ?? ''}
          onClose={() => setIsConfigureApiOpen(false)}
        />
      )}
    </div>
  );
};

export default GatewaysPage;
