"use client";
import useCategories from "@/hooks/use-categories";
import { motion } from "framer-motion";
import { Skeleton } from "../ui/skeleton";
import CategoryCard from "./CategoryCard";
import Logo from "../shared/Logo";

const CategoriesGrid = () => {
  const { categories, isPending } = useCategories();

  return (
    <div className="w-full">
      {isPending ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="aspect-video rounded-sm relative">
              <Skeleton className="h-full w-full rounded-sm" />
              <motion.div
                initial={{ opacity: 0.3, scale: 0.95 }}
                animate={{
                  opacity: [0.3, 0.5, 0.3],
                  scale: [0.95, 1, 0.95],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
              >
                <Logo className="w-20 h-20 opacity-20 grayscale-100" />
              </motion.div>
            </div>
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
