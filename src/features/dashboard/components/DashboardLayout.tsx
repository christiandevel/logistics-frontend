import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, Outlet, Navigate, useNavigate } from 'react-router-dom';
import { RootState } from '../../../app/store';
import { logout } from '../../auth/store/authSlice';

/**
 * Interface that defines the structure of a menu item
 * @property {string} label - Text to display in the menu
 * @property {string} path - Route to navigate to
 * @property {string} [icon] - Optional icon for the menu item
 */
interface MenuItem {
  label: string;
  path: string;
  icon?: string;
}

/**
 * Mapping of user roles to menu items
 * Defines which menu options are available for each user type
 */
const menuByRole: Record<string, MenuItem[]> = {
  admin: [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'View All Orders', path: '/dashboard/admin/orders' },
    { label: 'Manage Users', path: '/dashboard/users' },
  ],
  driver: [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'My Orders', path: '/dashboard/my-orders' },
  ],
  user: [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'My Orders', path: '/dashboard/my-orders' },
    { label: 'Create Order', path: '/dashboard/create-order' },
  ],
};

/**
 * Main dashboard layout component
 * Handles the general structure of the application, including:
 * - Sidebar navigation
 * - Main content area
 * - Authentication handling
 * - Contextual menu based on user role
 */
const DashboardLayout: React.FC = () => {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redirect to login if no authenticated user
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" />;
  }

  const menuItems = menuByRole[user.role] || [];

  /**
   * Handles the logout process
   * Dispatches the logout action and redirects the user to the login page
   */
  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Main navigation sidebar */}
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
        {/* Logout button */}
        <div className="p-4 border-t">
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h5a1 1 0 1 0 0-2H4V5h4a1 1 0 1 0 0-2H3zm12.293 2.293a1 1 0 0 1 1.414 0l3 3a1 1 0 0 1 0 1.414l-3 3a1 1 0 0 1-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 0 1 0-1.414z" clipRule="evenodd" />
            </svg>
            Logout
          </button>
        </div>
      </div>

      {/* Main application content */}
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