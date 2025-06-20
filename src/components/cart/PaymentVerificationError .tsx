import { AlertTriangle } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";

interface PaymentVerificationErrorProps {
  message: string;
  onRetry: () => void;
}

const PaymentVerificationError = ({
  message,
  onRetry,
}: PaymentVerificationErrorProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
      <div className="bg-red-100 rounded-full p-4 mb-4">
        <AlertTriangle className="h-12 w-12 text-red-600" />
      </div>
      <h2 className="text-2xl font-bold mb-2">Payment Verification Failed</h2>
      <p className="text-lg text-muted-foreground mb-6">{message}</p>

      <div className="flex gap-4">
        <Button onClick={onRetry}>Try Again</Button>
        <Button variant="outline" asChild>
          <a href="/checkout">Return to Checkout</a>
        </Button>
      </div>
    </div>
  );
};

export default PaymentVerificationError;
