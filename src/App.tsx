import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from './components/Layout';
import authRoutes from './features/auth/routes';
import classroomRoutes from './features/classrooms/routes';
import communityRoutes from './features/community/routes';
import coursesRoutes from './features/courses/routes';
import notificationsRoutes from './features/notifications/routes';
import assignmentsRoutes from './features/assignments/routes';
import submissionsRoutes from './features/submissions/routes';
import usersRoutes from './features/users/routes';
import paymentsRoutes from './features/payments/routes';
import certificatesRoutes from './features/certificates/routes';
import adminRoutes from './features/admin/routes';

// Create TanStack Query client for API request caching and states
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

// Setup routing paths, merging authentication, classrooms, community, courses, notifications, assignments, submissions, and users routes
const router = createBrowserRouter([
  // Standalone public routes
  ...authRoutes,

  // Authenticated routes wrapped inside Layout
  {
    element: <Layout />,
    children: [
      ...classroomRoutes,
      ...communityRoutes,
      ...coursesRoutes,
      ...notificationsRoutes,
      ...assignmentsRoutes,
      ...submissionsRoutes,
      ...usersRoutes,
      ...paymentsRoutes,
      ...certificatesRoutes,
      ...adminRoutes,
    ],
  },
  {
    path: '*',
    element: <Navigate to="/login" replace />,
  },
]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
