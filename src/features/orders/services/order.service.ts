import api from '../../../app/api';
import { CreateOrderRequest, CreateOrderResponse } from '../types/order.types';

export const orderService = {
  createOrder: async (data: CreateOrderRequest): Promise<CreateOrderResponse> => {
    const response = await api.post('/shipments', data);
    return response.data;
  },
}; 