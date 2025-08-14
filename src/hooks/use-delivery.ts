"use client";

import {
  IDeliveryArea
} from "@/interfaces/delivery.interface";
import { getDeliveryAreaById, getDeliveryAreas } from "@/lib/api/delivery";
import { useQuery } from "@tanstack/react-query";

export const useDeliveryArea = (id?: string) => {
  const {
    data: deliveryAreas,
    isLoading: isLoadingAreas,
    error: areasError,
  } = useQuery({
    queryKey: ["delivery-areas"],
    queryFn: getDeliveryAreas,
    select: (res) => res.data as IDeliveryArea[],
  });

  const {
    data: deliveryArea,
    isLoading: isLoadingArea,
    error: areaError,
  } = useQuery({
    queryKey: ["delivery-area", id],
    queryFn: () => getDeliveryAreaById(id!),
    enabled: !!id,
    select: (res) => res.data as IDeliveryArea,
  });

  return {
    deliveryAreas,
    deliveryArea,
    isLoading: isLoadingAreas || isLoadingArea,
    error: areasError || areaError,
  };
};
