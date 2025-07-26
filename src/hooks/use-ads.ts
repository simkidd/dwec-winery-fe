"use client";
import { FilterAdsParams, IAds } from "@/interfaces/ads.interface";
import { getAdminAds, getAds } from "@/lib/api/products";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

const useAds = (isAdmin: boolean = false, params?: FilterAdsParams) => {
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: isAdmin ? ["allAdminAds"] : ["allUserAds", params],
    queryFn: async () => (isAdmin ? getAdminAds() : getAds(params)),
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
