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
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import useLogout from "@/hooks/use-logout";
import { useIsMobile } from "@/hooks/use-mobile";
import { IUser } from "@/interfaces/user.interface";
import { cn } from "@/lib/utils";
import { User } from "iconsax-reactjs";
import { ChevronLeft, ChevronRight, LogIn, Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "../ui/button";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "./Logo";
import useCategories from "@/hooks/use-categories";

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

type MenuState = "main" | "products" | "categories";

const MenuNavigation = ({
  mobileView = false,
  user,
}: {
  mobileView?: boolean;
  user: IUser;
}) => {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const { signOut } = useLogout();
  const { categories } = useCategories();

  const [isOpen, setIsOpen] = useState(false);
  const [menuState, setMenuState] = useState<MenuState>("main");
  const [menuHistory, setMenuHistory] = useState<MenuState[]>(["main"]);
  const [direction, setDirection] = useState(1);

  const isActive = (href: string) => {
    return (
      href === pathname ||
      href === pathname.replace(/\/$/, "") ||
      pathname.startsWith(href + "/")
    );
  };

  const navigateTo = (menu: MenuState) => {
    setDirection(1);
    setMenuHistory([...menuHistory, menu]);
    setMenuState(menu);
  };

  const goBack = () => {
    if (menuHistory.length > 1) {
      setDirection(-1);
      const newHistory = [...menuHistory];
      newHistory.pop();
      setMenuHistory(newHistory);
      setMenuState(newHistory[newHistory.length - 1]);
    }
  };

  const handleSheetOpenChange = (open: boolean) => {
    if (!open) {
      setDirection(1);
      setMenuState("main");
      setMenuHistory(["main"]);
    }
    setIsOpen(open);
  };

  const closeMenu = () => {
    setIsOpen(false);
    setDirection(1);
    setMenuState("main");
    setMenuHistory(["main"]);
  };

  const renderMainMenu = () => (
    <motion.div
      key="main"
      initial={{ x: -100 * direction, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 100 * direction, opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="absolute inset-0 space-y-4"
    >
      {/* Account Section */}
      <div className="px-4 pb-4 border-b mt-12">
        {user ? (
          <div className="flex items-center space-x-4">
            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-muted">
              <User className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium">{user?.firstname}</p>
              <Link
                href="/account"
                className="text-xs text-muted-foreground hover:text-primary"
                onClick={closeMenu}
              >
                View Account
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex flex-col space-y-2">
            <Link
              href="/login"
              className="flex items-center space-x-2 text-sm font-medium text-muted-foreground"
              onClick={closeMenu}
            >
              <LogIn className="h-4 w-4" />
              <span>Sign In / Register</span>
            </Link>
          </div>
        )}
      </div>

      <MobileNavItem href="/" isActive={isActive("/")} onClick={closeMenu}>
        Home
      </MobileNavItem>

      <div
        className="flex items-center px-4 py-2 text-sm font-medium text-muted-foreground cursor-pointer hover:text-primary"
        onClick={() => navigateTo("products")}
      >
        Products
        <span className="ml-auto">
          <ChevronRight className="h-5 w-5" />
        </span>
      </div>

      <MobileNavItem
        href="/about-us"
        isActive={isActive("/about-us")}
        onClick={closeMenu}
      >
        About Us
      </MobileNavItem>

      <MobileNavItem
        href="/blog"
        isActive={isActive("/blog")}
        onClick={closeMenu}
      >
        Blog
      </MobileNavItem>

      <MobileNavItem
        href="/contact-us"
        isActive={isActive("/contact-us")}
        onClick={closeMenu}
      >
        Contact Us
      </MobileNavItem>

      {user && (
        <div className="space-y-2 pt-4 border-t">
          <MobileNavItem
            href="/account/orders"
            isActive={isActive("/account/orders")}
            onClick={closeMenu}
          >
            My Orders
          </MobileNavItem>
          <MobileNavItem
            href="/account/favourites"
            isActive={isActive("/account/favourites")}
            onClick={closeMenu}
          >
            Saved items
          </MobileNavItem>
          <div>
            <span
              className="block px-4 py-2 text-sm font-medium transition-colors text-destructive cursor-pointer"
              onClick={() => {
                signOut();
                setIsOpen(false);
              }}
            >
              Sign Out
            </span>
          </div>
        </div>
      )}
    </motion.div>
  );

  const renderProductsMenu = () => (
    <motion.div
      key="products"
      initial={{ x: 100 * direction, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -100 * direction, opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="absolute inset-0 space-y-4"
    >
      <div className="flex items-center px-4 py-2 mt-1 border-b">
        <Button
          size="icon"
          variant="ghost"
          className="cursor-pointer rounded-full"
          onClick={goBack}
        >
          <ChevronLeft />
        </Button>
        <span className="ml-2 font-medium">Products</span>
      </div>

      {featuredProducts.map((item) => (
        <MobileNavItem
          key={item.href}
          href={item.href}
          isActive={isActive(item.href)}
          onClick={closeMenu}
        >
          {item.title}
        </MobileNavItem>
      ))}

      <div
        className="flex items-center px-4 py-2 text-sm font-medium text-muted-foreground cursor-pointer hover:text-primary"
        onClick={() => navigateTo("categories")}
      >
        All Categories
        <span className="ml-auto">
          <ChevronRight className="h-5 w-5" />
        </span>
      </div>
    </motion.div>
  );

  const renderCategoriesMenu = () => (
    <motion.div
      key="categories"
      initial={{ x: 100 * direction, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -100 * direction, opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="absolute inset-0 space-y-4"
    >
      <div className="flex items-center px-4 py-2 mt-1 border-b">
        <Button
          size="icon"
          variant="ghost"
          className="cursor-pointer rounded-full"
          onClick={goBack}
        >
          <ChevronLeft />
        </Button>
        <span className="ml-2 font-medium">All Categories</span>
      </div>

      {categories?.map((category) => (
        <MobileNavItem
          key={category._id}
          href={`/category/${category.slug}`}
          isActive={pathname.includes(`/category/${category.slug}`)}
          onClick={closeMenu}
        >
          {category.name}
        </MobileNavItem>
      ))}
    </motion.div>
  );

  if (mobileView || isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={handleSheetOpenChange}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden cursor-pointer"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-full">
          <div className="relative h-full overflow-hidden">
            <AnimatePresence initial={false} custom={direction}>
              {menuState === "main" && renderMainMenu()}
              {menuState === "products" && renderProductsMenu()}
              {menuState === "categories" && renderCategoriesMenu()}
            </AnimatePresence>
          </div>

          <div className="absolute bottom-10 right-24 scale-[450%] pointer-events-none opacity-10">
            <Logo />
          </div>
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
            <div className="grid w-[500px] gap-3 p-4 md:w-[600px] md:grid-cols-2 lg:w-[700px]">
              <div>
                <h3 className="text-lg font-semibold mb-2">Featured</h3>
                <ul className="">
                  {featuredProducts.map((item) => (
                    <ListItem
                      key={item.title}
                      title={item.title}
                      href={item.href}
                    >
                      {item.description}
                    </ListItem>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Categories</h3>
                <ul className="">
                  {categories?.map((category) => (
                    <ListItem
                      key={category._id}
                      title={category.name}
                      href={`/category/${category.slug}`}
                      isCategory
                    ></ListItem>
                  ))}
                </ul>
              </div>
            </div>
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
  isCategory = false,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & {
  href: string;
  isCategory?: boolean;
}) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild className="hover:bg-transparent hover:text-primary">
        <Link
          href={href}
          className="block select-none space-y-1 rounded-md p-2 leading-none w-fit"
        >
          <div
            className={cn(
              "text-sm font-medium leading-none",
              isCategory && "font-normal"
            )}
          >
            {title}
          </div>
          {!isCategory && (
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
              {children}
            </p>
          )}
        </Link>
      </NavigationMenuLink>
    </li>
  );
}

const MobileNavItem = ({
  href,
  isActive,
  children,
  ...props
}: {
  href: string;
  isActive: boolean;
  children: React.ReactNode;
} & React.ComponentPropsWithoutRef<typeof Link>) => {
  return (
    <Link
      href={href}
      className={cn(
        "block px-4 py-2 text-sm font-medium transition-colors hover:text-primary",
        isActive ? "text-primary" : "text-muted-foreground"
      )}
      {...props}
    >
      {children}
    </Link>
  );
};
