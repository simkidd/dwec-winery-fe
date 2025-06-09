import { IProduct } from "./product.interface";

export interface IUser {
  _id: string;
  firstName: string;
  lastName: string;
  slug: string;
  phoneNumber: string;
  email: string;
  address: string;
  isAdmin: boolean;
  isEmailVerified: boolean;
  favouriteProducts: IProduct[];
  createdAt: string;
  updatedAt: string;
}
