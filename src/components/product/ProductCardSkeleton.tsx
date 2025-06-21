import React from "react";
import { Skeleton } from "../ui/skeleton";
import Logo from "../shared/Logo";
import { motion } from "framer-motion";

const ProductCardSkeleton = () => {
  return (
    <div className="flex flex-col gap-2">
      <div className="relative">
        <Skeleton className="aspect-square rounded-sm" />
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
          <Logo className="w-16 h-16 opacity-20 grayscale-100" />
          {/* Adjust size as needed */}
        </motion.div>
      </div>

      <Skeleton className="h-4 w-3/4 mx-auto" />
      <Skeleton className="h-4 w-1/2 mx-auto" />
    </div>
  );
};

export default ProductCardSkeleton;
