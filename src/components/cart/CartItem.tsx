import { ICartItem } from "@/interfaces/cart.interface";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/utils/helpers";
import { Minus, Plus, Trash2Icon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

interface CartItemProps {
  item: ICartItem;
  onRemove: () => void;
  onQuantityChange: (quantity: number) => void;
}

const CartItem = ({ item, onRemove, onQuantityChange }: CartItemProps) => {
  // Type-safe way to determine if this is a variant item
  const isVariantItem = "variant" in item && item.variant !== undefined;

  // Price and stock logic
  const basePrice = isVariantItem ? item.variant.price : item.product.price;
  const maxQuantity = isVariantItem
    ? item.variant.quantityInStock
    : item.product.quantityInStock;

  // Image handling - prefer variant image if available
  const primaryImage =
    isVariantItem && item.variant.images?.length > 0
      ? item.variant.images[0]
      : item.product.images[0];

  const hasDiscount =
    item.product.currentOffer?.isActive &&
    item.product.currentOffer?.percentageOff;

  const calculateDiscountPrice = (price: number, percentageOff: number) => {
    return price - (price * percentageOff) / 100;
  };

  const discountedPrice = hasDiscount
    ? calculateDiscountPrice(basePrice, item.product.currentOffer.percentageOff)
    : basePrice;

  return (
    <div className="flex items-start gap-4">
      <div className="w-24 h-24 aspect-square bg-primary/10 py-2 rounded-sm overflow-hidden shrink-0">
        <Image
          src={primaryImage}
          alt={item.product.name}
          width={300}
          height={300}
          className="w-full h-full object-contain"
        />
      </div>

      <div className="flex-1">
        <div className="flex justify-between">
          <div>
            <Link href={`/products/${item.product.slug}`} className="">
              {item.product.name}
            </Link>
            {item.variant && (
              <p className="text-sm text-muted-foreground">
                Variant: {item.variant.name}
              </p>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 cursor-pointer"
            onClick={onRemove}
          >
            <Trash2Icon className="h-4 w-4" />
          </Button>
        </div>

        {/* active offer */}
        <div></div>

        <div className="mt-4 flex items-center justify-between">
          <div className="font-medium">
            {/* offer badge */}
            {hasDiscount && (
              <Badge
                className={cn(
                  "bg-gradient-to-tr from-red-500 to-red-400 text-white text-xs font-semibold h-8 w-8 rounded-full mr-2"
                )}
              >
                -40{item.product?.currentOffer?.percentageOff}%
              </Badge>
            )}
            {hasDiscount && (
              <span className="line-through text-gray-500 text-sm mr-1">
                {formatCurrency(basePrice)}
              </span>
            )}
            <span className="text-primary font-bold">
              {formatCurrency(discountedPrice)}
            </span>
            {/* {formatCurrency(item.product.price * item.quantity)} */}
          </div>

          <div className="flex items-center border rounded-sm">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-none cursor-pointer"
              onClick={() => onQuantityChange(Math.max(1, item.qty - 1))}
              disabled={item.qty <= 1}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <div className="w-10 h-full text-center">{item.qty}</div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-none cursor-pointer"
              onClick={() => onQuantityChange(item.qty + 1)}
              disabled={item.qty >= maxQuantity}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
