import { IProduct } from "./product.interface";

export interface ICartItemBase {
  id: string; // Unique cart item ID (productId or productId-variantId)
  qty: number;
}

export interface ICartItemProduct extends ICartItemBase {
  product: IProduct;
  variant?: never; // Explicitly no variant
}

export interface ICartItemVariant extends ICartItemBase {
  product: IProduct; // Always contains the base product
  variant: {
    id: string; // Variant ID
    name: string;
    price: number;
    quantityInStock: number;
    images: string[];
    qty: number; // Mirrors root qty or custom quantity
  };
}

// Discriminated union type
export type ICartItem = ICartItemProduct | ICartItemVariant;
