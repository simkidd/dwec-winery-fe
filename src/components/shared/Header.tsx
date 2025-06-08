"use client";
import React, { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { SearchIcon, ShoppingCartIcon, User2Icon } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";
import ThemeSwitcher from "./ThemeSwitcher";
import MenuNavigation from "./MenuNavigation";
import CartSheet from "./CartSheet";

const Header = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <div className="w-full">
      {/* top header */}
      <div className="container mx-auto px-4">
        <div className="w-full grid grid-cols-3 py-4">
          {/* logo */}
          <div className="flex-shrink-0 font-bold text-lg text-primary">
            Logo
          </div>

          {/* search input */}
          <div className="flex w-full items-center justify-center gap-2">
            <div className="flex items-center relative w-full">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search products..."
                className="focus-visible:ring-0 shadow-none rounded-sm pl-10 w-full"
              />
            </div>
            <Button
              type="submit"
              className="rounded-sm cursor-pointer shrink-0"
            >
              Search
            </Button>
          </div>

          {/* user & cart  */}
          <div className="flex items-center justify-end gap-4">
            <HoverCard>
              <HoverCardTrigger asChild>
                <Button
                  variant="ghost"
                  className="gap-1.5 hover:bg-transparent rounded-sm   dark:hover:bg-transparent cursor-pointer"
                  aria-label="Account options"
                >
                  <User2Icon className="h-5 w-5" />
                  <span className="hidden sm:inline">Account</span>
                </Button>
              </HoverCardTrigger>
              <HoverCardContent>
                <div className="space-y-2">
                  <h3 className="font-semibold">Account</h3>
                  <p className="text-sm text-muted-foreground">
                    Sign in to view your orders, wishlist, and preferences.
                  </p>
                  <div className="flex flex-col gap-2 pt-2">
                    <Button variant="outline" size="sm" className="w-full">
                      Sign In
                    </Button>
                    <Button size="sm" className="w-full">
                      Create Account
                    </Button>
                  </div>
                </div>{" "}
              </HoverCardContent>
            </HoverCard>

            <Button
              variant="ghost"
              size="icon"
              className="relative hover:bg-transparent rounded-sm dark:hover:bg-transparent cursor-pointer"
              aria-label="Shopping cart"
              onClick={() => setIsCartOpen(!isCartOpen)}
            >
              <ShoppingCartIcon className="h-5 w-5" />
              <span className="sr-only">Cart</span>
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                0
              </span>
            </Button>

            <CartSheet
              isOpen={isCartOpen}
              onChange={() => setIsCartOpen(!isCartOpen)}
            />

            <ThemeSwitcher />
          </div>
        </div>
      </div>

      {/* botton header */}
      <div className=" bg-gray-100 dark:bg-background border-t border-b">
        <div className="container mx-auto px-4 flex">
          <MenuNavigation />
        </div>
      </div>
    </div>
  );
};

export default Header;
