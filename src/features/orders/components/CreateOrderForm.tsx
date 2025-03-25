import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { orderService } from '../services/order.service';
import { CreateOrderRequest, ProductType } from '../types/order.types';
import { showToast } from '../../../components/ui/Toast';

const productTypes = ["electronic", "food", "medicine", "other"] as const;

const createOrderSchema = z.object({
  origin: z.string().min(1, 'La dirección de origen es requerida'),
  destination: z.string().min(1, 'La dirección de destino es requerida'),
  destinationZipcode: z.string().min(5, 'El código postal debe tener al menos 5 caracteres'),
  destinationCity: z.string().min(1, 'La ciudad de destino es requerida'),
  weight: z.number().min(0.1, 'El peso debe ser mayor a 0'),
  width: z.number().min(1, 'El ancho debe ser mayor a 0'),
  height: z.number().min(1, 'La altura debe ser mayor a 0'),
  length: z.number().min(1, 'El largo debe ser mayor a 0'),
  productType: z.enum(productTypes),
  isFragile: z.boolean(),
  specialInstructions: z.string().optional(),
});

type CreateOrderFormData = z.infer<typeof createOrderSchema>;

const CreateOrderForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateOrderFormData>({
    resolver: zodResolver(createOrderSchema),
    defaultValues: {
      isFragile: false,
      productType: 'electronic',
    },
  });

  const onSubmit = async (data: CreateOrderFormData) => {
    try {
      await orderService.createOrder(data as CreateOrderRequest);
      showToast('Orden creada exitosamente', 'success');
      reset();
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Error al crear la orden', 'error');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl mx-auto">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-6">Crear Nueva Orden</h2>

        {/* Direcciones */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Dirección de Origen</label>
            <input
              type="text"
              {...register('origin')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.origin && (
              <p className="mt-1 text-sm text-red-600">{errors.origin.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Dirección de Destino</label>
            <input
              type="text"
              {...register('destination')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.destination && (
              <p className="mt-1 text-sm text-red-600">{errors.destination.message}</p>
            )}
          </div>
        </div>

        {/* Ciudad y Código Postal */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Ciudad de Destino</label>
            <input
              type="text"
              {...register('destinationCity')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.destinationCity && (
              <p className="mt-1 text-sm text-red-600">{errors.destinationCity.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Código Postal</label>
            <input
              type="text"
              {...register('destinationZipcode')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.destinationZipcode && (
              <p className="mt-1 text-sm text-red-600">{errors.destinationZipcode.message}</p>
            )}
          </div>
        </div>

        {/* Dimensiones */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Peso (kg)</label>
            <input
              type="number"
              step="0.1"
              {...register('weight', { valueAsNumber: true })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.weight && (
              <p className="mt-1 text-sm text-red-600">{errors.weight.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Ancho (cm)</label>
            <input
              type="number"
              {...register('width', { valueAsNumber: true })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.width && (
              <p className="mt-1 text-sm text-red-600">{errors.width.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Alto (cm)</label>
            <input
              type="number"
              {...register('height', { valueAsNumber: true })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.height && (
              <p className="mt-1 text-sm text-red-600">{errors.height.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Largo (cm)</label>
            <input
              type="number"
              {...register('length', { valueAsNumber: true })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.length && (
              <p className="mt-1 text-sm text-red-600">{errors.length.message}</p>
            )}
          </div>
        </div>

        {/* Tipo de Producto y Frágil */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Tipo de Producto</label>
            <select
              {...register('productType')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {productTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            {errors.productType && (
              <p className="mt-1 text-sm text-red-600">{errors.productType.message}</p>
            )}
          </div>

          <div className="flex items-center mt-6">
            <input
              type="checkbox"
              {...register('isFragile')}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-900">
              ¿Es frágil?
            </label>
          </div>
        </div>

        {/* Instrucciones Especiales */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">
            Instrucciones Especiales
          </label>
          <textarea
            {...register('specialInstructions')}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.specialInstructions && (
            <p className="mt-1 text-sm text-red-600">{errors.specialInstructions.message}</p>
          )}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isSubmitting ? 'Creando...' : 'Crear Orden'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default CreateOrderForm; 