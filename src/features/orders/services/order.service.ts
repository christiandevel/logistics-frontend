import api from '../../../app/api';
import { CreateOrderRequest, CreateOrderResponse, Order } from '../types/order.types';

export const orderService = {
  createOrder: async (data: CreateOrderRequest): Promise<CreateOrderResponse> => {
    const response = await api.post('/shipments', data);
    return response.data;
  },

  getUserOrders: async (userId: number): Promise<Order[]> => {
    const response = await api.get(`/shipments/user/${userId}`);
    return response.data;
  },
}; 