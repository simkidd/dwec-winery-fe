"use client";
import useOrders from "@/hooks/use-orders";
import { format } from "date-fns";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { Loader2 } from "lucide-react";

const OrdersList = () => {
  const { orders, isFetchingOrders } = useOrders();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(price);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Processing":
        return "bg-yellow-100 text-yellow-800";
      case "Shipped":
        return "bg-blue-100 text-blue-800";
      case "Delivered":
        return "bg-green-100 text-green-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Your Orders</h1>
        <Link href="/products">
          <Button variant="outline">Continue Shopping</Button>
        </Link>
      </div>

      {isFetchingOrders ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="animate-spin text-primary" />
        </div>
      ) : orders.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <p className="text-gray-500 mb-4">
              You haven&apos;t placed any orders yet.
            </p>
            <Link href="/products">
              <Button>Browse Products</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order._id} className="overflow-hidden">
              <CardHeader className="bg-gray-50 px-6 py-4 border-b flex flex-row justify-between items-center">
                <div className="space-y-1">
                  <CardTitle className="text-lg">
                    Order #{order.trackingId.tracking_id}
                  </CardTitle>
                  <p className="text-sm text-gray-500">
                    {format(
                      new Date(order.createdAt),
                      "MMM d, yyyy 'at' h:mm a"
                    )}
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className={getStatusColor(order.trackingStatus)}
                >
                  {order.trackingStatus}
                </Badge>
              </CardHeader>

              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div>
                    <h3 className="font-medium mb-3">Delivery Information</h3>
                    <div className="text-sm text-gray-600 space-y-1">
                      {order.deliveryMethod === "Pickup" ? (
                        <p>Store Pickup</p>
                      ) : (
                        <>
                          {order.deliveryDetails.streetAddress && (
                            <p>{order.deliveryDetails.streetAddress}</p>
                          )}
                          <p>
                            {order.deliveryDetails.city &&
                              `${order.deliveryDetails.city}, `}
                            {order.deliveryDetails.area}
                          </p>
                          {order.deliveryDetails.zipCode && (
                            <p>{order.deliveryDetails.zipCode}</p>
                          )}
                        </>
                      )}
                      <p>Phone: {order.deliveryDetails?.phoneNumber}</p>
                      <p>Email: {order.deliveryDetails?.email}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-3">Payment</h3>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p className="capitalize">{order?.paymentMethod}</p>
                      <p>Ref: {order?.paymentReference}</p>
                      <p>Paid: {formatPrice(order?.totalAmountPaid)}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-3">Order Summary</h3>
                    <div className="text-sm space-y-1">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal:</span>
                        <span>
                          {formatPrice(
                            order?.totalAmountPaid - order.deliveryDetails?.fee
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Delivery:</span>
                        <span>{formatPrice(order.deliveryDetails?.fee)}</span>
                      </div>
                      <Separator className="my-2" />
                      <div className="flex justify-between font-medium">
                        <span>Total:</span>
                        <span>{formatPrice(order?.totalAmountPaid)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator className="mb-6" />

                <div className="mb-6">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-medium">
                      Items ({order.products.length})
                    </h3>
                    <Link href={`/account/orders/${order._id}`}>
                      <Button
                        variant="link"
                        className="text-primary p-0 h-auto"
                      >
                        View full order details
                      </Button>
                    </Link>
                  </div>
                  <div className="space-y-4">
                    {order.products.slice(0, 2).map((item) => (
                      <div key={item._id} className="flex items-start gap-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                          {item.product.images.length > 0 ? (
                            <Image
                              src={item.product.images[0]}
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                              width={64}
                              height={64}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              No Image
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium truncate">
                            {item.product.name}
                          </h4>
                          {item.variantUsed?.name && (
                            <p className="text-sm text-gray-500 truncate">
                              Variant: {item.variantUsed.name}
                            </p>
                          )}
                          <p className="text-sm text-gray-500">
                            Qty: {item.qty}
                          </p>
                        </div>
                        <div className="text-right">
                          <p>{formatPrice(item.product.price * item.qty)}</p>
                        </div>
                      </div>
                    ))}
                    {order.products.length > 2 && (
                      <p className="text-sm text-gray-500 text-center">
                        + {order.products.length - 2} more items
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <Button variant="outline" asChild>
                    <Link href={`/account/orders/${order._id}`}>
                      View Details
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <a href="#" target="_blank" rel="noopener noreferrer">
                      View Invoice
                    </a>
                  </Button>
                  {order.trackingStatus === "Processing" && (
                    <Button variant="destructive">Cancel Order</Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersList;
