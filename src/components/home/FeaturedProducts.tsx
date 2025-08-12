"use client";
import useProducts from "@/hooks/use-products";
import { ChevronRight, Star } from "lucide-react";
import Link from "next/link";
import ProductCard from "../product/ProductCard";
import ProductCardSkeleton from "../product/ProductCardSkeleton";
import { Button } from "../ui/button";

const FeaturedProducts = () => {
  const { products, isPending } = useProducts({
    limit: 12,
    sort: "highestPrice",
  });

  return (
    <section className="py-12 w-full">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight capitalize">
              Explore our best selections
            </h2>
            <p className="text-muted-foreground max-w-2xl">
              Curated for the True Connoisseur!
            </p>
          </div>
          <Button asChild variant={"link"} className="hidden md:flex ">
            <Link href={"/products"} className="flex items-center gap-1">
              <span className="text-primary dark:text-stone-300 group-hover:text-primary transition-colors">
                View All Range
              </span>
              <ChevronRight className="h-5 w-5 text-primary dark:text-stone-400 group-hover:text-primary transition-colors" />
            </Link>
          </Button>
        </div>

        {isPending ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(10)].map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((item) => (
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
              View All Range
              <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
