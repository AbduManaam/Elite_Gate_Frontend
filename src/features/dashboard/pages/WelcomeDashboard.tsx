import React from 'react';
import FeaturedBanner from '../components/FeaturedBanner';
import ServiceCards from '../components/ServiceCards';
import QuickStats from '../components/QuickStats';
import DashboardWidgets from '../components/DashboardWidgets';

export interface WelcomeDashboardProps {
  readonly className?: string;
}

export const WelcomeDashboard: React.FC<WelcomeDashboardProps> = ({ className = '' }) => {
  return (
    <div className={`space-y-lg ${className}`}>
      {/* Banner */}
      <FeaturedBanner />

      {/* Main Grid: Core Services & Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
        {/* Left Column: Core Services & Stats */}
        <div className="lg:col-span-2 flex flex-col gap-lg">
          <ServiceCards />
          <QuickStats className="mt-sm" />
        </div>

        {/* Right Column: Sidebar Widgets */}
        <div>
          <DashboardWidgets />
        </div>
      </div>
    </div>
  );
};

export default WelcomeDashboard;
