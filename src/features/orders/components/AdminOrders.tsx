import React, { useState, useEffect } from 'react';
import { orderService, OrderStatus } from '../services/order.service';
import { Order } from '../types/order.types';
import { showToast } from '../../../components/ui/Toast';
import OrderList from './OrderList';
import AdminStatistics from './AdminStatistics';

const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>('ALL');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const orders = await orderService.getAllOrders();
      setOrders(orders || []);
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Error al cargar las órdenes', 'error');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = selectedStatus === 'ALL'
    ? orders
    : orders.filter(order => order.status === selectedStatus);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <AdminStatistics />
      
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Todas las Órdenes</h2>
        <div className="flex items-center gap-4">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as OrderStatus)}
            className="px-3 py-2 border rounded-md"
          >
            <option value="ALL">Todos los Estados</option>
            <option value="PENDING">Pendientes</option>
            <option value="PICKED_UP">Recogidos</option>
            <option value="IN_TRANSIT">En Tránsito</option>
            <option value="DELIVERED">Entregados</option>
            <option value="CANCELLED">Cancelados</option>
          </select>
          <button
            onClick={fetchOrders}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Actualizar Lista
          </button>
        </div>
      </div>

      <OrderList
        orders={filteredOrders}
        title=""
        emptyMessage="No hay órdenes disponibles"
        onOrderAssigned={fetchOrders}
        showStatusUpdateButton={false}
      />
    </div>
  );
};

export default AdminOrders; 