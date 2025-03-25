import api from '../../../app/api';
import { CreateOrderRequest, CreateOrderResponse, Order, OrderHistory } from '../types/order.types';

export type OrderStatus = 'PENDING' | 'PICKED_UP'  | 'DELIVERED' | 'ALL';

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

  getDriverAssignedOrders: async (): Promise<Order[]> => {
    const response = await api.get('/shipments/driver/assigned');
    return response.data;
  },

  assignDriver: async (orderId: string, driverId: string): Promise<Order> => {
    const response = await api.put(`/shipments/${orderId}/driver`, { driverId });
    return response.data;
  },

  updateOrderStatus: async (orderId: string, status: Exclude<OrderStatus, 'ALL'>): Promise<Order> => {
    const response = await api.put(`/shipments/${orderId}/status`, { status: status.toLowerCase() });
    return response.data;
  },

  getOrderHistory: async (orderId: string): Promise<OrderHistory[]> => {
    const response = await api.get(`/shipments/${orderId}/history`);
    return response.data;
  },
}; 