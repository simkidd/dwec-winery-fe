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
import useAds from "@/hooks/use-ads";
import { deleteAd } from "@/lib/api/products";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import AdForm from "./AdForm";
import AdsTable from "./AdsTable";

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
            <AdsTable
              ads={ads}
              onDelete={handleDelete}
              isDeleting={deleteAdMutation.isPending}
              onPreviewImage={openImagePreview}
            />
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
