import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { store } from './store';
import LoadingSpinner from '../components/ui/LoadingSpinner';

// Lazy loading de componentes
const Login = React.lazy(() => import('../features/auth/pages/Login'));
const Register = React.lazy(() => import('../features/auth/pages/Register'));
const ForgotPassword = React.lazy(() => import('../features/auth/pages/ForgotPassword'));
const ConfirmEmail = React.lazy(() => import('../features/auth/components/ConfirmEmail'));

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
    path: '/forgot-password',
    element: (
      <React.Suspense fallback={<LoadingSpinner />}>
        <ForgotPassword />
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
]);