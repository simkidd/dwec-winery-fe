import { IUser } from "./user.interface";

export interface IImage {
  publicId: string; // Cloudinary public_id
  imageUrl: string; // Cloudinary secure_url
}

export interface IBlogPost {
  _id: string;
  title: string;
  content: string;
  excerpt?: string;
  author: IUser;
  tags?: string[];
  isPublished?: boolean;
  slug: string;
  image?: IImage;
  featured?: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  readTime?: number;
  category?: string;
}

export interface PostFilterInput {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  isPublished?: boolean;
  featured?: boolean;
}
