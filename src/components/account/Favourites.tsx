"use client";
import ProductCard from "@/components/product/ProductCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useFavourites } from "@/hooks/use-favourites";
import { HeartOff } from "lucide-react";
import Link from "next/link";

const Favourites = () => {
  const {
    isFetching,
    fetchedFavourites: favorites,
    // refetchFavourites,
  } = useFavourites();

  return (
    <div>
      {favorites?.length === 0 ? (
        <EmptyState
          icon={<HeartOff className="h-12 w-12 text-muted-foreground" />}
          title="No favorites yet"
          description="Save your favorite items to see them here"
          action={
            <Button asChild className="rounded-sm">
              <Link href={"/products"}>Browse Products</Link>
            </Button>
          }
        />
      ) : isFetching ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="flex flex-col gap-2">
              <Skeleton className="aspect-square rounded-sm" />
              <Skeleton className="h-4 w-3/4 mx-auto" />
              <Skeleton className="h-4 w-1/2 mx-auto" />
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium">
              {favorites?.length} {favorites?.length === 1 ? "item" : "items"}{" "}
              saved
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {favorites?.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Favourites;
