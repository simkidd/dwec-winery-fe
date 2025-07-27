"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import { formatDate } from "date-fns";
import AdForm from "./AdForm";
import { IAds } from "@/interfaces/ads.interface";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface AdsTableProps {
  ads: IAds[];
  onDelete: (id: string) => void;
  isDeleting: boolean;
  onPreviewImage: (imageUrl: string) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageSize: number;
  onPageSizeChange: (size: number) => void;
  totalItems: number;
}

const formatPosition = (position: string) => {
  const positionMap: Record<string, string> = {
    hero: "Hero",
    featured: "Featured",
    sidebar: "Sidebar",
    promotion: "Promotion",
    main: "Main",
    product: "Product",
    footer: "Footer",
  };
  return positionMap[position] || position;
};

const AdsTable = ({
  ads,
  onDelete,
  isDeleting,
  onPreviewImage,
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  onPageSizeChange,
  totalItems,
}: AdsTableProps) => {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div>
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Preview</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Positions</TableHead>
              <TableHead>Valid From</TableHead>
              <TableHead>Expires On</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ads.map((ad) => (
              <TableRow key={ad._id}>
                <TableCell>
                  <div className="flex gap-2">
                    {!ad.banners?.length && ad.image && (
                      <div
                        className="relative w-16 h-10 rounded-md overflow-hidden border cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => onPreviewImage(ad?.image as string)}
                      >
                        <Image
                          src={ad.image}
                          alt={ad.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}

                    {ad.banners?.length > 0 && (
                      <>
                        {ad.banners.slice(0, 2).map((banner, index) => (
                          <div
                            key={index}
                            className="relative w-16 h-10 rounded-md overflow-hidden border cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => onPreviewImage(banner.image)}
                          >
                            <Image
                              src={banner.image}
                              alt={`${ad.name} - ${banner.position}`}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ))}
                        {ad.banners.length > 2 && (
                          <div className="flex items-center justify-center text-xs text-muted-foreground">
                            +{ad.banners.length - 2} more
                          </div>
                        )}
                      </>
                    )}

                    {!ad.banners?.length && !ad.image && (
                      <div className="w-16 h-10 bg-muted rounded-md"></div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-medium max-w-[240px] text-wrap">
                    <div className="line-clamp-2">{ad.name}</div>
                    {ad.description && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="text-xs text-muted-foreground line-clamp-1">
                            {ad.description}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>{ad.description}</TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1 max-w-[200px]">
                    {ad.banners?.map((banner) => (
                      <Badge
                        key={banner.position}
                        variant="outline"
                        className="capitalize"
                      >
                        {formatPosition(banner.position)}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-sm">
                      {formatDate(new Date(ad.validFrom), "MMM d, yyyy")}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-sm">
                      {formatDate(new Date(ad.expiresOn), "MMM d, yyyy")}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col min-w-[150px] max-w-[200px] text-wrap">
                    <span className="line-clamp-1">
                      {ad.associatedProduct?.name || "N/A"}
                    </span>
                    {ad.otherAssociatedProducts?.length > 0 && (
                      <span className="text-xs text-muted-foreground">
                        +{ad.otherAssociatedProducts.length} more
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={ad.isActive ? "default" : "secondary"}
                    className={
                      ad.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }
                  >
                    {ad.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <AdForm initialValues={ad}>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="cursor-pointer"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </AdForm>
                      </TooltipTrigger>
                      <TooltipContent>Edit</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive cursor-pointer"
                          onClick={() => onDelete(ad._id)}
                          disabled={isDeleting}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Delete</TooltipContent>
                    </Tooltip>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2 mt-8">
        {/* Mobile: Compact Info */}
        <div className="sm:hidden text-sm text-muted-foreground">
          Page {currentPage} of {totalPages}
        </div>

        {/* Desktop: Full Info */}
        <div className="hidden sm:block flex-1 text-sm text-muted-foreground">
          Showing {(currentPage - 1) * pageSize + 1} to{" "}
          {Math.min(currentPage * pageSize, totalItems)} of {totalItems} ads
        </div>

        <div className="flex items-center gap-4 w-full sm:w-auto">
          {/* Rows per page selector - always visible */}
          <div className="flex items-center space-x-2">
            <p className="hidden sm:block text-sm font-medium">Rows</p>
            <Select
              value={`${pageSize}`}
              onValueChange={(value) => onPageSizeChange(Number(value))}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {[5, 10, 20].map((size) => (
                  <SelectItem key={size} value={`${size}`}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Pagination buttons */}
          <div className="flex items-center gap-1 sm:gap-2 ml-auto">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 sm:h-8 sm:w-8"
              onClick={handlePrevious}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {/* Page numbers - hidden on mobile */}
            <div className="hidden sm:flex items-center gap-1">
              {currentPage > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 cursor-pointer"
                  onClick={() => onPageChange(1)}
                >
                  1
                </Button>
              )}
              {currentPage > 3 && <span className="px-1">...</span>}
              {currentPage > 2 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 cursor-pointer"
                  onClick={() => onPageChange(currentPage - 1)}
                >
                  {currentPage - 1}
                </Button>
              )}
              <Button variant="default" size="sm" className="h-8 w-8" disabled>
                {currentPage}
              </Button>
              {currentPage < totalPages - 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 cursor-pointer"
                  onClick={() => onPageChange(currentPage + 1)}
                >
                  {currentPage + 1}
                </Button>
              )}
              {currentPage < totalPages - 2 && (
                <span className="px-1">...</span>
              )}
              {currentPage < totalPages && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 cursor-pointer"
                  onClick={() => onPageChange(totalPages)}
                >
                  {totalPages}
                </Button>
              )}
            </div>

            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 sm:h-8 sm:w-8 cursor-pointer"
              onClick={handleNext}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdsTable;
