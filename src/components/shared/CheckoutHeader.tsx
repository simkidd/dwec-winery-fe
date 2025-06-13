import Link from "next/link";
import React from "react";

const CheckoutHeader = () => {
  return (
    <div className="w-full border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex-shrink-0 font-bold text-lg text-primary">
          <Link href={'/'}>Logo</Link>
        </div>
        <div></div>
      </div>
    </div>
  );
};

export default CheckoutHeader;
