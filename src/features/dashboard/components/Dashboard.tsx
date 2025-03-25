import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../app/store';

const Dashboard: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  const renderDashboardContent = () => {
    switch (user?.role) {
      case 'admin':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-2">Gestión de Usuarios</h3>
              <p className="text-gray-600">Administra los usuarios del sistema</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-2">Asignación de Rutas</h3>
              <p className="text-gray-600">Asigna rutas a los conductores</p>
            </div>
          </div>
        );
      case 'driver':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-2">Órdenes Asignadas</h3>
              <p className="text-gray-600">Visualiza y gestiona tus órdenes asignadas</p>
            </div>
          </div>
        );
      case 'user':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-2">Crear Nueva Orden</h3>
              <p className="text-gray-600">Crea una nueva orden de envío</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-2">Seguimiento de Órdenes</h3>
              <p className="text-gray-600">Realiza seguimiento a tus órdenes</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Bienvenido, {user?.email}
        </h2>
        <p className="text-gray-600">
          {user?.role === 'admin' && 'Panel de Administración'}
          {user?.role === 'driver' && 'Panel de Conductor'}
          {user?.role === 'user' && 'Panel de Usuario'}
        </p>
      </div>
      {renderDashboardContent()}
    </div>
  );
};

export default Dashboard; 