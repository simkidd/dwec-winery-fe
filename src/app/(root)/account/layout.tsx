import AccountNav from "@/components/account/AccountNav";
import CustomBreadcrumbs from "@/components/shared/CustomBreadcrumbs";
import PageHeader from "@/components/shared/PageHeader";
import { Separator } from "@/components/ui/separator";
import { config } from "@/utils/config";
import { Metadata } from "next";

const { SITE_NAME } = config;

const pageTitle = "Account";

export const metadata: Metadata = {
  title: {
    default: SITE_NAME,
    template: `%s | ${pageTitle} | ${SITE_NAME}`,
  },
};

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full">
      <CustomBreadcrumbs />
      <PageHeader
        title="My Account"
        // description="We'd love to hear from you! Get in touch with our team."
        className="hidden md:flex"
      />

      <div className="container mx-auto px-4 flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0 py-8 md:py-16">
        <AccountNav />
        <Separator className="md:hidden" />
        <main className="flex-1 lg:max-w-3xl">{children}</main>
      </div>
    </div>
  );
}
