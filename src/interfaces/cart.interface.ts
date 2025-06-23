import { IProduct, ProductVariant } from "./product.interface";

export interface ICartItem {
  id: string;
  product: IProduct;
  qty: number;
  selectedVariant?: ProductVariant;
}
