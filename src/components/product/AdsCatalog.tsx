"use client";
import useAds from "@/hooks/use-ads";
import React from "react";
import { Skeleton } from "../ui/skeleton";
import ProductCardSkeleton from "./ProductCardSkeleton";
import { Button } from "../ui/button";
import Link from "next/link";
import Image from "next/image";
import ProductCard from "./ProductCard";

const AdsCatalog = ({ id, slug }: { slug: string; id: string }) => {
  const { ads, isPending } = useAds();

  const ad = ads.find((ad) => ad._id === id);

  if (isPending) {
    return (
      <div className="space-y-8">
        <div className="space-y-4">
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-4 w-1/3" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {[...Array(12)].map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (!ad) {
    return (
      <div className="text-center py-16 space-y-4">
        <h2 className="text-2xl font-bold">Collection not found</h2>
        <p className="text-muted-foreground">
          The collection you&apos;re looking for doesn&apos;t exist.
        </p>
        <Button asChild variant="outline">
          <Link href="/products">Browse all products</Link>
        </Button>
      </div>
    );
  }

  // Create combined array of products
  const allProducts = [
    ...(ad.associatedProduct ? [ad.associatedProduct] : []),
    ...(ad.otherAssociatedProducts || []),
  ];

  if (allProducts.length === 0) {
    return (
      <div className="text-center py-16 space-y-4">
        <h2 className="text-2xl font-bold">No products available</h2>
        <p className="text-muted-foreground">
          This collection currently has no products.
        </p>
        <Button asChild variant="outline">
          <Link href="/products">Browse all products</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold capitalize">
          {slug.replace(/-/g, " ")}
        </h1>
        <p className="text-muted-foreground">
          {allProducts.length} premium drinks
        </p>
      </div>

      {/* Ad Image */}
      {ad.image && (
        <div className="rounded-sm overflow-hidden">
          <Image
            src={ad.image}
            alt={ad.name}
            className="w-full h-auto max-h-64 object-cover"
            width={1200}
            height={300}
            priority
          />
        </div>
      )}

      {/* Combined Products Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {allProducts.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      {/* Back to Products */}
      <div className="flex justify-center pt-8">
        <Button asChild variant="outline">
          <Link href="/products">View All Products</Link>
        </Button>
      </div>
    </div>
  );
};

export default AdsCatalog;
