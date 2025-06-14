"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

const tabs = [
  { name: "Personal Information", href: "/account" },
  { name: "My Orders", href: "/account/orders" },
  // { name: "Manage Address", href: "/account/*" },
  { name: "Change Password", href: "/account/security" },
];

const AccountNav = () => {
  const pathname = usePathname();

  const isItemActive = (itemUrl: string) => {
    if (pathname === itemUrl) return true; // Exact match first
    return (
      pathname.startsWith(itemUrl) &&
      pathname.split("/").length === itemUrl.split("/").length
    );
  };
  return (
    <aside className="lg:w-1/5">
      <nav className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
        <ul className="space-y-1">
          {tabs.map((tab) => (
            <li key={tab.name}>
              <Button
                variant={isItemActive(tab.href) ? "default" : "outline"}
                size={"lg"}
                className="w-full justify-start"
                asChild
              >
                <Link
                  href={tab.href}
                  className={cn()}
                >
                  {tab.name}
                </Link>
              </Button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default AccountNav;
