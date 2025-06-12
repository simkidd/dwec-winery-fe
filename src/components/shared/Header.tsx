"use client";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Apple, GooglePlay } from "iconsax-reactjs";
import {
  DownloadIcon,
  SearchIcon,
  ShoppingCartIcon,
  User2Icon,
  X,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Button } from "../ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";
import { Input } from "../ui/input";
import CartSheet from "./CartSheet";
import MenuNavigation from "./MenuNavigation";
import ThemeSwitcher from "./ThemeSwitcher";
import { useAppSelector } from "@/store/hooks";
import useLogout from "@/hooks/use-logout";

const SCROLL_THRESHOLD = 100;

const Header = () => {
  const { user } = useAppSelector((state) => state.auth);
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

  console.log(">>>>", user);

  return (
    <div
      className={cn(
        "w-full sticky top-0 z-30 transition-transform duration-500 ease-in-out",
        isScrolled ? "-translate-y-full" : "translate-y-0"
      )}
    >
      {/* Top Header */}
      <div className="bg-background border-b">
        <div className="w-full container mx-auto px-4 py-4 flex items-center justify-between">
          {/* Mobile Menu Button */}
          {isMobile && <MenuNavigation mobileView />}

          {/* Logo */}
          <div className="flex-shrink-0 font-bold text-lg text-primary">
            Logo
          </div>

          {/* Search Input - Hidden on mobile */}
          {!isMobile && (
            <div className="flex-1 max-w-xl mx-4">
              <div className="flex items-center relative">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search products..."
                  className="focus-visible:ring-0 shadow-none rounded-sm pl-10 w-full"
                />
                <Button
                  type="submit"
                  className="ml-2 rounded-sm cursor-pointer"
                >
                  Search
                </Button>
              </div>
            </div>
          )}

          {/* User & Cart */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Mobile Search Button */}
            {isMobile && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowMobileSearch(!showMobileSearch)}
              >
                {showMobileSearch ? (
                  <X className="h-5 w-5" />
                ) : (
                  <SearchIcon className="h-5 w-5" />
                )}
              </Button>
            )}

            {!isMobile && (
              <HoverCard>
                <HoverCardTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <DownloadIcon className="h-4 w-4" />
                    <span>Get App</span>
                  </Button>
                </HoverCardTrigger>
                <HoverCardContent className="w-fit">
                  <div className="flex flex-col">
                    <h3 className="font-semibold">Download the App</h3>
                    <div className="flex items-center gap-2 mt-4">
                      <Link
                        href={"#"}
                        className="flex items-center justify-center text-left border shadow-xs w-[160px] h-[48px] rounded-[24px] gap-1"
                      >
                        <Apple size="32" variant="Bold" className="shrink-0" />
                        <div className="flex flex-col">
                          <span className="text-[9px] font-bold text-nowrap">
                            Download on the
                          </span>
                          <p className="font-semibold leading-[1] text-nowrap">
                            App Store
                          </p>
                        </div>
                      </Link>
                      <Link
                        href={"#"}
                        className="flex items-center justify-center text-left border shadow-xs w-[160px] h-[48px] rounded-[24px] gap-1"
                      >
                        <GooglePlay size="32" variant="Bold" />
                        <div className="flex flex-col">
                          <span className="text-[9px] font-bold text-nowrap">
                            Download on the
                          </span>
                          <p className="font-semibold leading-[1] text-nowrap">
                            Play Store
                          </p>
                        </div>
                      </Link>
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
            )}

            {!isMobile &&
              (user ? (
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <Button variant="ghost" className="gap-1.5 rounded-sm">
                      <User2Icon className="h-5 w-5" />
                      <span>{user.firstname || "My Account"}</span>
                    </Button>
                  </HoverCardTrigger>
                  <HoverCardContent>
                    <div className="space-y-2">
                      <h3 className="font-semibold">
                        Welcome, {user.firstname}
                      </h3>
                      <div className="flex flex-col gap-2 pt-2">
                        <Button
                          variant="destructive"
                          size="sm"
                          className="w-full"
                          onClick={signOut}
                        >
                          Logout
                        </Button>
                      </div>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              ) : (
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <Button variant="ghost" className="gap-1.5 rounded-sm">
                      <User2Icon className="h-5 w-5" />
                      <span>Account</span>
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
                0
              </span>
            </Button>

            <ThemeSwitcher />
          </div>
        </div>

        {/* Mobile Search Bar - Appears when search button clicked */}
        {isMobile && (
          <div
            className={cn(
              "px-4 transition-all duration-300 ease-in-out overflow-hidden",
              showMobileSearch
                ? "pb-4 max-h-20 opacity-100"
                : "max-h-0 opacity-0"
            )}
          >
            <div className="flex items-center relative">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search products..."
                className="focus-visible:ring-0 shadow-none rounded-sm pl-10 w-full"
              />
            </div>
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
