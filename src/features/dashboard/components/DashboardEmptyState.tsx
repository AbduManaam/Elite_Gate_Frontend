import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkspacePath } from '../../../shared/hooks/useWorkspacePath';
import { useRoles } from '../../../shared/hooks/useRoles';

interface DashboardEmptyStateProps {
  readonly routeCount?: number;
  readonly upstreamCount?: number;
  readonly policyCount?: number;
  readonly apiKeyCount?: number;
}

export const DashboardEmptyState: React.FC<DashboardEmptyStateProps> = ({
  routeCount = 0,
  upstreamCount = 0,
  policyCount = 0,
  apiKeyCount = 0,
}) => {
  const navigate = useNavigate();
  const getPath = useWorkspacePath();
  const { can } = useRoles();
  const canManage = can('editor');

  // Project setup checklist steps
  const steps = [
    { id: 'project-created', label: 'Project Created', completed: true },
    { id: 'add-upstream', label: 'Add Upstream', completed: upstreamCount > 0 },
    { id: 'create-route', label: 'Create Route', completed: routeCount > 0 },
    { id: 'configure-policy', label: 'Configure Policy', completed: policyCount > 0 },
    { id: 'generate-api-key', label: 'Generate API Key', completed: apiKeyCount > 0 },
  ];

  const completedCount = steps.filter((step) => step.completed).length;
  const progressPercentage = Math.round((completedCount / steps.length) * 100);

  return (
    <div className="space-y-xl animate-fade-in-scale text-left">
      {/* Top Section: Welcome and Progress Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
        {/* Welcome Card (Spans 2 columns) */}
        <div className="md:col-span-2 bg-white border border-outline-variant rounded-2xl p-xl shadow-sm flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row gap-lg items-start">
            {/* Gateway Icon Container */}
            <div className="w-16 h-16 shrink-0 rounded-2xl bg-gradient-to-br from-[#e3f2fd] to-[#c6e7ff]/30 text-[#113346] flex items-center justify-center shadow-sm border border-[#c6e7ff]/40">
              <span className="material-symbols-outlined text-[36px]">
                door_front
              </span>
            </div>
            {/* Text Details */}
            <div className="space-y-xs">
              <h2 className="font-display-lg text-display-md font-extrabold text-on-surface tracking-tight">
                Welcome to Elite Gateway
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant font-semibold pt-xs">
                Your project is ready.
              </p>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                Create your first route to start routing requests through the gateway.
              </p>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-md mt-xl pt-lg border-t border-outline-variant/60">
            {canManage && (
              <button
                onClick={() => navigate(getPath('/connectivity?tab=Routes&action=create-route'))}
                className="bg-[#113346] hover:bg-brand-hover text-white px-xl py-2.5 rounded-lg font-bold text-sm flex items-center gap-xs cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
                type="button"
              >
                <span className="material-symbols-outlined text-[20px]">add</span>
                Create First Route
              </button>
            )}
            <div className="flex items-center gap-xs text-xs font-semibold text-outline-variant select-none">
              <span className="material-symbols-outlined text-[18px] text-primary">
                west
              </span>
              <span className="text-on-surface-variant/80 font-semibold">
                Recommended first step
              </span>
            </div>
          </div>
        </div>

        {/* Project Setup Progress Card (Spans 1 column) */}
        <div className="bg-white border border-outline-variant rounded-2xl p-xl shadow-sm flex flex-col justify-between">
          <div className="space-y-md">
            <h3 className="font-display-lg text-body-lg font-extrabold text-on-surface tracking-tight">
              Project Setup Progress
            </h3>
            {/* Checklist */}
            <ul className="space-y-sm">
              {steps.map((step) => (
                <li key={step.id} className="flex items-center gap-sm">
                  {step.completed ? (
                    <span className="material-symbols-outlined text-green-600 text-[20px] font-extrabold shrink-0">
                      check_circle
                    </span>
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-outline-variant shrink-0" />
                  )}
                  <span
                    className={`text-xs font-semibold ${
                      step.completed ? 'text-on-surface font-bold' : 'text-on-surface-variant/70'
                    }`}
                  >
                    {step.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Progress Bar Footer */}
          <div className="mt-xl pt-lg border-t border-outline-variant/60">
            <div className="flex justify-between items-center text-xs">
              <div className="w-full bg-[#eaeef2] rounded-full h-2 overflow-hidden mr-sm">
                <div
                  className="bg-[#113346] h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <span className="text-on-surface font-extrabold shrink-0">
                {progressPercentage}% Complete
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Recommended Next Steps */}
      <div className="space-y-md pt-lg">
        <div>
          <h3 className="font-display-lg text-body-lg font-extrabold text-on-surface tracking-tight">
            Recommended Next Steps
          </h3>
          <p className="text-xs text-on-surface-variant font-semibold">
            Complete your gateway configuration.
          </p>
        </div>

        {/* 3 Column Next Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
          {/* Card 1: Add Upstreams */}
          <div className="bg-white border border-outline-variant rounded-2xl p-xl shadow-sm flex flex-col justify-between hover:shadow-md hover:border-[#113346]/30 transition-all duration-300 group">
            <div className="space-y-md">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#e3f2fd] to-[#c6e7ff]/30 text-[#113346] flex items-center justify-center shadow-sm border border-[#c6e7ff]/40">
                <span className="material-symbols-outlined text-[24px]">dns</span>
              </div>
              <div className="space-y-xs">
                <h4 className="font-display-lg text-body-md font-bold text-on-surface">
                  Add Upstreams
                </h4>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Register backend services that handle your requests.
                </p>
              </div>
            </div>
            {canManage && (
              <button
                onClick={() => navigate(getPath('/connectivity?tab=Upstreams&action=create-upstream'))}
                className="mt-xl border border-outline-variant hover:border-primary/60 hover:bg-surface-container-low/20 text-on-surface-variant group-hover:text-primary py-2 px-lg rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer text-center w-full"
                type="button"
              >
                Open Upstreams
              </button>
            )}
          </div>

          {/* Card 2: Configure Policies */}
          <div className="bg-white border border-outline-variant rounded-2xl p-xl shadow-sm flex flex-col justify-between hover:shadow-md hover:border-[#113346]/30 transition-all duration-300 group">
            <div className="space-y-md">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#e8f5e9] to-[#c8e6c9]/40 text-[#2e7d32] flex items-center justify-center shadow-sm border border-[#c8e6c9]/50">
                <span className="material-symbols-outlined text-[24px]">security</span>
              </div>
              <div className="space-y-xs">
                <h4 className="font-display-lg text-body-md font-bold text-on-surface">
                  Configure Policies
                </h4>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Authentication, rate limiting, CORS and other policies.
                </p>
              </div>
            </div>
            {canManage && (
              <button
                onClick={() => navigate(getPath('/connectivity?tab=Policies&action=create-policy'))}
                className="mt-xl border border-outline-variant hover:border-primary/60 hover:bg-surface-container-low/20 text-on-surface-variant group-hover:text-primary py-2 px-lg rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer text-center w-full"
                type="button"
              >
                Open Policies
              </button>
            )}
          </div>

          {/* Card 3: Generate API Keys */}
          <div className="bg-white border border-outline-variant rounded-2xl p-xl shadow-sm flex flex-col justify-between hover:shadow-md hover:border-[#113346]/30 transition-all duration-300 group">
            <div className="space-y-md">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#f3e5f5] to-[#e1bee7]/40 text-[#6a1b9a] flex items-center justify-center shadow-sm border border-[#e1bee7]/50">
                <span className="material-symbols-outlined text-[24px]">key</span>
              </div>
              <div className="space-y-xs">
                <h4 className="font-display-lg text-body-md font-bold text-on-surface">
                  Generate API Keys
                </h4>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Create credentials for your clients to access APIs.
                </p>
              </div>
            </div>
            {canManage && (
              <button
                onClick={() => navigate(getPath('/connectivity?tab=API Credentials&action=create-apikey'))}
                className="mt-xl border border-outline-variant hover:border-primary/60 hover:bg-surface-container-low/20 text-on-surface-variant group-hover:text-primary py-2 px-lg rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer text-center w-full"
                type="button"
              >
                Open API Credentials
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardEmptyState;

