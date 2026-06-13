import type { RouteObject } from 'react-router-dom';
import ProfilePage from './pages/ProfilePage';
import EditProfilePage from './pages/EditProfilePage';

/**
 * Routing configuration for the Users & Profiles feature.
 * Exports an array of RouteObjects to be integrated into the main application router.
 */
export const usersRoutes: RouteObject[] = [
  {
    path: '/profile/:id',
    element: <ProfilePage />,
  },
  {
    path: '/profile/me',
    element: <ProfilePage />,
  },
  {
    path: '/profile/edit',
    element: <EditProfilePage />,
  },
];

export default usersRoutes;
