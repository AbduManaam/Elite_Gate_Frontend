import { createBrowserRouter } from 'react-router-dom';
import { AppRouter } from './AppRouter';
import { RequireAuth } from './AuthGate';
import { RequireRole } from './RequireRole';
import { ProjectLayout } from './ProjectLayout';
import { RootRedirect } from './RootRedirect';
import { LoginRoute } from './LoginRoute';
import { PLATFORM, ADMIN } from '../../shared/lib/platformPaths';
import {
  OAuthCallbackPage, PlatformAdminsPage, RolesPermissionsPage, UnauthorizedPage,
  ForgotPasswordPage, ResetPasswordPage, VerifyEmailPage,
} from '../../features/auth';
import { WelcomeDashboard } from '../../features/dashboard';
import { ObservabilitySummaryPage, PlatformHealthPage, PlatformMetricsPage } from '../../features/observability';
import { GatewaysPage, PlatformGatewaysPage, GatewayStatusPage, GatewayMonitoringPage } from '../../features/gateways';
import { ProjectSettings, TenantManagementPage, AllProjectsPage } from '../../features/projects';
import { AuditLogsPage } from '../../features/auditLogs';
import { CustomDomainsPage } from '../../features/customDomains';
import { RequireProjectOwner } from './RequireProjectOwner';
import { ProjectJwtSecurityPage } from '../../features/projectJwt';

export const router = createBrowserRouter([
  { path: '/login', element: <LoginRoute /> },
  { path: '/forgot-password', element: <ForgotPasswordPage /> },
  { path: '/reset-password', element: <ResetPasswordPage /> },
  { path: '/verify-email', element: <VerifyEmailPage /> },
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
          { path: 'custom-domains', element: <RequireRole minProjectRole="viewer"><CustomDomainsPage /></RequireRole> },
          {
            path: 'security',
            element: (
              <RequireProjectOwner>
                <ProjectJwtSecurityPage />
              </RequireProjectOwner>
            ),
          },
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