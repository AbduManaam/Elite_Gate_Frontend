import React from 'react';
import { MOCK_ACTIVITIES, ActivityItem } from '../../../shared/mocks/dashboardMock';

export interface DashboardWidgetsProps {
  readonly activities?: readonly ActivityItem[];
  readonly className?: string;
}

export const DashboardWidgets: React.FC<DashboardWidgetsProps> = ({
  activities = MOCK_ACTIVITIES,
  className = ''
}) => {
  return (
    <div className={`flex flex-col gap-lg ${className}`}>
      {/* Konnect Trial Widget */}
      <div className="surface-level-1 rounded-xl overflow-hidden shadow-sm text-left">
        <div className="h-1.5 bg-primary w-full" style={{ backgroundColor: '#587c94' }}></div>
        <div className="p-lg">
          <div className="flex items-center gap-md mb-md">
            <span className="material-symbols-outlined text-primary text-[28px]">
              workspace_premium
            </span>
            <h3 className="font-headline-sm text-headline-sm text-on-surface">
              Konnect Trial
            </h3>
          </div>
          <div className="mb-md">
            <div className="flex justify-between text-label-md font-label-md mb-1">
              <span className="text-on-surface-variant">Usage</span>
              <span className="text-on-surface font-bold">28 days left</span>
            </div>
            <div className="w-full bg-surface-container rounded-full h-1.5">
              <div className="bg-primary h-1.5 rounded-full" style={{ width: '25%', backgroundColor: '#587c94' }}></div>
            </div>
            <p className="font-label-md text-label-md text-outline mt-2">
              Expires Jan 15, 2026
            </p>
          </div>
          <button
            type="button"
            className="w-full bg-white border border-outline-variant text-on-surface px-4 py-2 rounded font-label-md text-label-md font-medium hover:bg-surface-container transition-colors cursor-pointer"
            style={{ color: 'rgb(83, 117, 140)' }}
          >
            View Plan Details
          </button>
        </div>
      </div>

      {/* Support Widget */}
      <div className="surface-level-1 rounded-xl p-lg bg-gradient-to-br from-white to-surface-container-low text-left">
        <div className="flex items-center gap-md mb-md">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-[20px]">
              support_agent
            </span>
          </div>
          <div>
            <h3 className="font-headline-sm text-headline-sm text-on-surface">
              Need Help?
            </h3>
            <p className="font-label-md text-label-md text-on-surface-variant">
              24/7 Enterprise Support
            </p>
          </div>
        </div>
        <p className="font-body-sm text-body-sm text-on-surface-variant mb-md">
          Our engineering team is ready to assist you with architecture or deployment queries.
        </p>
        <button
          type="button"
          className="w-full bg-primary text-white px-4 py-2 rounded font-label-md text-label-md font-medium hover:bg-brand-hover transition-colors flex justify-center items-center gap-2 cursor-pointer"
          style={{ backgroundColor: 'rgb(17, 51, 70)' }}
        >
          <span className="material-symbols-outlined text-[16px]">chat</span> Chat now
        </button>
      </div>

      {/* Recent Activity List */}
      <div className="surface-level-1 rounded-xl p-lg text-left">
        <h3 className="font-headline-sm text-headline-sm text-on-surface mb-md">
          Recent Activity
        </h3>
        <ul className="space-y-4">
          {activities.map((activity) => {
            const { id, title, time, category, icon } = activity;
            return (
              <li key={id} className="flex gap-sm items-start">
                <span className="material-symbols-outlined text-outline text-[18px] mt-0.5">
                  {icon}
                </span>
                <div>
                  <p className="font-body-sm text-body-sm text-on-surface font-medium">
                    {title}
                  </p>
                  <p className="font-label-md text-label-md text-outline">
                    {time} • {category}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default DashboardWidgets;
