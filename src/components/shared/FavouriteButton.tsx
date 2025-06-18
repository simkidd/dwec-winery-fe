"use client";
import { cn } from "@/lib/utils";
import { Heart } from "lucide-react";
import { Button } from "../ui/button";

interface FavouriteButtonProps {
  isHovered: boolean;
  isFavorite: boolean;
  className?: string;
  onClick: (e: React.MouseEvent) => void;
}

const FavouriteButton = ({
  isHovered,
  isFavorite,
  className,
  onClick,
}: FavouriteButtonProps) => {
  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn(
        "absolute top-2 right-2 rounded-full bg-background/80 backdrop-blur-sm transition-all duration-500 ease-in-out cursor-pointer z-[2]",
        isHovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2",
        className
      )}
      onClick={onClick}
    >
      <Heart
        className={`h-4 w-4 ${
          isFavorite ? "fill-primary text-primary" : "text-muted-foreground"
        }`}
      />
    </Button>
  );
};

export default FavouriteButton;
