"use client";
import { IAds } from "@/interfaces/ads.interface";
import { getAds } from "@/lib/api/products";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

const useAds = () => {
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["allAds"],
    queryFn: async () => getAds(),
  });

  const { ads } = useMemo(() => {
    if (!data || isPending || isError) return { ads: [] };

    return {
      ads: (data.data as IAds[]) || [],
    };
  }, [data, isPending, isError]);

  return {
    ads,
    isPending,
    isError,
    refetch,
  };
};

export default useAds;
