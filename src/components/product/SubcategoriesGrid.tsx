"use client";
import { ICategory, ISubCategory } from "@/interfaces/product.interface";
import { getSubcategoriesByCategoryId } from "@/lib/api/products";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { Skeleton } from "../ui/skeleton";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

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
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={`subcat-skeleton-${i}`}
              className="border rounded-lg p-4 h-full"
            >
              <Skeleton className="h-5 w-3/4 mb-2" />
              <div className="flex items-center mt-2">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-4 w-4 ml-1" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        subcategories &&
        subcategories.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {subcategories.map((subcat) => (
              <Link
                key={subcat._id}
                href={`/category/${category.slug}/${subcat.slug}`}
                className="group"
              >
                <div className="border rounded-lg p-4 h-full hover:border-primary transition-colors">
                  <h3 className="font-medium group-hover:text-primary">
                    {subcat.name}
                  </h3>
                  <div className="flex items-center mt-2 text-sm text-muted-foreground">
                    <span>Browse</span>
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )
      )}
    </div>
  );
};

export default SubcategoriesGrid;
