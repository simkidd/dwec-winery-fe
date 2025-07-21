/* eslint-disable @typescript-eslint/no-explicit-any */

import { PostFilterInput } from "@/interfaces/blog.interface";
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

export const getAllPosts = async (params?: PostFilterInput) => {
  try {
    const response = await instance.get(`/blogs`, { params });

    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

export const getPostById = async (id: string) => {
  try {
    const response = await instance.get(`/blogs/${id}`);
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

export const getPostBySlug = async (slug: string) => {
  try {
    const response = await instance.get(`/blogs/slug/${slug}`);
    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

export const createPost = async (data: FormData) => {
  try {
    const response = await instance.post(`/blogs/create`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

export const updatePost = async (data: FormData, id: string) => {
  try {
    const response = await instance.put(`/blogs/${id}/update`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

export const deletePost = async (id: string) => {
  try {
    const response = await instance.delete(`/blogs/${id}/delete`);

    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};
