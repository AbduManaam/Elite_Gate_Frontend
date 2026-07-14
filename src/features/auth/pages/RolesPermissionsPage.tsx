import React from 'react';

export const RolesPermissionsPage: React.FC = () => {
  const matrix = [
    { permission: 'Platform-wide Metrics & Health', superAdmin: true, projectAdmin: false, member: false },
    { permission: 'Platform Tenant Operations (Suspend, Delete)', superAdmin: true, projectAdmin: false, member: false },
    { permission: 'Provision Dedicated Ingress Gateways', superAdmin: true, projectAdmin: false, member: false },
    { permission: 'Reload Global Cluster Nodes Configurations', superAdmin: true, projectAdmin: false, member: false },
    { permission: 'Manage Project-scoped Gateway Nodes', superAdmin: true, projectAdmin: true, member: false },
    { permission: 'Configure Ingress Routes & Policies', superAdmin: true, projectAdmin: true, member: false },
    { permission: 'Edit Project Settings', superAdmin: true, projectAdmin: true, member: false },
    { permission: 'Provision Project API Keys', superAdmin: true, projectAdmin: true, member: false },
    { permission: 'View Active Dashboard Metrics', superAdmin: true, projectAdmin: true, member: true },
    { permission: 'View System Access Logs & Audit Trails', superAdmin: true, projectAdmin: true, member: true },
  ];

  return (
    <div className="flex flex-col gap-md text-left">
      <div>
        <h2 className="font-headline-lg text-headline-lg text-on-surface">Roles & Permissions</h2>
        <p className="text-sm text-on-surface-variant mt-0.5">Role-Based Access Control (RBAC) privilege matrix mapping.</p>
      </div>

      <div className="bg-white border border-outline-variant rounded-xl overflow-hidden shadow-xs">
        <div className="px-lg py-4 border-b border-outline-variant bg-surface-container-low">
          <h3 className="font-semibold text-sm text-on-surface">System Authorization Policy</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#f8fafd] border-b border-outline-variant text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
              <tr>
                <th className="py-3 px-lg w-1/2">Capability / Permission Scope</th>
                <th className="py-3 px-lg text-center">Super Admin</th>
                <th className="py-3 px-lg text-center">Project Admin</th>
                <th className="py-3 px-lg text-center">Team Member</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {matrix.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-lg font-medium text-on-surface">{row.permission}</td>
                  <td className="py-3.5 px-lg text-center">
                    <span className={`material-symbols-outlined text-[20px] font-bold ${
                      row.superAdmin ? 'text-green-600' : 'text-outline/40'
                    }`}>
                      {row.superAdmin ? 'check_circle' : 'cancel'}
                    </span>
                  </td>
                  <td className="py-3.5 px-lg text-center">
                    <span className={`material-symbols-outlined text-[20px] font-bold ${
                      row.projectAdmin ? 'text-[#587c94]' : 'text-outline/40'
                    }`}>
                      {row.projectAdmin ? 'check_circle' : 'cancel'}
                    </span>
                  </td>
                  <td className="py-3.5 px-lg text-center">
                    <span className={`material-symbols-outlined text-[20px] font-bold ${
                      row.member ? 'text-[#587c94]' : 'text-outline/40'
                    }`}>
                      {row.member ? 'check_circle' : 'cancel'}
                    </span>
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

export default RolesPermissionsPage;
