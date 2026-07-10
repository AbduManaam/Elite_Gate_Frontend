import React from 'react';

export type PolicyFilterType = 'all' | 'auth_required' | 'public' | 'rate_limited' | 'no_rate_limit' | 'cors_enabled';

interface PolicyFiltersProps {
  readonly searchText: string;
  readonly onSearchChange: (text: string) => void;
  readonly selectedFilter: PolicyFilterType;
  readonly onFilterChange: (filter: PolicyFilterType) => void;
  readonly onCreateClick?: () => void;
  readonly canManage?: boolean;
}

export const PolicyFilters: React.FC<PolicyFiltersProps> = ({
  searchText,
  onSearchChange,
  selectedFilter,
  onFilterChange,
  onCreateClick,
  canManage = false,
}) => {
  const filterOptions: { label: string; value: PolicyFilterType }[] = [
    { label: 'All', value: 'all' },
    { label: 'Authentication Required', value: 'auth_required' },
    { label: 'Public', value: 'public' },
    { label: 'Rate Limited', value: 'rate_limited' },
    { label: 'No Rate Limit', value: 'no_rate_limit' },
    { label: 'CORS Enabled', value: 'cors_enabled' },
  ];

  return (
    <div className="flex flex-col gap-sm w-full">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-md bg-white border border-outline-variant rounded-xl p-md shadow-sm">
        {/* Search bar */}
        <div className="relative flex-1 min-w-0 w-full sm:max-w-md text-left">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">
            search
          </span>
          <input
            type="text"
            value={searchText}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search policies by name, origin, role or scope..."
            className="w-full pl-9 pr-3 py-1.5 border border-outline-variant rounded-lg focus:border-[#587c94] focus:ring-1 focus:ring-[#587c94] transition-all outline-none text-sm text-on-surface bg-white"
          />
        </div>

        {/* Create Button */}
        {canManage && onCreateClick && (
          <button
            type="button"
            onClick={onCreateClick}
            className="w-full sm:w-auto bg-[#113346] text-white px-md py-1.5 rounded-lg text-xs font-bold hover:bg-[#123749] transition-colors flex items-center justify-center gap-1 cursor-pointer h-[36px] shadow-sm shrink-0"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            Create Policy
          </button>
        )}
      </div>

      {/* Filter chips */}
      <div className="flex flex-wrap gap-xs items-center text-left py-0.5">
        {filterOptions.map((opt) => {
          const isActive = selectedFilter === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onFilterChange(opt.value)}
              className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#113346] text-white border-[#113346] shadow-sm'
                  : 'bg-white text-on-surface-variant border-outline-variant hover:border-on-surface-variant'
              }`}
            >
              {opt.label}
            </button>
          );
        })}
        {selectedFilter !== 'all' && (
          <button
            type="button"
            onClick={() => onFilterChange('all')}
            className="text-xs text-[#587c94] hover:underline ml-xs font-semibold cursor-pointer"
          >
            Clear Filters
          </button>
        )}
      </div>
    </div>
  );
};
