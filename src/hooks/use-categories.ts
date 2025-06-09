"use client";
import { ICategory } from "@/interfaces/product.interface";
import { getAllCategories } from "@/lib/api/products";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

const useCategories = () => {
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["allCategories"],
    queryFn: async () => getAllCategories(),
  });

  const { categories } = useMemo(() => {
    if (!data || isPending || isError) return { categories: [] };

    return {
      categories: (data.categories as ICategory[]) || [],
    };
  }, [data, isPending, isError]);

  return {
    categories,
    isPending,
    isError,
    refetch,
  };
};

export default useCategories;
