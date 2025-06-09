/* eslint-disable @typescript-eslint/no-explicit-any */
import { ProductFilterInput } from "@/interfaces/product.interface";
import instance from "@/services/axios";

// Handle responses and errors
const handleResponse = (response: any) => {
  if (response.status >= 200 && response.status < 300) {
    return response.data;
  }
  throw new Error(response.data.message || "Request failed");
};

const handleError = (error: any) => {
  if (error.response) {
    throw new Error(error.response.data.error || "Request failed");
  } else if (error.request) {
    throw new Error("No response received from the server");
  } else {
    throw new Error(error.message || "Request failed");
  }
};

export const getAllProducts = async (params?: ProductFilterInput) => {
  try {
    const response = await instance.get(`/products`, { params });

    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

export const getProductBySlug = async (slug: string) => {
  try {
    const response = await instance.get(`/products/slug/${slug}`);

    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

export const getAllCategories = async () => {
  try {
    const response = await instance.get(`/categories`);

    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

export const getAds = async () => {
  try {
    const response = await instance.get(`/users/ads/get-ads`);

    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};
