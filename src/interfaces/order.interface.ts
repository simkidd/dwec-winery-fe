import { IProduct } from "./product.interface";
import { ITracking } from "./tracking.interface";
import { IUser } from "./user.interface";

export interface PaymentDTO {
  email: string;
  amount: number;
  orderData: CreateOrderDTO;
  callback_url: string;
  cancel_url: string;
}

export interface PaginatedOrderResponse<T> {
  success: boolean;
  message: string;
  orders: T[];
  currentPage: number;
  total: number;
  totalPages: number;
}

export interface orderFilterInput {
  page?: number;
  limit?: number;
}

export interface IOrderDetails {
  _id: string;
  user: IUser;
  trackingId: ITracking;
  products: Product[];
  deliveryMethod: "Pickup" | "Home Delivery";
  deliveryDetails: DeliveryDetails;
  totalAmountPaid: number;
  paymentMethod: "pay-on-delivery" | "paystack";
  paymentReference: string;
  paymentData: string;
  trackingStatus: "Processing" | "Delivered" | "Received";
  trackingLevel: number;
  isCancelled: number;
  cancelledBy: string;
  cancellationReason: string;
  isCompleted: boolean;
  isResolved: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DeliveryDetails {
  area: string;
  phoneNumber: string;
  email: string;
  note?: string;
  suiteNumber?: string;
  streetAddress: string;
  city: string;
  zipCode: string;
  fee: number;
}

export interface Product {
  _id: string;
  qty: number;
  product: IProduct;
  variantUsed: VariantUsed;
}

export interface VariantUsed {
  id: string;
  name: string;
  price: number;
  images: string[];
  quantityOrdered: number;
}

export interface OrderedProductVariant {
  id: string;
  qty: number;
  price: number;
  name: string;
  images: string[];
}

interface OrderedProducts {
  product: string;
  qty: number;
  variant?: OrderedProductVariant;
}

export interface CreateOrderDTO {
  products: OrderedProducts[];
  paymentReference: string;
  paymentMethod: string;
  totalAmountPaid: number;
  deliveryMethod: "Pickup" | "Home Delivery";
  deliveryDetails: DeliveryDetails;
}
