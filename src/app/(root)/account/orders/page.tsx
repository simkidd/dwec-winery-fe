import OrdersList from "@/components/account/OrdersList";
import { Metadata } from "next";
import React from "react";

const pageTitle = "My orders";

export const metadata: Metadata = {
  title: pageTitle,
};

const OrdersPage = () => {
  return (
    <div>
      <div>
        <OrdersList />
      </div>
    </div>
  );
};

export default OrdersPage;
