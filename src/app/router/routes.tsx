// This file manages the application's navigation. It defines all routes, maps each URL to its 
// corresponding page, and ensures that unauthenticated users are redirected to the login page before accessing protected pages.


import React from 'react';
import { createBrowserRouter, useNavigate } from 'react-router-dom';
import { AppRouter } from './AppRouter';
import { RequireAuth } from './AuthGate';
import { LoginPage } from '../../features/auth';
import { WelcomeDashboard } from '../../features/dashboard';
import { ObservabilitySummaryPage, ObservabilityExplorerPage } from '../../features/observability';
import { GatewaysPage } from '../../features/gateways';
import { ProjectSettings } from '../../features/projects';
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
        path: '/',
        element: (
            <RequireAuth>
                <AppRouter />
            </RequireAuth>
        ),
        children: [
            { index: true, element: <WelcomeDashboard /> },
            { path: 'connectivity', element: <GatewaysPage /> },
            { path: 'analytics', element: <ObservabilitySummaryPage /> },
            { path: 'analytics/explorer', element: <ObservabilityExplorerPage /> },
            { path: 'settings', element: <ProjectSettings /> },
            { path: 'logs', element: <AuditLogsPage /> },
        ],
    },
]);