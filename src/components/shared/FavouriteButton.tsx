"use client";
import { cn } from "@/lib/utils";
import { Heart } from "lucide-react";
import { Button } from "../ui/button";
import { useFavourites } from "@/hooks/use-favourites";
import { IProduct } from "@/interfaces/product.interface";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

interface FavouriteButtonProps {
  product: IProduct;
  className?: string;
}

const FavouriteButton = ({ product, className }: FavouriteButtonProps) => {
  const { toggleFavorite, fetchedFavourites } = useFavourites();

  const isFavorite = (productId: string) => {
    return fetchedFavourites?.some((fav) => fav._id === productId);
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            " rounded-full bg-background/80 backdrop-blur-sm transition-all duration-500 ease-in-out cursor-pointer z-[2]",
            className
          )}
          onClick={(e) => {
            e.preventDefault();
            toggleFavorite(product._id);
          }}
        >
          <Heart
            className={`h-4 w-4 ${
              isFavorite(product._id) ? "fill-primary text-primary" : ""
            }`}
          />
        </Button>
      </TooltipTrigger>
      <TooltipContent>Save for later</TooltipContent>
    </Tooltip>
  );
};

export default FavouriteButton;
