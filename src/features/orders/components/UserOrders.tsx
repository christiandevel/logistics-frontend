import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../app/store';
import { orderService } from '../services/order.service';
import { Order } from '../types/order.types';
import { showToast } from '../../../components/ui/Toast';

const statusColors = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  IN_PROGRESS: 'bg-blue-100 text-blue-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
};

const UserOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (user?.id) {
          const userOrders = await orderService.getUserOrders(Number(user.id));
          setOrders(userOrders);
        }
      } catch (error: any) {
        showToast(error.response?.data?.message || 'Error al cargar las órdenes', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [user?.id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-600">No tienes órdenes creadas</h2>
        <p className="mt-2 text-gray-500">Crea tu primera orden para comenzar</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Mis Órdenes</h2>
      <div className="grid gap-6">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">Orden #{order.id}</h3>
                <p className="text-sm text-gray-500">
                  Creada el {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  statusColors[order.status]
                }`}
              >
                {order.status}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Origen</p>
                <p className="mt-1">{order.origin}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Destino</p>
                <p className="mt-1">{order.destination}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Ciudad de Destino</p>
                <p className="mt-1">{order.destinationCity}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Código Postal</p>
                <p className="mt-1">{order.destinationZipcode}</p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Peso</p>
                <p className="mt-1">{order.weight} kg</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Dimensiones</p>
                <p className="mt-1">
                  {order.width}x{order.height}x{order.length} cm
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Tipo</p>
                <p className="mt-1">{order.productType}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Frágil</p>
                <p className="mt-1">{order.isFragile ? 'Sí' : 'No'}</p>
              </div>
            </div>

            {order.specialInstructions && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-500">Instrucciones Especiales</p>
                <p className="mt-1 text-gray-700">{order.specialInstructions}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserOrders; 