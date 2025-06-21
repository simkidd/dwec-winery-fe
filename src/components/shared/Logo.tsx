"use client";
import { useTheme } from "next-themes";
import Image from "next/image";
import React from "react";

const Logo = ({ ...props }: React.ComponentProps<"div">) => {
  const { theme } = useTheme();
  return (
    <div className="h-8 md:h-10" {...props}>
      <Image
        src={theme === "light" ? "/logo/logo-red.png" : "/logo/logo-white.png"}
        alt="logo"
        width={300}
        height={150}
        className="object-contain w-full h-full"
      />
    </div>
  );
};

export default Logo;
