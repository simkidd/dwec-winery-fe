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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { IProduct } from "@/interfaces/product.interface";
import { Search } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

interface ProductSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  searchTerm: string;
  onSearch: (term: string) => void;
  products: IProduct[];
  isLoading: boolean;
  isFetchingNextPage: boolean;
  selectedValue: string;
  onSelect: (value: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
  selectedProduct?: IProduct;
  loadMore: () => void;
  hasMore: boolean;
}

export const ProductSelectionDialog = ({
  open,
  onOpenChange,
  title,
  searchTerm,
  onSearch,
  products,
  isLoading,
  isFetchingNextPage,
  selectedValue,
  onSelect,
  onConfirm,
  onCancel,
  selectedProduct,
  loadMore,
  hasMore,
}: ProductSelectionDialogProps) => {
  const [displayedProducts, setDisplayedProducts] = useState<IProduct[]>([]);

  // Combine selected product with filtered results if needed
  useEffect(() => {
    if (
      selectedProduct &&
      !products.some((p) => p._id === selectedProduct._id)
    ) {
      setDisplayedProducts([selectedProduct, ...products]);
    } else {
      setDisplayedProducts(products);
    }
  }, [products, selectedProduct]);

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
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            className="pl-10 focus-visible:ring-0 focus-visible:border-primary shadow-none"
            value={searchTerm}
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
        <ScrollArea className="max-h-[240px]" onScroll={handleScroll}>
          {isLoading && displayedProducts.length === 0 ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-3 p-2">
                  <Skeleton className="h-4 w-4 rounded-full" />
                  <Skeleton className="h-12 w-12 rounded-md" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              ))}
            </div>
          ) : displayedProducts.length > 0 ? (
            <>
              <RadioGroup
                value={selectedValue}
                onValueChange={onSelect}
                className="divide-y gap-0"
              >
                {displayedProducts.map((product) => (
                  <div
                    key={product._id}
                    className={`flex items-center p-2 cursor-pointer hover:bg-accent ${
                      selectedValue === product._id ? "bg-accent" : ""
                    }`}
                    onClick={() => onSelect(product._id)}
                  >
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value={product._id} id={product._id} />
                      {product.images?.length > 0 && (
                        <div className="relative w-12 h-12 rounded-md overflow-hidden bg-primary/10">
                          <Image
                            src={product.images[0]}
                            alt={product.name}
                            width={50}
                            height={50}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      )}
                      <label
                        htmlFor={product._id}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {product.name}
                      </label>
                    </div>
                  </div>
                ))}
              </RadioGroup>
              {isFetchingNextPage && (
                <div className="flex justify-center p-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              No products found
            </div>
          )}
        </ScrollArea>
        <DialogFooter className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="button" disabled={!selectedValue} onClick={onConfirm}>
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
