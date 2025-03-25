import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../app/store';
import { Order, OrderHistory } from '../types/order.types';
import Modal from '../../../components/ui/Modal';
import { showToast } from '../../../components/ui/Toast';
import { orderService, OrderStatus } from '../services/order.service';

const statusColors: Record<OrderStatus, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  PICKED_UP: 'bg-purple-100 text-purple-800',
  DELIVERED: 'bg-green-100 text-green-800',
  ALL: '', // Este estado no se usa para mostrar colores
};

interface OrderListProps {
  orders: Order[];
  title: string;
  emptyMessage: string;
  onOrderAssigned?: () => void;
  showStatusUpdateButton?: boolean;
}

const OrderList: React.FC<OrderListProps> = ({ 
  orders, 
  title, 
  emptyMessage, 
  onOrderAssigned,
  showStatusUpdateButton = false
}) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderHistory, setOrderHistory] = useState<OrderHistory[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [driverId, setDriverId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cleanup function for socket subscription
  const [cleanupSubscription, setCleanupSubscription] = useState<(() => void) | null>(null);

  useEffect(() => {
    // Cleanup cuando el componente se desmonta o el modal se cierra
    return () => {
      if (cleanupSubscription) {
        cleanupSubscription();
      }
    };
  }, [cleanupSubscription]);

  const handleAssignOrder = (orderId: string) => {
    setSelectedOrderId(orderId);
    setIsModalOpen(true);
  };

  const handleViewHistory = async (order: Order) => {
    setSelectedOrder(order);
    setIsHistoryModalOpen(true);
    setIsLoadingHistory(true);

    try {
      const history = await orderService.getOrderHistory(order.id);
      setOrderHistory(history);
      
  
      const unsubscribe = orderService.suscribeToOrderUpdates(order.id.toString(), (update) => {
        setOrderHistory(prev => [...prev, update]);
        showToast('Nueva actualización recibida', 'info');
      });

      // Guardar la función de limpieza para usarla cuando se cierre el modal
      setCleanupSubscription(() => unsubscribe);
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Error al cargar el historial', 'error');
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleSubmitAssignment = async () => {
    if (!selectedOrderId || !driverId) return;

    setIsSubmitting(true);
    try {
      await orderService.assignDriver(selectedOrderId, driverId);
      showToast('Orden asignada exitosamente', 'success');
      setIsModalOpen(false);
      setDriverId('');
      if (onOrderAssigned) {
        onOrderAssigned();
      }
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Error al asignar la orden', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getNextStatus = (currentStatus: Exclude<OrderStatus, 'ALL'>): Exclude<OrderStatus, 'ALL'> | null => {
    const statusFlow: { [key in Exclude<OrderStatus, 'ALL'>]: Exclude<OrderStatus, 'ALL'> } = {
      PENDING: 'PICKED_UP',
      PICKED_UP: 'DELIVERED',
      DELIVERED: 'DELIVERED',
    };
    return statusFlow[currentStatus] || null;
  };

  const handleStatusUpdate = async (order: Order) => {
    const nextStatus = getNextStatus(order.status);
    if (!nextStatus) return;

    try {
      await orderService.updateOrderStatus(order.id, nextStatus);
      showToast(`Estado actualizado a: ${nextStatus}`, 'success');
      if (onOrderAssigned) {
        onOrderAssigned(); // Recargar las órdenes después de actualizar
      }
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Error al actualizar el estado', 'error');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-600">{emptyMessage}</h2>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {title && <h2 className="text-2xl font-bold">{title}</h2>}
      <div className="grid gap-6">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold">Orden #{order.id}</h3>
                  <span className="text-sm text-gray-500">
                    ({order.tracking_number})
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  Creada el {new Date(order.created_at).toLocaleDateString()}
                </p>
                {order.driverInfo && (
                  <div className="mt-2 text-sm">
                    <span className="font-medium text-gray-700">Transportador: </span>
                    <span className="text-gray-600">{order.driverInfo.full_name}</span>
                    <span className="text-gray-400 ml-2">({order.driverInfo.email})</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    statusColors[order.status]
                  }`}
                >
                  {order.status}
                </span>
                {user?.role === 'admin' && order.status === 'PENDING' && (
                  <button
                    onClick={() => handleAssignOrder(order.id)}
                    className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Asignar
                  </button>
                )}
                {showStatusUpdateButton && getNextStatus(order.status) && (
                  <button
                    onClick={() => handleStatusUpdate(order)}
                    className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  >
                    Actualizar Estado
                  </button>
                )}
                {user?.role === 'user' && (
                  <button
                    onClick={() => handleViewHistory(order)}
                    className="px-3 py-1 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                  >
                    Ver Historial
                  </button>
                )}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Origen</p>
                <p className="mt-1">{order.origin}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Destino</p>
                <p className="mt-1">{order.destination}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Ciudad de Destino</p>
                <p className="mt-1">{order.destination_city}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Código Postal</p>
                <p className="mt-1">{order.destination_zipcode}</p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Peso</p>
                <p className="mt-1">{order.weight} kg</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Dimensiones</p>
                <p className="mt-1">
                  {order.width}x{order.height}x{order.length} cm
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Tipo</p>
                <p className="mt-1">{order.product_type}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Frágil</p>
                <p className="mt-1">{order.is_fragile ? 'Sí' : 'No'}</p>
              </div>
            </div>

            {order.special_instructions && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-500">Instrucciones Especiales</p>
                <p className="mt-1 text-gray-700">{order.special_instructions}</p>
              </div>
            )}

            {order.estimated_delivery_date && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-500">Fecha Estimada de Entrega</p>
                <p className="mt-1 text-gray-700">
                  {new Date(order.estimated_delivery_date).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setDriverId('');
        }}
        title="Asignar Orden"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              ID del Transportador
            </label>
            <input
              type="text"
              value={driverId}
              onChange={(e) => setDriverId(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Ingrese el ID del transportador"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                setIsModalOpen(false);
                setDriverId('');
              }}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmitAssignment}
              disabled={!driverId.trim() || isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Asignando...' : 'Asignar'}
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isHistoryModalOpen}
        onClose={() => {
          if (cleanupSubscription) {
            cleanupSubscription();
          }
          setIsHistoryModalOpen(false);
          setSelectedOrder(null);
          setOrderHistory([]);
          setCleanupSubscription(null);
        }}
        title={`Historial de Orden #${selectedOrder?.id}`}
      >
        <div className="space-y-4">
          <div className="text-sm text-gray-600">
            <p>Número de seguimiento: {selectedOrder?.tracking_number}</p>
            <p>Estado actual: {selectedOrder?.status}</p>
            <p>Fecha de creación: {selectedOrder && formatDate(selectedOrder.created_at)}</p>
            {selectedOrder?.driverInfo && (
              <p>Transportador asignado: {selectedOrder.driverInfo.full_name}</p>
            )}
          </div>
          <div className="border-t pt-4">
            <h4 className="font-medium mb-2">Historial de Estados</h4>
            {isLoadingHistory ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : orderHistory.length > 0 ? (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {orderHistory.map((event) => (
                  <div key={event.id} className="border-l-4 border-blue-500 pl-4 py-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900">{event.status}</p>
                        <p className="text-sm text-gray-600">{event.notes}</p>
                      </div>
                      <span className="text-sm text-gray-500">
                        {formatDate(event.created_at)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No hay registros en el historial.</p>
            )}
          </div>
          <div className="flex justify-end">
            <button
              onClick={() => {
                setIsHistoryModalOpen(false);
                setSelectedOrder(null);
                setOrderHistory([]);
              }}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cerrar
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default OrderList; 