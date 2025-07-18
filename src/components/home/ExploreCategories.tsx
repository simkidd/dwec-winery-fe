"use client";
import useCategories from "@/hooks/use-categories";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import CategoryCard from "../product/CategoryCard";
import { motion } from "framer-motion";
import Logo from "../shared/Logo";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const ExploreCategories = () => {
  const { categories, isPending } = useCategories();

  return (
    <section className="w-full py-16 bg-gray-50 dark:bg-stone-900/95">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end lg:mb-8 gap-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
              Our Categories
            </h2>
            <p className="mt-3 text-stone-600 dark:text-stone-400 max-w-2xl">
              Explore an irresistible selection from over 1,000 premium brands
            </p>
          </div>
          <div>
            <Button variant={"link"} asChild className="hidden md:flex group">
              <Link href="/category" className="flex items-center gap-1">
                <span className="text-primary dark:text-stone-300 group-hover:text-primary transition-colors">
                  Shop All Range
                </span>
                <ChevronRight className="h-5 w-5 text-primary dark:text-stone-400 group-hover:text-primary transition-colors" />
              </Link>
            </Button>
          </div>
        </div>

        {isPending ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="aspect-video rounded-lg relative overflow-hidden"
              >
                <Skeleton className="h-full w-full rounded-lg bg-stone-200 dark:bg-stone-800" />
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
                  <Logo className="w-20 h-20 opacity-20 dark:opacity-10 grayscale" />
                </motion.div>
              </div>
            ))}
          </div>
        ) : categories.length > 0 ? (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
          >
            <div className="relative">
              <Carousel
                opts={{
                  align: "start",
                  slidesToScroll: 1,
                }}
                className="w-full"
              >
                <CarouselContent className="-ml-4">
                  {categories.map((category) => (
                    <CarouselItem
                      key={category.name}
                      className="pl-4 flex-[0_0_45%] md:flex-[0_0_30%] lg:flex-[0_0_22%]"
                    >
                      <motion.div
                        variants={{
                          hidden: { y: 20, opacity: 0 },
                          visible: {
                            y: 0,
                            opacity: 1,
                            transition: {
                              duration: 0.5,
                              ease: "easeOut",
                            },
                          },
                        }}
                      >
                        <CategoryCard category={category} />
                      </motion.div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="hidden md:flex cursor-pointer disabled:hidden" />
                <CarouselNext className="hidden md:flex cursor-pointer disabled:hidden" />
              </Carousel>
            </div>
          </motion.div>
        ) : null}

        <motion.div
          className="mt-8 flex justify-center md:hidden"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <Button
            variant="outline"
            className="gap-2 border-stone-300 dark:border-stone-700 hover:border-primary"
            asChild
          >
            <Link href={"/category"}>
              <span className="text-stone-800 dark:text-stone-200">
                Shop All Range
              </span>
              <ChevronRight className="h-4 w-4 text-stone-600 dark:text-stone-400" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default ExploreCategories;
