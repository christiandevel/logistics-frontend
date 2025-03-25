import React, { useEffect, useState } from 'react';
import { orderService } from '../services/order.service';
import { Order } from '../types/order.types';
import { showToast } from '../../../components/ui/Toast';
import OrderList from './OrderList';

const DriverOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const assignedOrders = await orderService.getDriverAssignedOrders();
      setOrders(assignedOrders);
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Error al cargar las órdenes', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

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
        <h2 className="text-2xl font-bold">Mis Órdenes Asignadas</h2>
      </div>

      <OrderList
        orders={orders}
        title=""
        emptyMessage="No tienes órdenes asignadas"
        showStatusUpdateButton={true}
        onOrderAssigned={fetchOrders}
      />
    </div>
  );
};

export default DriverOrders; 