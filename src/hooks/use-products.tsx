"use client";
import {
  IProduct,
  PaginatedResponse,
  ProductFilterInput,
} from "@/interfaces/product.interface";
import { getAllProducts } from "@/lib/api/products";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

const useProducts = (params?: ProductFilterInput) => {
  const { data, isPending, isError, refetch } = useQuery<
    PaginatedResponse<IProduct>
  >({
    queryKey: ["allProducts", params],
    queryFn: async () => getAllProducts(params),
  });

  const { products, totalProducts, totalPages } = useMemo(() => {
    if (!data || isPending || isError)
      return { products: [], totalProducts: 0, totalPages: 0 };

    return {
      products: data.products || [],
      totalProducts: data.totalDocs || 0,
      totalPages: data.totalPages || 0,
    };
  }, [data, isPending, isError]);

  return {
    products,
    totalProducts,
    totalPages,
    isPending,
    isError,
    refetch,
  };
};

export default useProducts;
