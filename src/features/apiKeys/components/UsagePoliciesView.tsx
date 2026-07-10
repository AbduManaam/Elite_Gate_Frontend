import React from 'react';

export const UsagePoliciesView: React.FC = () => {
    const policies = [
        {
            id: '1',
            name: 'Key Authentication (key-auth)',
            description: 'Enforces credentials check on all gateway routes. Keys must be passed via apikey header.',
            status: 'Active',
            type: 'Authentication',
            routesCount: 8,
        },
        {
            id: '2',
            name: 'Developer Tier Rate Limiting',
            description: 'Limits requests to 60 per minute for viewer/developer role credentials.',
            status: 'Active',
            type: 'Rate Limiting',
            routesCount: 4,
        },
        {
            id: '3',
            name: 'Production Token Restrictions',
            description: 'Restricts editor keys to specific corporate IP CIDR ranges (10.0.0.0/8).',
            status: 'Active',
            type: 'Access Control',
            routesCount: 2,
        },
    ];

    return (
        <div className="flex flex-col gap-md text-left select-none">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
                <div className="bg-white p-md border border-outline-variant rounded-xl shadow-sm flex flex-col gap-1">
                    <span className="text-xs text-[#587c94] font-semibold">Active Credential Policies</span>
                    <span className="text-2xl font-bold text-on-surface">3 Policies</span>
                    <span className="text-[10px] text-on-surface-variant">Enforced across routes</span>
                </div>
                <div className="bg-white p-md border border-outline-variant rounded-xl shadow-sm flex flex-col gap-1">
                    <span className="text-xs text-[#587c94] font-semibold">Enforced Header Name</span>
                    <span className="text-lg font-mono font-bold text-on-surface">apikey</span>
                    <span className="text-[10px] text-on-surface-variant">Customizable in route settings</span>
                </div>
                <div className="bg-white p-md border border-outline-variant rounded-xl shadow-sm flex flex-col gap-1">
                    <span className="text-xs text-[#587c94] font-semibold">Default Expiry Policy</span>
                    <span className="text-2xl font-bold text-on-surface">365 Days</span>
                    <span className="text-[10px] text-on-surface-variant">For newly generated credentials</span>
                </div>
            </div>

            {/* Policies Table */}
            <div className="bg-white border border-outline-variant rounded-xl overflow-hidden shadow-sm mt-sm">
                <div className="p-4 border-b border-outline-variant bg-white">
                    <h3 className="text-sm font-bold text-on-surface">Applied Access Control & Limits</h3>
                    <p className="text-xs text-on-surface-variant">These policies validate requests authenticated with gateway API keys.</p>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-surface-container-low border-b border-outline-variant text-xs font-semibold text-on-surface-variant">
                            <tr>
                                <th className="py-3 px-md font-semibold">Policy Name</th>
                                <th className="py-3 px-md font-semibold">Type</th>
                                <th className="py-3 px-md font-semibold">Description</th>
                                <th className="py-3 px-md font-semibold">Applied Routes</th>
                                <th className="py-3 px-md font-semibold">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-outline-variant text-sm text-on-surface font-sans">
                            {policies.map((p) => (
                                <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="py-4 px-md font-semibold">{p.name}</td>
                                    <td className="py-4 px-md">
                                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-surface-container text-on-surface-variant border border-outline-variant">
                                            {p.type}
                                        </span>
                                    </td>
                                    <td className="py-4 px-md text-xs text-on-surface-variant max-w-xs">{p.description}</td>
                                    <td className="py-4 px-md font-mono text-xs">{p.routesCount} routes</td>
                                    <td className="py-4 px-md">
                                        <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                            {p.status}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default UsagePoliciesView;
