import { IProduct } from "./product.interface";

export interface ICartItem {
  product: IProduct;
  qty: number;
}
