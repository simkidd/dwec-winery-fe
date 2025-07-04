"use client";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { IBlogPost } from "@/interfaces/blog.interface";
import { deletePost } from "@/lib/api/blog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Edit, Loader2, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { blogPosts } from "./blog-posts";
import BlogForm, { BlogFormRef } from "./BlogForm";

const BlogManager = () => {
  const [showBlogForm, setShowBlogForm] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);
  const [currentPost, setCurrentPost] = useState<IBlogPost | null>(null);
  const formRef = useRef<BlogFormRef>(null);
  const queryClient = useQueryClient();

  const handleSubmit = async () => {
    if (formRef.current) {
      const result = await formRef.current.submitForm();
      if (result) {
        setShowBlogForm(false);
        setCurrentPost(null);
      }
    }
  };

  const handleEdit = (post: IBlogPost) => {
    setCurrentPost(post);
    setShowBlogForm(true);
  };

  const handleDeleteClick = (postId: string) => {
    setPostToDelete(postId);
    setShowDeleteDialog(true);
  };

  const deletePostMutation = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      toast.success("Post deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
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

  return (
    <div>
      <div className="container mx-auto px-4 py-8 flex justify-end">
        <Button
          className="cursor-pointer"
          onClick={() => {
            setCurrentPost(null);
            setShowBlogForm(true);
          }}
        >
          New Post
        </Button>

        {/* Blog Form Dialog */}
        <Dialog
          open={showBlogForm}
          onOpenChange={() => {
            setShowBlogForm(false);
            setCurrentPost(null);
          }}
        >
          <DialogContent className="!max-w-4xl">
            <DialogHeader>
              <DialogTitle>
                {currentPost ? "Edit Post" : "New Post"}
              </DialogTitle>
            </DialogHeader>
            <BlogForm ref={formRef} initialValues={currentPost as IBlogPost} />
            <DialogFooter>
              <Button
                type="button"
                variant={"ghost"}
                className="cursor-pointer"
                onClick={() => {
                  setShowBlogForm(false);
                  setCurrentPost(null);
                }}
              >
                Cancel
              </Button>
              <Button
                type="button"
                disabled={formRef.current?.isSubmitting}
                className="cursor-pointer"
                onClick={handleSubmit}
              >
                {formRef.current?.isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {currentPost ? "Updating..." : "Creating..."}
                  </>
                ) : currentPost ? (
                  "Update Post"
                ) : (
                  "Create Post"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

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

      <div className="container mx-auto px-4">
        <div className="grid gap-6 md:grid-cols-3">
          {blogPosts.map((post) => (
            <div key={post.id} className="group relative">
              <Link href={`/blog/${post.slug}`} className="block">
                <div className="relative mb-4 h-48 overflow-hidden rounded-lg">
                  <Image
                    src={post.imageUrl}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <h5 className="mb-1 text-sm font-medium text-primary">
                  {post.category}
                </h5>
                <h3 className="text-lg font-bold group-hover:text-primary">
                  {post.title}
                </h3>
              </Link>

              <div className="flex items-center justify-end gap-2 mt-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleEdit(post)}
                  className="cursor-pointer"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => handleDeleteClick(post.id)}
                  className="cursor-pointer"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogManager;
