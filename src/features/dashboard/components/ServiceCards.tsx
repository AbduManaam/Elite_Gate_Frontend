import React from 'react';
import { MOCK_SERVICES, ServiceCardItem } from '../../../shared/mocks/dashboardMock';

export interface ServiceCardsProps {
  readonly services?: readonly ServiceCardItem[];
  readonly className?: string;
}

export const ServiceCards: React.FC<ServiceCardsProps> = ({
  services = MOCK_SERVICES,
  className = ''
}) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-lg ${className}`}>
      {services.map((service) => {
        const { id, title, description, icon, linkText, href, isRecommended, isDisabled } = service;

        if (isDisabled) {
          return (
            <div
              key={id}
              className="surface-level-1 rounded-xl p-lg ghost-hover transition-all cursor-pointer relative overflow-hidden group opacity-80 border-dashed border border-outline-variant"
            >
              <div className="flex justify-between items-start mb-md">
                <div className="w-12 h-12 rounded-lg bg-surface-container flex items-center justify-center text-outline">
                  <span className="material-symbols-outlined text-[24px]">
                    {icon}
                  </span>
                </div>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2">
                {title}
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant mb-lg h-10">
                {description}
              </p>
              <div className="flex items-center gap-2 text-outline font-label-md text-label-md">
                {linkText} <span className="material-symbols-outlined text-[16px]">add_circle</span>
              </div>
            </div>
          );
        }

        return (
          <a
            key={id}
            href={href}
            className="surface-level-1 rounded-xl p-lg ghost-hover transition-all cursor-pointer relative overflow-hidden group block hover:no-underline text-left"
          >
            <div className="absolute top-0 left-0 w-1 h-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="flex justify-between items-start mb-md">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[24px]">
                  {icon}
                </span>
              </div>
              {isRecommended && (
                <span
                  className="px-2 py-1 bg-surface-container text-primary rounded-full font-label-md text-label-md border border-outline-variant text-[10px] font-bold uppercase tracking-wider"
                  style={{ color: 'rgb(83, 117, 140)' }}
                >
                  Recommended
                </span>
              )}
            </div>
            <h3 className="font-headline-sm text-headline-sm text-on-surface mb-2">
              {title}
            </h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant mb-lg h-10">
              {description}
            </p>
            <div
              className="flex items-center gap-2 text-primary font-label-md text-label-md group-hover:underline"
              style={{ color: 'rgb(83, 117, 140)' }}
            >
              {linkText} <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </div>
          </a>
        );
      })}
    </div>
  );
};

export default ServiceCards;
