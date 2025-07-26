import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Return Policy | DWEC WINERY",
  description: "Our return and shopping policy for DWEC WINERY products",
};

export default function ReturnPolicy() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Return & Shopping Policy</h1>
        <p className="text-muted-foreground">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </div>

      <div className="prose prose-lg dark:prose-invert">
        <h2 className="text-2xl font-semibold mb-4">RETURN POLICY</h2>

        <ul className="space-y-4 mb-8">
          <li className="flex gap-4">
            <div className="flex-shrink-0 font-bold">•</div>
            <div>
              <strong>Damaged or Incorrect Products:</strong> Any claims
              regarding damaged or incorrect items must be reported upon receipt
              of product. Refunds or replacements will be processed accordingly.
            </div>
          </li>
          <li className="flex gap-4">
            <div className="flex-shrink-0 font-bold">•</div>
            <div>
              <strong>Eligibility for Returns:</strong> Only products in their
              original, unopened, and undamaged condition are eligible for
              returns within 24 hours of purchase.
            </div>
          </li>
          <li className="flex gap-4">
            <div className="flex-shrink-0 font-bold">•</div>
            <div>
              <strong>Non-Returnable Items:</strong> Opened bottles, perishable
              goods, and promotional items are not eligible for return or
              refund.
            </div>
          </li>
          <li className="flex gap-4">
            <div className="flex-shrink-0 font-bold">•</div>
            <div>
              <strong>Refund Process:</strong> Approved refunds will be
              processed within 3–5 business days via the original payment
              method.
            </div>
          </li>
        </ul>

        <div className="border-t pt-6 mt-8">
          <p className="text-muted-foreground mb-4">
            For return requests or questions about our policy, please contact
            our customer service.
          </p>
          <Button asChild variant="outline">
            <Link href="/contact">Contact Us</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
