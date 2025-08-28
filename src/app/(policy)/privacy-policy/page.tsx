import { Metadata } from "next";
import React from "react";

const pageTitle = "Privacy Policy";

export const metadata: Metadata = {
  title: pageTitle,
  description: "Our privacy policy for using DWEC WINERY services",
};

const PrivacyPolicyPage = () => {
  return (
    <div className="container max-w-4xl mx-auto px-4 py-8 text-[15px] lg:py-16">
      <h1 className="text-3xl font-bold text-center mb-6">
        Privacy Policy for DWEC WINERY
      </h1>
      <p className="text-stone-500 dark:text-stone-400 mb-8">
        Effective Date: Jan 01, 2025
      </p>

      <div className="mb-8">
        <p className="mb-4">
          DWEC WINERY (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is
          committed to protecting the privacy of our customers and users
          (&quot;you&quot; or &quot;your&quot;) who access our website, mobile
          application, or any other digital service (collectively, the
          &quot;Platform&quot;). This Privacy Policy outlines how we collect,
          use, disclose, and protect your personal information.
        </p>
        <div className="h-px bg-gray-200 my-6"></div>
      </div>

      <div className="space-y-8">
        {/* Section 1 */}
        <div>
          <h2 className="text-xl font-semibold mb-4">
            1. Information We Collect
          </h2>
          <p className="mb-4">
            We may collect the following types of personal and non-personal
            information:
          </p>

          <h3 className="font-medium mb-2">a. Personal Information</h3>
          <ul className="list-disc pl-6 mb-4 space-y-1">
            <li>Full Name</li>
            <li>Contact Details (email, phone number, address)</li>
            <li>Date of Birth (where required for age verification)</li>
            <li>
              Payment Information (handled securely via third-party processors)
            </li>
            <li>Delivery Details</li>
            <li>
              Any other information voluntarily provided through forms, customer
              service, or feedback
            </li>
          </ul>

          <h3 className="font-medium mb-2">b. Non-Personal Information</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>Device type and operating system</li>
            <li>Browser type and version</li>
            <li>IP address</li>
            <li>Cookies and usage data</li>
            <li>Location data (if enabled)</li>
          </ul>
        </div>

        {/* Section 2 */}
        <div>
          <h2 className="text-xl font-semibold mb-4">
            2. How We Use Your Information
          </h2>
          <p>We use your information to:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Process and deliver orders</li>
            <li>Communicate with you about your orders or account</li>
            <li>Improve our services and user experience</li>
            <li>Provide customer support</li>
            <li>
              Send promotional emails or special offers (with your consent)
            </li>
            <li>Comply with legal and regulatory requirements</li>
            <li>Prevent fraud or misuse of our platform</li>
          </ul>
        </div>

        {/* Section 3 */}
        <div>
          <h2 className="text-xl font-semibold mb-4">
            3. Sharing and Disclosure
          </h2>
          <p className="mb-2">
            We do not sell your personal information. We may share your data
            only with:
          </p>
          <ul className="list-disc pl-6 mb-2 space-y-1">
            <li>
              Trusted service providers who assist in payment processing, order
              fulfillment, hosting, marketing, and delivery
            </li>
            <li>
              Regulatory or law enforcement agencies, when legally required
            </li>
            <li>Third parties, only with your explicit consent</li>
          </ul>
          <p>
            All third parties are bound by confidentiality obligations and are
            required to use your data only for the services we specify.
          </p>
        </div>

        {/* Section 4 */}
        <div>
          <h2 className="text-xl font-semibold mb-4">4. Data Security</h2>
          <p className="mb-2">
            We implement industry-standard security measures to protect your
            personal information, including:
          </p>
          <ul className="list-disc pl-6 mb-2 space-y-1">
            <li>SSL encryption</li>
            <li>Secure server infrastructure</li>
            <li>Restricted access to personal data</li>
          </ul>
          <p>
            Despite our efforts, no method of transmission over the internet is
            100% secure, and we cannot guarantee absolute security.
          </p>
        </div>

        {/* Section 5 */}
        <div>
          <h2 className="text-xl font-semibold mb-4">
            5. Cookies and Tracking Technologies
          </h2>
          <p>
            We use cookies to enhance user experience, analyze site traffic, and
            deliver personalized content. You can disable cookies in your
            browser settings, but doing so may affect site functionality.
          </p>
        </div>

        {/* Section 6 */}
        <div>
          <h2 className="text-xl font-semibold mb-4">6. Your Rights</h2>
          <p className="mb-2">You have the right to:</p>
          <ul className="list-disc pl-6 mb-4 space-y-1">
            <li>Access the personal data we hold about you</li>
            <li>Request correction or deletion of your data</li>
            <li>
              Withdraw your consent for data processing (where applicable)
            </li>
            <li>Opt-out of marketing communications at any time</li>
          </ul>
          <p>To exercise these rights, please contact us at:</p>
          <ul className="mt-2 space-y-1">
            <li>📧 Email: dwecwinery@gmail.com; info@dwecwinery.ng</li>
            <li>📞 +2347 03625 4646, +2348 05823 2688</li>
          </ul>
        </div>

        {/* Section 7 */}
        <div>
          <h2 className="text-xl font-semibold mb-4">7. Age Restriction</h2>
          <p>
            Our services are intended for individuals who are of legal drinking
            age in their country of residence. We do not knowingly collect data
            from anyone under this age.
          </p>
        </div>

        {/* Section 8 */}
        <div>
          <h2 className="text-xl font-semibold mb-4">
            8. International Data Transfers
          </h2>
          <p>
            If you are accessing our services from outside Nigeria, your data
            may be processed and stored in Nigeria or other jurisdictions with
            appropriate safeguards.
          </p>
        </div>

        {/* Section 9 */}
        <div>
          <h2 className="text-xl font-semibold mb-4">
            9. Changes to This Policy
          </h2>
          <p>
            We reserve the right to update this Privacy Policy at any time.
            Changes will be posted on this page with an updated &quot;Effective
            Date.&quot; We encourage you to review this policy periodically.
          </p>
        </div>

        {/* Section 10 */}
        <div>
          <h2 className="text-xl font-semibold mb-4">10. Contact Us</h2>
          <p className="mb-2">
            For any questions, concerns, or data requests regarding this Privacy
            Policy, contact us at:
          </p>
          <address className="not-italic">
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
};

export default PrivacyPolicyPage;
