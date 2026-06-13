import type { RouteObject } from 'react-router-dom';
import ClassroomDashboard from './pages/ClassroomDashboard';
import ClassroomDetailsPage from './pages/ClassroomDetailsPage';
import JoinClassroomPage from './pages/JoinClassroomPage';

/**
 * Routing configuration for the Classrooms feature.
 * Exports an array of RouteObjects that can be merged into the main application router.
 */
export const classroomRoutes: RouteObject[] = [
  {
    path: '/classrooms',
    element: <ClassroomDashboard />,
  },
  {
    path: '/classrooms/:id',
    element: <ClassroomDetailsPage />,
  },
  {
    path: '/classrooms/join',
    element: <JoinClassroomPage />,
  },
];

export default classroomRoutes;
