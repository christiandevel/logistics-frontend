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

export interface Order extends CreateOrderRequest {
  id: string;
  userId: number;
  status: 'PENDING' | 'IN_PROGRESS' | 'DELIVERED' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderResponse {
  id: string;
  status: string;
  message: string;
} 