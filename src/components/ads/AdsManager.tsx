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
                  <TableHead>Preview</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Position</TableHead>
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
                      <div
                        className="relative w-20 h-10 rounded-md overflow-hidden border cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => ad.image && openImagePreview(ad.image)}
                      >
                        {ad.image ? (
                          <Image
                            src={ad.image}
                            alt={ad.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-muted"></div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium min-w-[200px] ">
                      <span className="line-clamp-2 text-wrap">{ad.name}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {formatPosition(ad.position)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {formatDate(new Date(ad.validFrom), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell>
                      {formatDate(new Date(ad.expiresOn), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell className="min-w-[150px] max-w-[160px]">
                      <span className="text-wrap line-clamp-2">
                        {ad.associatedProduct?.name || "N/A"}
                      </span>
                      {ad.otherAssociatedProducts?.length > 0 && (
                        <span className="text-muted-foreground text-xs block">
                          +{ad.otherAssociatedProducts.length} more
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={ad.isActive ? "default" : "secondary"}
                        className={
                          ad.isActive ? "bg-green-100 text-green-800" : ""
                        }
                      >
                        {ad.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <div className="flex gap-2">
                        {/* <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="cursor-pointer"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>View Info</TooltipContent>
                        </Tooltip> */}

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
