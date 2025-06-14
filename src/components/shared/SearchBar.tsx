"use client";
import { useCallback, useEffect, useState, useRef } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Loader2Icon, SearchIcon, X } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setFilter } from "@/store/features/products/product.slice";
import useProducts from "@/hooks/use-products";
import Link from "next/link";
import Image from "next/image";

interface SearchBarProps {
  className?: string;
  mobileView?: boolean;
  showMobileSearch?: boolean;
  onSearch?: (query: string) => void;
  onToggleMobileSearch?: (show: boolean) => void;
}

const DEBOUNCE_DELAY = 500;
const MIN_QUERY_LENGTH = 2;

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
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const { products, isPending } = useProducts({
    ...filter,
    search: searchQuery,
    limit: 5,
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const debouncedSearch = useCallback(
    (query: string) => {
      const timer = setTimeout(() => {
        dispatch(setFilter({ search: query }));
      }, DEBOUNCE_DELAY);

      return () => clearTimeout(timer);
    },
    [dispatch]
  );

  useEffect(() => {
    if (searchQuery !== filter.search) {
      debouncedSearch(searchQuery);
      setShowSuggestions(searchQuery.length >= MIN_QUERY_LENGTH && isFocused);
    }
  }, [searchQuery, debouncedSearch, filter.search, isFocused]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const searchUrl = `/search?q=${encodeURIComponent(searchQuery)}`;

    // Always update URL and dispatch filter
    if (pathname !== "/search") {
      router.push(searchUrl);
    } else {
      // On search page, update URL without full navigation
      const params = new URLSearchParams(searchParams.toString());
      params.set("q", searchQuery);
      router.replace(`${pathname}?${params.toString()}`);
    }

    dispatch(setFilter({ search: searchQuery }));
    setShowSuggestions(false);
    onToggleMobileSearch?.(false);
  };

  if (mobileView && !showMobileSearch) {
    return null;
  }

  return (
    <div className="relative w-full" ref={searchRef}>
      <form
        onSubmit={handleSubmit}
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
            onFocus={() => {
              setIsFocused(true);
              setShowSuggestions(searchQuery.length >= MIN_QUERY_LENGTH);
            }}
            onBlur={() => setIsFocused(false)}
          />
          {searchQuery && (
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground cursor-pointer"
              onClick={() => setSearchQuery("")}
            >
              <X className="h-4 w-4" />
            </button>
          )}

          {/* Search Suggestions */}
          {showSuggestions && (
            <div className="absolute top-full w-full z-50 mt-1 bg-white dark:bg-gray-900 shadow-lg rounded-md border border-gray-200 dark:border-gray-700 max-h-60 overflow-auto">
              {isPending ? (
                <div className="flex justify-center items-center p-4">
                  <Loader2Icon className="animate-spin text-primary" />
                </div>
              ) : products.length > 0 ? (
                <>
                  <ul className="divide-y ">
                    {products.map((product) => (
                      <li key={product._id}>
                        <Link
                          href={`/products/${product.slug}`}
                          type="button"
                          className="px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 text-sm flex items-center"
                          onClick={() => {
                            setShowSuggestions(false);
                            onToggleMobileSearch?.(false);
                            setSearchQuery("");
                          }}
                        >
                          <div className="size-10 mr-2">
                            <Image
                              src={product.images[0]}
                              alt={product.name}
                              className="w-full h-full object-contain"
                              width={100}
                              height={100}
                            />
                          </div>
                          <span className="truncate">{product.name}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/search?q=${encodeURIComponent(searchQuery)}`}
                    className="block px-4 py-2 text-sm font-medium text-primary hover:bg-gray-50 dark:hover:bg-gray-800 border-t border-gray-100 dark:border-gray-800"
                    onClick={() => {
                      setShowSuggestions(false);
                      onToggleMobileSearch?.(false);
                      setSearchQuery("");
                    }}
                  >
                    View all results for &quot;{searchQuery}&quot;
                  </Link>
                </>
              ) : (
                <div className="p-4 text-sm text-gray-500 dark:text-gray-400">
                  No products found
                </div>
              )}
            </div>
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
