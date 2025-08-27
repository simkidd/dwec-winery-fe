"use client";
import { Mail, Phone } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const PolicyHeader = () => {
  const { theme } = useTheme();
  return (
    <div className="w-full border-b">
      {/* Top Contact Bar */}
      <div className="bg-gray-50 dark:bg-stone-800 text-muted-foreground text-xs hidden lg:block border-b">
        <div className="container mx-auto px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a
              href="tel:+2348123456789"
              className="flex items-center gap-2 hover:underline"
            >
              <Phone className="h-4 w-4" />
              <span>+234 703 625 4646</span>
            </a>
            <a
              href="mailto:info@dwecwinery.com"
              className="flex items-center gap-2 hover:underline"
            >
              <Mail className="h-4 w-4" />
              <span>dwecwinery@gmail.com</span>
            </a>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <span>Free shipping on specific orders</span>
            <span>|</span>
            <span>Same-day delivery in Rivers State</span>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-4 flex">
        <div className="flex items-center gap-4">
          {/* Logo */}
          <div className=" flex font-bold text-lg">
            <Link href={"/"}>
              <div className="h-8 lg:h-10">
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
        </div>

        <div></div>
      </div>
    </div>
  );
};

export default PolicyHeader;
