"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  clearCart,
  removeFromCart,
  updateQuantity,
} from "@/store/features/cart/cart.slice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { formatCurrency } from "@/utils/helpers";
import { ShoppingCart, Trash2 } from "lucide-react";
import { toast } from "sonner";
// import EmptyCart from "./EmptyCart";
import CartItem from "@/components/cart/CartItem";
import EmptyCart from "@/components/cart/EmptyCart";
import CustomBreadcrumbs from "@/components/shared/CustomBreadcrumbs";
import PageHeader from "@/components/shared/PageHeader";
import Link from "next/link";

const CartPage = () => {
  const dispatch = useAppDispatch();
  const { items } = useAppSelector((state) => state.cart);

  // Calculate subtotal using variant price if available
  const subtotal = items.reduce((sum, item) => {
    const price =
      "variant" in item && item.variant
        ? item.variant.price
        : item.product.price;
    return sum + price * item.qty;
  }, 0);

  const itemCount = items.reduce((count, item) => count + item.qty, 0);

  const handleClearCart = () => {
    dispatch(clearCart());
    toast.success("Cart cleared successfully");
  };

  if (items.length === 0) {
    return <EmptyCart />;
  }

  const handleRemoveItem = (productId: string) => {
    dispatch(removeFromCart(productId));
  };

  const handleQuantityChange = (itemId: string, quantity: number) => {
    dispatch(updateQuantity({ itemId, quantity }));
  };

  return (
    <div>
      <CustomBreadcrumbs />
      <PageHeader title="Cart" className="hidden md:flex" />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items Section */}
          <div className="lg:w-2/3">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <ShoppingCart className="h-6 w-6" />
                Your Cart ({itemCount} {itemCount === 1 ? "item" : "items"})
              </h1>
              <Button
                variant="ghost"
                className="text-destructive hover:text-destructive cursor-pointer"
                onClick={handleClearCart}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear Cart
              </Button>
            </div>

            <ScrollArea className="">
              <div className="space-y-2 divide-y">
                {items.map((item) => (
                  <div key={item.id} className="p-4 ">
                    <CartItem
                      item={item}
                      onRemove={() => handleRemoveItem(item.id)}
                      onQuantityChange={(qty) =>
                        handleQuantityChange(item.id, qty)
                      }
                    />
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Order Summary Section */}
          <div className="lg:w-1/3">
            <Card className="p-6 sticky top-4">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Total</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>

                <div className="border-t pt-4 flex justify-between text-lg font-bold">
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>

                <div className="space-y-2 mt-4">
                  <Button asChild size="lg" className="w-full cursor-pointer">
                    <Link href={"/checkout"}>Proceed to Checkout</Link>
                  </Button>

                  <Button variant="outline" className="w-full cursor-pointer">
                    <Link href={"/products"}>Continue Shopping</Link>
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
