"use client";
import {
  IProduct,
  PaginatedResponse,
  ProductFilterInput,
} from "@/interfaces/product.interface";
import { getAllProducts } from "@/lib/api/products";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

const useProducts = (params?: ProductFilterInput) => {
  // Regular query for paginated products
  const { data, isPending, isError, refetch } = useQuery<
    PaginatedResponse<IProduct>
  >({
    queryKey: ["allProducts", params],
    queryFn: async () => getAllProducts(params),
  });

  // Infinite query version
  const infiniteQuery = useInfiniteQuery<PaginatedResponse<IProduct>, Error>({
    queryKey: ["products-infinite", params],
    queryFn: ({ pageParam = 1 }) =>
      getAllProducts({
        ...params,
        page: pageParam as number,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.totalPages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
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
    // Regular query data
    products,
    totalProducts,
    totalPages,
    isPending,
    isError,
    refetch,

    // Infinite query methods
    infiniteQuery: {
      ...infiniteQuery,
      products:
        infiniteQuery.data?.pages.flatMap((page) => page.products) || [],
      isLoadingInfinite: infiniteQuery.isPending,
      isFetchingNextPage: infiniteQuery.isFetchingNextPage,
    },

    // Helper methods
    hasMore: infiniteQuery.hasNextPage,
    loadMore: infiniteQuery.fetchNextPage,
  };
};

export default useProducts;
