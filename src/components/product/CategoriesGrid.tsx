"use client";
import useCategories from "@/hooks/use-categories";
import React from "react";
import { Skeleton } from "../ui/skeleton";
import CategoryCard from "../home/CategoryCard";

const CategoriesGrid = () => {
  const { categories, isPending } = useCategories();

  return (
    <div className="w-full">
      {isPending ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="aspect-video rounded-sm" />
          ))}
        </div>
      ) : categories.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category) => (
            <CategoryCard key={category.name} category={category} />
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default CategoriesGrid;
