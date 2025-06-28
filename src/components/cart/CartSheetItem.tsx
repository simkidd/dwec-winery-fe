"use client";
import { ICartItem } from "@/interfaces/cart.interface";
import { formatCurrency } from "@/utils/helpers";
import { Minus, Plus, Trash2Icon } from "lucide-react";
import Image from "next/image";
import { Button } from "../ui/button";

interface CartItemProps {
  item: ICartItem;
  onRemove: () => void;
  onQuantityChange: (quantity: number) => void;
}

const CartSheetItem = ({ item, onRemove, onQuantityChange }: CartItemProps) => {
  // Type-safe way to determine if this is a variant item
  const isVariantItem = "variant" in item && item.variant !== undefined;

  // Price and stock logic
  const price = isVariantItem ? item.variant.price : item.product.price;
  const maxQuantity = isVariantItem
    ? item.variant.quantityInStock
    : item.product.quantityInStock;

  // Image handling - prefer variant image if available
  const primaryImage =
    isVariantItem && item.variant.images?.length > 0
      ? item.variant.images[0]
      : item.product.images[0];

  return (
    <div className="flex items-start gap-4 p-2 py-3">
      <div className="relative h-14 w-16 rounded-md overflow-hidden shrink-0">
        <Image
          src={primaryImage}
          alt={item.product.name}
          fill
          className="w-full h-full object-contain"
        />
      </div>
      <div className="flex-1">
        <div className="flex justify-between gap-4">
          <div>
            <h3 className="text-sm">{item.product.name}</h3>
            {item.variant && (
              <p className="text-sm text-muted-foreground">
                {item.variant.name}
              </p>
            )}
          </div>

          <p className="text-muted-foreground pb-2">
            {formatCurrency(price * item.qty)}
          </p>
        </div>
        <p className="text-muted-foreground pb-2">
          {formatCurrency(price)}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center border rounded-sm w-fit text-sm">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 rounded-none cursor-pointer"
              onClick={() => onQuantityChange(Math.max(1, item.qty - 1))}
              disabled={item.qty <= 1}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-10 text-center">{item.qty}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 rounded-none cursor-pointer"
              onClick={() => onQuantityChange(item.qty + 1)}
              disabled={item.qty >= maxQuantity}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 cursor-pointer rounded-full mr-1"
            onClick={onRemove}
          >
            <Trash2Icon className="h-3 w-3" />
            <span className="sr-only">Remove</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CartSheetItem;
