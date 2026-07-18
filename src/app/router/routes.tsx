import React from 'react';
import { createBrowserRouter, useNavigate } from 'react-router-dom';
import { AppRouter } from './AppRouter';
import { RequireAuth } from './AuthGate';
import { RequireRole } from './RequireRole';
import { ProjectLayout } from './ProjectLayout';
import { RootRedirect } from './RootRedirect';
import { PLATFORM, ADMIN } from '../../shared/lib/platformPaths';
import {
  LoginPage, OAuthCallbackPage, PlatformAdminsPage, RolesPermissionsPage, UnauthorizedPage,
} from '../../features/auth';
import { WelcomeDashboard } from '../../features/dashboard';
import { ObservabilitySummaryPage, PlatformHealthPage, PlatformMetricsPage } from '../../features/observability';
import { GatewaysPage, PlatformGatewaysPage, GatewayStatusPage, GatewayMonitoringPage } from '../../features/gateways';
import { ProjectSettings, TenantManagementPage, AllProjectsPage } from '../../features/projects';
import { AuditLogsPage } from '../../features/auditLogs';

const LoginRoute: React.FC = () => {
  const navigate = useNavigate();
  return <LoginPage onLoginSuccess={() => navigate('/', { replace: true })} />;
};

export const router = createBrowserRouter([
  { path: '/login', element: <LoginRoute /> },
  { path: '/oauth/callback', element: <OAuthCallbackPage /> },
  { path: '/unauthorized', element: <UnauthorizedPage /> },
  {
    path: '/',
    element: <RequireAuth><AppRouter /></RequireAuth>,
    children: [
      { index: true, element: <RootRedirect /> },
      { path: 'projects', element: <RootRedirect /> },

      {
        path: 'projects/:projectId',
        element: <ProjectLayout />,
        children: [
          { index: true, element: <WelcomeDashboard /> },
          { path: 'connectivity', element: <GatewaysPage /> },
          { path: 'analytics', element: <ObservabilitySummaryPage /> },
          { path: 'settings', element: <ProjectSettings /> },
          { path: 'logs', element: <AuditLogsPage /> },
          { path: 'gateway/status', element: <RequireRole minProjectRole="viewer"><GatewayStatusPage /></RequireRole> },
          { path: 'gateway/monitoring', element: <RequireRole minProjectRole="viewer"><GatewayMonitoringPage /></RequireRole> },
        ],
      },

      { path: PLATFORM.health, element: <RequireRole superAdminOnly><PlatformHealthPage /></RequireRole> },
      { path: PLATFORM.metrics, element: <RequireRole superAdminOnly><PlatformMetricsPage /></RequireRole> },
      { path: PLATFORM.tenants, element: <RequireRole superAdminOnly><TenantManagementPage /></RequireRole> },
      { path: PLATFORM.projects, element: <RequireRole superAdminOnly><AllProjectsPage /></RequireRole> },
      { path: PLATFORM.gateways, element: <RequireRole superAdminOnly><PlatformGatewaysPage /></RequireRole> },
      { path: ADMIN.members, element: <RequireRole superAdminOnly><PlatformAdminsPage /></RequireRole> },
      { path: ADMIN.roles, element: <RequireRole superAdminOnly><RolesPermissionsPage /></RequireRole> },
    ],
  },
]);