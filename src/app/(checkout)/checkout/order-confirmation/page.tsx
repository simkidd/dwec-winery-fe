import OrderConfirmationComp from "@/components/cart/OrderConfirmationComp";
import { Metadata } from "next";
import React from "react";

const pageTitle = "Order Confirmation";

export const metadata: Metadata = {
  title: pageTitle,
};

const OrderConfirmationPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const { reference } = await searchParams;
  return (
    <div>
      <div className="container mx-auto px-4 py-8">
        <OrderConfirmationComp reference={reference as string} />
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
