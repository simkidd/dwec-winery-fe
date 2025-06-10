"use client"
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IProduct } from "@/interfaces/product.interface";
import { formatCurrency } from "@/utils/helpers";
import { Heart, Minus, Plus, Share2, Shield, Truck } from "lucide-react";
import ProductImages from "./ProductImages";
import { useState } from "react";

const ProductDetails = ({ product }: { product: IProduct }) => {
  const [quantity, setQuantity] = useState(1);

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

  const handleIncrement = () => {
    setQuantity((prev) => Math.min(prev + 1, 10)); // Limit to max 10
  };

  const handleDecrement = () => {
    setQuantity((prev) => Math.max(prev - 1, 1)); // Minimum 1
  };

  return (
    <section>
      <div className="container mx-auto px-4 py-8">
        <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-2 relative">
          {/* Image Gallery Section */}
          {/* <div className="lg:sticky lg:top-20 lg:self-start"> */}
          <div className="">
            <ProductImages images={product.images} altText={product.name} />
          </div>

          {/* Product Info Section */}
          <div className="">
            {/* Title and Rating */}
            <div className="mb-4">
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                {product.name}
              </h1>
            </div>

            {/* Price and Availability */}
            <div className="mb-6">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold">
                  {formatCurrency(discountedPrice)}
                </span>
                {hasDiscount && (
                  <span className="text-sm text-muted-foreground line-through">
                    {formatCurrency(product?.price)}
                  </span>
                )}
                {hasDiscount && (
                  <Badge variant="destructive" className="ml-2">
                    -{product?.currentOffer?.percentageOff}%
                  </Badge>
                )}
              </div>
              <div className="mt-2 flex items-center gap-2 text-sm text-green-600">
                <Truck className="h-4 w-4" />
                <span>In Stock (Ready to ship)</span>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="mb-2 text-sm font-medium">Description</h3>
              <p className="text-muted-foreground">{product.description}</p>
            </div>

            {/* Quantity Selector */}
            <div className="mb-6 flex items-center gap-4">
              <h3 className="text-sm font-medium">Quantity:</h3>
              <div className="flex items-center border rounded-sm">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-none"
                  onClick={handleDecrement}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-10 text-center">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-none"
                  onClick={handleIncrement}
                  disabled={quantity >= 10}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <Button
                size="lg"
                className="flex-1 min-w-[200px] rounded-sm cursor-pointer"
              >
                Add to Cart 
              </Button>

              <Button variant="ghost" size="icon" className="rounded-full">
                <Heart className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4 border-t pt-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                <span>1-Year Warranty</span>
              </div>
              {product?.isFreeDelivery && (
                <div className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  <span>Free Shipping</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetails;
