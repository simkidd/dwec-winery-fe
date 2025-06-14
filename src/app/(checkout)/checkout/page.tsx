"use client";
import CustomBreadcrumbs from "@/components/shared/CustomBreadcrumbs";
import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createOrder } from "@/lib/api/order";
import { loadPaystack } from "@/lib/paystack";
import { useAppSelector } from "@/store/hooks";
import { formatCurrency } from "@/utils/helpers";
import { ChevronLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    PaystackPop: any;
  }
}

const CheckoutPage = () => {
  const router = useRouter();
  const { items } = useAppSelector((state) => state.cart);
  const { user } = useAppSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(false);
  const [paystackLoaded, setPaystackLoaded] = useState(false);
  const [formData, setFormData] = useState({
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
    agreeTerms: false,
  });

  // Load Paystack script when Paystack is selected
  useEffect(() => {
    if (formData.paymentMethod === "paystack") {
      loadPaystack().then(() => setPaystackLoaded(true));
    }
  }, [formData.paymentMethod]);

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.qty,
    0
  );
  const shippingFee = formData.deliveryMethod === "Home Delivery" ? 5 : 0;
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + shippingFee + tax;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDeliveryDetailsChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      deliveryDetails: {
        ...prev.deliveryDetails,
        [name]: value,
      },
    }));
  };

  const initializePaystackPayment = async (orderId?: string) => {
    if (!window.PaystackPop) {
      toast.error("Payment processor not loaded. Please try again.");
      return;
    }

    const handler = window.PaystackPop.setup({
      key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
      email: formData.email,
      amount: total * 100, // Paystack expects amount in kobo
      currency: "NGN",
      ref: `ORDER-${orderId}-${Date.now()}`,
      callback: (response: any) => {
        // Verify payment on your server
        handlePaymentVerification(orderId, response.reference);
      },
      onClose: () => {
        toast.info(
          "Payment window closed. Your order is still pending payment."
        );
      },
    });

    handler.openIframe();
  };

  const handlePaymentVerification = async (
    orderId: string,
    reference: string
  ) => {
    try {
      // In a real app, you would verify the payment with your backend
      // await verifyPayment(orderId, reference);

      toast.success("Payment verified successfully!");
      router.push(`/order-confirmation/${orderId}`);
    } catch (error) {
      console.error("Payment verification failed:", error);
      toast.error("Payment verification failed. Please contact support.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!formData.agreeTerms) {
      toast.error("Please agree to the terms and conditions");
      setIsLoading(false);
      return;
    }

    try {
      // Create order first
      const orderData = {
        user: user?._id,
        products: items.map((item) => ({
          product: item.product._id,
          qty: item.qty,
        })),
        deliveryMethod: formData.deliveryMethod,
        deliveryDetails: {
          ...formData.deliveryDetails,
          phoneNumber: formData.phoneNumber,
          email: formData.email,
          fee: shippingFee,
        },
        totalAmountPaid: total,
        paymentMethod:
          formData.paymentMethod === "paystack"
            ? "Paystack"
            : "Pay on Delivery",
        paymentReference:
          formData.paymentMethod === "paystack" ? "" : "POD-" + Date.now(),
        paymentData: "",
        trackingStatus: "Processing",
        trackingLevel: 1,
        isCancelled: false,
        isCompleted: false,
        isResolved: false,
      };

      const order = await createOrder();

      if (formData.paymentMethod === "paystack") {
        const order = await createOrder();
        await initializePaystackPayment(order._id);
      } else {
        // Pay on Delivery flow
        const order = await createOrder();
        toast.success(
          "Order placed successfully! You'll pay when your order arrives."
        );
        router.push(`/order-confirmation/${order._id}`);
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setIsLoading(false);
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
      <PageHeader title="Checkout" />

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Checkout Form */}
          <div className="lg:w-2/3">
            <Button variant="ghost" className="mb-6 pl-0" asChild>
              <Link href="/cart" className="flex items-center">
                <ChevronLeft className="h-5 w-5 mr-2" />
                Back to Cart
              </Link>
            </Button>

            <Card className="p-6 mb-8 bg-transparent border-0">
              <form onSubmit={handleSubmit} className="space-y-6">
                <h2 className="text-xl font-bold">Contact Information</h2>
                <Input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="rounded-sm"
                />
                <Input
                  type="tel"
                  name="phoneNumber"
                  placeholder="Phone Number"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                  className="rounded-sm"
                />

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="save-info"
                    checked={formData.saveInfo}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, saveInfo: !!checked })
                    }
                  />
                  <label htmlFor="save-info" className="text-sm">
                    Save this information for next time
                  </label>
                </div>

                <h2 className="text-xl font-bold pt-4 border-t">
                  Delivery Method
                </h2>
                <Select
                  value={formData.deliveryMethod}
                  onValueChange={(value) =>
                    setFormData({ ...formData, deliveryMethod: value })
                  }
                >
                  <SelectTrigger className="rounded-sm">
                    <SelectValue placeholder="Select delivery method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Home Delivery">Home Delivery</SelectItem>
                    <SelectItem value="Pickup">Store Pickup</SelectItem>
                  </SelectContent>
                </Select>

                {formData.deliveryMethod === "Home Delivery" && (
                  <>
                    <h2 className="text-xl font-bold pt-4 border-t">
                      Shipping Address
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        name="streetAddress"
                        placeholder="Street Address"
                        value={formData.deliveryDetails.streetAddress}
                        onChange={handleDeliveryDetailsChange}
                        required
                        className="rounded-sm"
                      />
                      <Input
                        name="suiteNumber"
                        placeholder="Apt, Suite, etc. (Optional)"
                        value={formData.deliveryDetails.suiteNumber}
                        onChange={handleDeliveryDetailsChange}
                        className="rounded-sm"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Input
                        name="city"
                        placeholder="City"
                        value={formData.deliveryDetails.city}
                        onChange={handleDeliveryDetailsChange}
                        required
                        className="rounded-sm"
                      />
                      <Input
                        name="area"
                        placeholder="State/Province"
                        value={formData.deliveryDetails.area}
                        onChange={handleDeliveryDetailsChange}
                        required
                        className="rounded-sm"
                      />
                      <Input
                        name="zipCode"
                        placeholder="ZIP/Postal Code"
                        value={formData.deliveryDetails.zipCode}
                        onChange={handleDeliveryDetailsChange}
                        required
                        className="rounded-sm"
                      />
                    </div>
                    <Input
                      name="note"
                      placeholder="Delivery Notes (Optional)"
                      value={formData.deliveryDetails.note}
                      onChange={handleDeliveryDetailsChange}
                      className="rounded-sm"
                    />
                  </>
                )}

                <h2 className="text-xl font-bold pt-4 border-t">
                  Payment Method
                </h2>
                <div className="space-y-4">
                  {/* Paystack Option */}
                  <div className="p-4 border rounded-sm bg-gray-50 dark:bg-gray-900">
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="paystack"
                        name="payment"
                        value="paystack"
                        checked={formData.paymentMethod === "paystack"}
                        onChange={() =>
                          setFormData({
                            ...formData,
                            paymentMethod: "paystack",
                          })
                        }
                        className="h-4 w-4"
                      />
                      <label htmlFor="paystack" className="font-medium">
                        Paystack (Cards, Bank Transfer, etc.)
                      </label>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Pay securely with your card, bank account, or mobile
                      money.
                    </p>
                  </div>

                  {/* Pay on Delivery Option */}
                  <div className="p-4 border rounded-sm bg-gray-50 dark:bg-gray-900">
                    <div className="flex items-center space-x-2">
                      <input
                        type="radio"
                        id="pay-on-delivery"
                        name="payment"
                        value="pay-on-delivery"
                        checked={formData.paymentMethod === "pay-on-delivery"}
                        onChange={() =>
                          setFormData({
                            ...formData,
                            paymentMethod: "pay-on-delivery",
                          })
                        }
                        className="h-4 w-4"
                      />
                      <label htmlFor="pay-on-delivery" className="font-medium">
                        Pay on Delivery
                      </label>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Pay cash when your order arrives. Additional ₦
                      {shippingFee} delivery fee applies.
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="terms"
                      checked={formData.agreeTerms}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, agreeTerms: !!checked })
                      }
                      required
                    />
                    <label htmlFor="terms" className="text-sm">
                      I agree to the Terms and Conditions and Privacy Policy
                    </label>
                  </div>
                </div>

                <div className="pt-6">
                  <Button
                    type="submit"
                    className="w-full rounded-sm"
                    disabled={
                      isLoading ||
                      (formData.paymentMethod === "paystack" && !paystackLoaded)
                    }
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : formData.paymentMethod === "pay-on-delivery" ? (
                      `Place Order (Pay ${formatCurrency(total)} on Delivery)`
                    ) : (
                      `Pay ${formatCurrency(total)} Now`
                    )}
                  </Button>
                </div>
              </form>
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
                    <span>
                      {formatCurrency(item.product.price * item.qty)}
                    </span>
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
