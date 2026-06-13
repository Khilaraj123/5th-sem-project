import type { RouteObject } from 'react-router-dom';
import NotificationHistoryPage from './pages/NotificationHistoryPage';
import SendNotificationPage from './pages/SendNotificationPage';

/**
 * Routing configuration for the Notifications feature.
 * Exports an array of RouteObjects to be integrated into the main application router.
 */
export const notificationsRoutes: RouteObject[] = [
  {
    path: '/notifications',
    element: <NotificationHistoryPage />,
  },
  {
    path: '/notifications/send',
    element: <SendNotificationPage />,
  },
];

export default notificationsRoutes;
