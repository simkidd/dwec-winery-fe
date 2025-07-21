import { IProduct } from "./product.interface";

export interface IUser {
  _id: string;
  firstname: string;
  lastname: string;
  slug: string;
  phoneNumber: string;
  email: string;
  address: string;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  isEmailVerified: boolean;
  favouriteProducts: IProduct[];
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  isBanned: boolean;
  jwtTokenVersion: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
