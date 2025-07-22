"use client";
import { IAds } from "@/interfaces/ads.interface";
import { getAdminAds, getAds } from "@/lib/api/products";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

const useAds = (isAdmin: boolean = false) => {
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: isAdmin ? ["allAdminAds"] : ["allAds"],
    queryFn: async () => (isAdmin ? getAdminAds() : getAds()),
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
