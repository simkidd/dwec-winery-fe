"use client";
import CustomBreadcrumbs from "@/components/shared/CustomBreadcrumbs";
import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createOrder, initPayment } from "@/lib/api/order";
import { useAppSelector } from "@/store/hooks";
import { formatCurrency } from "@/utils/helpers";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { ChevronLeft, Loader2 } from "lucide-react";
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
import { CreateOrderDTO } from "@/interfaces/order.interface";
import { zodResolver } from "@hookform/resolvers/zod";
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

const CheckoutPage = () => {
  // const router = useRouter();
  const { items } = useAppSelector((state) => state.cart);
  const { user } = useAppSelector((state) => state.auth);

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
    (sum, item) => sum + item.product.price * item.qty,
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

  // // Mutation: Verify payment
  // const verifyPaymentMutation = useMutation({
  //   mutationFn: verifyPayment,
  //   onSuccess: (data) => {},
  // });

  // Mutation: create order
  const createOrderMutation = useMutation({
    mutationFn: createOrder,
    onSuccess: async (data) => {
      console.log("createOrder>>", data);
    },
    onError: (error: AxiosError<{ message: string }>) => {
      console.log("error", error?.response?.data?.message);
      toast.error(error?.response?.data?.message || error?.message);
    },
  });

  const onSubmit = async (values: CheckoutFormValues) => {
    try {
      const orderData: CreateOrderDTO = {
        products: items.map((item) => ({
          product: item.product._id,
          qty: item.qty,
        })),
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
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Checkout Form */}
          <div className="lg:w-2/3 lg:pr-8">
            <Button variant="ghost" className="mb-6 pl-0" asChild>
              <Link href="/cart" className="flex items-center">
                <ChevronLeft className="h-5 w-5 mr-2" />
                Back to Cart
              </Link>
            </Button>

            <Card className=" mb-8 bg-transparent border-0 shadow-none">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
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
                            className="rounded-sm"
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
                            className="rounded-sm"
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
                      <FormItem>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="rounded-sm">
                              <SelectValue placeholder="Select delivery method" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Home Delivery">
                              Home Delivery
                            </SelectItem>
                            <SelectItem value="Pickup">Store Pickup</SelectItem>
                          </SelectContent>
                        </Select>
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
                                    className="rounded-sm"
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
                                    className="rounded-sm"
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
                                    className="rounded-sm"
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
                                    className="rounded-sm"
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
                                    className="rounded-sm"
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
                                    className="rounded-sm"
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
                            <div className="p-4 border rounded-sm bg-gray-50 dark:bg-gray-900">
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem
                                  value="paystack"
                                  id="paystack"
                                  className="h-4 w-4 cursor-pointer"
                                />
                                <FormLabel
                                  htmlFor="paystack"
                                  className="!mt-0 cursor-pointer"
                                >
                                  Paystack (Cards, Bank Transfer, etc.)
                                </FormLabel>
                              </div>
                              <p className="text-sm text-muted-foreground mt-2">
                                Pay securely with your card, bank account, or
                                mobile money.
                              </p>
                            </div>

                            <div className="p-4 border rounded-sm bg-gray-50 dark:bg-gray-900">
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem
                                  value="pay-on-delivery"
                                  id="pay-on-delivery"
                                  className="h-4 w-4 text-muted-foreground disabled:cursor-not-allowed"
                                  disabled
                                />
                                <FormLabel
                                  htmlFor="pay-on-delivery"
                                  className="!mt-0 text-muted-foreground cursor-not-allowed"
                                >
                                  Pay on Delivery{" "}
                                  <span className="italic">
                                    (Currently Unavailable)
                                  </span>
                                </FormLabel>
                              </div>
                              <p className="text-sm text-muted-foreground/70 mt-2">
                                Pay cash when your order arrives.
                                {/* Pay cash when your order arrives. Additional ₦
                                {shippingFee} delivery fee applies. */}
                              </p>
                            </div>
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

                  <div className="pt-6">
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
          <div className="lg:w-1/3">
            <Card className="p-6 sticky top-4">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>

              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.product._id} className="flex justify-between">
                    <span>
                      {item.product.name} × {item.qty}
                    </span>
                    <span>{formatCurrency(item.product.price * item.qty)}</span>
                  </div>
                ))}

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>
                      {shippingFee > 0 ? formatCurrency(shippingFee) : "Free"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>{formatCurrency(tax)}</span>
                  </div>
                </div>

                <div className="border-t pt-4 flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
