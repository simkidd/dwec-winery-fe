"use client";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

const PaymentVerificationSuccess = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
      <div className="bg-green-100 rounded-full p-4 mb-4">
        <CheckCircle className="h-12 w-12 text-green-600" />
      </div>
      <h2 className="text-2xl font-bold mb-2">Order Confirmed!</h2>
      <p className="text-lg text-muted-foreground mb-6">
        Thank you for your purchase. Your order has been received.
      </p>

      <div className="flex gap-4">
        <Button asChild>
          <Link href={`/account/orders`}>View Orders</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/products">Continue Shopping</Link>
        </Button>
      </div>
    </div>
  );
};

export default PaymentVerificationSuccess;
