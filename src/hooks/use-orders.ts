import {
  IOrderDetails,
  orderFilterInput,
  PaginatedOrderResponse,
} from "@/interfaces/order.interface";
import { getOrderById, getOrders } from "@/lib/api/order";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

const useOrders = (params?: orderFilterInput) => {
  // Query: Get all orders
  const {
    data,
    isPending: isFetchingOrders,
    isError,
    error: ordersError,
    refetch: refetchOrders,
  } = useQuery<PaginatedOrderResponse<IOrderDetails>>({
    queryKey: ["orders", params],
    queryFn: async () => getOrders(params),
    // select:(data)=> data.
  });

  const { orders, totalOrders, totalPages } = useMemo(() => {
    if (!data || isFetchingOrders || isError)
      return { orders: [], totalOrders: 0, totalPages: 0 };

    return {
      orders: data.orders || [],
      totalOrders: data.total || 0,
      totalPages: data.totalPages || 0,
    };
  }, [data, isFetchingOrders, isError]);

  // Query: Get single order
  const useGetOrder = (orderId: string) => {
    return useQuery({
      queryKey: ["order", orderId],
      queryFn: () => getOrderById(orderId),
      enabled: !!orderId, // Only fetch if orderId exists
      select: (data) => data.order as IOrderDetails,
    });
  };

  return {
    // Queries
    orders,
    totalOrders,
    totalPages,
    isFetchingOrders,
    ordersError,
    useGetOrder,
    refetchOrders,
  };
};

export default useOrders;
