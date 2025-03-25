import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { orderService } from '../services/order.service';
import { CreateOrderRequest, ProductType } from '../types/order.types';
import { showToast } from '../../../components/ui/Toast';

const productTypes = ["electronic", "food", "medicine", "other"] as const;

const productTypeLabels: Record<ProductType, string> = {
  electronic: 'Electrónico',
  food: 'Alimentos',
  medicine: 'Medicamentos',
  other: 'Otro'
};

// Expresiones regulares para validar direcciones colombianas
const addressRegex = /^[A-Za-z0-9\s#-]+$/;
const streetNumberRegex = /^[0-9]+[A-Za-z]?$/;
const apartmentRegex = /^[0-9]+[A-Za-z]?$/;

const createOrderSchema = z.object({
  origin: z.string()
    .min(1, 'La dirección de origen es requerida')
    .regex(addressRegex, 'La dirección solo puede contener letras, números, espacios, # y -')
    .refine((val) => {
      // Verificar que la dirección tenga al menos un número
      return /\d/.test(val);
    }, 'La dirección debe incluir un número')
    .refine((val) => {
      // Verificar que la dirección tenga al menos una letra
      return /[A-Za-z]/.test(val);
    }, 'La dirección debe incluir el nombre de la calle o avenida'),
  destination: z.string()
    .min(1, 'La dirección de destino es requerida')
    .regex(addressRegex, 'La dirección solo puede contener letras, números, espacios, # y -')
    .refine((val) => {
      // Verificar que la dirección tenga al menos un número
      return /\d/.test(val);
    }, 'La dirección debe incluir un número')
    .refine((val) => {
      // Verificar que la dirección tenga al menos una letra
      return /[A-Za-z]/.test(val);
    }, 'La dirección debe incluir el nombre de la calle o avenida'),
  destinationZipcode: z.string()
    .min(5, 'El código postal debe tener al menos 5 caracteres')
    .max(6, 'El código postal no puede tener más de 6 caracteres')
    .regex(/^[0-9]+$/, 'El código postal solo puede contener números'),
  destinationCity: z.string()
    .min(1, 'La ciudad de destino es requerida')
    .regex(/^[A-Za-z\s]+$/, 'La ciudad solo puede contener letras y espacios')
    .min(2, 'La ciudad debe tener al menos 2 caracteres'),
  weight: z.string()
    .min(1, 'El peso es requerido')
    .transform((val) => Number(val))
    .refine((val) => !isNaN(val), 'Por favor, ingrese un número válido')
    .refine((val) => val > 0, 'El peso debe ser mayor a 0')
    .refine((val) => val <= 1000, 'El peso no puede exceder los 1000 kg'),
  width: z.string()
    .min(1, 'El ancho es requerido')
    .transform((val) => Number(val))
    .refine((val) => !isNaN(val), 'Por favor, ingrese un número válido')
    .refine((val) => val > 0, 'El ancho debe ser mayor a 0')
    .refine((val) => val <= 300, 'El ancho no puede exceder los 300 cm'),
  height: z.string()
    .min(1, 'La altura es requerida')
    .transform((val) => Number(val))
    .refine((val) => !isNaN(val), 'Por favor, ingrese un número válido')
    .refine((val) => val > 0, 'La altura debe ser mayor a 0')
    .refine((val) => val <= 300, 'La altura no puede exceder los 300 cm'),
  length: z.string()
    .min(1, 'El largo es requerido')
    .transform((val) => Number(val))
    .refine((val) => !isNaN(val), 'Por favor, ingrese un número válido')
    .refine((val) => val > 0, 'El largo debe ser mayor a 0')
    .refine((val) => val <= 300, 'El largo no puede exceder los 300 cm'),
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
      const orderData: CreateOrderRequest = {
        ...data,
        weight: Number(data.weight),
        width: Number(data.width),
        height: Number(data.height),
        length: Number(data.length),
      };
      await orderService.createOrder(orderData);
      showToast('Orden creada exitosamente', 'success');
      reset();
    } catch (error: any) {
      showToast(error.response?.data?.message || 'Error al crear la orden', 'error');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-6xl mx-auto">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-6">Crear Nueva Orden</h2>

        {/* Direcciones */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Dirección de Origen</label>
            <input
              type="text"
              {...register('origin')}
              className="input-primary"
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
              className="input-primary"
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
              className="input-primary"
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
              className="input-primary"
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
              {...register('weight')}
              className="input-primary"
            />
            {errors.weight && (
              <p className="mt-1 text-sm text-red-600">{errors.weight.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Ancho (cm)</label>
            <input
              type="number"
              {...register('width')}
              className="input-primary"
            />
            {errors.width && (
              <p className="mt-1 text-sm text-red-600">{errors.width.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Alto (cm)</label>
            <input
              type="number"
              {...register('height')}
              className="input-primary"
            />
            {errors.height && (
              <p className="mt-1 text-sm text-red-600">{errors.height.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Largo (cm)</label>
            <input
              type="number"
              {...register('length')}
              className="input-primary"
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
              className="input-primary"
            >
              {productTypes.map((type) => (
                <option key={type} value={type}>
                  {productTypeLabels[type]}
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
            className="input-primary"
          />
          {errors.specialInstructions && (
            <p className="mt-1 text-sm text-red-600">{errors.specialInstructions.message}</p>
          )}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary"
          >
            {isSubmitting ? 'Creando...' : 'Crear Orden'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default CreateOrderForm; 