export interface IDeliveryArea {
  _id: string;
  name: string;
  amount: number;
  createdAt: string;
  updatedAt: string;
}

export interface IDeliveryAreasResponse {
  success: boolean;
  count: number;
  data: IDeliveryArea[];
}
