import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, Outlet, Navigate, useNavigate } from 'react-router-dom';
import { RootState } from '../../../app/store';
import { logout } from '../../auth/store/authSlice';

interface MenuItem {
  label: string;
  path: string;
  icon?: string;
}

const menuByRole: Record<string, MenuItem[]> = {
  admin: [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Gestionar Usuarios', path: '/dashboard/users' },
    { label: 'Ver Todas las Órdenes', path: '/dashboard/admin/orders' },
  ],
  driver: [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Mis Órdenes', path: '/dashboard/my-orders' },
  ],
  user: [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Mis Órdenes', path: '/dashboard/my-orders' },
    { label: 'Crear Orden', path: '/dashboard/create-order' },
  ],
};

const DashboardLayout: React.FC = () => {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  console.log('isAuthenticated', isAuthenticated);
  console.log('user', user);
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" />;
  }

  const menuItems = menuByRole[user.role] || [];

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md flex flex-col">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">Logistics App</h2>
          <p className="text-sm text-gray-600">{user.email}</p>
        </div>
        <nav className="p-4 flex-grow">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className="block px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        {/* Logout Button */}
        <div className="p-4 border-t">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h5a1 1 0 1 0 0-2H4V5h4a1 1 0 1 0 0-2H3zm12.293 2.293a1 1 0 0 1 1.414 0l3 3a1 1 0 0 1 0 1.414l-3 3a1 1 0 0 1-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 0 1 0-1.414z" clipRule="evenodd" />
            </svg>
            Cerrar Sesión
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm">
          <div className="px-6 py-4">
            <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
          </div>
        </header>
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout; 