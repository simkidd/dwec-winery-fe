"use client";
import { ICategory, ISubCategory } from "@/interfaces/product.interface";
import { getSubcategoriesByCategoryId } from "@/lib/api/products";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { Skeleton } from "../ui/skeleton";
import Link from "next/link";
import { ChevronRight, Frown } from "lucide-react";

const SubcategoriesGrid = ({ category }: { category: ICategory }) => {
  const { data: subcategories, isPending: loadingSubcategories } = useQuery({
    queryKey: ["subcategories", category._id],
    queryFn: () => getSubcategoriesByCategoryId(category._id),
    select: (data) => data.subCategories as ISubCategory[],
  });

  return (
    <div className="my-12 container mx-auto px-4">
      {/* Subcategories Section */}
      {loadingSubcategories ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div
              key={`subcat-skeleton-${i}`}
              className="border rounded-lg p-4 h-36"
            >
              <Skeleton className="h-6 w-3/4 mb-3" />
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
        </div>
      ) : subcategories && subcategories.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {subcategories.map((subcat) => (
            <Link
              key={subcat._id}
              href={`/category/${category.slug}/${subcat.slug}`}
              className="group"
            >
              <div className="border rounded-lg p-5 h-36 hover:border-primary transition-colors flex flex-col justify-between">
                <h3 className="font-medium text-lg group-hover:text-primary">
                  {subcat.name}
                </h3>
                <div className="flex items-center text-sm text-muted-foreground group-hover:text-primary">
                  <span>View all</span>
                  <ChevronRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="py-12 flex flex-col items-center justify-center space-y-6">
          <div className="bg-muted/50 p-6 rounded-full">
            <Frown className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="font-medium text-xl">No subcategories available</h3>
        </div>
      )}
    </div>
  );
};

export default SubcategoriesGrid;
