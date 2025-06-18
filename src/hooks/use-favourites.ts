"use client";
import { IProduct } from "@/interfaces/product.interface";
import { addToFavourites, getFavourites } from "@/lib/api/products";
import { showAuthDialog } from "@/store/features/products/product.slice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export const useFavourites = () => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  // Fetch user's favorites on mount if authenticated
  const {
    data: fetchedFavourites,
    isPending,
    isError,
    refetch: refetchFavourites,
  } = useQuery({
    queryKey: ["favourites"],
    queryFn: getFavourites,
    enabled: !!user,
    select: (res) => res.data as IProduct[],
  });

  const favMutation = useMutation({
    mutationFn: addToFavourites,
    onSuccess: (data) => {
      toast.success(data?.message);
      refetchFavourites();
    },
    onError: (error: { type?: string; message?: string }) => {
      if (error.type === "AUTH_ERROR") {
        dispatch(showAuthDialog("Please login to add favorites"));
      } else {
        toast.error(error?.message);
      }
    },
  });

  const toggleFavorite = (productId: string) => {
    if (!isAuthenticated) {
      dispatch(showAuthDialog("Please login to add favorites"));
      return;
    }
    favMutation.mutate(productId);
  };

  return {
    fetchedFavourites, // Return the query data for the favorites page
    toggleFavorite,
    isLoading: favMutation.isPending,
    isFetching: isPending,
    isError,
    refetchFavourites,
  };
};
