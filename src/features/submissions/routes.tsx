import type { RouteObject } from 'react-router-dom';
import StudentSubmissionPage from './pages/StudentSubmissionPage';

/**
 * Routing configuration for the Submissions feature.
 * Exports an array of RouteObjects to be integrated into the main application router.
 */
export const submissionsRoutes: RouteObject[] = [
  {
    path: '/submissions/:id',
    element: <StudentSubmissionPage />,
  },
];

export default submissionsRoutes;
