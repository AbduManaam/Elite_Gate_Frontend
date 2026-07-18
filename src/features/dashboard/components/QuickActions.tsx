import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkspacePath } from '../../../shared/hooks/useWorkspacePath';

interface QuickActionItem {
  title: string;
  description: string;
  icon: string;
  iconBg: string;
  iconColor: string;
  btnText: string;
  path: string;
}

export const QuickActions: React.FC = () => {
  const navigate = useNavigate();
  const getPath = useWorkspacePath();

  const actions: QuickActionItem[] = [
    {
      title: 'Create Route',
      description: 'Route incoming traffic to your services.',
      icon: 'share',
      iconBg: 'bg-[#e3f2fd]',
      iconColor: 'text-[#0d47a1]',
      btnText: 'Create Route',
      path: getPath('/connectivity?tab=Routes&action=create-route'),
    },
    {
      title: 'Create Upstream',
      description: 'Add and manage backend services.',
      icon: 'dns',
      iconBg: 'bg-[#e8f5e9]',
      iconColor: 'text-[#1b5e20]',
      btnText: 'Create Upstream',
      path: getPath('/connectivity?tab=Upstreams&action=create-upstream'),
    },
    {
      title: 'Create Policy',
      description: 'Configure auth, rate limits and CORS.',
      icon: 'security',
      iconBg: 'bg-[#f3e5f5]',
      iconColor: 'text-[#4a148c]',
      btnText: 'Create Policy',
      path: getPath('/connectivity?tab=Policies&action=create-policy'),
    },
    {
      title: 'Generate API Key',
      description: 'Secure access for your applications.',
      icon: 'key',
      iconBg: 'bg-[#fff3e0]',
      iconColor: 'text-[#e65100]',
      btnText: 'Generate Key',
      path: getPath('/connectivity?tab=API Credentials&action=create-apikey'),
    },
  ];

  return (
    <div className="flex flex-col gap-sm text-left">
      <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">Quick Actions</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-lg">
        {actions.map((act) => (
          <div
            key={act.title}
            className="bg-white border border-outline-variant rounded-xl p-lg flex flex-col items-center text-center shadow-xs hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5"
          >
            {/* Circular Icon Wrapper */}
            <div className={`w-12 h-12 rounded-full ${act.iconBg} ${act.iconColor} flex items-center justify-center mb-md shadow-inner`}>
              <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 0" }}>
                {act.icon}
              </span>
            </div>

            {/* Content */}
            <h4 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-xs">
              {act.title}
            </h4>
            <p className="text-xs text-on-surface-variant min-h-[32px] mb-lg max-w-[200px]">
              {act.description}
            </p>

            {/* Action button */}
            <button
              onClick={() => navigate(act.path)}
              className="mt-auto w-full bg-[#113346] hover:bg-brand-hover text-white py-2 px-md rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-sm"
              type="button"
            >
              {act.btnText}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
