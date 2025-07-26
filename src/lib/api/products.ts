/* eslint-disable @typescript-eslint/no-explicit-any */
import { FilterAdsParams } from "@/interfaces/ads.interface";
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
    throw new Error(error.response.data.message || "Request failed");
  } else if (error.request) {
    throw new Error("No response received from the server");
  } else {
    throw new Error(error.message || "Request failed");
  }
};

const handleFavError = (error: any) => {
  if (error.response) {
    console.log("from erro>>>", error);
    const { status, data } = error.response;

    if (status === 401) {
      throw {
        type: "AUTH_ERROR",
        message: data?.message || "Please login to add favorites",
        status,
      };
    } else if (status === 404) {
      throw {
        type: "NOT_FOUND",
        message: data?.message || "Product not found",
        status,
      };
    } else {
      throw {
        type: "API_ERROR",
        message: data?.message || "Failed to update favorites",
        status,
      };
    }
  } else if (error.request) {
    // Request was made but no response received
    throw {
      type: "NETWORK_ERROR",
      message: "No response received from server",
    };
  } else {
    // Other errors
    throw {
      type: "CLIENT_ERROR",
      message: error.message || "Failed to make request",
    };
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

export const getCategoryBySlug = async (slug: string) => {
  try {
    const response = await instance.get(`/categories/slug/${slug}`);

    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

export const addToFavourites = async (productId: string) => {
  try {
    const response = await instance.patch(`/users/products/update-fav`, {
      productId,
    });

    return handleResponse(response);
  } catch (error) {
    handleFavError(error);
  }
};

export const getFavourites = async () => {
  try {
    const response = await instance.get(`/users/products/get-fav-products`);

    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

export const getAds = async (params?: FilterAdsParams) => {
  try {
    const response = await instance.get(`/users/ads/get-user-ads`, { params });

    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

export const getAdminAds = async () => {
  try {
    const response = await instance.get(`/admin/all-ads`);

    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

export const getAdminAdById = async (id: string) => {
  try {
    const response = await instance.get(`/admin/get-ad/${id}`);

    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

/**
 * For admin usage
 */
export const createAd = async (data: FormData) => {
  try {
    const response = await instance.post(`/admin/new-create-ad`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

export const updateAd = async (id: string, data: FormData) => {
  try {
    const response = await instance.patch(`/admin/new-update-ad/${id}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

export const deleteAd = async (id: string) => {
  try {
    const response = await instance.delete(`/admin/delete-ad/${id}`);

    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};
