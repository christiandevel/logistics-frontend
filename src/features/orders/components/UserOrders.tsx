import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../app/store';
import { orderService } from '../services/order.service';
import { Order } from '../types/order.types';
import { showToast } from '../../../components/ui/Toast';
import OrderList from './OrderList';

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

  return (
    <OrderList
      orders={orders}
      title="Mis Órdenes"
      emptyMessage="No tienes órdenes creadas"
    />
  );
};

export default UserOrders; 