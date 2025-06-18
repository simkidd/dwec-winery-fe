"use client";
import useOrders from "@/hooks/use-orders";
import React from "react";

const OrdersList = () => {
  const { orders } = useOrders();
  console.log("orders>>", orders);

  return (
    <div>
      <div></div>
    </div>
  );
};

export default OrdersList;
