import Footer from "@/components/shared/Footer";
import ScrollToTop from "@/components/shared/ScrollToTop";
import { Suspense } from "react";
import Loading from "../loading";
import PolicyHeader from "@/components/shared/PolicyHeader";

export default async function PolicyLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div>
      <Suspense fallback={<Loading />}>
        <PolicyHeader />
        <main className="w-full min-h-dvh">{children}</main>
        <ScrollToTop />
        <Footer />
      </Suspense>
    </div>
  );
}
