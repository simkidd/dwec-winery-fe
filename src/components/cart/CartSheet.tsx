"use client";
import {
  removeFromCart,
  updateQuantity,
} from "@/store/features/cart/cart.slice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { ShoppingCartIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";
import { formatCurrency } from "@/utils/helpers";
import CartSheetItem from "./CartSheetItem";

const CartSheet = ({
  isOpen,
  onChange,
}: {
  isOpen: boolean;
  onChange: () => void;
}) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { items } = useAppSelector((state) => state.cart);

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const itemCount = items.reduce((count, item) => count + item.quantity, 0);

  const handleCheckout = () => {
    // Close the sheet
    onChange();
    // Navigate to checkout
    router.push("/checkout");
  };

  const handleViewCart = () => {
    // Close the sheet
    onChange();
    // Navigate to full cart page
    router.push("/cart");
  };

  const handleRemoveItem = (productId: string) => {
    dispatch(removeFromCart(productId));
  };

  const handleQuantityChange = (productId: string, quantity: number) => {
    dispatch(updateQuantity({ productId, quantity }));
  };

  return (
    <Sheet open={isOpen} onOpenChange={onChange}>
      <SheetContent className="w-full">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 text-xl">
            <ShoppingCartIcon className="h-5 w-5" />
            Your Cart ({itemCount})
          </SheetTitle>

          {itemCount > 0 ? (
            <SheetDescription>
              Review your items before checkout
            </SheetDescription>
          ) : null}
        </SheetHeader>

        <ScrollArea className="flex-1 py-2 min-h-60">
          {items.length > 0 ? (
            <div className="divide-y">
              {items.map((item) => (
                <CartSheetItem
                  key={item.product._id}
                  item={item}
                  onRemove={() => handleRemoveItem(item.product._id)}
                  onQuantityChange={(qty) =>
                    handleQuantityChange(item.product._id, qty)
                  }
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <ShoppingCartIcon className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Your cart is empty</p>
              <SheetClose asChild className="mt-4">
                <Button asChild className="rounded-sm">
                  <Link href="/products">Continue Shopping</Link>
                </Button>
              </SheetClose>
            </div>
          )}
        </ScrollArea>

        {items.length > 0 && (
          <SheetFooter className="border-t pt-4">
            <div className="w-full space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">{formatCurrency(subtotal)}</span>
              </div>

              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>

              <div className="flex flex-col gap-2">
                <Button
                  onClick={handleCheckout}
                  className="w-full cursor-pointer"
                >
                  Proceed to Checkout
                </Button>

                <Button
                  variant="secondary"
                  className="w-full cursor-pointer"
                  onClick={handleViewCart}
                >
                  View Cart
                </Button>
              </div>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartSheet;
