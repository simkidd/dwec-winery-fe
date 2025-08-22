"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import usePosts from "@/hooks/usePosts";
import { PostFilterInput } from "@/interfaces/blog.interface";
import { deletePost } from "@/lib/api/blog";
import { cn } from "@/lib/utils";
import { formatCategory, getPaginationRange } from "@/utils/helpers";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CalendarIcon,
  Edit,
  ImageIcon,
  Loader2,
  PlusIcon,
  Trash2,
  UploadIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";
import BlogForm from "./BlogForm";
import { Skeleton } from "../ui/skeleton";
import BlogStats from "./BlogStats";
import { Separator } from "../ui/separator";
import { formatDate } from "date-fns";

const BlogManager = () => {
  const queryClient = useQueryClient();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const [filter, setFilter] = useState<PostFilterInput>({
    page: 1,
    limit: 15,
  });

  const { posts, isPending, totalPages } = usePosts(filter);

  const handleDeleteClick = (postId: string) => {
    setPostToDelete(postId);
    setShowDeleteDialog(true);
  };

  const deletePostMutation = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      toast.success("Post deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["allPosts"] });
      queryClient.invalidateQueries({ queryKey: ["blog-stats"] });
      setShowDeleteDialog(false);
    },
    onError: (error) => {
      toast.error("Failed to delete post");
      console.error("Delete error:", error);
    },
  });

  const confirmDelete = () => {
    if (postToDelete) {
      deletePostMutation.mutate(postToDelete);
    }
  };

  const onPaginationChange = (page: number) => {
    setFilter({ ...filter, page });
  };

  const PostSkeleton = () => (
    <div className="space-y-4">
      <Skeleton className="h-48 w-full rounded-lg" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-5 w-3/4" />
      </div>
      <div className="flex justify-end gap-2">
        <Skeleton className="h-8 w-8 rounded-md" />
        <Skeleton className="h-8 w-8 rounded-md" />
      </div>
    </div>
  );

  return (
    <div>
      <div className="container mx-auto px-4 py-8">
        <BlogStats />
      </div>
      <Separator />
      <div className="container mx-auto px-4 py-8 flex justify-end">
        <BlogForm>
          <Button className="cursor-pointer">
            <PlusIcon className="h-4 w-4" />
            New Post
          </Button>
        </BlogForm>

        {/* Delete Confirmation Dialog */}
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Post</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this post? This action cannot be
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
                disabled={deletePostMutation.isPending}
              >
                {deletePostMutation.isPending ? (
                  <>
                    <Loader2 className=" h-4 w-4 animate-spin" />
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

      <div className="container mx-auto px-4 py-8 mb-8">
        {isPending ? (
          <div className="grid gap-6 md:grid-cols-3">
            {[...Array(6)].map((_, index) => (
              <PostSkeleton key={index} />
            ))}
          </div>
        ) : posts.length === 0 ? (
          // Empty state
          <div className="text-center py-12">
            <p className="text-muted-foreground">No posts found</p>
          </div>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-3 mb-10">
              {posts.map((post) => (
                <div key={post._id} className="group relative">
                  <Link href={`/blog/${post.slug}`} className="block">
                    <div className="relative mb-4 h-48 overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
                      {post.image?.imageUrl ? (
                        <Image
                          src={post.image.imageUrl}
                          alt={post.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400">
                          <ImageIcon className="h-12 w-12 mb-2" />
                          <span className="text-sm">No image</span>
                        </div>
                      )}
                    </div>
                    <h5 className="mb-1 text-sm font-medium text-primary">
                      {formatCategory(post.category)}
                    </h5>
                    <h3 className="text-lg font-bold group-hover:text-primary mb-2">
                      {post.title}
                    </h3>

                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="h-3 w-3" />
                        <span>
                          {formatDate(post.createdAt, "MMM dd, yyyy")}
                        </span>
                      </div>
                      {post.publishedAt && (
                        <>
                          <Separator orientation="vertical" className="h-3" />
                          <div className="flex items-center gap-1">
                            <UploadIcon className="h-3 w-3" />
                            <span>
                              {formatDate(post.publishedAt, "MMM dd, yyyy")}
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </Link>

                  <div className="flex items-center justify-end gap-2 mt-2">
                    <BlogForm initialValues={post}>
                      <Button
                        variant="outline"
                        size="icon"
                        className="cursor-pointer"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </BlogForm>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDeleteClick(post._id)}
                      className="cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {posts.length > 0 && totalPages > 1 && (
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => onPaginationChange(filter?.page - 1)}
                      aria-disabled={filter.page === 1}
                      className={cn(
                        "cursor-pointer",
                        filter.page === 1 && "pointer-events-none opacity-50"
                      )}
                    />
                  </PaginationItem>

                  {getPaginationRange(filter.page, totalPages).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        className="cursor-pointer"
                        isActive={page === filter.page}
                        onClick={() => onPaginationChange(page)}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => onPaginationChange(filter.page + 1)}
                      aria-disabled={filter.page >= totalPages}
                      className={cn(
                        "cursor-pointer",
                        filter.page >= totalPages &&
                          "pointer-events-none opacity-50"
                      )}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BlogManager;