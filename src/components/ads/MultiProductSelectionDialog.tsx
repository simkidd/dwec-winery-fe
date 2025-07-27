"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, Search } from "lucide-react";
import Image from "next/image";
import { IProduct } from "@/interfaces/product.interface";
import { useState, useEffect } from "react";

interface MultiProductSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  searchTerm: string;
  onSearch: (term: string) => void;
  products: IProduct[];
  isLoading: boolean;
  isFetchingNextPage: boolean;
  selectedValues: string[];
  onSelect: (values: string[]) => void;
  onConfirm: () => void;
  onCancel: () => void;
  selectedProducts?: IProduct[];
  loadMore: () => void;
  hasMore: boolean;
}

export const MultiProductSelectionDialog = ({
  open,
  onOpenChange,
  title,
  searchTerm,
  onSearch,
  products,
  isLoading,
  isFetchingNextPage,
  selectedValues,
  onSelect,
  onConfirm,
  onCancel,
  selectedProducts = [],
  loadMore,
  hasMore,
}: MultiProductSelectionDialogProps) => {
  const [displayedProducts, setDisplayedProducts] = useState<IProduct[]>([]);

  // Combine selected products with filtered results
  useEffect(() => {
    const combined = [
      ...selectedProducts.filter(
        (selected) => !products.some((p) => p._id === selected._id)
      ),
      ...products,
    ];
    setDisplayedProducts(combined);
  }, [products, selectedProducts]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (
      scrollHeight - scrollTop <= clientHeight + 50 &&
      hasMore &&
      !isFetchingNextPage
    ) {
      loadMore();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            className="pl-10 focus-visible:ring-0 focus-visible:border-primary shadow-none"
            value={searchTerm}
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
        <ScrollArea className="max-h-[240px]" onScroll={handleScroll}>
          {isLoading && products.length === 0 ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-3 p-2">
                  <Skeleton className="h-4 w-4 rounded" />
                  <Skeleton className="h-12 w-12 rounded-md" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              ))}
            </div>
          ) : displayedProducts.length > 0 ? (
            <>
              <div className="divide-y">
                {displayedProducts.map((product) => (
                  <div
                    key={product._id}
                    className={`flex items-center p-2 cursor-pointer hover:bg-accent ${
                      selectedValues.includes(product._id) ? "bg-accent" : ""
                    }`}
                    onClick={() => {
                      const newValues = selectedValues.includes(product._id)
                        ? selectedValues.filter((id) => id !== product._id)
                        : [...selectedValues, product._id];
                      onSelect(newValues);
                    }}
                  >
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id={`other-${product._id}`}
                        checked={selectedValues.includes(product._id)}
                        onCheckedChange={(checked) => {
                          const newValues = checked
                            ? [...selectedValues, product._id]
                            : selectedValues.filter((id) => id !== product._id);
                          onSelect(newValues);
                        }}
                      />
                      {product.images?.length > 0 && (
                        <div className="relative w-12 h-12 rounded-md overflow-hidden">
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <label
                        htmlFor={`other-${product._id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {product.name}
                      </label>
                    </div>
                  </div>
                ))}
              </div>
              {isFetchingNextPage && (
                <div className="flex justify-center p-4">
                  <Loader2 className="h-5 w-5 animate-spin" />
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-4 text-muted-foreground">
              No products found
            </div>
          )}
        </ScrollArea>
        <DialogFooter className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="button" onClick={onConfirm}>
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
