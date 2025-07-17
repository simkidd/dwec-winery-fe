"use client";
import useCategories from "@/hooks/use-categories";
import {
  resetFilter,
  setFilter,
} from "@/store/features/products/product.slice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { ChevronDown, ChevronUp, FilterX } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Skeleton } from "../ui/skeleton";
import { Slider } from "../ui/slider";
import { ScrollArea } from "../ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import { usePathname } from "next/navigation";

const ProductFilter = () => {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { filter } = useAppSelector((state) => state.product);
  const { categories, isPending: categoriesLoading } = useCategories();
  const isMobile = useIsMobile();

  const isCategoryPage = pathname.includes("/category/");

  // Local filter state (only applied when clicking Apply)
  const [localFilters, setLocalFilters] = useState({
    minPrice: filter.minPrice || "",
    maxPrice: filter.maxPrice || "",
    category: filter.category || [],
  });

  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [expandedSections, setExpandedSections] = useState({
    price: true,
    category: true,
    brand: true,
  });

  // Initialize local state when filters change
  useEffect(() => {
    setLocalFilters({
      minPrice: filter.minPrice || "",
      maxPrice: filter.maxPrice || "",
      category: filter.category || [],
    });
  }, [filter]);

  const toggleSection = (section: "price" | "category" | "brand") => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    setLocalFilters((prev) => ({
      ...prev,
      category: checked
        ? [...prev.category, categoryId]
        : prev.category.filter((id) => id !== categoryId),
    }));
  };

  const handlePriceRangeChange = (values: number[]) => {
    setPriceRange(values);
    setLocalFilters((prev) => ({
      ...prev,
      minPrice: values[0].toString(),
      maxPrice: values[1].toString(),
    }));
  };

  const applyFilters = () => {
    dispatch(
      setFilter({
        minPrice: localFilters.minPrice,
        maxPrice: localFilters.maxPrice,
        category: localFilters.category,
      })
    );
  };

  const handleResetFilters = () => {
    dispatch(resetFilter());
    setLocalFilters({
      minPrice: "",
      maxPrice: "",
      category: [],
    });
    setPriceRange([0, 1000000]);
  };

  if (isMobile) {
    return (
      <Drawer>
        <DrawerTrigger asChild>
          <Button variant={"outline"} className="rounded-sm">
            <FilterX />
            Filters
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Filters</DrawerTitle>
          </DrawerHeader>
          <ScrollArea className="h-[50vh] px-4">
            <div className={`w-full space-y-6`}>
              {/* Category Filter Section */}
              {!isCategoryPage && (
                <div className="space-y-4 border-b pb-4">
                  <button
                    className="flex items-center justify-between w-full"
                    onClick={() => toggleSection("category")}
                  >
                    <h4 className="font-medium">Categories</h4>
                    {expandedSections.category ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </button>

                  {expandedSections.category && (
                    <ScrollArea className="h-32 w-full">
                      <div className="space-y-3 pt-2">
                        {categoriesLoading
                          ? [...Array(5)].map((_, i) => (
                              <div
                                key={i}
                                className="flex items-center space-x-2"
                              >
                                <Skeleton className="h-4 w-4 rounded-sm" />
                                <Skeleton className="h-4 w-24" />
                              </div>
                            ))
                          : categories.map((category) => (
                              <div
                                key={category._id}
                                className="flex items-center space-x-2"
                              >
                                <Checkbox
                                  id={`cat-${category._id}`}
                                  checked={localFilters.category.includes(
                                    category._id
                                  )}
                                  onCheckedChange={(checked) =>
                                    handleCategoryChange(
                                      category._id,
                                      checked as boolean
                                    )
                                  }
                                />
                                <Label
                                  htmlFor={`cat-${category._id}`}
                                  className="font-normal"
                                >
                                  {category.name}
                                </Label>
                              </div>
                            ))}
                      </div>
                    </ScrollArea>
                  )}
                </div>
              )}

              {/* Brand Filter Section */}
              {/* <div className="space-y-4 border-b pb-4">
                <button
                  className="flex items-center justify-between w-full"
                  onClick={() => toggleSection("brand")}
                >
                  <h4 className="font-medium">Brand</h4>
                  {expandedSections.brand ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </button>

                {expandedSections.brand && (
                  <div className="space-y-4 pt-2">
                    <span className="text-gray-500 italic">Coming soon</span>
                  </div>
                )}
              </div> */}

              {/* Price Filter Section */}
              <div className="space-y-4 border-b pb-4">
                <button
                  className="flex items-center justify-between w-full"
                  onClick={() => toggleSection("price")}
                >
                  <h4 className="font-medium">Price Range</h4>
                  {expandedSections.price ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </button>

                {expandedSections.price && (
                  <div className="space-y-4 pt-2">
                    <Slider
                      min={0}
                      max={1000000}
                      step={10}
                      value={priceRange}
                      onValueChange={handlePriceRangeChange}
                      className="w-full"
                    />
                    <div className="flex items-center gap-4">
                      <div className="space-y-1 flex-1">
                        <Label htmlFor="min-price">Min</Label>
                        <Input
                          id="min-price"
                          type="number"
                          value={localFilters.minPrice}
                          placeholder="Min price"
                          min={0}
                          className="focus-visible:ring-0 shadow-none rounded-sm"
                          onChange={(e) =>
                            setLocalFilters((prev) => ({
                              ...prev,
                              minPrice: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="space-y-1 flex-1">
                        <Label htmlFor="max-price">Max</Label>
                        <Input
                          id="max-price"
                          type="number"
                          value={localFilters.maxPrice}
                          placeholder="Max price"
                          min={0}
                          className="focus-visible:ring-0 shadow-none rounded-sm"
                          onChange={(e) =>
                            setLocalFilters((prev) => ({
                              ...prev,
                              maxPrice: e.target.value,
                            }))
                          }
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </ScrollArea>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button
                variant="outline"
                className="flex-1 cursor-pointer rounded-sm"
                disabled={categoriesLoading}
                onClick={handleResetFilters}
              >
                Reset
              </Button>
            </DrawerClose>
            <DrawerClose asChild>
              <Button
                className="flex-1 cursor-pointer rounded-sm"
                disabled={categoriesLoading}
                onClick={applyFilters}
              >
                Apply Filters
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <div className={`w-full h-full space-y-6`}>
      {/* Category Filter Section */}
      {!isCategoryPage && (
        <div className="space-y-4 border-b pb-4">
          <button
            className="flex items-center justify-between w-full"
            onClick={() => toggleSection("category")}
          >
            <h4 className="font-medium">Categories</h4>
            {expandedSections.category ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>

          {expandedSections.category && (
            <ScrollArea className="h-32  w-full">
              <div className="space-y-3 pt-2">
                {categoriesLoading
                  ? [...Array(5)].map((_, i) => (
                      <div key={i} className="flex items-center space-x-2">
                        <Skeleton className="h-4 w-4 rounded-sm" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    ))
                  : categories.map((category) => (
                      <div
                        key={category._id}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`cat-${category._id}`}
                          checked={localFilters.category.includes(category._id)}
                          onCheckedChange={(checked) =>
                            handleCategoryChange(
                              category._id,
                              checked as boolean
                            )
                          }
                        />
                        <Label
                          htmlFor={`cat-${category._id}`}
                          className="font-normal"
                        >
                          {category.name}
                        </Label>
                      </div>
                    ))}
              </div>
            </ScrollArea>
          )}
        </div>
      )}

      {/* Brand Filter Section */}
      {/* <div className="space-y-4 border-b pb-4">
        <button
          className="flex items-center justify-between w-full"
          onClick={() => toggleSection("brand")}
        >
          <h4 className="font-medium">Brand</h4>
          {expandedSections.brand ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>

        {expandedSections.brand && (
          <div className="space-y-4 pt-2">
            <span className="text-gray-500 italic">Coming soon</span>
          </div>
        )}
      </div> */}

      {/* Price Filter Section */}
      <div className="space-y-4 border-b pb-4">
        <button
          className="flex items-center justify-between w-full"
          onClick={() => toggleSection("price")}
        >
          <h4 className="font-medium">Filter By Price</h4>
          {expandedSections.price ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>

        {expandedSections.price && (
          <div className="space-y-4 pt-2">
            <Slider
              min={0}
              max={1000000}
              step={10}
              value={priceRange}
              onValueChange={handlePriceRangeChange}
              className="w-full"
            />
            <div className="flex items-center gap-4">
              <div className="space-y-1 flex-1">
                <Label htmlFor="min-price">Min</Label>
                <Input
                  id="min-price"
                  type="number"
                  value={localFilters.minPrice}
                  placeholder="Min price"
                  min={0}
                  className="focus-visible:ring-0 shadow-none rounded-sm"
                  onChange={(e) =>
                    setLocalFilters((prev) => ({
                      ...prev,
                      minPrice: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-1 flex-1">
                <Label htmlFor="max-price">Max</Label>
                <Input
                  id="max-price"
                  type="number"
                  value={localFilters.maxPrice}
                  placeholder="Max price"
                  min={0}
                  className="focus-visible:ring-0 shadow-none rounded-sm"
                  onChange={(e) =>
                    setLocalFilters((prev) => ({
                      ...prev,
                      maxPrice: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          variant="outline"
          className="flex-1 cursor-pointer rounded-sm"
          disabled={categoriesLoading}
          onClick={handleResetFilters}
        >
          Reset
        </Button>
        <Button
          className="flex-1 cursor-pointer rounded-sm"
          disabled={categoriesLoading}
          onClick={applyFilters}
        >
          Apply Filters
        </Button>
      </div>
    </div>
  );
};

export default ProductFilter;
