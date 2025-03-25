import api from '../../../app/api';
import { CreateOrderRequest, CreateOrderResponse, Order } from '../types/order.types';

export type OrderStatus = 'PENDING' | 'PICKED_UP' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED' | 'ALL';

export const orderService = {
  createOrder: async (orderData: CreateOrderRequest): Promise<Order> => {
    const response = await api.post('/shipments', orderData);
    return response.data;
  },

  getUserOrders: async (userId: number): Promise<Order[]> => {
    const response = await api.get(`/shipments/user/${userId}`);
    return response.data;
  },

  getAllOrders: async (status?: OrderStatus): Promise<Order[]> => {
    const params = status && status !== 'ALL' ? { status } : undefined;
    const response = await api.get('/shipments', { params });
    return response.data;
  },

  assignDriver: async (orderId: string, driverId: string): Promise<Order> => {
    const response = await api.put(`/shipments/${orderId}/driver`, { driverId });
    return response.data;
  },
}; 