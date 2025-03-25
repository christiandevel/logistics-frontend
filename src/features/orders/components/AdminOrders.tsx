import React, { useEffect, useState } from 'react';
import { orderService, OrderStatus } from '../services/order.service';
import { Order } from '../types/order.types';
import { showToast } from '../../../components/ui/Toast';
import OrderList from './OrderList';

const orderStatuses: OrderStatus[] = ['ALL', 'PENDING', 'PICKED_UP', 'DELIVERED'];

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>('ALL');

  const fetchOrders = async () => {
    try {
      const allOrders = await orderService.getAllOrders(selectedStatus);
      setOrders(allOrders);
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Error al cargar las órdenes', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchOrders();
  }, [selectedStatus]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Todas las Órdenes</h2>
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">
            Filtrar por estado:
          </label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as OrderStatus)}
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            {orderStatuses.map((status) => (
              <option key={status} value={status}>
                {status === 'ALL' ? 'Todos' : status}
              </option>
            ))}
          </select>
        </div>
      </div>

      <OrderList
        orders={orders}
        title=""
        emptyMessage="No hay órdenes registradas en el sistema"
        onOrderAssigned={fetchOrders}
      />
    </div>
  );
};

export default AdminOrders; 