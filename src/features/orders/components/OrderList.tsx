import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../app/store';
import { Order } from '../types/order.types';
import Modal from '../../../components/ui/Modal';
import { showToast } from '../../../components/ui/Toast';

const statusColors = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  IN_PROGRESS: 'bg-blue-100 text-blue-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
};

interface OrderListProps {
  orders: Order[];
  title: string;
  emptyMessage: string;
}

const OrderList: React.FC<OrderListProps> = ({ orders, title, emptyMessage }) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [driverId, setDriverId] = useState('');

  const handleAssignOrder = (orderId: string) => {
    setSelectedOrderId(orderId);
    setIsModalOpen(true);
  };

  const handleSubmitAssignment = async () => {
    try {
      // TODO: Implementar la llamada al servicio para asignar la orden
      showToast('Orden asignada exitosamente', 'success');
      setIsModalOpen(false);
      setDriverId('');
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Error al asignar la orden', 'error');
    }
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
      <h2 className="text-2xl font-bold">{title}</h2>
      <div className="grid gap-6">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">Orden #{order.id}</h3>
                <p className="text-sm text-gray-500">
                  Creada el {new Date(order.createdAt).toLocaleDateString()}
                </p>
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
                <p className="mt-1">{order.destinationCity}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Código Postal</p>
                <p className="mt-1">{order.destinationZipcode}</p>
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
                <p className="mt-1">{order.productType}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Frágil</p>
                <p className="mt-1">{order.isFragile ? 'Sí' : 'No'}</p>
              </div>
            </div>

            {order.specialInstructions && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-500">Instrucciones Especiales</p>
                <p className="mt-1 text-gray-700">{order.specialInstructions}</p>
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
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmitAssignment}
              disabled={!driverId.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              Asignar
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default OrderList; 