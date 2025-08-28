import { Metadata } from "next";

const pageTitle = "Return Policy";

export const metadata: Metadata = {
  title: pageTitle,
  description: "Our return and shopping policy for DWEC WINERY products",
};

export default function ReturnPolicy() {
  return (
    <div className="container max-w-4xl mx-auto px-4 py-8 text-[15px] lg:py-16 ">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Return & Shopping Policy</h1>
        <p className="text-stone-500 dark:text-stone-400">
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

          <address className="not-italic space-y-1">
            <p>📍 DWEC WINERY</p>
            <p>
              86A Woji Road, GRA Phase 2, Port Harcourt, Rivers State, Nigeria
            </p>
            <p>📞 +2347 03625 4646, +2348 05823 2688</p>
            <p>📧 Email: dwecwinery@gmail.com; info@dwecwinery.ng</p>
          </address>
        </div>
      </div>
    </div>
  );
}
