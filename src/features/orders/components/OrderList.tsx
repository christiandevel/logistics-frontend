import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../app/store';
import { Order, OrderHistory } from '../types/order.types';
import Modal from '../../../components/ui/Modal';
import { showToast } from '../../../components/ui/Toast';
import { orderService, OrderStatus } from '../services/order.service';
import { userService, User } from '../../users/services/user.service';

const statusColors: Record<OrderStatus, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  PICKED_UP: 'bg-purple-100 text-purple-800',
  DELIVERED: 'bg-green-100 text-green-800',
  ALL: '', // Este estado no se usa para mostrar colores
};

const statusLabels: Record<OrderStatus, string> = {
  PENDING: 'Pendiente',
  PICKED_UP: 'Recogido',
  DELIVERED: 'Entregado',
  ALL: 'Todos',
};

const productTypeLabels: Record<string, string> = {
  electronic: 'Electrónico',
  food: 'Alimentos',
  medicine: 'Medicamentos',
  other: 'Otro'
};

const historyMessageLabels: Record<string, string> = {
  // Aquí se irán agregando más traducciones según se necesiten
  'Shipment created': 'Orden creada',
  'Driver assigned': 'Conductor asignado',
  'Status changed from PENDING to PICKED_UP': 'Estado actualizado a Recogido',
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
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());
  const [drivers, setDrivers] = useState<User[]>([]);
  const [isLoadingDrivers, setIsLoadingDrivers] = useState(false);

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

  const handleAssignOrder = async (orderId: string) => {
    setSelectedOrderId(orderId);
    setIsModalOpen(true);
    setIsLoadingDrivers(true);
    try {
      const driversList = await userService.getDrivers();
      setDrivers(driversList);
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Error al cargar los conductores', 'error');
    } finally {
      setIsLoadingDrivers(false);
    }
  };

  const handleViewHistory = async (order: Order) => {
    setSelectedOrder(order);
    setIsHistoryModalOpen(true);
    setIsLoadingHistory(true);

    try {
      const history = await orderService.getOrderHistory(order.id);
      // Ordenar el historial por fecha más reciente primero
      const sortedHistory = history.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      setOrderHistory(sortedHistory);

      // Suscribirse a actualizaciones en tiempo real
      const unsubscribe = orderService.subscribeToOrderUpdates(order.id.toString(), (update) => {
        console.log('Nueva actualización recibida:', update);
        setOrderHistory(prev => [update, ...prev]);
        showToast('Estado de la orden actualizado', 'info');
      });

      // Guardar la función de limpieza
      setCleanupSubscription(() => () => {
        unsubscribe();
        console.log('Limpieza de suscripción completada');
      });

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

  const toggleOrderDetails = (orderId: string) => {
    setExpandedOrders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) {
        newSet.delete(orderId);
      } else {
        newSet.add(orderId);
      }
      return newSet;
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
          <div key={order.id} className="bg-white rounded-lg shadow">
            <div 
              className="p-6 cursor-pointer hover:bg-gray-50"
              onClick={() => toggleOrderDetails(order.id)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold">Orden #{order.tracking_number}</h3>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        statusColors[order.status]
                      }`}
                    >
                      {statusLabels[order.status]}
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
                  {user?.role === 'admin' && order.status === 'PENDING' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAssignOrder(order.id);
                      }}
                      className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Asignar
                    </button>
                  )}
                  {showStatusUpdateButton && getNextStatus(order.status) && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStatusUpdate(order);
                      }}
                      className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                    >
                      Actualizar Estado
                    </button>
                  )}
                  {user?.role === 'user' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewHistory(order);
                      }}
                      className="px-3 py-1 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                    >
                      Ver Historial
                    </button>
                  )}
                  <button
                    className="text-gray-400 hover:text-gray-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleOrderDetails(order.id);
                    }}
                  >
                    <svg
                      className={`w-5 h-5 transform transition-transform ${
                        expandedOrders.has(order.id) ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {expandedOrders.has(order.id) && (
              <div className="border-t px-6 py-4 bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <p className="mt-1">{productTypeLabels[order.product_type] || order.product_type}</p>
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
              Seleccionar Conductor
            </label>
            {isLoadingDrivers ? (
              <div className="mt-1 flex justify-center py-2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <select
                value={driverId}
                onChange={(e) => setDriverId(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                disabled={isLoadingDrivers}
              >
                <option value="">Seleccione un conductor</option>
                {drivers.map((driver) => (
                  <option key={driver.id} value={driver.id}>
                    {driver.full_name} ({driver.email})
                  </option>
                ))}
              </select>
            )}
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
            <p>Estado actual: {selectedOrder && statusLabels[selectedOrder.status]}</p>
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
                  <div 
                    key={event.id} 
                    className={`border-l-4 ${
                      event.is_recent ? 'border-green-500 bg-green-50' : 'border-blue-500'
                    } pl-4 py-2 relative`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900">{statusLabels[event.status as OrderStatus]}</p>
                        <p className="text-sm text-gray-600">
                          {historyMessageLabels[event.notes] || event.notes}
                        </p>
                        {event.is_recent && (
                          <span className="inline-flex items-center px-2 py-1 mt-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <span className="animate-pulse mr-1">●</span>
                            Actualización reciente
                          </span>
                        )}
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