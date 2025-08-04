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
import { IUser } from "@/interfaces/user.interface";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { User } from "iconsax-reactjs";
import { ChevronLeft, ChevronRight, LogIn, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";
import { useState } from "react";
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
  const { categories, isPending: loadingCategories } = useCategories();

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
        href="/faqs"
        isActive={isActive("/faqs")}
        onClick={closeMenu}
      >
        FAQs
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
            <>
              <MobileNavItem
                href="/admin/blogs"
                isActive={isActive("/account/favourites")}
                onClick={closeMenu}
              >
                Blog Manager
              </MobileNavItem>

              <MobileNavItem
                href="/admin/ads"
                isActive={isActive("/admin/ads")}
                onClick={closeMenu}
              >
                Ads Manager
              </MobileNavItem>
            </>
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

      <ScrollArea className="h-[calc(100vh-180px)]">
        <div className="space-y-1">
          {categories?.map((category) => (
            <div key={category._id}>
              <MobileNavItem
                href={`/category/${category.slug}`}
                isActive={pathname.includes(`/category/${category.slug}`)}
                onClick={closeMenu}
              >
                {category.name}
              </MobileNavItem>
              {category.subCategories && category.subCategories.length > 0 && (
                <div className="pl-4">
                  {category.subCategories.map((subcategory) => (
                    <MobileNavItem
                      key={subcategory._id}
                      href={`/category/${category.slug}/${subcategory.slug}`}
                      isActive={pathname.includes(
                        `/category/${category.slug}/${subcategory.slug}`
                      )}
                      onClick={closeMenu}
                    >
                      {subcategory.name}
                    </MobileNavItem>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
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
        <SheetContent side="right" className="w-full">
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

        {/* <NavigationMenuItem>
          <NavigationMenuLink
            asChild
            className={cn(
              "border-b-3 border-b-transparent",
              navigationMenuTriggerStyle(),
              isActive("/about-us") && "border-b-primary font-semibold"
            )}
          >
            <Link href="/products">Shop</Link>
          </NavigationMenuLink>
        </NavigationMenuItem> */}

        {loadingCategories
          ? [...Array(6)].map((_, i) => (
              <NavigationMenuItem key={i}>
                <Skeleton className="h-6 w-12 rounded-md" />
              </NavigationMenuItem>
            ))
          : categories.map((category) => (
              <NavigationMenuItem key={category._id}>
                {category.subCategories && category.subCategories.length > 0 ? (
                  <>
                    <NavigationMenuTrigger>
                      <NavigationMenuLink
                        asChild
                        className={cn(
                          "border-b-3 border-b-transparent capitalize",
                          navigationMenuTriggerStyle(),
                          isActive(`/category/${category.slug}`) &&
                            "border-b-primary font-semibold"
                        )}
                      >
                        <Link href={`/category/${category.slug}`}>
                          {category.name}
                        </Link>
                      </NavigationMenuLink>
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <NavigationMenuList className="grid gap-0">
                        {category.subCategories.map((subcategory) => (
                          <NavigationMenuItem key={subcategory._id}>
                            <NavigationMenuLink
                              asChild
                              className={cn(
                                "border-b-3 border-b-transparent capitalize !px-2",
                                navigationMenuTriggerStyle(),
                                isActive(
                                  `/category/${category.slug}/${subcategory.slug}`
                                ) && "text-primary font-semibold"
                              )}
                            >
                              <Link
                                href={`/category/${category.slug}/${subcategory.slug}`}
                              >
                                {subcategory.name}
                              </Link>
                            </NavigationMenuLink>
                          </NavigationMenuItem>
                        ))}
                      </NavigationMenuList>
                    </NavigationMenuContent>
                  </>
                ) : (
                  <NavigationMenuLink
                    asChild
                    className={cn(
                      "border-b-3 border-b-transparent capitalize",
                      navigationMenuTriggerStyle(),
                      isActive(`/category/${category.slug}`) &&
                        "border-b-primary font-semibold"
                    )}
                  >
                    <Link href={`/category/${category.slug}`}>
                      {category.name}
                    </Link>
                  </NavigationMenuLink>
                )}
              </NavigationMenuItem>
            ))}

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
              isActive("/faqs") && "border-b-primary font-semibold"
            )}
          >
            <Link href="/faqs">FAQs</Link>
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
