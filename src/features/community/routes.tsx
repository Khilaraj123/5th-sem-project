import type { RouteObject } from 'react-router-dom';
import CommunityDashboard from './pages/CommunityDashboard';
import QuestionDetailsPage from './pages/QuestionDetailsPage';

/**
 * Routing configuration for the Community feature.
 * Exports an array of RouteObjects that can be merged into the main application router.
 */
export const communityRoutes: RouteObject[] = [
  {
    path: '/community',
    element: <CommunityDashboard />,
  },
  {
    path: '/community/questions/:id',
    element: <QuestionDetailsPage />,
  },
];

export default communityRoutes;
