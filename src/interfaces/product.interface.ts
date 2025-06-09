import { IOffer } from "./offer.interface";

export interface IProduct {
  _id: string;
  name: string;
  description: string;
  category: ICategory;
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
}

export interface ProductFilterInput {
  page?: number;
  limit?: number;
  search?: string;
  category?: string[];
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
