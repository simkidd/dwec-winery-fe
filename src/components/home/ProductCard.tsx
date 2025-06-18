"use client";
import { useFavourites } from "@/hooks/use-favourites";
import { IProduct } from "@/interfaces/product.interface";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/utils/helpers";
import { Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import FavouriteButton from "../shared/FavouriteButton";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";
import { AuthDialog } from "../shared/AuthDialog";

const ProductCard = ({ product }: { product: IProduct }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { toggleFavorite, fetchedFavourites } = useFavourites();

  const isFavorite = (productId: string) => {
    return fetchedFavourites?.some((fav) => fav._id === productId);
  };

  const hasDiscount =
    product.currentOffer?.isActive && product.currentOffer?.percentageOff;

  const calculateDiscountPrice = (price: number, percentageOff: number) => {
    return price - (price * percentageOff) / 100;
  };

  const discountedPrice = hasDiscount
    ? calculateDiscountPrice(
        product?.price,
        product?.currentOffer?.percentageOff
      )
    : product?.price;

  return (
    <>
      <Card className="shadow-none rounded-sm p-0 border-0 bg-transparent group">
        <CardContent className="p-0 relative">
          {/* Image container with hover effects */}
          <div
            className="aspect-square bg-muted/50 dark:bg-muted/30 rounded-sm mb-2 flex items-center justify-center relative overflow-hidden py-2"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Product image with hover transition */}
            <div className="relative w-full h-full">
              <Image
                src={product.images[0]}
                alt={product.name}
                fill
                className={`w-full h-full object-contain transition-opacity duration-700 ease-in-out ${
                  isHovered && product.images[1] ? "opacity-0" : "opacity-100"
                }`}
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              />
              {product.images[1] && (
                <Image
                  src={product.images[1]}
                  alt={`${product.name} - alternate view`}
                  fill
                  className={`w-full h-full object-contain transition-opacity duration-700 ease-in-out ${
                    isHovered ? "opacity-100" : "opacity-0"
                  }`}
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                />
              )}
            </div>

            {/* offer badge */}
            {hasDiscount && (
              <Badge
                className={cn(
                  "absolute top-2 right-2 bg-gradient-to-tr from-red-500 to-red-400 text-white text-xs font-semibold h-8 w-8 rounded-full z-[2] transition-all duration-500 ease-in-out",
                  isHovered
                    ? "opacity-0 translate-x-2"
                    : "opacity-100 translate-x-0"
                )}
              >
                -{product?.currentOffer?.percentageOff}%
              </Badge>
            )}

            {/* Favorite button */}
            <FavouriteButton
              isHovered={isHovered}
              isFavorite={isFavorite(product._id) as boolean}
              onClick={(e) => {
                e.preventDefault();
                toggleFavorite(product._id);
              }}
            />
          </div>

          {/* Product info */}
          <div className="space-y-1 px-1">
            <Link
              href={`/products/${product.slug}`}
              className="hover:text-primary"
            >
              <h3 className="line-clamp-1 truncate text-center mb-1 text-sm">
                {product.name}
              </h3>
            </Link>
            <div className="flex justify-center items-center gap-1">
              {hasDiscount && (
                <span className="line-through text-gray-500 text-sm">
                  {formatCurrency(product?.price)}
                </span>
              )}
              <span className="text-primary font-bold">
                {formatCurrency(discountedPrice)}
              </span>
            </div>
          </div>

          {product?.isFreeDelivery && (
            <div className="flex items-center justify-center gap-1 text-xs text-green-600">
              <Truck className="h-3 w-3" />
              <span>Free Shipping</span>
            </div>
          )}
        </CardContent>
      </Card>

      <AuthDialog />
    </>
  );
};

export default ProductCard;
