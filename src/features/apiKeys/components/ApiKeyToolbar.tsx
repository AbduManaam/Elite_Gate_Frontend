import React from 'react';

interface ApiKeyToolbarProps {
    readonly onFiltersToggle: () => void;
    readonly showFilters: boolean;
    readonly searchQuery: string;
    readonly onSearchChange: (value: string) => void;
}

export const ApiKeyToolbar: React.FC<ApiKeyToolbarProps> = ({
    onFiltersToggle,
    showFilters,
    searchQuery,
    onSearchChange,
}) => {
    return (
        <div className="p-4 border-b border-outline-variant flex flex-wrap justify-between items-center gap-4 bg-white text-left select-none">
            <div className="flex items-center gap-2 flex-1 max-w-md">
                {/* Search Bar */}
                <div className="relative w-full">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">
                        search
                    </span>
                    <input
                        className="w-full pl-9 pr-3 py-1.5 text-sm border border-outline-variant rounded focus:border-[#587c94] focus:ring-1 focus:ring-[#587c94] outline-none transition-all placeholder:text-outline text-on-surface bg-white"
                        placeholder="Search by key name..."
                        type="text"
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </div>

                {/* Filters Toggle Button */}
                <button
                    type="button"
                    onClick={onFiltersToggle}
                    className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-md text-xs font-semibold cursor-pointer transition-all ${
                        showFilters
                            ? 'bg-[#587c94]/10 border-[#587c94] text-[#587c94]'
                            : 'border-outline-variant hover:bg-surface-container-low text-on-surface-variant'
                    }`}
                    title="Toggle Filters"
                >
                    <span className="material-symbols-outlined text-[18px] leading-none">filter_list</span>
                    Filters
                </button>
            </div>
        </div>
    );
};

export default ApiKeyToolbar;
