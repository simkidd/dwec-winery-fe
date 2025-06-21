import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ICategory } from "@/interfaces/product.interface";

const PLACEHOLDER_IMAGE = "/logo-icon-removebg-preview (1).png";

const CategoryCard = ({ category }: { category: ICategory }) => {
  return (
    <Link href={`/category/${category.slug}`}>
      <div className="group/card relative overflow-hidden rounded-sm transition-all duration-500">
        {/* background image */}
        <div className="relative overflow-hidden aspect-video">
          <Image
            src={category.image || PLACEHOLDER_IMAGE}
            alt={category.name}
            width={400}
            height={400}
            className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-105"
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 group-hover/card:from-black/80 to-black/20 group-hover/card:to-black/40 transition-colors duration-500 ease-in-out" />
        </div>

        {/* Text content */}
        <div className="absolute inset-0 flex items-center justify-center p-4 text-white">
          <h3 className="text-xl font-bold uppercase">{category.name}</h3>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;
