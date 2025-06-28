import { IOrderDetails } from "./order.interface";

export interface ITracking {
  _id: string;
  tracking_id: string;
  order: IOrderDetails;
  createdAt: string
  updatedAt: string
}
