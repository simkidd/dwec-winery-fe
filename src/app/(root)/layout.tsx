import Footer from "@/components/shared/Footer";
import Header from "@/components/shared/Header";
import React, { Suspense } from "react";
import Loading from "../loading";

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div>
      <Suspense fallback={<Loading />}>
        <Header />
        <main className="w-full min-h-dvh">{children}</main>
        <Footer />
      </Suspense>
    </div>
  );
}
