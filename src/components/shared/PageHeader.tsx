import { cn } from "@/lib/utils";
import React from "react";

const PageHeader = ({
  title,
  description,
  image,
}: {
  title: string;
  description?: string;
  image?: string;
}) => {
  return (
    <div
      className={cn(
        "w-full h-40 lg:h-60 relative flex items-center",
        ` bg-no-repeat bg-cover bg-center`
      )}
      style={{ backgroundImage: `url(${image})` }}
    >
      {/* Overlay for better text visibility */}
      <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800"></div>
      <div className="container mx-auto px-4 relative z-10 flex flex-col items-center">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
          {title}
        </h1>
        {description && (
          <p className="text-muted-foreground mt-2 max-w-2xl">{description}</p>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
