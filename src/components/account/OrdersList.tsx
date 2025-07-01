"use client";
import useOrders from "@/hooks/use-orders";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";
import { useIsMobile } from "@/hooks/use-mobile";
import { IOrderDetails } from "@/interfaces/order.interface";

const OrdersList = () => {
  const { orders, isFetchingOrders } = useOrders();
  const isMobile = useIsMobile();

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

  const OrderDetails = ({ order }: { order: IOrderDetails }) => {
    return (
      <div className="space-y-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

        <Separator />

        <div>
          <h3 className="font-medium mb-3">Items ({order.products.length})</h3>
          <div className="space-y-4">
            {order.products.map((item) => (
              <div key={item._id} className="flex items-start gap-4">
                <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                  {item.product.images.length > 0 ? (
                    <Image
                      src={
                        item.variantUsed
                          ? item.variantUsed.images[0]
                          : item.product.images[0]
                      }
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
                  <h4 className="font-medium truncate">{item.product.name}</h4>
                  {item.variantUsed && (
                    <p className="text-sm text-gray-500 truncate">
                      Variation: {item.variantUsed.name}
                    </p>
                  )}
                  <p className="text-sm text-gray-500">Qty: {item.qty}</p>
                </div>
                <div className="text-right">
                  {item.variantUsed ? (
                    <p>{formatPrice(item.variantUsed.price * item.qty)}</p>
                  ) : (
                    <p>{formatPrice(item.product.price * item.qty)}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const OrderDialog = ({ order }: { order: IOrderDetails }) => {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="link"
            className="text-primary p-0 h-auto cursor-pointer"
          >
            View full order details
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Order #{order.trackingId.tracking_id} Details
            </DialogTitle>
          </DialogHeader>
          <OrderDetails order={order} />
        </DialogContent>
      </Dialog>
    );
  };

  const OrderSheet = ({ order }: { order: IOrderDetails }) => {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="link"
            className="text-primary p-0 h-auto cursor-pointer"
          >
            View full order details
          </Button>
        </SheetTrigger>
        <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>
              Order #{order.trackingId.tracking_id} Details
            </SheetTitle>
          </SheetHeader>
          <div className="px-4">
            <OrderDetails order={order} />
          </div>
        </SheetContent>
      </Sheet>
    );
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Your Orders</h1>
        <Button variant="outline" asChild>
          <Link href="/products">Continue Shopping</Link>
        </Button>
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
            <Button asChild>
              <Link href="/products">Browse Products</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order._id} className="overflow-hidden py-0">
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

              <CardContent className="">
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
                    {!isMobile ? (
                      <OrderDialog order={order} />
                    ) : (
                      <OrderSheet order={order} />
                    )}
                  </div>
                  <div className="space-y-4">
                    {order.products.slice(0, 2).map((item) => (
                      <div key={item._id} className="flex items-start gap-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                          {item.product.images.length > 0 ? (
                            <Image
                              src={
                                item.variantUsed
                                  ? item.variantUsed.images[0]
                                  : item.product.images[0]
                              }
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
                          {item.variantUsed && (
                            <p className="text-sm text-gray-500 truncate">
                              Variation: {item.variantUsed.name}
                            </p>
                          )}
                          <p className="text-sm text-gray-500">
                            Qty: {item.qty}
                          </p>
                        </div>
                        <div className="text-right">
                          {item.variantUsed ? (
                            <p>
                              {formatPrice(item.variantUsed.price * item.qty)}
                            </p>
                          ) : (
                            <p>{formatPrice(item.product.price * item.qty)}</p>
                          )}
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
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersList;
