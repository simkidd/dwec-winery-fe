/* eslint-disable @typescript-eslint/no-explicit-any */
import { CreateOrderDTO, PaymentDTO } from "@/interfaces/order.interface";
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

const ROUTE_PATH = "users";

export const initPayment = async (data: PaymentDTO) => {
  try {
    const response = await instance.post(
      `/${ROUTE_PATH}/orders/initialize-paystack-payment`,
      data
    );

    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

export const createOrder = async (data: CreateOrderDTO) => {
  try {
    const response = await instance.post(
      `/${ROUTE_PATH}/orders/create-order`,
      data
    );

    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};
export const getOrders = async () => {
  try {
    const response = await instance.get(`/${ROUTE_PATH}/orders/user-orders`);

    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

export const getOrderById = async (id: string) => {
  try {
    const response = await instance.get(`/${ROUTE_PATH}/orders/${id}`);

    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};

export const verifyPayment = async (params: { ref: string }) => {
  try {
    const response = await instance.get(
      `/${ROUTE_PATH}/orders/verify-paystack-payment`,
      { params }
    );

    return handleResponse(response);
  } catch (error) {
    handleError(error);
  }
};
