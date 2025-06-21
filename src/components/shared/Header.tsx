"use client";
import useLogout from "@/hooks/use-logout";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/store/hooks";
import {
  Heart,
  LogOutIcon,
  SearchIcon,
  ShoppingCartIcon,
  User2Icon,
  X
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import CartSheet from "../cart/CartSheet";
import { Button } from "../ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";
import { Separator } from "../ui/separator";
import MenuNavigation from "./MenuNavigation";
import SearchBar from "./SearchBar";
import ThemeSwitcher from "./ThemeSwitcher";

const SCROLL_THRESHOLD = 100;

const Header = () => {
  const { user } = useAppSelector((state) => state.auth);
  const { items } = useAppSelector((state) => state.cart);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const isMobile = useIsMobile();
  const { signOut } = useLogout();

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > SCROLL_THRESHOLD) {
      if (currentScrollY > lastScrollY) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    } else {
      setIsScrolled(false);
    }

    setLastScrollY(currentScrollY);
  }, [lastScrollY]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <div
      className={cn(
        "w-full sticky top-0 z-30 transition-transform duration-500 ease-in-out",
        isScrolled ? "-translate-y-full" : "translate-y-0"
      )}
    >
      {/* Top Header */}
      <div className="bg-background border-b">
        <div className="w-full container mx-auto px-4 py-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-4">
            {/* Mobile Menu Button */}
            {isMobile && <MenuNavigation mobileView />}

            {/* Logo */}
            <div className=" flex font-bold text-lg">
              <div className="h-8 md:h-10">
                <Image
                  src={
                    "/logo/WhatsApp_Image_2025-06-08_at_10.56.17_d88b6574-removebg-preview.png"
                  }
                  alt=""
                  width={300}
                  height={150}
                  className="object-contain w-full h-full"
                />
              </div>
            </div>
          </div>

          {/* Search Input - Hidden on mobile */}
          {!isMobile && <SearchBar />}

          {/* User & Cart */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Mobile Search Button */}
            {isMobile && (
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full cursor-pointer"
                onClick={() => setShowMobileSearch(!showMobileSearch)}
              >
                {showMobileSearch ? (
                  <X className="h-5 w-5" />
                ) : (
                  <SearchIcon className="h-5 w-5" />
                )}
              </Button>
            )}

            {!isMobile &&
              (user ? (
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="rounded-full cursor-pointer"
                    >
                      <User2Icon className="h-5 w-5" />
                    </Button>
                  </HoverCardTrigger>
                  <HoverCardContent>
                    <div className="space-y-3">
                      <div className="">
                        <h3 className="font-semibold">
                          Welcome, {user.firstname}
                        </h3>
                      </div>
                      <Separator />
                      <ul className="flex flex-col gap-2">
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                          asChild
                        >
                          <Link href="/account">
                            <User2Icon />
                            My Account
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                          asChild
                        >
                          <Link href="/account/orders">
                            <ShoppingCartIcon />
                            My Orders
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                          asChild
                        >
                          <Link href="/account/favourites">
                            <Heart />
                            Saved Items
                          </Link>
                        </Button>
                        <Button
                          variant="destructive"
                          className="w-full cursor-pointer justify-start"
                          onClick={signOut}
                        >
                          <LogOutIcon />
                          Logout
                        </Button>
                      </ul>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              ) : (
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="rounded-full cursor-pointer"
                    >
                      <User2Icon className="h-5 w-5" />
                    </Button>
                  </HoverCardTrigger>
                  <HoverCardContent>
                    <div className="space-y-2">
                      <h3 className="font-semibold">Account</h3>
                      <p className="text-sm text-muted-foreground">
                        Sign in to view your orders, wishlist, and preferences.
                      </p>
                      <div className="flex flex-col gap-2 pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          asChild
                        >
                          <Link href={"/login"}>Sign In</Link>
                        </Button>
                        <Button size="sm" className="w-full" asChild>
                          <Link href={"/sign-up"}>Create Account</Link>
                        </Button>
                      </div>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              ))}

            <Button
              variant="ghost"
              size="icon"
              className="relative rounded-full cursor-pointer"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingCartIcon className="h-5 w-5" />
              <span className="sr-only">Cart</span>
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                {items.length || 0}
              </span>
            </Button>

            <ThemeSwitcher />
          </div>
        </div>

        {/* Mobile Search Bar - Appears when search button clicked */}
        {isMobile && (
          <div
            className={cn(
              "px-4 transition-all duration-300 ease-in-out ",
              showMobileSearch
                ? "pb-4 max-h-20 opacity-100"
                : "max-h-0 opacity-0"
            )}
          >
            <SearchBar mobileView showMobileSearch={showMobileSearch} />
          </div>
        )}
      </div>

      {/* Bottom Header - Hidden on mobile */}
      {!isMobile && (
        <div className=" bg-gray-50 dark:bg-gray-900 border-b">
          <div className="container mx-auto px-4 flex">
            <MenuNavigation />
          </div>
        </div>
      )}

      <CartSheet
        isOpen={isCartOpen}
        onChange={() => setIsCartOpen(!isCartOpen)}
      />
    </div>
  );
};

export default Header;
