import React, { useState, useEffect } from 'react';
import { orderService } from '../services/order.service';
import { ShipmentStatistics } from '../types/order.types';
import { showToast } from '../../../components/ui/Toast';

const AdminStatistics: React.FC = () => {
  const [statistics, setStatistics] = useState<ShipmentStatistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStatistics = async () => {
    try {
      setIsLoading(true);
      const response = await orderService.getShipmentStatistics();
      setStatistics(response.data);
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Error al cargar las estadísticas', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!statistics) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No hay estadísticas disponibles</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Estadísticas de Envíos</h2>
        <button
          onClick={fetchStatistics}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Actualizar Estadísticas
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow flex flex-col justify-between items-start">
          <h3 className="text-lg font-semibold text-gray-700">Total de Envíos</h3>
          <p className="text-3xl font-bold text-blue-600">{statistics.totalShipments}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow flex flex-col justify-between items-start">
          <h3 className="text-lg font-semibold text-gray-700">Tiempo Promedio de Entrega</h3>
          <p className="text-3xl font-bold text-green-600">{statistics.averageDeliveryTime} días</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow flex flex-col justify-between items-start">
          <h3 className="text-lg font-semibold text-gray-700">En Tránsito</h3>
          <p className="text-3xl font-bold text-purple-600">{statistics.totalInTransit}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow flex flex-col justify-between items-start">
          <h3 className="text-lg font-semibold text-gray-700">Entregados</h3>
          <p className="text-3xl font-bold text-green-600">{statistics.totalDelivered}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Estado de los Envíos</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Object.entries(statistics.statusCounts).map(([status, count]) => (
            <div key={status} className="text-center">
              <p className="text-sm text-gray-500">{status}</p>
              <p className="text-xl font-semibold">{count}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Envíos por Ciudad</h3>
          <div className="space-y-2">
            {statistics.shipmentsByCity.map((item) => (
              <div key={item.city} className="flex justify-between items-center">
                <span className="text-gray-600">{item.city}</span>
                <span className="font-semibold">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Envíos por Fecha</h3>
          <div className="space-y-2">
            {statistics.shipmentsByDate.map((item) => (
              <div key={item.date} className="flex justify-between items-center">
                <span className="text-gray-600">{new Date(item.date).toLocaleDateString()}</span>
                <span className="font-semibold">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStatistics; 