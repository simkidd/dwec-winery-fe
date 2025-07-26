import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms & Conditions | DWEC WINERY",
  description: "Our terms and conditions for using DWEC WINERY services",
};

export default function TermsAndConditions() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Terms & Conditions</h1>
        <p className="text-muted-foreground">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>

      <div className="prose prose-lg dark:prose-invert">
        <p className="mb-6">
          By engaging with DWEC WINERY&apos;s services, you agree to comply with
          the following terms and conditions:
        </p>

        <ul className="space-y-4 mb-8">
          <li className="flex gap-4">
            <div className="flex-shrink-0 font-bold">•</div>
            <div>
              <strong>Age Restriction:</strong> Customers must be at least 18
              years of age to purchase alcoholic beverages. Proof of age may be
              required upon delivery.
            </div>
          </li>
          <li className="flex gap-4">
            <div className="flex-shrink-0 font-bold">•</div>
            <div>
              <strong>Product Availability:</strong> All products are subject to
              availability. In the event of stock depletion, suitable
              alternatives or a full refund will be offered.
            </div>
          </li>
          <li className="flex gap-4">
            <div className="flex-shrink-0 font-bold">•</div>
            <div>
              <strong>Pricing & Payment:</strong> Prices are listed in Nigerian
              Naira and may be subject to change without prior notice. Payments
              must be made in full before order processing.
            </div>
          </li>
          <li className="flex gap-4">
            <div className="flex-shrink-0 font-bold">•</div>
            <div>
              <strong>Delivery & Shipping:</strong> We provide nationwide
              delivery with estimated timeframes displayed at checkout. While we
              strive for timely delivery, delays due to unforeseen circumstances
              are not our liability.
            </div>
          </li>
          <li className="flex gap-4">
            <div className="flex-shrink-0 font-bold">•</div>
            <div>
              <strong>Liability Disclaimer:</strong> DWEC WINERY shall not be
              held responsible for any damages, misuse, or mishandling of
              products post-delivery.
            </div>
          </li>
          <li className="flex gap-4">
            <div className="flex-shrink-0 font-bold">•</div>
            <div>
              <strong>Policy Amendments:</strong> We reserve the right to revise
              our terms and conditions at any time. Customers are encouraged to
              review updates periodically.
            </div>
          </li>
        </ul>

        <div className="border-t pt-6 mt-8">
          <p className="text-muted-foreground mb-4">
            For any questions regarding these terms, please contact our customer
            service.
          </p>
          <Button asChild variant="outline">
            <Link href="/contact">Contact Us</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
