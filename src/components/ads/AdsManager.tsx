/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { Eye, Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "../ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import AdForm from "./AdForm";

const AdsManager = () => {
  const { ads, isPending } = useAds(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [adToDelete, setAdToDelete] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const deleteAdMutation = useMutation({
    mutationFn: deleteAd,
    onSuccess: () => {
      toast.success("Ad deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["allAds"] });
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
                  <TableHead>Name</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Preview</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ads.map((ad) => (
                  <TableRow key={ad._id}>
                    <TableCell className="font-medium">{ad.name}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>
                          {formatDate(new Date(ad.validFrom), "MMM d, yyyy")}
                        </span>
                        <span className="text-muted-foreground text-xs">
                          to {formatDate(new Date(ad.expiresOn), "MMM d, yyyy")}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {ad.associatedProduct?.name || "N/A"}
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
                      <div className="relative w-20 h-10 rounded-md overflow-hidden border">
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
                    <TableCell>
                      <div className="flex gap-2">
                        <Tooltip>
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
                        </Tooltip>

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
    </div>
  );
};

export default AdsManager;
