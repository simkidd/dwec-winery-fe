import { IProduct } from "./product.interface";

export type BannerPosition =
  | "hero"
  | "featured"
  | "sidebar"
  | "promotion"
  | "main"
  | "product"
  | "footer";

export type BannerType = "promotional" | "seasonal" | "default";

export interface Banner {
  position: BannerPosition;
  image: string;
  imagePublicId: string;
  mobileImage?: string;
  mobileImagePublicId?: string;
}

export interface IAds {
  _id: string;
  name: string;
  description?: string;
  validFrom: Date | string;
  expiresOn: Date | string;
  totalAmountPaid: number;
  paymentPer: string;
  image?: string;
  imagePublicId?: string;
  associatedProduct?: IProduct;
  otherAssociatedProducts: IProduct[];
  isFreeDeliveryOnAssociatedProduct: boolean;
  isActive: boolean;
  type: BannerType;
  banners: Banner[];
}

export interface FilterAdsParams {
  position?: BannerPosition;
}
