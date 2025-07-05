"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import useOrders from "@/hooks/use-orders";
import { IOrderDetails } from "@/interfaces/order.interface";
import { formatCurrency } from "@/utils/helpers";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ScrollArea } from "../ui/scroll-area";

const OrdersList = () => {
  const { orders, isFetchingOrders } = useOrders();

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

  const OrderDetailsContent = ({ order }: { order: IOrderDetails }) => {
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
              <p>Paid: {formatCurrency(order?.totalAmountPaid, "NGN", 2)}</p>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-3">Order Summary</h3>
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal:</span>
                <span>
                  {formatCurrency(
                    order?.totalAmountPaid - order.deliveryDetails?.fee,
                    "NGN",
                    2
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery:</span>
                <span>
                  {formatCurrency(order.deliveryDetails?.fee, "NGN", 2)}
                </span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-medium">
                <span>Total:</span>
                <span>{formatCurrency(order?.totalAmountPaid, "NGN", 2)}</span>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        <div>
          <h3 className="font-medium mb-3">Items ({order.products.length})</h3>
          <div className="space-y-4">
            {order.products.map((item) => (
              <div key={item._id} className="flex items-start gap-4 pr-4 ">
                <div className="w-16 h-16 bg-primary/10 rounded-md overflow-hidden flex-shrink-0">
                  {item.product.images.length > 0 ? (
                    <Image
                      src={
                        item.variantUsed
                          ? item.variantUsed.images[0]
                          : item.product.images[0]
                      }
                      alt={item.product.name}
                      className="w-full h-full object-contain"
                      width={64}
                      height={64}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0 ">
                  <h4 className="font-medium truncate text-wrap">
                    {item.product.name}
                  </h4>
                  {item.variantUsed && (
                    <p className="text-sm text-gray-500 truncate text-wrap">
                      Variation: {item.variantUsed.name}
                    </p>
                  )}
                  <p className="text-sm text-gray-500">Qty: {item.qty}</p>
                </div>
                <div className="text-right">
                  {item.variantUsed ? (
                    <p>
                      {formatCurrency(
                        item.variantUsed.price * item.qty,
                        "NGN",
                        2
                      )}
                    </p>
                  ) : (
                    <p>
                      {formatCurrency(item.product.price * item.qty, "NGN", 2)}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const OrderDetailsModal = ({ order }: { order: IOrderDetails }) => {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="link"
            className="text-primary p-0 h-auto cursor-pointer"
          >
            View full details
          </Button>
        </DialogTrigger>
        <DialogContent className="!max-w-4xl px-0">
          <DialogHeader className="px-4">
            <DialogTitle className="text-left">
              Order #{order.trackingId.tracking_id} Details
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[calc(100vh-150px)] px-4 sm:px-6">
            <OrderDetailsContent order={order} />
          </ScrollArea>
        </DialogContent>
      </Dialog>
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
            <Card
              key={order._id}
              className="overflow-hidden py-0 divide-y gap-0"
            >
              <CardHeader className="bg-gray-50 dark:bg-transparent px-6 py-4 flex flex-row justify-between items-center">
                <div className="space-y-1">
                  <CardTitle className="text-base">
                    Order #{order.trackingId.tracking_id}
                  </CardTitle>
                  <p className="text-sm text-gray-500">
                    {format(
                      new Date(order.createdAt),
                      "MMM d, yyyy 'at' h:mm a"
                    )}
                  </p>
                </div>

                <OrderDetailsModal order={order} />
              </CardHeader>

              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="flex space-x-2">
                    {order.products.slice(0, 3).map((item) => (
                      <div
                        key={item._id}
                        className="w-16 h-16 bg-primary/10 rounded-lg overflow-hidden shadow-sm border"
                      >
                        {item.product.images.length > 0 ? (
                          <Image
                            src={
                              item.variantUsed
                                ? item.variantUsed.images[0]
                                : item.product.images[0]
                            }
                            alt={item.product.name}
                            className="w-full h-full object-contain"
                            width={48}
                            height={48}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                            No Image
                          </div>
                        )}
                      </div>
                    ))}
                    {order.products.length > 3 && (
                      <div className="w-16 h-16 bg-primary/10 rounded-lg border flex items-center justify-center text-xs font-medium text-gray-500">
                        +{order.products.length - 3}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>

              <CardFooter className="px-6 py-4">
                <div className="w-full flex items-center justify-between flex-wrap gap-2">
                  <Badge className={getStatusColor(order.trackingStatus)}>
                    {order.trackingStatus}
                  </Badge>

                  <div className="flex items-center gap-4">
                    <div className="inline-flex items-center">
                      <p className="text-sm text-gray-500 pr-2">Total Items</p>
                      <p className="font-medium">{order.products.length}</p>
                    </div>
                    <Separator orientation="vertical" className="h-8" />
                    <div className="inline-flex items-center">
                      <p className="text-sm text-gray-500 pr-2">Order Total</p>
                      <p className="font-medium">
                        {formatCurrency(order?.totalAmountPaid, "NGN", 2)}
                      </p>
                    </div>
                  </div>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersList;
