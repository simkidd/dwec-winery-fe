"use client";
import useCategories from "@/hooks/use-categories";
import { ChevronRight, Wine } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import CategoryCard from "./CategoryCard";
import { Skeleton } from "../ui/skeleton";

const ExploreCategories = () => {
  const { categories, isPending } = useCategories();

  return (
    <section className="w-full py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Wine className="h-6 w-6 text-primary" />
              <span className="text-sm font-medium text-primary">
                OUR COLLECTIONS
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Explore Our Wine Categories
            </h2>
            <p className="mt-3 text-muted-foreground max-w-2xl">
              Discover exceptional wines from around the world, carefully
              curated for every occasion and palate.
            </p>
          </div>
          <Button variant={'link'} asChild className="hidden md:flex ">
            <Link
              href="/product-categories"
              className="flex items-center gap-1"
            >
              View all categories <ChevronRight />
            </Link>
          </Button>
        </div>

        {isPending ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-sm" />
            ))}
          </div>
        ) : categories.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {categories.map((category) => (
              <CategoryCard key={category.name} category={category} />
            ))}
          </div>
        ) : null}

        <div className="mt-8 flex justify-center md:hidden">
          <Button variant="outline" className="gap-2">
            View all <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ExploreCategories;
