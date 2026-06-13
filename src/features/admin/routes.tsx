import type { RouteObject } from 'react-router-dom';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { ModerationPage } from './pages/ModerationPage';
import { AuditLogsPage } from './pages/AuditLogsPage';

export const adminRoutes: RouteObject[] = [
  {
    path: '/admin',
    element: <AdminDashboardPage />,
  },
  {
    path: '/admin/moderation',
    element: <ModerationPage />,
  },
  {
    path: '/admin/audit-logs',
    element: <AuditLogsPage />,
  },
];

export default adminRoutes;
