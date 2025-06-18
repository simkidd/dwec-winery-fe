"use client";
import useProducts from "@/hooks/use-products";
import { ChevronRight, Star } from "lucide-react";
import Link from "next/link";
import ProductCard from "./ProductCard";
import { Skeleton } from "../ui/skeleton";
import { Button } from "../ui/button";

const FeaturedProducts = () => {
  const { products, isPending } = useProducts();

  return (
    <section className="py-12 w-full">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">
              Featured Drinks
            </h2>
            <p className="text-muted-foreground max-w-2xl">
              Discover our hand-selected premium drinks from renowned vineyards
            </p>
          </div>
          <Button asChild variant={"link"} className="hidden md:flex ">
            <Link href={"/products"} className="flex items-center gap-1">
              View all drinks <ChevronRight />
            </Link>
          </Button>
        </div>

        {isPending ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="flex flex-col gap-2">
                <Skeleton className="aspect-square" />
                <Skeleton className="h-4 w-3/4 mx-auto" />
                <Skeleton className="h-4 w-1/2 mx-auto" />
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {products.slice(0, 10).map((item) => (
              <ProductCard key={item._id} product={item} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <Star className="h-8 w-8 text-muted-foreground" />
            <p className="text-muted-foreground">
              No featured products available
            </p>
            <Button asChild>
              <Link href="/products">Browse all wines</Link>
            </Button>
          </div>
        )}

        <div className="mt-8 flex justify-center md:hidden">
          <Button variant="outline" className="gap-2" asChild>
            <Link href={"/products"}>
              View all drinks<ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
