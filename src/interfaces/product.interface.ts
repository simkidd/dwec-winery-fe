import { IOffer } from "./offer.interface";

export interface IProduct {
  _id: string;
  name: string;
  description: string;
  category: ICategory;
  subCategory: ISubCategory;
  images: string[];
  price: number;
  slug: string;
  quantityInStock: number;
  isDeleted: boolean;
  isFreeDelivery: boolean;
  isPublished: boolean;
  currentOffer: IOffer;
  createdAt: string;
  updatedAt: string;
  variants: ProductVariant[];
}

export interface ProductVariant {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  quantityInStock: number;
  images: string[];
}

export interface ICategory {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  subCategories: ISubCategory[];
}

export interface ISubCategory {
  _id: string;
  name: string;
  slug: string;
  isDeleted: boolean;
  category: ICategory;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFilterInput {
  page?: number;
  limit?: number;
  search?: string;
  category?: string[];
  subCategory?: string[];
  minPrice?: string;
  maxPrice?: string;
  sort?: "desc" | "asc" | "lowestPrice" | "highestPrice" | "a-z" | "z-a";
}

export interface PaginatedResponse<T> {
  products: T[];
  page: number;
  limit: number;
  totalDocs: number;
  totalPages: number;
}
