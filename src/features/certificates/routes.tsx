import type { RouteObject } from 'react-router-dom';
import CertificatesListPage from './pages/CertificatesListPage';

export const certificatesRoutes: RouteObject[] = [
  {
    path: '/certificates',
    element: <CertificatesListPage />,
  },
];

export default certificatesRoutes;
