import type { RouteObject } from 'react-router-dom';
import CheckoutPage from './pages/CheckoutPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';

export const paymentsRoutes: RouteObject[] = [
  {
    path: '/checkout/:courseId',
    element: <CheckoutPage />,
  },
  {
    path: '/payment/success/:courseId',
    element: <PaymentSuccessPage />,
  },
];

export default paymentsRoutes;
