import React from 'react';

type FilterType = 'all' | 'http' | 'grpc' | 'enabled' | 'disabled';

interface UpstreamFiltersProps {
    readonly searchText: string;
    readonly onSearchChange: (value: string) => void;
    readonly selectedFilter: FilterType;
    readonly onFilterChange: (value: FilterType) => void;
}

export const UpstreamFilters: React.FC<UpstreamFiltersProps> = ({
    searchText,
    onSearchChange,
    selectedFilter,
    onFilterChange,
}) => {
    const filters: { label: string; value: FilterType }[] = [
        { label: 'All', value: 'all' },
        { label: 'HTTP', value: 'http' },
        { label: 'gRPC', value: 'grpc' },
        { label: 'Enabled', value: 'enabled' },
        { label: 'Disabled', value: 'disabled' },
    ];

    return (
        <div className="flex flex-col md:flex-row justify-between items-center gap-md w-full py-xs">
            {/* Search Input */}
            <div className="relative w-full md:w-72">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">
                    search
                </span>
                <input
                    className="w-full pl-9 pr-3 py-1.5 rounded border border-outline-variant bg-white focus:border-[#587c94] focus:ring-2 focus:ring-[#587c94]/10 text-sm outline-none placeholder-on-surface-variant transition-all h-[36px]"
                    placeholder="Search upstreams by name or url..."
                    type="text"
                    value={searchText}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
            </div>

            {/* Filter Chips */}
            <div className="flex flex-wrap items-center gap-sm w-full md:w-auto">
                {filters.map((filter) => {
                    const isActive = selectedFilter === filter.value;
                    return (
                        <button
                            key={filter.value}
                            type="button"
                            onClick={() => onFilterChange(filter.value)}
                            className={`px-md py-sm rounded-full text-xs font-semibold border transition-all duration-200 cursor-pointer ${
                                isActive
                                    ? 'bg-[#113346] text-white border-[#113346] shadow-sm'
                                    : 'bg-white text-on-surface-variant border-outline-variant hover:border-[#587c94]/60 hover:text-on-surface'
                            }`}
                        >
                            {filter.label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
