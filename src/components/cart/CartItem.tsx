"use client";
import { Button } from "../ui/button";
import { XIcon } from "lucide-react";
import Image from "next/image";
import { Input } from "../ui/input";

interface CartItemProps {
  item: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  };
  onRemove: () => void;
  onQuantityChange: (quantity: number) => void;
}

const CartItem = ({ item, onRemove, onQuantityChange }: CartItemProps) => {
  return (
    <div className="flex items-start gap-4 border-b pb-4">
      <div className="relative h-16 w-16 rounded-md overflow-hidden">
        <Image src={item.image} alt={item.name} fill className="object-cover" />
      </div>
      <div className="flex-1">
        <div className="flex justify-between">
          <h3 className="font-medium">{item.name}</h3>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={onRemove}
          >
            <XIcon className="h-3 w-3" />
            <span className="sr-only">Remove</span>
          </Button>
        </div>
        <p className="text-muted-foreground">${item.price.toFixed(2)}</p>
        <div className="flex items-center gap-2 mt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onQuantityChange(Math.max(1, item.quantity - 1))}
          >
            -
          </Button>
          <Input
            type="number"
            value={item.quantity}
            onChange={(e) => onQuantityChange(Number(e.target.value))}
            className="w-12 text-center"
            min="1"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => onQuantityChange(item.quantity + 1)}
          >
            +
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
