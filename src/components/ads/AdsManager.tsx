"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useAds from "@/hooks/use-ads";
import { deleteAd } from "@/lib/api/products";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { formatDate } from "date-fns";
import { Loader2, Pencil, Plus, Trash2, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "../ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import AdForm from "./AdForm";

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

const AdsManager = () => {
  const queryClient = useQueryClient();
  const { ads, isPending } = useAds(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [adToDelete, setAdToDelete] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const deleteAdMutation = useMutation({
    mutationFn: deleteAd,
    onSuccess: () => {
      toast.success("Ad deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["allUserAds"] });
      queryClient.invalidateQueries({ queryKey: ["allAdminAds"] });
      setShowDeleteDialog(false);
    },
    onError: (error) => {
      toast.error("Failed to delete ad");
      console.error("Delete error:", error);
    },
  });

  const handleDelete = (id: string) => {
    setAdToDelete(id);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (adToDelete) {
      deleteAdMutation.mutate(adToDelete);
    }
  };

  const openImagePreview = (imageUrl: string) => {
    setPreviewImage(imageUrl);
  };

  const closeImagePreview = () => {
    setPreviewImage(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start gap-8">
            <div>
              <CardTitle>Promotional Ads</CardTitle>
              <CardDescription>
                Manage all advertisements and banners
              </CardDescription>
            </div>

            <AdForm>
              <Button className="cursor-pointer">
                <Plus className="h-4 w-4" />
                New Ad
              </Button>
            </AdForm>
          </div>
        </CardHeader>
        <CardContent>
          {isPending ? (
            <div className="flex items-center justify-center h-60">
              <Loader2 className="animate-spin text-primary" />
            </div>
          ) : (
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
                        {/* Handle legacy ads with just the image field */}
                        {!ad.banners?.length && ad.image && (
                          <div
                            className="relative w-16 h-10 rounded-md overflow-hidden border cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() =>
                              openImagePreview(ad?.image as string)
                            }
                          >
                            <Image
                              src={ad.image}
                              alt={ad.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}

                        {/* Handle new ads with banners array */}
                        {ad.banners?.length > 0 && (
                          <>
                            {ad.banners.slice(0, 2).map((banner, index) => (
                              <div
                                key={index}
                                className="relative w-16 h-10 rounded-md overflow-hidden border cursor-pointer hover:opacity-80 transition-opacity"
                                onClick={() => openImagePreview(banner.image)}
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

                        {/* Fallback for ads with no images */}
                        {!ad.banners?.length && !ad.image && (
                          <div className="w-16 h-10 bg-muted rounded-md"></div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      <div className="line-clamp-2">{ad.name}</div>
                      {ad.description && (
                        <div className="text-xs text-muted-foreground line-clamp-1">
                          {ad.description}
                        </div>
                      )}
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
                      <div className="flex flex-col">
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
                              onClick={() => handleDelete(ad._id)}
                              disabled={deleteAdMutation.isPending}
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
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Ad</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this ad? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              className="cursor-pointer"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="cursor-pointer"
              onClick={confirmDelete}
              disabled={deleteAdMutation.isPending}
            >
              {deleteAdMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Image Preview Dialog */}
      {previewImage !== null && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="relative w-auto h-auto max-w-[90vw] max-h-[90vh]">
              <Image
                src={previewImage}
                alt="Ad preview"
                width={1920}
                height={1080}
                className="object-contain w-full h-full"
                quality={100}
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 rounded-full bg-black/50 hover:bg-black/70 text-white hover:text-white cursor-pointer"
              onClick={closeImagePreview}
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdsManager;
