import { IProduct } from "./product.interface";

export interface IAds {
  _id: string;
  name: string;
  description: string;
  validFrom: Date | string;
  expiresOn: Date | string;
  totalAmountPaid: number;
  paymentPer: string;
  image: string;
  associatedProduct: IProduct;
  otherAssociatedProducts: IProduct[];
  isFreeDeliveryOnAssociatedProduct: boolean;
  isActive: boolean;
}
