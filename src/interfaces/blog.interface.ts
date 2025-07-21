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
  category?: BlogCategory;
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

export enum BlogCategory {
  WineTasting = "wine-tasting",
  Vineyard = "vineyard",
  Winemaking = "winemaking",
  FoodPairing = "food-pairing",
  Events = "events",
  Awards = "awards",
  Sustainability = "sustainability",
  VintageReports = "vintage-reports",
  WineEducation = "wine-education",
  GrapeVarieties = "grape-varieties",
  CellarDoor = "cellar-door",
  WineClub = "wine-club",
  LimitedEditions = "limited-editions",
  OrganicWinemaking = "organic-winemaking",
  WineTourism = "wine-tourism",
  WineHistory = "wine-history",
  BarrelAging = "barrel-aging",
  WineTech = "wine-tech",
  StaffPicks = "staff-picks",
  SeasonalReleases = "seasonal-releases",
}
