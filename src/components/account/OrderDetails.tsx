"use client";
import { IOrderDetails } from "@/interfaces/order.interface";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import Image from "next/image";

const OrderDetails = ({ order }: { order: IOrderDetails }) => {
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
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Order Details</h1>
          <p className="text-muted-foreground">
            Order #{order.trackingId.tracking_id}
          </p>
        </div>
        <Link href="/account/orders">
          <Button variant="outline">Back to Orders</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Order Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Status */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Order Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <Badge className={getStatusColor(order.trackingStatus)}>
                    {order.trackingStatus}
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-2">
                    Ordered on{" "}
                    {format(
                      new Date(order.createdAt),
                      "MMMM d, yyyy 'at' h:mm a"
                    )}
                  </p>
                </div>
                {order.trackingStatus === "Processing" && (
                  <Button variant="destructive">Cancel Order</Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Delivery Information */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">
                {order.deliveryMethod === "Pickup" ? "Pickup" : "Delivery"}{" "}
                Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {order.deliveryMethod === "Pickup" ? (
                <p className="text-sm">
                  You&apos;ll pick up your order at our store location
                </p>
              ) : (
                <div className="text-sm space-y-1">
                  <p className="font-medium">
                    {order.deliveryDetails.streetAddress}
                  </p>
                  <p>
                    {order.deliveryDetails.city}, {order.deliveryDetails.area}
                  </p>
                  <p>{order.deliveryDetails.zipCode}</p>
                </div>
              )}
              <Separator className="my-3" />
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Contact</p>
                  <p>{order.deliveryDetails.phoneNumber}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Email</p>
                  <p>{order.deliveryDetails.email}</p>
                </div>
              </div>
              {order.deliveryDetails.note && (
                <>
                  <Separator className="my-3" />
                  <div>
                    <p className="text-muted-foreground text-sm">
                      Delivery Note
                    </p>
                    <p className="text-sm">{order.deliveryDetails.note}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {order.products.map((item) => (
                  <div key={item._id} className="flex gap-4">
                    <div className="relative w-20 h-20 rounded-md overflow-hidden border">
                      {item.product.images.length > 0 ? (
                        <Image
                          src={
                            item.variantUsed
                              ? item.variantUsed.images[0]
                              : item.product.images[0]
                          }
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                          No Image
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-medium">{item.product.name}</h3>
                          {item.variantUsed && (
                            <p className="text-sm text-muted-foreground">
                              Variation: {item.variantUsed.name}
                            </p>
                          )}
                        </div>
                        <p className="font-medium">
                          {item.variantUsed ? (
                            <p>
                              {formatPrice(item.variantUsed.price * item.qty)}
                            </p>
                          ) : (
                            <p>{formatPrice(item.product.price * item.qty)}</p>
                          )}
                        </p>
                      </div>
                      <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                        <p>Qty: {item.qty}</p>
                        {item.variantUsed ? (
                          <p>{formatPrice(item.variantUsed.price)} each</p>
                        ) : (
                          <p>{formatPrice(item.product.price)} each</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          <Card className="">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>
                    {formatPrice(
                      order.totalAmountPaid - order.deliveryDetails.fee
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery Fee</span>
                  <span>{formatPrice(order.deliveryDetails.fee)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>{formatPrice(order.totalAmountPaid)}</span>
                </div>
                <Separator />
                <div className="pt-2">
                  <h4 className="font-medium mb-2">Payment Method</h4>
                  <div className="text-sm space-y-1">
                    <p className="capitalize">{order.paymentMethod}</p>
                    <p className="text-muted-foreground">
                      Ref: {order.paymentReference}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
