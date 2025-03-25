import { OrderStatus } from '../services/order.service';

export type ProductType = 'electronic' | 'food' | 'medicine' | 'other';

export interface CreateOrderRequest {
  origin: string;
  destination: string;
  destinationZipcode: string;
  destinationCity: string;
  weight: number;
  width: number;
  height: number;
  length: number;
  productType: ProductType;
  isFragile: boolean;
  specialInstructions?: string;
}

export interface DriverInfo {
  id: number;
  email: string;
  full_name: string;
}

export interface Order {
  id: string;
  user_id: number;
  driver_id: number | null;
  origin: string;
  destination: string;
  destination_zipcode: string;
  destination_city: string;
  weight: string;
  width: string;
  height: string;
  length: string;
  product_type: string;
  is_fragile: boolean;
  special_instructions?: string;
  tracking_number: string;
  status: Exclude<OrderStatus, 'ALL'>;
  estimated_delivery_date: string;
  assigned_at: string;
  created_at: string;
  updated_at: string;
  driverInfo: DriverInfo | null;
}

export interface CreateOrderResponse {
  id: string;
  status: string;
  message: string;
} 