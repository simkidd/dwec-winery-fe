"use client";

import useProducts from "@/hooks/use-products";
import { setFilter } from "@/store/features/products/product.slice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { ChevronDown, Frown, Loader2 } from "lucide-react";
import ProductCard from "../home/ProductCard";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Skeleton } from "../ui/skeleton";
import ProductFilter from "./ProductFilter";

type SortOption =
  | "desc"
  | "asc"
  | "lowestPrice"
  | "highestPrice"
  | "a-z"
  | "z-a";

const sortOptions = [
  { value: "desc", label: "Newest" },
  { value: "asc", label: "Oldest" },
  { value: "lowestPrice", label: "Price: Low to High" },
  { value: "highestPrice", label: "Price: High to Low" },
  { value: "a-z", label: "Name: A-Z" },
  { value: "z-a", label: "Name: Z-A" },
];

const ProductsGrid = () => {
  const dispatch = useAppDispatch();
  const { filter } = useAppSelector((state) => state.product);
  const {
    infiniteQuery: {
      products,
      isLoadingInfinite,
      isFetchingNextPage,
      isError,
      error,
    },
    hasMore,
    loadMore,
  } = useProducts(filter);

  const handleSortFilter = (value: SortOption) => {
    dispatch(
      setFilter({
        ...filter,
        sort: value,
      })
    );
  };

  const currentSortLabel =
    sortOptions.find((opt) => opt.value === filter.sort)?.label || "Sort By";

  return (
    <div className="w-full py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-8 relative">
          {/* Filters Sidebar - Hidden on small screens */}
          <div className="hidden md:block w-full md:w-64 flex-shrink-0">
            <div className="sticky top-20">
              <ProductFilter />
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Mobile Filters & Sort Header */}
            <div className="flex justify-between items-center gap-4 mb-6">
              {/* Mobile Filters */}
              <div className="md:hidden">
                <ProductFilter />
              </div>

              <div className="ms-auto">
                {/* Sort Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-2 rounded-sm">
                      <span>{currentSortLabel}</span>
                      <ChevronDown />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-40 space-y-0.5">
                    {sortOptions.map((option) => (
                      <DropdownMenuItem
                        key={option.value}
                        className={`w-full text-left px-2 py-1.5 text-sm rounded-sm hover:bg-accent ${
                          filter.sort === option.value
                            ? "bg-accent font-medium"
                            : ""
                        }`}
                        onClick={() =>
                          handleSortFilter(option.value as SortOption)
                        }
                      >
                        {option.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {isError ? (
              <div className="flex flex-col items-center justify-center py-16 space-y-6 text-center">
                <div className="bg-destructive/10 p-6 rounded-full">
                  <Frown className="h-12 w-12 text-destructive" />
                </div>
                <h3 className="text-xl font-medium">Error loading products</h3>
                <p className="text-muted-foreground max-w-md">
                  {error?.message ||
                    "Failed to load products. Please try again."}
                </p>
                <Button
                  variant="outline"
                  onClick={() => window.location.reload()}
                >
                  Retry
                </Button>
              </div>
            ) : isLoadingInfinite ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="flex flex-col gap-2">
                    <Skeleton className="aspect-square rounded-sm" />
                    <Skeleton className="h-4 w-3/4 mx-auto" />
                    <Skeleton className="h-4 w-1/2 mx-auto" />
                  </div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {products.map((item) => (
                    <ProductCard key={item._id} product={item} />
                  ))}
                </div>

                {/* Load More Button */}
                {hasMore && (
                  <div className="mt-8 flex justify-center">
                    {isFetchingNextPage ? (
                      <Loader2 className="animate-spin text-primary" />
                    ) : (
                      <Button
                        variant="outline"
                        onClick={() => loadMore()}
                        disabled={isFetchingNextPage}
                        className="min-w-[200px]"
                      >
                        Load More
                      </Button>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 space-y-6 text-center">
                <div className="bg-muted/50 p-6 rounded-full">
                  <Frown className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-medium">No products found</h3>
                <p className="text-muted-foreground max-w-md">
                  We couldn&apos;t find any products matching your filters. Try
                  adjusting your search criteria.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsGrid;
