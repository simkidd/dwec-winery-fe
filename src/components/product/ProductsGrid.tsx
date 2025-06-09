"use client";

import useProducts from "@/hooks/use-products";
import { useAppSelector } from "@/store/hooks";
import { FilterX, Frown, Loader2 } from "lucide-react";
import ProductCard from "../home/ProductCard";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import ProductFilter from "./ProductFilter";

const ProductsGrid = () => {
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

  return (
    <div className="w-full">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar - Hidden on small screens */}
          <div className="hidden md:block w-full md:w-64 flex-shrink-0">
            <ProductFilter />
          </div>

          {/* Mobile Filters Button */}
          <div className="md:hidden mb-4">
            <Button variant="outline" className="w-full" asChild>
              <details className="dropdown">
                <summary className="flex items-center gap-2">
                  <FilterX className="h-4 w-4" />
                  Filters
                </summary>
                <div className="mt-2 p-4 border rounded-lg shadow-lg">
                  <ProductFilter mobileView />
                </div>
              </details>
            </Button>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Error State */}
            {isError && (
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
            )}

            {isLoadingInfinite && !isError ? (
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
                    <Button
                      variant="outline"
                      onClick={() => loadMore()}
                      disabled={isFetchingNextPage}
                      className="min-w-[200px]"
                    >
                      {isFetchingNextPage ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="animate-spin" />
                          Loading...
                        </span>
                      ) : (
                        "Load More"
                      )}
                    </Button>
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
