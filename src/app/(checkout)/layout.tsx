import CheckoutHeader from "@/components/shared/CheckoutHeader";
import React, { Suspense } from "react";
import Loading from "../loading";

export default async function CheckoutLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div>
      <Suspense fallback={<Loading />}>
        <CheckoutHeader />
        <div className="w-full min-h-dvh">
          <main>{children}</main>
        </div>
      </Suspense>
    </div>
  );
}
