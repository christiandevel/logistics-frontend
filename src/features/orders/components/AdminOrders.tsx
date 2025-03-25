import React, { useEffect, useState } from 'react';
import { orderService } from '../services/order.service';
import { Order } from '../types/order.types';
import { showToast } from '../../../components/ui/Toast';
import OrderList from './OrderList';

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const allOrders = await orderService.getAllOrders();
        setOrders(allOrders);
      } catch (error: any) {
        showToast(error.response?.data?.message || 'Error al cargar las órdenes', 'error');
      } finally {
        setIsLoading(false);
      }
    };

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
    <OrderList
      orders={orders}
      title="Todas las Órdenes"
      emptyMessage="No hay órdenes registradas en el sistema"
    />
  );
};

export default AdminOrders; 