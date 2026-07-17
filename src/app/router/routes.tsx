import React from 'react';
import { createBrowserRouter, useNavigate } from 'react-router-dom';
import { AppRouter } from './AppRouter';
import { RequireAuth } from './AuthGate';
import { RequireRole } from './RequireRole';
import {
    LoginPage,
    OAuthCallbackPage,
    PlatformAdminsPage,
    RolesPermissionsPage,
    UnauthorizedPage,
} from '../../features/auth';
import { WelcomeDashboard } from '../../features/dashboard';
import {
    ObservabilitySummaryPage,
    PlatformHealthPage,
    PlatformMetricsPage,
} from '../../features/observability';
import {
    GatewaysPage,
    PlatformGatewaysPage,
    GatewayStatusPage,
    GatewayMonitoringPage,
} from '../../features/gateways';
import {
    ProjectSettings,
    TenantManagementPage,
    AllProjectsPage,
} from '../../features/projects';
import { AuditLogsPage } from '../../features/auditLogs';

const LoginRoute: React.FC = () => {
    const navigate = useNavigate();
    return <LoginPage onLoginSuccess={() => navigate('/', { replace: true })} />;
};

export const router = createBrowserRouter([
    {
        path: '/login',
        element: <LoginRoute />,
    },
    {
        path: '/oauth/callback',
        element: <OAuthCallbackPage />,
    },
    {
        path: '/unauthorized',
        element: <UnauthorizedPage />,
    },
    {
        path: '/',
        element: (
            <RequireAuth>
                <AppRouter />
            </RequireAuth>
        ),
        children: [
            { index: true, element: <WelcomeDashboard /> },

            // Project Admin & standard routes
            { path: 'connectivity', element: <GatewaysPage /> },
            { path: 'analytics', element: <ObservabilitySummaryPage /> },
            { path: 'settings', element: <ProjectSettings /> },
            { path: 'logs', element: <AuditLogsPage /> },

            // Team Member Operations
            {
                path: 'gateway/status',
                element: (
                    <RequireRole minProjectRole="viewer">
                        <GatewayStatusPage />
                    </RequireRole>
                ),
            },
            {
                path: 'gateway/monitoring',
                element: (
                    <RequireRole minProjectRole="viewer">
                        <GatewayMonitoringPage />
                    </RequireRole>
                ),
            },

            // Super Admin Only platform routes
            {
                path: 'platform/health',
                element: (
                    <RequireRole superAdminOnly>
                        <PlatformHealthPage />
                    </RequireRole>
                ),
            },
            {
                path: 'platform/metrics',
                element: (
                    <RequireRole superAdminOnly>
                        <PlatformMetricsPage />
                    </RequireRole>
                ),
            },
            {
                path: 'platform/tenants',
                element: (
                    <RequireRole superAdminOnly>
                        <TenantManagementPage />
                    </RequireRole>
                ),
            },
            {
                path: 'projects',
                element: (
                    <RequireRole superAdminOnly>
                        <AllProjectsPage />
                    </RequireRole>
                ),
            },
            {
                path: 'platform/gateways',
                element: (
                    <RequireRole superAdminOnly>
                        <PlatformGatewaysPage />
                    </RequireRole>
                ),
            },
            {
                path: 'administration/members',
                element: (
                    <RequireRole superAdminOnly>
                        <PlatformAdminsPage />
                    </RequireRole>
                ),
            },
            {
                path: 'administration/roles',
                element: (
                    <RequireRole superAdminOnly>
                        <RolesPermissionsPage />
                    </RequireRole>
                ),
            },
        ],
    },
]);