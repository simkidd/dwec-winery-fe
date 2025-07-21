"use client";
import { BlogCategory, IBlogPost } from "@/interfaces/blog.interface";
import { createPost, updatePost } from "@/lib/api/blog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { ImagePlus, Loader2, Tag, X } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useForm } from "react-hook-form";
import "react-quill-new/dist/quill.snow.css";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { ScrollArea } from "../ui/scroll-area";
import { Switch } from "../ui/switch";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => <p>Loading editor...</p>,
});

const formSchema = z.object({
  title: z.string().min(5, {
    message: "Title must be at least 5 characters.",
  }),
  content: z.string().min(100, {
    message: "Content must be at least 100 characters.",
  }),
  isPublished: z.boolean(),
  featured: z.boolean(),
  tags: z.array(z.string()),
  excerpt: z.string().min(20, {
    message: "Excerpt must be at least 20 characters.",
  }),
   category: z.nativeEnum(BlogCategory, {
    required_error: "Please select a category",
    invalid_type_error: "Please select a valid category",
  }),
});

export type BlogFormValues = z.infer<typeof formSchema>;

interface BlogFormProps {
  initialValues?: Partial<IBlogPost>;
  children?: React.ReactNode;
}

const BlogForm = ({ initialValues, children }: BlogFormProps) => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const form = useForm<BlogFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      isPublished: false,
      featured: false,
      tags: [],
      excerpt: "",
      category: undefined,
      ...initialValues,
    },
  });

  useEffect(() => {
    if (initialValues) {
      form.reset({
        ...initialValues,
        category: initialValues.category || undefined,
        tags: initialValues.tags || [],
        isPublished: initialValues.isPublished || false,
        featured: initialValues.featured || false,
      });
      if (initialValues.image?.imageUrl) {
        setPreviewImage(initialValues.image.imageUrl);
      }
    }
  }, [initialValues, form]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        setImageFile(file);
        setPreviewImage(URL.createObjectURL(file));
      }
    },
  });

  const createPostMutation = useMutation({
    mutationFn: (data: FormData) => createPost(data),
    onSuccess: async (data) => {
      toast.success(data?.message || "Post created successfully!");
      queryClient.invalidateQueries({ queryKey: ["allPosts"] });
      handleClose();
    },
    onError: (error: AxiosError<{ message: string }>) => {
      console.error("Error creating post:", error);
      toast.error(error?.response?.data?.message || "Failed to create post");
    },
  });

  const updatePostMutation = useMutation({
    mutationFn: (data: FormData) =>
      updatePost(data, initialValues?._id as string),
    onSuccess: async (data) => {
      toast.success(data?.message || "Post updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["allPosts"] });
      handleClose();
    },
    onError: (error: AxiosError<{ message: string }>) => {
      console.error("Error updating post:", error);
      toast.error(error?.response?.data?.message || "Failed to update post");
    },
  });

  const onSubmit = async (values: BlogFormValues) => {
    const formData = new FormData();

    // Append all fields
    formData.append("title", values.title);
    formData.append("content", values.content);
    formData.append("isPublished", String(values.isPublished));
    formData.append("featured", String(values.featured));
    formData.append("excerpt", String(values.excerpt));

    if (values.category) {
      formData.append("category", values.category);
    }

    // Handle tags
    values.tags.forEach((tag) => {
      formData.append("tags[]", tag);
    });

    // Handle image
    if (imageFile) {
      formData.append("file", imageFile);
    } else if (!previewImage && initialValues?.image?.imageUrl) {
      // If image was removed
      formData.append("removeImage", "true");
    }

    if (initialValues?._id) {
      updatePostMutation.mutate(formData);
    } else {
      createPostMutation.mutate(formData);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setPreviewImage(null);
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const newTag = tagInput.trim();
      if (newTag) {
        const currentTags = form.getValues("tags") || [];
        if (!currentTags.includes(newTag)) {
          form.setValue("tags", [...currentTags, newTag]);
        }
        setTagInput("");
      }
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const currentTags = form.getValues("tags") || [];
    form.setValue(
      "tags",
      currentTags.filter((tag) => tag !== tagToRemove)
    );
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "link",
    "image",
  ];

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      form.reset();
    }
    setOpen(isOpen);
  };

  const handleClose = () => {
    form.reset();
    setPreviewImage(null);
    setImageFile(null);
    setOpen(false);
  };

  const isLoading =
    createPostMutation.isPending || updatePostMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        className="!max-w-4xl"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>
            {initialValues?._id ? "Edit Post" : "New Post"}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[calc(100vh-200px)]">
          <Form {...form}>
            <form
              id="blog-form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 p-4"
            >
              {/* Image Upload */}

              <div className="space-y-4">
                <FormLabel>Image</FormLabel>
                {previewImage ? (
                  <div className="relative h-[300px] rounded-lg border-2 border-input border-dashed">
                    <Image
                      src={previewImage}
                      alt="Preview"
                      className="w-full h-full object-contain"
                      width={300}
                      height={300}
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full cursor-pointer"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div
                    {...getRootProps()}
                    className="border-2 border-input border-dashed rounded-lg text-center cursor-pointer hover:border-primary transition-colors  "
                  >
                    <input {...getInputProps()} />
                    <div className="flex flex-col items-center justify-center gap-2  h-[300px]">
                      <ImagePlus className="h-8 w-8 text-gray-400" />
                      <p className="text-sm text-gray-500">
                        Drag & drop an image here, or click to select
                      </p>
                      <p className="text-xs text-gray-400">
                        JPEG, PNG, WEBP (Max 5MB)
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title *</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter post title"
                        className="focus-visible:ring-0 focus-visible:border-primary shadow-none rounded-sm"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Tags Input */}
              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <FormControl>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap mb-2">
                          {field.value?.map((tag) => (
                            <div
                              key={tag}
                              className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full text-sm"
                            >
                              <Tag className="h-3 w-3" />
                              <span>{tag}</span>
                              <button
                                type="button"
                                onClick={() => handleRemoveTag(tag)}
                                className="text-gray-500 hover:text-red-500"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                        <Input
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          onKeyDown={handleAddTag}
                          placeholder="Add tags (press Enter or comma)"
                          className="focus-visible:ring-0 focus-visible:border-primary shadow-none rounded-sm"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                    <p className="text-sm text-muted-foreground">
                      Add relevant tags to help categorize your post
                    </p>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || undefined}
                      >
                        <SelectTrigger className="w-full cursor-pointer focus-visible:ring-0 focus-visible:border-primary shadow-none rounded-sm">
                          <SelectValue placeholder="Select blog category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Wine Production</SelectLabel>
                            <SelectItem value={BlogCategory.Vineyard}>
                              Vineyard Updates
                            </SelectItem>
                            <SelectItem value={BlogCategory.Winemaking}>
                              Winemaking Process
                            </SelectItem>
                            <SelectItem value={BlogCategory.VintageReports}>
                              Vintage Reports
                            </SelectItem>
                            <SelectItem value={BlogCategory.OrganicWinemaking}>
                              Organic Winemaking
                            </SelectItem>
                            <SelectItem value={BlogCategory.BarrelAging}>
                              Barrel Aging
                            </SelectItem>
                          </SelectGroup>

                          <SelectGroup>
                            <SelectLabel>Wine Experiences</SelectLabel>
                            <SelectItem value={BlogCategory.WineTasting}>
                              Tasting Notes
                            </SelectItem>
                            <SelectItem value={BlogCategory.CellarDoor}>
                              Cellar Door
                            </SelectItem>
                            <SelectItem value={BlogCategory.WineTourism}>
                              Wine Tourism
                            </SelectItem>
                            <SelectItem value={BlogCategory.Events}>
                              Events & Tours
                            </SelectItem>
                          </SelectGroup>

                          <SelectGroup>
                            <SelectLabel>Wine Knowledge</SelectLabel>
                            <SelectItem value={BlogCategory.WineEducation}>
                              Wine Education
                            </SelectItem>
                            <SelectItem value={BlogCategory.GrapeVarieties}>
                              Grape Varieties
                            </SelectItem>
                            <SelectItem value={BlogCategory.WineHistory}>
                              Wine History
                            </SelectItem>
                            <SelectItem value={BlogCategory.WineTech}>
                              Wine Technology
                            </SelectItem>
                          </SelectGroup>

                          <SelectGroup>
                            <SelectLabel>Our Offerings</SelectLabel>
                            <SelectItem value={BlogCategory.WineClub}>
                              Wine Club
                            </SelectItem>
                            <SelectItem value={BlogCategory.LimitedEditions}>
                              Limited Editions
                            </SelectItem>
                            <SelectItem value={BlogCategory.SeasonalReleases}>
                              Seasonal Releases
                            </SelectItem>
                            <SelectItem value={BlogCategory.StaffPicks}>
                              Staff Picks
                            </SelectItem>
                          </SelectGroup>

                          <SelectGroup>
                            <SelectLabel>Recognition</SelectLabel>
                            <SelectItem value={BlogCategory.Awards}>
                              Awards
                            </SelectItem>
                            <SelectItem value={BlogCategory.Sustainability}>
                              Sustainability
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="excerpt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Excerpt *</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Enter a short excerpt"
                        className="min-h-[100px] focus-visible:ring-0 focus-visible:border-primary shadow-none rounded-sm"
                      />
                    </FormControl>
                    <FormMessage />
                    <p className="text-sm text-muted-foreground">
                      A brief summary of your post (20-200 characters)
                    </p>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content *</FormLabel>
                    <FormControl>
                      <div className="rich-text-editor">
                        <ReactQuill
                          theme="snow"
                          value={field.value}
                          onChange={field.onChange}
                          modules={modules}
                          formats={formats}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="featured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Featured Post</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Featured posts will be highlighted on the homepage
                      </p>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isPublished"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Publish immediately</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        If checked, the post will be visible to the public
                      </p>
                    </div>
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </ScrollArea>

        <DialogFooter>
          <Button
            type="button"
            variant={"ghost"}
            className="cursor-pointer"
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="blog-form"
            disabled={isLoading}
            className="cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {initialValues?._id ? "Updating..." : "Creating..."}
              </>
            ) : initialValues?._id ? (
              "Update Post"
            ) : (
              "Create Post"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BlogForm;
