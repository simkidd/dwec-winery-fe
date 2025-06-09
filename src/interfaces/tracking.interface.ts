import { IOrder } from "./order.interface";

export interface ITracking {
  _id: string;
  tracking_id: string;
  order: IOrder;
}
