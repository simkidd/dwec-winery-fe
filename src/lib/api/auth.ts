/* eslint-disable @typescript-eslint/no-explicit-any */
import { LoginDTO, SignUpDTO } from "@/interfaces/auth.interface";
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

export const loginUser = async (data: LoginDTO) => {
  try {
    const response = await instance.post(`/auth/login`, data);

    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

export const registerUser = async (data: SignUpDTO) => {
  try {
    const response = await instance.post(`/auth/signup`, data);

    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

export const userForgotPassword = async (data: { email: string }) => {
  try {
    const response = await instance.post(`/auth/forgot-password`, data);

    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

export const userResetPassword = async (payload: {
  resetCode: string;
  password: string;
}) => {
  try {
    const response = await instance.put(`/auth/reset-password`, payload);

    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

export const userVerifyResetCode = async (code: string) => {
  try {
    const response = await instance.get(`/auth/verify-reset-code/${code}`);

    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

export const userVerify = async (data: { code: string }) => {
  try {
    const response = await instance.post(`/auth/verify-user`, data);

    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

export const userRequestVerification = async (email: string) => {
  try {
    const response = await instance.post(`/auth/request-verification`, {
      email,
    });

    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};
