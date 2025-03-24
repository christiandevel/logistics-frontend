import { createBrowserRouter, Navigate } from 'react-router-dom';
import { store } from './store';
import React from 'react';

// Lazy loading de componentes
const Login = React.lazy(() => import('../features/auth/pages/Login'));
const Register = React.lazy(() => import('../features/auth/pages/Register'));
const ForgotPassword = React.lazy(() => import('../features/auth/pages/ForgotPassword'));
// const Dashboard = React.lazy(() => import('../features/dashboard/pages/Dashboard'));
// const Orders = React.lazy(() => import('../features/orders/pages/Orders'));
// const Users = React.lazy(() => import('../features/users/pages/Users'));

// Componente de protección de rutas
const ProtectedRoute = ({ children, roles }: { children: React.ReactNode; roles?: string[] }) => {
  const { isAuthenticated, user } = store.getState().auth;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (roles && user && !roles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: '/login',
    element: (
      <React.Suspense fallback={<div>Loading...</div>}>
        <Login />
      </React.Suspense>
    ),
  },
  {
    path: '/register',
    element: (
      <React.Suspense fallback={<div>Loading...</div>}>
        <Register />
      </React.Suspense>
    ),
  },
  {
    path: '/forgot-password',
    element: (
      <React.Suspense fallback={<div>Loading...</div>}>
        <ForgotPassword />
      </React.Suspense>
    ),
  },
  // {
  //   path: '/dashboard',
  //   element: (
  //     <ProtectedRoute>
  //       <React.Suspense fallback={<div>Loading...</div>}>
  //         <Dashboard />
  //       </React.Suspense>
  //     </ProtectedRoute>
  //   ),
  // },
  // {
  //   path: '/orders',
  //   element: (
  //     <ProtectedRoute>
  //       <React.Suspense fallback={<div>Loading...</div>}>
  //         <Orders />
  //       </React.Suspense>
  //     </ProtectedRoute>
  //   ),
  // },
  // {
  //   path: '/users',
  //   element: (
  //     <ProtectedRoute roles={['admin']}>
  //       <React.Suspense fallback={<div>Loading...</div>}>
  //         <Users />
  //       </React.Suspense>
  //     </ProtectedRoute>
  //   ),
  // },
]);