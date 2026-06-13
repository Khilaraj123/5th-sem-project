import type { RouteObject } from 'react-router-dom';
import CreateAssignmentPage from './pages/CreateAssignmentPage';
import EditAssignmentPage from './pages/EditAssignmentPage';
import AssignmentDetailsPage from './pages/AssignmentDetailsPage';

/**
 * Routing configuration for the Assignments and Submissions feature.
 * Exports an array of RouteObjects to be integrated into the main application router.
 */
export const assignmentsRoutes: RouteObject[] = [
  {
    path: '/classrooms/:classroomId/assignments/create',
    element: <CreateAssignmentPage />,
  },
  {
    path: '/assignments/:id',
    element: <AssignmentDetailsPage />,
  },
  {
    path: '/assignments/:id/edit',
    element: <EditAssignmentPage />,
  },
];

export default assignmentsRoutes;
