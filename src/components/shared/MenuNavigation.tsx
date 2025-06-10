"use client";

import Link from "next/link";
import * as React from "react";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";
import { Button } from "../ui/button";
import { Menu } from "lucide-react";
// import useCategories from "@/hooks/use-categories";

const featuredProducts = [
  {
    title: "New Arrivals",
    href: "/products/new",
    description: "Discover our latest products",
  },
  {
    title: "Best Sellers",
    href: "/products/bestsellers",
    description: "Our most popular items",
  },
  {
    title: "Sale Items",
    href: "/products/sale",
    description: "Special discounts",
  },
];

const MenuNavigation = ({ mobileView = false }: { mobileView?: boolean }) => {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  // const { categories, isPending } = useCategories();

  const isActive = (href: string) => {
    return (
      href === pathname ||
      href === pathname.replace(/\/$/, "") ||
      pathname.startsWith(href + "/")
    );
  };

  if (mobileView || isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[300px]">
          <nav className="flex flex-col space-y-4 pt-6">
            <MobileNavItem href="/" isActive={isActive("/")}>
              Home
            </MobileNavItem>

            <div className="space-y-2">
              <p className="px-4 text-sm font-medium text-muted-foreground">
                Products
              </p>
              {featuredProducts.map((item) => (
                <MobileNavItem
                  key={item.href}
                  href={item.href}
                  isActive={isActive(item.href)}
                >
                  {item.title}
                </MobileNavItem>
              ))}
            </div>

            <MobileNavItem href="/about-us" isActive={isActive("/about-us")}>
              About Us
            </MobileNavItem>

            <MobileNavItem href="/blog" isActive={isActive("/blog")}>
              Blog
            </MobileNavItem>

            <MobileNavItem
              href="/contact-us"
              isActive={isActive("/contact-us")}
            >
              Contact Us
            </MobileNavItem>
          </nav>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <NavigationMenu viewport={false}>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink
            asChild
            className={cn(
              "border-b-3 border-b-transparent",
              navigationMenuTriggerStyle(),
              isActive("/") && "border-b-primary font-semibold"
            )}
          >
            <Link href="/">Home</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>All Products</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-2 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              {featuredProducts.map((component) => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  href={component.href}
                >
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink
            asChild
            className={cn(
              "border-b-3 border-b-transparent",
              navigationMenuTriggerStyle(),
              isActive("/about-us") && "border-b-primary font-semibold"
            )}
          >
            <Link href="/about-us">About Us</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink
            asChild
            className={cn(
              "border-b-3 border-b-transparent",
              navigationMenuTriggerStyle(),
              isActive("/blog") && "border-b-primary font-semibold"
            )}
          >
            <Link href="/blog">Blog</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink
            asChild
            className={cn(
              "border-b-3 border-b-transparent",
              navigationMenuTriggerStyle(),
              isActive("/contact-us") && "border-b-primary font-semibold"
            )}
          >
            <Link href="/contact-us">Contact Us</Link>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default MenuNavigation;

function ListItem({
  title,
  children,
  href,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link href={href}>
          <div className="text-sm leading-none font-medium">{title}</div>
          <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}

const MobileNavItem = ({
  href,
  isActive,
  children,
}: {
  href: string;
  isActive: boolean;
  children: React.ReactNode;
}) => {
  return (
    <Link
      href={href}
      className={cn(
        "block px-4 py-2 text-sm font-medium transition-colors hover:text-primary",
        isActive ? "text-primary" : "text-muted-foreground"
      )}
    >
      {children}
    </Link>
  );
};
