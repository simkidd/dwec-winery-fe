import OrderDetails from "@/components/account/OrderDetails";
import { getOrderById } from "@/lib/api/order";
import { notFound } from "next/navigation";
import React from "react";

const OrderInfoPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const { order } = await getOrderById(id);

  if (!order) {
    return notFound();
  }

  return (
    <div>
      <OrderDetails order={order} />
    </div>
  );
};

export default OrderInfoPage;
