import React, { Suspense } from "react";

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div>
      <Suspense fallback={"Loaading..."}>{children}</Suspense>
    </div>
  );
}
