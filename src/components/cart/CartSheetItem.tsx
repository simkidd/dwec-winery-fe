"use client";
import { ICartItem } from "@/interfaces/cart.interface";
import { formatCurrency } from "@/utils/helpers";
import { Minus, Plus, XIcon } from "lucide-react";
import Image from "next/image";
import { Button } from "../ui/button";

interface CartItemProps {
  item: ICartItem;
  onRemove: () => void;
  onQuantityChange: (quantity: number) => void;
}

const CartSheetItem = ({ item, onRemove, onQuantityChange }: CartItemProps) => {
  return (
    <div className="flex items-start gap-4 p-2 py-3">
      <div className="relative h-14 w-16 rounded-md overflow-hidden shrink-0">
        <Image
          src={item.product.images[0]}
          alt={item.product.name}
          fill
          className="w-full h-full object-contain"
        />
      </div>
      <div className="flex-1">
        <div className="flex justify-between">
          <h3 className="text-sm">{item.product.name}</h3>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 cursor-pointer rounded-full mr-1"
            onClick={onRemove}
          >
            <XIcon className="h-3 w-3" />
            <span className="sr-only">Remove</span>
          </Button>
        </div>
        <p className="text-muted-foreground pb-2">
          {formatCurrency(item.product?.price)}
        </p>

        <div className="flex items-center border rounded-sm w-fit text-sm">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 rounded-none"
            onClick={() => onQuantityChange(Math.max(1, item.qty - 1))}
            disabled={item.qty <= 1}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-10 text-center">{item.qty}</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 rounded-none"
            onClick={() => onQuantityChange(item.qty + 1)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CartSheetItem;
