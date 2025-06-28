"use client";
import CustomBreadcrumbs from "@/components/shared/CustomBreadcrumbs";
import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { createOrder, initPayment } from "@/lib/api/order";
import { useAppSelector } from "@/store/hooks";
import { formatCurrency } from "@/utils/helpers";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { ChevronLeft, Loader2, StoreIcon, Truck } from "lucide-react";
import Link from "next/link";
// import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CreateOrderDTO } from "@/interfaces/order.interface";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

// Define base schema
const baseSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
  deliveryMethod: z.enum(["Home Delivery", "Pickup"]),
  paymentMethod: z.enum(["paystack", "pay-on-delivery"]),
  saveInfo: z.boolean(),
  agreeTerms: z.literal(true, {
    errorMap: () => ({ message: "You must agree to the terms and conditions" }),
  }),
});

// Define conditional schema
const formSchema = z.discriminatedUnion("deliveryMethod", [
  // Home Delivery schema
  baseSchema.extend({
    deliveryMethod: z.literal("Home Delivery"),
    deliveryDetails: z.object({
      area: z.string().min(1, "Area is required"),
      suiteNumber: z.string().optional(),
      streetAddress: z.string().min(1, "Street address is required"),
      city: z.string().min(1, "City is required"),
      zipCode: z.string().min(1, "ZIP code is required"),
      note: z.string().optional(),
    }),
  }),
  // Pickup schema
  baseSchema.extend({
    deliveryMethod: z.literal("Pickup"),
    deliveryDetails: z.object({}).optional(),
  }),
]);

type CheckoutFormValues = z.infer<typeof formSchema>;

const CheckoutComp = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const status = searchParams.get("status");

  const { items } = useAppSelector((state) => state.cart);
  const { user } = useAppSelector((state) => state.auth);

  const effectRan = useRef(false);

  console.log("cart items>>>>", items);

  useEffect(() => {
    if (effectRan.current) return; // Skip if already ran
    if (status === "cancelled") {
      toast.error("Payment was cancelled. You can try again.");
      // Clean URL without reload
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete("status");
      window.history.replaceState(null, "", newUrl.toString());
      effectRan.current = true;
    }
  }, [status]);

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: user?.email || "",
      phoneNumber: "",
      deliveryMethod: "Home Delivery",
      deliveryDetails: {
        area: "",
        suiteNumber: "",
        streetAddress: "",
        city: "",
        zipCode: "",
        note: "",
      },
      paymentMethod: "paystack",
      saveInfo: true,
      agreeTerms: true,
    },
  });

  const deliveryMethod = form.watch("deliveryMethod");
  const paymentMethod = form.watch("paymentMethod");

  const subtotal = items.reduce(
    (sum, item) => sum + (item.variant?.price || item.product.price) * item.qty,
    0
  );
  const shippingFee = deliveryMethod === "Home Delivery" ? 5 : 0;
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + shippingFee + tax;

  // Mutation: Initialize payment
  const initPaymentMutation = useMutation({
    mutationFn: initPayment,
    onSuccess: async (data) => {
      window.location.href = data.data.data.authorization_url;
    },
    onError: (error: AxiosError<{ message: string }>) => {
      console.log("error", error?.response?.data?.message);
      toast.error(error?.response?.data?.message || error?.message);
    },
  });

  // Mutation: create order
  const createOrderMutation = useMutation({
    mutationFn: createOrder,
    onSuccess: async (data) => {
      console.log("createOrder>>", data);
      router.push(`/checkout/order-confirmation/${data.order?._id}`);
    },
    onError: (error: AxiosError<{ message: string }>) => {
      console.log("error", error?.response?.data?.message);
      toast.error(error?.response?.data?.message || error?.message);
    },
  });

  const onSubmit = async (values: CheckoutFormValues) => {
    try {
      // Transform cart items to match backend order format
      const products = items.map((item) => ({
        product: item.product._id,
        qty: item.qty,
        ...(item.variant && {
          variant: {
            id: item.variant.id,
            qty: item.variant.qty,
            price: item.variant.price,
            name: item.variant.name,
            images: item.variant.images,
          },
        }),
      }));

      const orderData: CreateOrderDTO = {
        products,
        deliveryMethod: values.deliveryMethod,
        deliveryDetails: {
          area:
            values.deliveryMethod === "Home Delivery"
              ? values.deliveryDetails.area
              : "",
          phoneNumber: values.phoneNumber,
          email: values.email,
          note:
            values.deliveryMethod === "Home Delivery"
              ? values.deliveryDetails.note
              : "",
          suiteNumber:
            values.deliveryMethod === "Home Delivery"
              ? values.deliveryDetails.suiteNumber
              : "",
          streetAddress:
            values.deliveryMethod === "Home Delivery"
              ? values.deliveryDetails.streetAddress
              : "",
          city:
            values.deliveryMethod === "Home Delivery"
              ? values.deliveryDetails.city
              : "",
          zipCode:
            values.deliveryMethod === "Home Delivery"
              ? values.deliveryDetails.zipCode
              : "",
          fee: shippingFee,
        },
        paymentMethod: values.paymentMethod,
        paymentReference: "",
        totalAmountPaid: total,
      };

      if (values.paymentMethod === "paystack") {
        // Paystack payment flow
        initPaymentMutation.mutate({
          email: values.email,
          amount: total * 100,
          orderData,
          callback_url: `${window.location.origin}/checkout/order-confirmation`,
          cancel_url: `${window.location.origin}/checkout?status=cancelled`,
        });
      } else {
        // Pay on delivery flow
        await createOrderMutation.mutateAsync(orderData);
      }
    } catch (error) {
      console.error("Checkout error:", error);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <Card className="p-8 max-w-md mx-auto">
          <h2 className="text-xl font-bold mb-4">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6">
            Please add items to your cart before checking out.
          </p>
          <Button asChild>
            <Link href="/products">Continue Shopping</Link>
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <CustomBreadcrumbs />
      <PageHeader title="Checkout" className="hidden md:flex" />

      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" className="mb-6 pl-0" asChild>
          <Link href="/cart" className="flex items-center">
            <ChevronLeft className="h-5 w-5 mr-2" />
            Back to Cart
          </Link>
        </Button>

        <div className="flex flex-col lg:flex-row gap-2 lg:gap-8">
          {/* Checkout Form */}
          <div className="lg:w-3/5 lg:pr-8 ">
            <Card className="py-4 lg:mb-8 bg-transparent border-0 shadow-none">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                  id="checkout-form"
                >
                  <h2 className="text-xl font-bold">Contact Information</h2>

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="Email"
                            className="focus-visible:ring-0 focus-visible:border-primary shadow-none rounded-sm"
                            readOnly
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="tel"
                            placeholder="Phone Number"
                            className="focus-visible:ring-0 focus-visible:border-primary shadow-none rounded-sm"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="saveInfo"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel className="!mt-0">
                          Save this information for next time
                        </FormLabel>
                      </FormItem>
                    )}
                  />

                  <h2 className="text-xl font-bold pt-4 border-t">
                    Delivery Method
                  </h2>

                  <FormField
                    control={form.control}
                    name="deliveryMethod"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="space-y-2"
                          >
                            <FormLabel
                              htmlFor="home-delivery"
                              className="!mt-0 cursor-pointer flex"
                            >
                              <div className="w-full p-4 border rounded-sm bg-gray-50 dark:bg-gray-900 flex justify-between items-center">
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem
                                    value="Home Delivery"
                                    id="home-delivery"
                                    className="h-4 w-4 cursor-pointer"
                                  />
                                  <div>
                                    <p>Ship</p>
                                    <p className="text-sm text-muted-foreground mt-1">
                                      Get your order delivered to your doorstep
                                    </p>
                                  </div>
                                </div>
                                <Truck className="h-5 w-5 text-muted-foreground" />
                              </div>
                            </FormLabel>

                            <FormLabel
                              htmlFor="pickup"
                              className="!mt-0 cursor-pointer"
                            >
                              <div className="w-full p-4 border rounded-sm bg-gray-50 dark:bg-gray-900 flex justify-between items-center">
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem
                                    value="Pickup"
                                    id="pickup"
                                    className="h-4 w-4 cursor-pointer"
                                  />
                                  <div>
                                    <FormLabel
                                      htmlFor="pickup"
                                      className="!mt-0 cursor-pointer"
                                    >
                                      Store Pickup
                                    </FormLabel>
                                    <p className="text-sm text-muted-foreground mt-1">
                                      Pick up your order from our nearest store
                                    </p>
                                  </div>
                                </div>
                                <StoreIcon className="h-5 w-5 text-muted-foreground" />
                              </div>
                            </FormLabel>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {deliveryMethod === "Home Delivery" && (
                    <>
                      <h2 className="text-xl font-bold pt-4 border-t">
                        Shipping Address
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                        <div className="col-span-1 md:col-span-3">
                          <FormField
                            control={form.control}
                            name="deliveryDetails.streetAddress"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input
                                    placeholder="Street Address"
                                    className="focus-visible:ring-0 focus-visible:border-primary shadow-none rounded-sm"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="col-span-1 md:col-span-3">
                          <FormField
                            control={form.control}
                            name="deliveryDetails.suiteNumber"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input
                                    placeholder="Apt, Suite, etc. (Optional)"
                                    className="focus-visible:ring-0 focus-visible:border-primary shadow-none rounded-sm"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="col-span-1 md:col-span-2">
                          <FormField
                            control={form.control}
                            name="deliveryDetails.city"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input
                                    placeholder="City"
                                    className="focus-visible:ring-0 focus-visible:border-primary shadow-none rounded-sm"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="col-span-1 md:col-span-2">
                          <FormField
                            control={form.control}
                            name="deliveryDetails.area"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input
                                    placeholder="State/Province"
                                    className="focus-visible:ring-0 focus-visible:border-primary shadow-none rounded-sm"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="col-span-1 md:col-span-2">
                          <FormField
                            control={form.control}
                            name="deliveryDetails.zipCode"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input
                                    placeholder="ZIP/Postal Code"
                                    className="focus-visible:ring-0 focus-visible:border-primary shadow-none rounded-sm"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="col-span-1 md:col-span-6">
                          <FormField
                            control={form.control}
                            name="deliveryDetails.note"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input
                                    placeholder="Delivery Notes (Optional)"
                                    className="focus-visible:ring-0 focus-visible:border-primary shadow-none rounded-sm"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </>
                  )}

                  <h2 className="text-xl font-bold pt-4 border-t">
                    Payment Method
                  </h2>

                  <FormField
                    control={form.control}
                    name="paymentMethod"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="space-y-2"
                          >
                            <FormLabel
                              htmlFor="paystack"
                              className="!mt-0 cursor-pointer"
                            >
                              <div className="w-full p-4 border rounded-sm bg-gray-50 dark:bg-gray-900">
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem
                                    value="paystack"
                                    id="paystack"
                                    className="h-4 w-4 cursor-pointer"
                                  />
                                  <p>Paystack (Cards, Bank Transfer, etc.)</p>
                                </div>
                                <p className="text-sm text-muted-foreground mt-2">
                                  Pay securely with your card, bank account, or
                                  mobile money.
                                </p>
                              </div>
                            </FormLabel>

                            <FormLabel
                              htmlFor="pay-on-delivery"
                              className="!mt-0 text-muted-foreground cursor-not-allowed"
                            >
                              <div className="w-full p-4 border rounded-sm bg-gray-50 dark:bg-gray-900">
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem
                                    value="pay-on-delivery"
                                    id="pay-on-delivery"
                                    className="h-4 w-4 text-muted-foreground disabled:cursor-not-allowed"
                                    disabled
                                  />
                                  <p>
                                    Pay on Delivery{" "}
                                    <span className="italic">
                                      (Currently Unavailable)
                                    </span>
                                  </p>
                                </div>
                                <p className="text-sm text-muted-foreground/70 mt-2">
                                  Pay cash when your order arrives.
                                  {/* Pay cash when your order arrives. Additional ₦
                                {shippingFee} delivery fee applies. */}
                                </p>
                              </div>
                            </FormLabel>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="pt-4 border-t">
                    <FormField
                      control={form.control}
                      name="agreeTerms"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="!mt-0">
                            I agree to the Terms and Conditions and Privacy
                            Policy
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Keep payment button for desktop */}
                  <div className="pt-6 hidden lg:block">
                    <Button
                      type="submit"
                      className="w-full rounded-sm cursor-pointer"
                      disabled={
                        initPaymentMutation.isPending ||
                        createOrderMutation.isPending
                      }
                    >
                      {initPaymentMutation.isPending ||
                      createOrderMutation.isPending ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : paymentMethod === "pay-on-delivery" ? (
                        `Place Order (Pay ${formatCurrency(total)} on Delivery)`
                      ) : (
                        `Pay ${formatCurrency(total)} Now`
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:w-2/5 ">
            <Card className="p-4 sticky top-4 rounded-sm">
              <div className="">
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                <ScrollArea className="">
                  {items.map((item, i) => (
                    <div key={i} className="flex items-start gap-4 py-3">
                      <div className="relative h-16 w-16 rounded-md overflow-hidden shrink-0 border">
                        <Image
                          src={
                            item.variant?.images?.[0] || item.product.images[0]
                          }
                          alt={item.product.name}
                          fill
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between gap-4">
                          <div>
                            <h3 className="text-sm">{item.product.name}</h3>
                            {item.variant && (
                              <p className="text-xs text-muted-foreground">
                                Variant: {item.variant.name}
                              </p>
                            )}
                          </div>

                          <p className="text-muted-foreground pb-2">
                            {formatCurrency(
                              (item.variant?.price || item.product.price) *
                                item.qty
                            )}
                          </p>
                        </div>
                        <p className="text-muted-foreground pb-2">
                          {formatCurrency(
                            item.variant?.price || item.product.price
                          )}{" "}
                          x {item.qty}
                        </p>
                      </div>
                    </div>
                  ))}
                </ScrollArea>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>
                      {deliveryMethod === "Pickup"
                        ? "Pickup in store"
                        : "Shipping"}
                    </span>
                    <span>
                      {shippingFee > 0 ? formatCurrency(shippingFee) : "Free"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>{formatCurrency(tax)}</span>
                  </div>
                </div>

                <div className=" pt-4 flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>

              <div className="pt-6 lg:hidden">
                <Button
                  type="submit"
                  form="checkout-form"
                  className="w-full rounded-sm cursor-pointer"
                  disabled={
                    initPaymentMutation.isPending ||
                    createOrderMutation.isPending
                  }
                >
                  {initPaymentMutation.isPending ||
                  createOrderMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : paymentMethod === "pay-on-delivery" ? (
                    `Place Order (Pay ${formatCurrency(total)} on Delivery)`
                  ) : (
                    `Pay ${formatCurrency(total)} Now`
                  )}
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutComp;
