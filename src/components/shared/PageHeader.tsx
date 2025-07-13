"use client"
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Image from "next/image";

const PageHeader = ({
  title,
  description,
  image,
  className,
}: {
  title: string;
  description?: string;
  image?: string;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "w-full h-48 md:h-64 lg:h-80 xl:h-96 relative flex items-center overflow-hidden",
        className
      )}
    >
      {/* Background Image with Overlay */}
      {image && (
        <>
          <div className="absolute inset-0">
            <Image
              src={image}
              alt=""
              fill
              className="object-cover"
              priority
              quality={80}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 to-stone-900/40 dark:from-stone-900/90 dark:to-stone-900/60" />
        </>
      )}

      {/* Fallback background when no image */}
      {!image && (
        <div className="absolute inset-0 bg-gradient-to-r from-stone-500 to-stone-200 dark:from-stone-800 dark:to-stone-900" />
      )}

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-stone-100 dark:text-stone-50">
            {title}
          </h1>
          {description && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="mt-4 text-lg text-stone-200 dark:text-stone-300 max-w-3xl"
            >
              {description}
            </motion.p>
          )}
        </motion.div>
      </div>

      {/* Decorative elements */}
      <motion.div 
        className="absolute bottom-0 left-0 w-full h-1 bg-primary"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      />
    </div>
  );
};

export default PageHeader;