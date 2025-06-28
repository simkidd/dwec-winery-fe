"use client";
import { IOrderDetails } from "@/interfaces/order.interface";
import { createOrder, verifyPayment } from "@/lib/api/order";
import { clearCart } from "@/store/features/cart/cart.slice";
import { useAppDispatch } from "@/store/hooks";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

export interface PaymentVerificationResponse {
  success: boolean;
  data: {
    status: boolean;
    message: string;
    data: {
      id: number;
      reference: string;
      amount: number;
      status: string;
      paid_at: string;
      metadata: {
        products: Array<{
          product: string;
          qty: string;
          variant: {
            id: string;
            qty: string;
            price: string;
            name: string;
            images: string[];
          };
        }>;
        deliveryMethod: string;
        deliveryDetails: {
          area: string;
          phoneNumber: string;
          email: string;
          note: string;
          suiteNumber: string;
          streetAddress: string;
          city: string;
          zipCode: string;
          fee: string;
        };
        paymentMethod: string;
        totalAmountPaid: string;
        user: string;
      };
      authorization: {
        authorization_code: string;
        last4: string;
        card_type: string;
        bank: string;
      };
      customer: {
        email: string;
      };
    };
  };
}

interface VerifyPaymentProps {
  reference: string;
  onSuccess: (data: IOrderDetails) => void;
  onError: (message: string) => void;
}

const VerifyPayment = ({
  reference,
  onSuccess: onSuccessData,
  onError: onErrorMsg,
}: VerifyPaymentProps) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const effectRan = useRef(false);

  useEffect(() => {
    if (effectRan.current) return;
    if (reference) {
      verifyPaymentMutation.mutate({
        ref: reference,
      });
      effectRan.current = true;
    }
  }, [reference]);

  // Mutation: Verify payment
  const verifyPaymentMutation = useMutation({
    mutationFn: verifyPayment,
    onSuccess: (res: PaymentVerificationResponse) => {
      // clean the url params
      router.replace("/checkout/order-confirmation", undefined);

      const orderData = {
        paymentReference: res.data.data.reference,
        paymentMethod: res.data.data.metadata.paymentMethod,
        deliveryDetails: {
          ...res.data.data.metadata.deliveryDetails,
          fee: parseInt(res.data.data.metadata.deliveryDetails.fee),
        },
        deliveryMethod: res.data.data.metadata.deliveryMethod as
          | "Pickup"
          | "Home Delivery",
        totalAmountPaid: parseInt(res.data.data.metadata.totalAmountPaid),
        products: res.data.data.metadata.products.map((item) => ({
          product: item.product,
          qty: parseInt(item.qty),
          ...(item.variant && {
            variant: {
              id: item.variant.id,
              qty: Number(item.variant.qty) || 1,
              price: Number(item.variant.price),
              name: item.variant.name,
              images: item.variant.images,
            },
          }),
        })),
      };

      createOrderMutation.mutate(orderData);
    },
    onError: (error: AxiosError<{ message: string }>) => {
      console.log("error", error?.response?.data?.message);
      onErrorMsg(error?.response?.data?.message || error?.message);
    },
  });

  const createOrderMutation = useMutation({
    mutationFn: createOrder,
    onSuccess: (res) => {
      onSuccessData(res.order);
      dispatch(clearCart());
    },
    onError: (error: AxiosError<{ message: string }>) => {
      console.log("error", error?.response?.data?.message);
      onErrorMsg(error?.response?.data?.message || error?.message);
    },
  });

  const isLoading =
    verifyPaymentMutation.isPending || createOrderMutation.isPending;
  const currentStatus = createOrderMutation.isPending
    ? "Creating your order..."
    : "Verifying payment...";

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] px-4 text-center">
      <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
      <h2 className="text-xl font-bold mb-2">{currentStatus}</h2>

      <div className="max-w-md space-y-2">
        <p className="text-muted-foreground">
          {createOrderMutation.isPending
            ? "We're finalizing your order details"
            : "Please wait while we confirm your payment details"}
        </p>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-yellow-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700 font-medium">
                Please don&apos;t close this page during processing.
              </p>
            </div>
          </div>
        </div>

        {isLoading && (
          <p className="text-sm text-muted-foreground mt-4">
            Status: {currentStatus}
          </p>
        )}

        {(verifyPaymentMutation.error || createOrderMutation.error) && (
          <p className="text-sm text-red-500 mt-4">
            {verifyPaymentMutation.error?.message ||
              createOrderMutation.error?.message}
          </p>
        )}
      </div>
    </div>
  );
};

export default VerifyPayment;
