import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { RootState } from './store';

// Lazy loading de componentes
const Login = React.lazy(() => import('../features/auth/pages/Login'));
const Register = React.lazy(() => import('../features/auth/pages/Register'));
const ForgotPassword = React.lazy(() => import('../features/auth/pages/ForgotPassword'));
const ConfirmEmail = React.lazy(() => import('../features/auth/components/ConfirmEmail'));
const ResetPassword = React.lazy(() => import('../pages/ResetPassword'));
const ResetFirstPassword = React.lazy(() => import('../features/auth/pages/ResetFirstPassword'));
const DashboardLayout = React.lazy(() => import('../features/dashboard/components/DashboardLayout'));
const Dashboard = React.lazy(() => import('../features/dashboard/components/Dashboard'));
const CreateOrderForm = React.lazy(() => import('../features/orders/components/CreateOrderForm'));
const AdminOrders = React.lazy(() => import('../features/orders/components/AdminOrders'));
const OrdersContainer = React.lazy(() => import('../features/orders/components/OrdersContainer'));
const UserManagement = React.lazy(() => import('../features/users/components/UserManagement'));

// Protected route
const ProtectedRoute = ({ children, roles }: { children: React.ReactNode; roles?: string[] }) => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (roles && user && !roles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

// Router
export const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <React.Suspense fallback={<LoadingSpinner />}>
        <Login />
      </React.Suspense>
    ),
  },
  {
    path: '/register',
    element: (
      <React.Suspense fallback={<LoadingSpinner />}>
        <Register />
      </React.Suspense>
    ),
  },
  {
    path: '/confirm-email',
    element: (
      <React.Suspense fallback={<LoadingSpinner />}>
        <ConfirmEmail />
      </React.Suspense>
    ),
  },
  {
    path: '/forgot-password',
    element: (
      <React.Suspense fallback={<LoadingSpinner />}>
        <ForgotPassword />
      </React.Suspense>
    ),
  },
  {
    path: '/reset-password',
    element: (
      <React.Suspense fallback={<LoadingSpinner />}>
        <ResetPassword />
      </React.Suspense>
    ),
  },
  {
    path: '/reset-first-password',
    element: (
      <React.Suspense fallback={<LoadingSpinner />}>
        <ResetFirstPassword />
      </React.Suspense>
    ),
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <React.Suspense fallback={<LoadingSpinner />}>
          <DashboardLayout />
        </React.Suspense>
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <React.Suspense fallback={<LoadingSpinner />}>
            <Dashboard />
          </React.Suspense>
        ),
      },
      {
        path: 'users',
        element: (
          <ProtectedRoute roles={['admin']}>
            <React.Suspense fallback={<LoadingSpinner />}>
              <UserManagement />
            </React.Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: 'my-orders',
        element: (
          <ProtectedRoute roles={['driver', 'user']}>
            <React.Suspense fallback={<LoadingSpinner />}>
              <OrdersContainer />
            </React.Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: 'admin/orders',
        element: (
          <ProtectedRoute roles={['admin']}>
            <React.Suspense fallback={<LoadingSpinner />}>
              <AdminOrders />
            </React.Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: 'create-order',
        element: (
          <ProtectedRoute roles={['user']}>
            <React.Suspense fallback={<LoadingSpinner />}>
              <CreateOrderForm />
            </React.Suspense>
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
]);