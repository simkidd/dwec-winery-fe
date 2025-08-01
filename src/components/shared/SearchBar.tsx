"use client";
import { cn } from "@/lib/utils";
import { setFilter } from "@/store/features/products/product.slice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { SearchIcon, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface SearchBarProps {
  className?: string;
  mobileView?: boolean;
  showMobileSearch?: boolean;
  onSearch?: (query: string) => void;
  onToggleMobileSearch?: (show: boolean) => void;
}

const SearchBar = ({
  className,
  mobileView = false,
  showMobileSearch = false,
  onToggleMobileSearch,
}: SearchBarProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const { filter } = useAppSelector((state) => state.product);
  const [searchQuery, setSearchQuery] = useState(filter.search || "");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedQuery = searchQuery.trim();
    if (!trimmedQuery) return;

    const searchUrl = `/search?q=${encodeURIComponent(searchQuery)}`;

    if (pathname !== "/search") {
      router.push(searchUrl);
      // window.location.href = searchUrl
    } else {
      const params = new URLSearchParams(searchParams.toString());
      params.set("q", searchQuery);
      router.replace(`${pathname}?${params.toString()}`);
      // window.location.href = `${pathname}?${params.toString()}`
    }

    onToggleMobileSearch?.(false);
    setSearchQuery("");
  };

  if (mobileView && !showMobileSearch) {
    return null;
  }

  return (
    <div className="relative w-full">
      <form
        onSubmit={handleSearch}
        className={cn(
          "flex items-center relative",
          mobileView ? "w-full" : "flex-1 max-w-xl mx-4",
          className
        )}
      >
        <div className="relative flex items-center w-full">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search products..."
            className="focus-visible:ring-0 focus-visible:border-primary shadow-none rounded-sm pl-10 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground cursor-pointer"
              onClick={() => {
                setSearchQuery("");
                if (pathname !== "/products") {
                  dispatch(setFilter({ ...filter, search: "" }));
                }
              }}
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        {mobileView ? (
          <Button
            type="submit"
            variant="default"
            size="icon"
            className="ml-2 cursor-pointer"
          >
            <SearchIcon className="h-5 w-5" />
          </Button>
        ) : (
          <Button type="submit" className="ml-2 rounded-sm cursor-pointer">
            Search
          </Button>
        )}
      </form>
    </div>
  );
};

export default SearchBar;
