"use client";
import useProducts from "@/hooks/use-products";
import { setFilter } from "@/store/features/products/product.slice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import React, { useEffect } from "react";
import { Skeleton } from "../ui/skeleton";
import { Frown, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import ProductCard from "../home/ProductCard";

const SearchResults = ({ query }: { query: string }) => {
  const dispatch = useAppDispatch();
  const { filter } = useAppSelector((state) => state.product);

  // Update filter with search query when it changes
  useEffect(() => {
    if (filter.search !== query) {
      dispatch(setFilter({ ...filter, search: query }));
    }
  }, [query, dispatch, filter]);

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

  if (isLoadingInfinite) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="flex flex-col gap-2">
            <Skeleton className="aspect-square rounded-sm" />
            <Skeleton className="h-4 w-3/4 mx-auto" />
            <Skeleton className="h-4 w-1/2 mx-auto" />
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-6 text-center">
        <div className="bg-destructive/10 p-6 rounded-full">
          <Frown className="h-12 w-12 text-destructive" />
        </div>
        <h3 className="text-xl font-medium">Error loading products</h3>
        <p className="text-muted-foreground max-w-md">
          {error?.message || "Failed to load products. Please try again."}
        </p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-6 text-center">
        <div className="bg-muted/50 p-6 rounded-full">
          <Frown className="h-12 w-12 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-medium mb-2">
          No products found for &quot;{query}&quot;
        </h2>
        <p className="text-muted-foreground">
          Try different keywords or check back later
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center">
          <Button
            variant="outline"
            disabled={isFetchingNextPage}
            className="w-48"
            onClick={() => loadMore()}
          >
            {isFetchingNextPage ? (
              <Loader2 className="text-primary animate-spin" />
            ) : (
              "Load More"
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
