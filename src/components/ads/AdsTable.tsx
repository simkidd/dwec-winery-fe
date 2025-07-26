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
import { Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import { formatDate } from "date-fns";
import AdForm from "./AdForm";
import { IAds } from "@/interfaces/ads.interface";

interface AdsTableProps {
  ads: IAds[];
  onDelete: (id: string) => void;
  isDeleting: boolean;
  onPreviewImage: (imageUrl: string) => void;
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
}: AdsTableProps) => {
  return (
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
  );
};

export default AdsTable;
