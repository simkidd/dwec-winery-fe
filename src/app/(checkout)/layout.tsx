import CheckoutHeader from "@/components/shared/CheckoutHeader";
import React, { Suspense } from "react";

export default async function CheckoutLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div>
      <Suspense fallback={"Loaading..."}>
        <CheckoutHeader />
        <div className="w-full min-h-dvh">
          <main>{children}</main>
        </div>
      </Suspense>
    </div>
  );
}
