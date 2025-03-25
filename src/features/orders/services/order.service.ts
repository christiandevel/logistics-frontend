import { io, Socket } from 'socket.io-client';
import api from '../../../app/api';
import { CreateOrderRequest, Order, OrderHistory, StatisticsResponse } from '../types/order.types';

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

  getAllOrders: async (): Promise<Order[]> => {
    const response = await api.get('/shipments');
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
  
  subscribeToOrderUpdates: (orderId: string, callback: (update: OrderHistory) => void) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.error('No se encontró el token en el localStorage');
      return () => {};
    }
    
    const socket: Socket = io(backendUrl, {
      path: '/socket.io',
      transports: ['websocket', 'polling'],
      autoConnect: true,
      auth: {
        token: token
      }
    });
    
    socket.on('connect', () => {
      console.log('✅ Conectado con SocketIO');
      socket.emit('join:order', { orderId });
      console.log(`👥 Suscrito a actualizaciones de la orden ${orderId}`);
    });
    
    socket.on('disconnect', () => {
      console.log('❌ Desconectado de SocketIO');
    });
    
    socket.on('connect_error', (error) => {
      console.error('🚨 Error de conexión con SocketIO:', error.message);
    });

    socket.on('shipment:statusChanged', (data) => {
      console.log('📦 Actualización de estado recibida:', data);
      if (data.shipment.id.toString() === orderId) {
        // Crear un nuevo evento de historial con los datos recibidos
        const historyEvent: OrderHistory = {
          id: Date.now(), // ID temporal para el nuevo evento
          shipment_id: data.shipment.id,
          status: data.shipment.status.toUpperCase(),
          notes: `Estado actualizado a ${data.shipment.status.toUpperCase()}`,
          created_at: new Date().toISOString(),
          is_recent: true, // Marcar como actualización reciente
          user_id: 0, // Asegurarse de incluir user_id
        };
        callback(historyEvent);
      }
    });

    return () => {
      console.log(`👋 Cancelando suscripción a la orden ${orderId}`);
      socket.off('shipment:statusChanged');
      socket.emit('leave:order', { orderId });
      socket.disconnect();
    };
  },

  getShipmentStatistics: async (): Promise<StatisticsResponse> => {
    const response = await api.get('/shipments/statistics');
    return response.data;
  }
}; 