import type { RouteObject } from 'react-router-dom';
import CourseCatalogPage from './pages/CourseCatalogPage';
import CourseDetailPage from './pages/CourseDetailPage';
import CoursePlayerPage from './pages/CoursePlayerPage';
import CreateCoursePage from './pages/CreateCoursePage';
import EditCoursePage from './pages/EditCoursePage';

/**
 * Routing configuration for the Courses feature.
 * Exports an array of RouteObjects to be integrated into the main application router.
 */
export const coursesRoutes: RouteObject[] = [
  {
    path: '/courses',
    element: <CourseCatalogPage />,
  },
  {
    path: '/courses/create',
    element: <CreateCoursePage />,
  },
  {
    path: '/courses/:id',
    element: <CourseDetailPage />,
  },
  {
    path: '/courses/:id/learn',
    element: <CoursePlayerPage />,
  },
  {
    path: '/courses/:id/edit',
    element: <EditCoursePage />,
  },
];

export default coursesRoutes;
