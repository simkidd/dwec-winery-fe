"use client";
import { ICartItem } from "@/interfaces/cart.interface";
import { ShoppingCartIcon } from "lucide-react";
import Link from "next/link";
import CartItem from "../cart/CartItem";
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
import { useRouter } from "next/navigation";

const CartSheet = ({
  isOpen,
  onChange,
}: {
  isOpen: boolean;
  onChange: () => void;
}) => {
  const router = useRouter();

  // Example cart data for demonstration
  const items: ICartItem[] = [
    {
      id: "1",
      name: "Cabernet Sauvignon",
      price: 29.99,
      quantity: 2,
      image: "/images/cabernet.jpg",
    },
    {
      id: "2",
      name: "Chardonnay",
      price: 19.99,
      quantity: 1,
      image: "/images/chardonnay.jpg",
    },
  ];

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
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

  return (
    <Sheet open={isOpen} onOpenChange={onChange}>
      <SheetContent>
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

        <ScrollArea className="flex-1 py-4">
          {items.length > 0 ? (
            <div className="space-y-4">
              {items.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onRemove={() => console.log("Remove", item.id)}
                  onQuantityChange={(qty) =>
                    console.log("Update", item.id, qty)
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
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-medium">Calculated at checkout</span>
              </div>
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>${subtotal.toFixed(2)}</span>
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
