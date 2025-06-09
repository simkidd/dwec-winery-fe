import { IProduct } from "./product.interface";
import { ITracking } from "./tracking.interface";
import { IUser } from "./user.interface";

export interface IOrder {
  _id: string;
  user: IUser;
  trackindId: ITracking;
  products: IProduct[];
  deliveryMethod: "Pickup" | "Home Delivery";
  deliveryDetails: DeliveryDetails;
  totalAmountPaid: number;
  paymentMethod: number;
  paymentReference: number;
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
  note: string;
  suiteNumber: string;
  streetAddress: string;
  city: string;
  zipCode: string;
  fee: number;
}
