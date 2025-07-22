"use client";
import { IProduct } from "@/interfaces/product.interface";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/utils/helpers";
import { Loader2, Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AuthDialog } from "../shared/AuthDialog";
import FavouriteButton from "../shared/FavouriteButton";
import { Badge } from "../ui/badge";
import { Card, CardContent } from "../ui/card";

const ProductCard = ({ product }: { product: IProduct }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [hasImageError, setHasImageError] = useState(false);

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

  const isOutOfStock = product.quantityInStock <= 0;

  useEffect(() => {
    setIsImageLoading(true);
    setHasImageError(false);
  }, [product]);

  return (
    <>
      <Card className="shadow-none rounded-sm p-0 border-0 bg-transparent group">
        <CardContent className="p-0 relative">
          <div className="relative">
            {/* Image container */}
            <div
              className="aspect-square bg-primary/10  rounded-sm mb-2 flex items-center justify-center relative overflow-hidden py-2"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {/* Loading state */}
              {isImageLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-full h-full">
                    <Loader2 className="absolute inset-0 m-auto h-6 w-6 animate-spin text-primary" />
                  </div>
                </div>
              )}

              {/* Error state */}
              {hasImageError && (
                <div className="absolute inset-0 flex items-center justify-center bg-muted">
                  <span className="text-xs text-muted-foreground">
                    Image not available
                  </span>
                </div>
              )}

              {/* Image content */}
              {!hasImageError && (
                <div className="relative w-full h-full">
                  <Link href={`/products/${product.slug}`}>
                    <Image
                      src={isHovered ? product.images[0] : product.images[1]}
                      alt={product.name}
                      fill
                      className={`w-full h-full object-contain transition duration-300 ease-in-out ${isImageLoading ? "opacity-0" : "opacity-100"}`}
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                      onLoadingComplete={() => setIsImageLoading(false)}
                      onError={() => {
                        setIsImageLoading(false);
                        setHasImageError(true);
                      }}
                      priority={false} // Let Next.js optimize loading
                    />
                  </Link>
                </div>
              )}

              {/* Discount badge */}
              {hasDiscount && (
                <Badge
                  className={cn(
                    "absolute top-2 left-2 lg:right-2 bg-gradient-to-tr from-red-500 to-red-400 text-white text-xs font-semibold h-8 w-8 rounded-full z-[2] flex items-center justify-center",
                    isImageLoading && "opacity-0"
                  )}
                >
                  -{product?.currentOffer?.percentageOff}%
                </Badge>
              )}

              {/* Favorite button */}
              <FavouriteButton
                product={product}
                className={cn(
                  "absolute top-2 right-2",
                  isHovered
                    ? "opacity-100 translate-x-0"
                    : "lg:opacity-0 lg:translate-x-2",
                  isImageLoading && "opacity-0"
                )}
              />

              {/* Out of stock badge */}
              {isOutOfStock && (
                <div className="absolute w-full h-full bg-white/50 dark:bg-black/50 flex items-center justify-center pointer-events-none">
                  <span className="bg-red-500 text-white px-2 py-1 rounded-md text-xs font-bold">
                    Out of stock
                  </span>
                </div>
              )}
            </div>

            {/* Free delivery indicator */}
            {product?.isFreeDelivery && (
              <span className="free-delivery-tag inline-flex items-center text-xs text-muted-foreground mt-1">
                <Truck className="h-3 w-3 mr-1" />
                Free Shipping
              </span>
            )}
          </div>

          {/* Product info */}
          <div className="space-y-1 px-1">
            <Link
              href={`/products/${product.slug}`}
              className="hover:text-primary"
            >
              <h3 className="line-clamp-1 truncate mb-1 text-sm font-medium">
                {product.name}
              </h3>
            </Link>
            <div className="flex items-center gap-1">
              <span className="font-bold text-foreground">
                {formatCurrency(discountedPrice)}
              </span>
              {hasDiscount && (
                <span className="line-through text-muted-foreground text-sm">
                  {formatCurrency(product?.price)}
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <AuthDialog />
    </>
  );
};

export default ProductCard;
