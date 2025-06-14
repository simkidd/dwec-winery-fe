"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, Clock, Truck, CreditCard, Wallet } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import CustomBreadcrumbs from "@/components/shared/CustomBreadcrumbs";
import PageHeader from "@/components/shared/PageHeader";
import { getOrderById } from "@/lib/api/order";
import Image from "next/image";
import { formatCurrency } from "@/utils/helpers";
import { IOrderDetails } from "@/interfaces/order.interface";
import { formatDate } from "date-fns";

const OrderConfirmationPage = () => {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");
  const [order, setOrder] = useState<IOrderDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return;

      try {
        const orderData = await getOrderById();
        setOrder(orderData);
      } catch (error) {
        console.error("Failed to fetch order:", error);
        toast.error("Failed to load order details");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
        <p className="mt-4">Loading your order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <Card className="p-8 max-w-md mx-auto">
          <h2 className="text-xl font-bold mb-4">Order Not Found</h2>
          <p className="text-muted-foreground mb-6">
            We couldn&apos;t find the order you&apos;re looking for.
          </p>
          <Button asChild>
            <Link href="/">Back to Home</Link>
          </Button>
        </Card>
      </div>
    );
  }

  const subtotal = order.products.reduce(
    (sum, item) => sum + item.product.price * item.qty,
    0
  );
  const tax = subtotal * 0.1; // 10% tax
  const total = order.totalAmountPaid;

  return (
    <div>
      <CustomBreadcrumbs />
      <PageHeader title="Order Confirmation" />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Order Status Card */}
          <Card className="p-6 mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                {order.trackingStatus === "Processing" ? (
                  <Clock className="h-12 w-12 text-yellow-500" />
                ) : (
                  <CheckCircle className="h-12 w-12 text-green-500" />
                )}
                <div>
                  <h2 className="text-xl font-bold">
                    {order.trackingStatus === "Processing"
                      ? "Order Processing"
                      : order.trackingStatus === "Delivered"
                      ? "On Its Way"
                      : "Order Received"}
                  </h2>
                  <p className="text-muted-foreground">
                    Order #{order._id.slice(-8).toUpperCase()}
                  </p>
                  <p className="text-sm">
                    Placed on {formatDate(order.createdAt, "yyyy-MM-dd")}
                  </p>
                </div>
              </div>
              <Button asChild variant="outline">
                <Link href="/orders">View All Orders</Link>
              </Button>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  {order.paymentMethod === "pay-on-delivery" ? (
                    <Wallet className="h-5 w-5 text-primary" />
                  ) : (
                    <CreditCard className="h-5 w-5 text-primary" />
                  )}
                  <h3 className="font-medium">Payment Method</h3>
                </div>
                <p className="capitalize">
                  {order.paymentMethod.toLowerCase()}
                </p>
                {order.paymentReference && (
                  <p className="text-sm text-muted-foreground">
                    Ref: {order.paymentReference}
                  </p>
                )}
              </div>

              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Truck className="h-5 w-5 text-primary" />
                  <h3 className="font-medium">Delivery Method</h3>
                </div>
                <p className="capitalize">
                  {order.deliveryMethod.toLowerCase()}
                </p>
                {order.deliveryDetails.fee > 0 ? (
                  <p className="text-sm text-muted-foreground">
                    {formatCurrency(order.deliveryDetails.fee)} delivery fee
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground">Free delivery</p>
                )}
              </div>

              <div className="border rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <h3 className="font-medium">Order Status</h3>
                </div>
                <p className="capitalize">
                  {order.trackingStatus.toLowerCase()}
                </p>
                <p className="text-sm text-muted-foreground">
                  {order.trackingStatus === "Processing"
                    ? "Preparing your order"
                    : order.trackingStatus === "Delivered"
                    ? "Shipped to your address"
                    : "Ready for pickup"}
                </p>
              </div>
            </div>
          </Card>

          {/* Order Details */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Items */}
            <div className="lg:col-span-2">
              <h2 className="text-xl font-bold mb-4">Order Details</h2>
              <Card className="p-6">
                <div className="divide-y">
                  {order.products.map((item) => (
                    <div key={item.product._id} className="py-4 flex gap-4">
                      <div className="w-20 h-20 bg-gray-100 rounded-md overflow-hidden">
                        {item.product.images?.[0] ? (
                          <Image
                            src={item.product.images[0]}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                            width={300}
                            height={300}
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{item.product.name}</h3>
                        <p className="text-muted-foreground text-sm">
                          Qty: {item.qty}
                        </p>
                      </div>
                      <div className="font-medium">
                        {formatCurrency(item.product.price * item.qty)}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Order Summary */}
            <div>
              <h2 className="text-xl font-bold mb-4">Summary</h2>
              <Card className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>
                      {order.deliveryDetails.fee > 0
                        ? formatCurrency(order.deliveryDetails.fee)
                        : "Free"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>{formatCurrency(tax)}</span>
                  </div>
                  <div className="border-t pt-4 flex justify-between font-bold">
                    <span>Total</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                </div>

                {order.paymentMethod === "pay-on-delivery" && (
                  <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                    <h3 className="font-medium flex items-center gap-2 mb-2">
                      <Wallet className="h-4 w-4" />
                      Pay on Delivery
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Please prepare {formatCurrency(total)} in cash for when
                      your order arrives.
                    </p>
                  </div>
                )}

                <div className="mt-6 space-y-2">
                  <Button className="w-full" asChild>
                    <Link href="/products">Continue Shopping</Link>
                  </Button>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href={`/orders/${order._id}`}>
                      View Order Details
                    </Link>
                  </Button>
                </div>
              </Card>

              {/* Delivery Address */}
              <Card className="p-6 mt-6">
                <h2 className="text-xl font-bold mb-4">Delivery Address</h2>
                <div className="space-y-2">
                  <p>{order.deliveryDetails.streetAddress}</p>
                  {order.deliveryDetails.suiteNumber && (
                    <p>Apt/Suite: {order.deliveryDetails.suiteNumber}</p>
                  )}
                  <p>
                    {order.deliveryDetails.city}, {order.deliveryDetails.area}{" "}
                    {order.deliveryDetails.zipCode}
                  </p>
                  <p>Phone: {order.deliveryDetails.phoneNumber}</p>
                  {order.deliveryDetails.note && (
                    <div className="mt-4 pt-4 border-t">
                      <h3 className="font-medium">Delivery Note</h3>
                      <p className="text-muted-foreground">
                        {order.deliveryDetails.note}
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
