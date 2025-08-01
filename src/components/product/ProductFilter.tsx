"use client";
import { useIsMobile } from "@/hooks/use-mobile";
import { setFilter } from "@/store/features/products/product.slice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { FilterX } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTrigger,
} from "../ui/drawer";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { ScrollArea } from "../ui/scroll-area";
import { Slider } from "../ui/slider";
import { useQuery } from "@tanstack/react-query";
import { getSubcategoriesByCategoryId } from "@/lib/api/products";
import { ICategory, ISubCategory } from "@/interfaces/product.interface";
import { Skeleton } from "../ui/skeleton";
import Link from "next/link";

const ProductFilter = ({ category }: { category?: ICategory }) => {
  const dispatch = useAppDispatch();
  const { filter } = useAppSelector((state) => state.product);
  // const { categories, isPending: categoriesLoading } = useCategories();
  const isMobile = useIsMobile();

  // Local filter state (only applied when clicking Apply)
  const [localFilters, setLocalFilters] = useState({
    minPrice: filter.minPrice || "",
    maxPrice: filter.maxPrice || "",
  });

  const [priceRange, setPriceRange] = useState([0, 1000000]);

  const { data: subcategories, isPending: loadingSubcategories } = useQuery({
    queryKey: ["subcategories", category?._id],
    queryFn: () => getSubcategoriesByCategoryId(category?._id as string),
    select: (data) => data.subCategories as ISubCategory[],
    enabled: !!category?._id,
  });

  // Initialize local state when filters change
  useEffect(() => {
    setLocalFilters({
      minPrice: filter.minPrice || "",
      maxPrice: filter.maxPrice || "",
    });
  }, [filter]);

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
        ...filter,
        minPrice: localFilters.minPrice,
        maxPrice: localFilters.maxPrice,
      })
    );
  };

  // const handleResetFilters = () => {
  //   dispatch(resetFilter());
  //   setLocalFilters({
  //     minPrice: "",
  //     maxPrice: "",
  //   });
  //   setPriceRange([0, 1000000]);
  // };

  if (isMobile) {
    return (
      <div className="flex flex-col gap-4">
        {/* Filter Button */}
        <Drawer>
          <DrawerTrigger asChild>
            <Button variant={"outline"} className="rounded-sm cursor-pointer">
              <FilterX />
              Filters
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader></DrawerHeader>
            <ScrollArea className="h-[50vh] px-4">
              <div className={`w-full space-y-6`}>
                {/* sub Categories Links */}
                {category && (
                  <div className="space-y-2 ">
                    {loadingSubcategories ? (
                      <ul className="py-2 space-y-1 border-b">
                        {[...Array(5)].map((_, i) => (
                          <li key={i}>
                            <Skeleton className="h-8 w-full rounded-sm" />
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <>
                        {subcategories && subcategories?.length > 0 && (
                          <>
                            <h4 className="font-medium text-lg">
                              Sub Categories
                            </h4>
                            <ul className="py-2 space-y-1 border-b">
                              {subcategories.map((subcat) => (
                                <li key={subcat._id}>
                                  <Button
                                    variant="ghost"
                                    className="w-full justify-start font-normal"
                                    asChild
                                  >
                                    <Link
                                      href={`/category/${category?.slug}/${subcat.slug}`}
                                      className="text-sm"
                                    >
                                      {subcat.name}
                                    </Link>
                                  </Button>
                                </li>
                              ))}
                            </ul>
                          </>
                        )}
                      </>
                    )}
                  </div>
                )}

                {/* Price Filter Section */}
                <div className="space-y-4 border-b pb-4">
                  <h4 className="font-medium text-lg">Filter By Price</h4>

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
                </div>
              </div>
            </ScrollArea>
            <DrawerFooter>
              {/* <DrawerClose asChild>
                <Button
                  variant="outline"
                  className="flex-1 cursor-pointer rounded-sm"
                  onClick={handleResetFilters}
                >
                  Reset
                </Button>
              </DrawerClose> */}
              <DrawerClose asChild>
                <Button
                  className="flex-1 cursor-pointer rounded-sm"
                  onClick={applyFilters}
                >
                  Apply Filters
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* SubCategories Links */}
      {category && (
        <div className="space-y-2 ">
          {loadingSubcategories ? (
            <ul className="py-2 space-y-1 border-b">
              {[...Array(5)].map((_, i) => (
                <li key={i}>
                  <Skeleton className="h-8 w-full rounded-sm" />
                </li>
              ))}
            </ul>
          ) : (
            <>
              {subcategories && subcategories?.length > 0 && (
                <>
                  <h4 className="font-medium text-lg">Sub Categories</h4>
                  <ul className="py-2 space-y-1 border-b">
                    {subcategories.map((subcat) => (
                      <li key={subcat._id}>
                        <Button
                          variant="ghost"
                          className="w-full justify-start font-normal"
                          asChild
                        >
                          <Link
                            href={`/category/${category?.slug}/${subcat.slug}`}
                            className="text-sm"
                          >
                            {subcat.name}
                          </Link>
                        </Button>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </>
          )}
        </div>
      )}
      {/* Price Filter Section */}
      <div className="space-y-4 border-b pb-4">
        <div className="flex items-baseline justify-between">
          <h4 className="font-medium text-lg">Filter By Price</h4>

          <Button
            variant={"link"}
            className="cursor-pointer"
            onClick={applyFilters}
          >
            Apply
          </Button>
        </div>

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
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        {/* <Button
          variant="outline"
          className="flex-1 cursor-pointer rounded-sm"
          onClick={handleResetFilters}
        >
          Reset
        </Button> */}
        {/* <Button
          className="ms-auto cursor-pointer rounded-sm"
          onClick={applyFilters}
        >
          Apply Filters
        </Button> */}
      </div>
    </div>
  );
};

export default ProductFilter;
