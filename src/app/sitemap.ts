import { IBlogPost } from "@/interfaces/blog.interface";
import {
  IProduct,
  PaginatedResponse as PaginatedProductResponse,
} from "@/interfaces/product.interface";
import { PaginatedResponse as PaginatedBlogResponse } from "@/interfaces/user.interface";
import { getAllPosts } from "@/lib/api/blog";
import { getAllProducts } from "@/lib/api/products";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_WEBSITE_URL;

  const blogRes: PaginatedBlogResponse<IBlogPost> = await getAllPosts({
    page: 1,
    limit: 1000,
    isPublished: true,
  });

  const productsRes: PaginatedProductResponse<IProduct> = await getAllProducts({
    page: 1,
    limit: 1000,
  });

  const posts = blogRes.data || [];
  const products = productsRes.products || [];

  const postUrls: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/blog/${post?.slug}`,
    lastModified: new Date(post?.updatedAt),
  }));

  const productUrls: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${baseUrl}/products/${product.slug}`,
    lastModified: new Date(product.updatedAt),
    changeFrequency: "daily" as const,
    priority: 0.5,
  }));

  return [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 1,
    },
    {
      url: `${baseUrl}/about-us`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact-us`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
    ...postUrls,
    ...productUrls,
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
  ];
}
