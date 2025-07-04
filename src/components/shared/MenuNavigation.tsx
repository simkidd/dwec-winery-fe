"use client";

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
import useCategories from "@/hooks/use-categories";
import useLogout from "@/hooks/use-logout";
import { useIsMobile } from "@/hooks/use-mobile";
import useProducts from "@/hooks/use-products";
import { IUser } from "@/interfaces/user.interface";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { User } from "iconsax-reactjs";
import { ChevronLeft, ChevronRight, LogIn, Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { Skeleton } from "../ui/skeleton";
import Logo from "./Logo";

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
  const [filter, setFilter] = useState({});
  const { products, isPending } = useProducts(filter);

  const [isOpen, setIsOpen] = useState(false);
  const [menuState, setMenuState] = useState<MenuState>("main");
  const [menuHistory, setMenuHistory] = useState<MenuState[]>(["main"]);
  const [direction, setDirection] = useState(1);

  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Prefetch all products on initial load
  useEffect(() => {
    if (categories?.length) {
      setFilter({
        category: categories.map((c) => c._id), // Get all category IDs at once
        limit: 20,
      });
    }
  }, [categories]);

  // Filter products client-side based on active category
  const filteredProducts = activeCategory
    ? products?.filter((p) => p.category._id === activeCategory)
    : products;

  // Handle category hover
  const handleCategoryHover = (categoryId: string) => {
    setActiveCategory(categoryId);
  };

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

      {/* <MobileNavItem
        href="/about-us"
        isActive={isActive("/about-us")}
        onClick={closeMenu}
      >
        About Us
      </MobileNavItem> */}

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

          {(user.isAdmin || user.isSuperAdmin) && (
            <MobileNavItem
              href="/admin/blogs"
              isActive={isActive("/account/favourites")}
              onClick={closeMenu}
            >
              Blog Manager
            </MobileNavItem>
          )}
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

      <MobileNavItem
        href="/products"
        isActive={isActive("/products")}
        onClick={closeMenu}
      >
        All Products
      </MobileNavItem>

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
          <NavigationMenuContent className="p-0 h-[500px]">
            <div className="grid w-[800px] h-full gap-6 md:grid-cols-[250px_1fr] text-sm">
              {/* Categories Column */}
              <div className="border-r ">
                <ScrollArea className="h-full p-2">
                  <ul className="space-y-1">
                    {categories?.map((category) => (
                      <li
                        key={category._id}
                        className={`px-3 py-2 rounded-md transition-colors cursor-pointer flex items-center ${
                          activeCategory === category._id
                            ? "bg-accent font-medium"
                            : "hover:bg-accent/50"
                        }`}
                        onMouseEnter={() => handleCategoryHover(category._id)}
                      >
                        {category.name}

                        <span className="ml-auto">
                          <ChevronRight className="h-3 w-3" />
                        </span>
                      </li>
                    ))}
                  </ul>
                </ScrollArea>
              </div>

              {/* Products Column */}
              <div className="p-2 py-4">
                <Link
                  href={
                    activeCategory
                      ? `/category/${
                          categories?.find((c) => c._id === activeCategory)
                            ?.slug
                        }`
                      : "/products"
                  }
                  className="hover:underline hover:underline-offset-2"
                >
                  <h3 className="text-base font-semibold mb-4 flex items-center">
                    {activeCategory
                      ? `All ${
                          categories?.find((c) => c._id === activeCategory)
                            ?.name
                        }`
                      : "Featured Products"}
                    <span className="ml-1">
                      <ChevronRight className="h-4 w-4" />
                    </span>
                  </h3>
                </Link>

                <ScrollArea className="flex-1 p-4">
                  {isPending ? (
                    <ul className="grid grid-cols-5 gap-4">
                      {[...Array(8)].map((_, i) => (
                        <li key={i} className="w-full">
                          <div className="flex flex-col items-center gap-2">
                            <Skeleton className="size-16 rounded-full" />
                            <div className="w-full space-y-1 text-center">
                              <Skeleton className="h-4 w-3/4 mx-auto" />
                              <Skeleton className="h-3 w-1/2 mx-auto" />
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : filteredProducts?.length ? (
                    <ul className="grid grid-cols-5 gap-4">
                      {filteredProducts.map((product) => (
                        <li key={product._id}>
                          <Link
                            href={`/products/${product.slug}`}
                            className="hover:text-primary transition-colors flex flex-col items-center gap-2"
                          >
                            <div className="size-16 rounded-full bg-primary/10 dark:bg-muted/30 overflow-hidden flex-shrink-0">
                              <Image
                                src={product.images[0]}
                                alt={product.name}
                                width={200}
                                height={200}
                                className="w-full h-full object-contain"
                              />
                            </div>
                            <div className="text-center w-full">
                              <span className="block truncate text-sm">
                                {product.name}
                              </span>
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-muted-foreground py-4 text-center">
                      No products found in this category
                    </div>
                  )}
                </ScrollArea>
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* <NavigationMenuItem>
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
        </NavigationMenuItem> */}

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
