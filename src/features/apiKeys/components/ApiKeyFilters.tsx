import React from 'react';

export const ApiKeyFilters: React.FC = () => {
    return (
        <div className="p-md bg-slate-50 border-b border-outline-variant flex flex-col md:flex-row gap-md items-start text-left select-none opacity-80">
            <div className="w-full md:w-1/3">
                <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                    Status (Future Release)
                </label>
                <select disabled className="w-full pl-3 pr-8 py-1.5 bg-white/70 border border-outline-variant rounded text-xs text-outline cursor-not-allowed outline-none bg-transparent">
                    <option>All Statuses</option>
                    <option>Active</option>
                    <option>Expired</option>
                    <option>Revoked</option>
                </select>
            </div>

            <div className="w-full md:w-1/3">
                <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                    Role (Future Release)
                </label>
                <select disabled className="w-full pl-3 pr-8 py-1.5 bg-white/70 border border-outline-variant rounded text-xs text-outline cursor-not-allowed outline-none bg-transparent">
                    <option>All Roles</option>
                    <option>Viewer</option>
                    <option>Editor</option>
                    <option>Owner</option>
                </select>
            </div>

            <div className="w-full md:w-1/3">
                <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                    Expiration (Future Release)
                </label>
                <select disabled className="w-full pl-3 pr-8 py-1.5 bg-white/70 border border-outline-variant rounded text-xs text-outline cursor-not-allowed outline-none bg-transparent">
                    <option>All Timeframes</option>
                    <option>Expiring Soon</option>
                    <option>Already Expired</option>
                </select>
            </div>
        </div>
    );
};

export default ApiKeyFilters;
