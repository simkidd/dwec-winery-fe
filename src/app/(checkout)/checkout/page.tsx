import CheckoutComp from "@/components/cart/CheckoutComp";
import { Metadata } from "next";
import React from "react";

const pageTitle = "Checkout";

export const metadata: Metadata = {
  title: pageTitle,
};

const CheckoutPage = () => {
  return (
    <div>
      <CheckoutComp />
    </div>
  );
};

export default CheckoutPage;
