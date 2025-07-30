import { ICategory, ISubCategory } from "@/interfaces/product.interface";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const SubcategoryCard = ({
  category,
  subcategory,
}: {
  category: ICategory;
  subcategory: ISubCategory;
}) => {
  return (
    <Link
      href={`/category/${category.slug}/${subcategory.slug}`}
      className="group block overflow-hidden rounded-lg border transition-all hover:shadow-md"
    >
      <div className="relative aspect-square bg-gray-100">
        <Image
          src={category.image} // Using parent category image
          alt={subcategory.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
      </div>
      <div className="p-4">
        <h3 className="font-medium group-hover:text-primary transition-colors">
          {subcategory.name}
        </h3>
        <div className="flex items-center mt-2 text-sm text-muted-foreground">
          <span>View products</span>
          <ChevronRight className="h-4 w-4 ml-1" />
        </div>
      </div>
    </Link>
  );
};

export default SubcategoryCard;
