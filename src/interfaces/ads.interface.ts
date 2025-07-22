import { IProduct } from "./product.interface";

export type BannerPosition = "hero" | "featured" | "sidebar" | "promotion";

export interface IAds {
  _id: string;
  name: string;
  position: BannerPosition;
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

export interface FilterAdsParams {
  position?: BannerPosition;
}
