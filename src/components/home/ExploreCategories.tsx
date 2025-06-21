"use client";
import useCategories from "@/hooks/use-categories";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import CategoryCard from "../product/CategoryCard";
import { motion } from "framer-motion";
import Logo from "../shared/Logo";

const ExploreCategories = () => {
  const { categories, isPending } = useCategories();

  return (
    <section className="w-full py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Explore Our Drinks Categories
            </h2>
            <p className="mt-3 text-muted-foreground max-w-2xl">
              Discover exceptional drinks from around the world, carefully
              curated for every occasion and palate.
            </p>
          </div>
          <Button variant={"link"} asChild className="hidden md:flex ">
            <Link href="/category" className="flex items-center gap-1">
              View all categories <ChevronRight />
            </Link>
          </Button>
        </div>

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
            {categories.slice(0, 4).map((category) => (
              <CategoryCard key={category.name} category={category} />
            ))}
          </div>
        ) : null}

        <div className="mt-8 flex justify-center md:hidden">
          <Button variant="outline" className="gap-2" asChild>
            <Link href={"/category"}>
              View all categories <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ExploreCategories;
