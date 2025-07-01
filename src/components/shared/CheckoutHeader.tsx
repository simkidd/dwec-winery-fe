"use client"
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const CheckoutHeader = () => {
  const { theme } = useTheme();

  return (
    <div className="w-full border-b">
      <div className="container mx-auto px-4 py-4 flex">
        <div className="flex-shrink-0 font-bold text-lg text-primary">
          <Link href={"/"}>
            <div className="h-8 md:h-10">
              <Image
                src={
                  theme === "light"
                    ? "/logo/logo-red.png"
                    : "/logo/logo-white.png"
                }
                alt="logo"
                width={300}
                height={150}
                className="object-contain w-full h-full"
              />
            </div>
          </Link>
        </div>
        <div></div>
      </div>
    </div>
  );
};

export default CheckoutHeader;
