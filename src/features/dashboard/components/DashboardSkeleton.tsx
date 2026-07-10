import React from 'react';

export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col w-full gap-lg text-left animate-pulse">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center pb-md border-b border-outline-variant">
        <div className="flex flex-col gap-sm">
          <div className="h-8 w-64 bg-slate-200 rounded" />
          <div className="h-4 w-96 bg-slate-100 rounded" />
        </div>
        <div className="h-10 w-32 bg-slate-200 rounded-lg" />
      </div>

      {/* Quick Actions Skeleton */}
      <div className="flex flex-col gap-sm">
        <div className="h-5 w-32 bg-slate-200 rounded" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-lg">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-slate-50 border border-slate-100 rounded-xl p-lg flex flex-col items-center gap-md">
              <div className="w-12 h-12 rounded-full bg-slate-200" />
              <div className="h-5 w-24 bg-slate-200 rounded" />
              <div className="h-4 w-36 bg-slate-100 rounded" />
              <div className="h-8 w-full bg-slate-200 rounded-lg mt-sm" />
            </div>
          ))}
        </div>
      </div>

      {/* Resource Cards Skeleton */}
      <div className="flex flex-col gap-sm">
        <div className="h-5 w-40 bg-slate-200 rounded" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-md">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-slate-50 border border-slate-100 rounded-xl p-md flex items-center gap-md">
              <div className="w-12 h-12 rounded-full bg-slate-200" />
              <div className="flex-1 flex flex-col gap-sm">
                <div className="h-3 w-16 bg-slate-200 rounded" />
                <div className="h-6 w-10 bg-slate-200 rounded" />
                <div className="h-3 w-20 bg-slate-100 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main content grid skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
        {/* Recent activity & documentation skeletons */}
        <div className="lg:col-span-2 flex flex-col gap-lg">
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-lg flex flex-col gap-md">
            <div className="flex justify-between items-center border-b border-slate-100 pb-sm">
              <div className="h-6 w-32 bg-slate-200 rounded" />
              <div className="h-4 w-20 bg-slate-100 rounded" />
            </div>
            <div className="flex flex-col gap-md">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center justify-between py-xs border-b border-slate-100/55 last:border-0">
                  <div className="flex items-center gap-md flex-1">
                    <div className="w-8 h-8 rounded-lg bg-slate-200" />
                    <div className="flex flex-col gap-xs flex-1">
                      <div className="h-4 w-24 bg-slate-200 rounded" />
                      <div className="h-3 w-48 bg-slate-100 rounded" />
                    </div>
                  </div>
                  <div className="h-3 w-16 bg-slate-200 rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar skeletons */}
        <div className="flex flex-col gap-lg">
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-lg flex flex-col gap-md">
            <div className="h-6 w-32 bg-slate-200 rounded" />
            <div className="flex flex-col gap-sm">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-12 bg-slate-200 rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardSkeleton;
