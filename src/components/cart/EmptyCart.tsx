import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";

const EmptyCart = () => {
  return (
    <div className="container mx-auto px-4 py-12 flex flex-col items-center justify-center text-center">
      <div className="bg-gray-100 rounded-full p-6 mb-6">
        <ShoppingCart className="h-12 w-12 text-muted-foreground" />
      </div>

      <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
      <p className="text-muted-foreground mb-6 max-w-md">
        Looks like you haven&apos;t added any items to your cart yet. Start
        shopping to find amazing products!
      </p>

      <Button asChild className="rounded-sm">
        <Link href="/products">Continue Shopping</Link>
      </Button>
    </div>
  );
};

export default EmptyCart;
