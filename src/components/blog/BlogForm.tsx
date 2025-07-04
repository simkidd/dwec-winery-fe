"use client";
import { createPost, updatePost } from "@/lib/api/blog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import dynamic from "next/dynamic";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { useForm } from "react-hook-form";
import "react-quill-new/dist/quill.snow.css";
import { toast } from "sonner";
import { z } from "zod";
import { Checkbox } from "../ui/checkbox";
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
import { Textarea } from "../ui/textarea";
import { IBlogPost } from "@/interfaces/blog.interface";
import { useDropzone } from "react-dropzone";
import { ImagePlus, Tag, X } from "lucide-react";
import Image from "next/image";

const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => <p>Loading editor...</p>,
});

export interface BlogFormRef {
  submitForm: () => Promise<boolean>;
  isSubmitting: boolean;
}

const formSchema = z.object({
  title: z.string().min(5, {
    message: "Title must be at least 5 characters.",
  }),
  slug: z
    .string()
    .min(5, {
      message: "Slug must be at least 5 characters.",
    })
    .regex(/^[a-z0-9-]+$/, {
      message: "Slug can only contain lowercase letters, numbers, and hyphens.",
    }),
  excerpt: z
    .string()
    .min(20, {
      message: "Excerpt must be at least 20 characters.",
    })
    .max(200, {
      message: "Excerpt must be at most 200 characters.",
    }),
  content: z.string().min(100, {
    message: "Content must be at least 100 characters.",
  }),
  isPublished: z.boolean(),
  image: z.instanceof(File).optional(),
  tags: z.array(z.string()),
});

export type BlogFormValues = z.infer<typeof formSchema>;

interface BlogFormProps {
  initialValues?: Partial<IBlogPost>;
}

const BlogForm = forwardRef<BlogFormRef, BlogFormProps>(
  ({ initialValues }, ref) => {
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [tagInput, setTagInput] = useState("");

    const form = useForm<BlogFormValues>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        title: "",
        slug: "",
        excerpt: "",
        content: "",
        isPublished: false,
        tags: [],
        ...initialValues,
      },
    });

    useEffect(() => {
      if (initialValues) {
        form.reset({ ...initialValues, tags: initialValues.tags || [] });
        if (initialValues.imageUrl) {
          setPreviewImage(initialValues.imageUrl);
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
          form.setValue("image", file);
          setPreviewImage(URL.createObjectURL(file));
        }
      },
    });

    const createPostMutation = useMutation({
      mutationFn: (data: FormData) => createPost(data),
      onSuccess: async (data) => {
        toast.success(data?.message || "Post created successfully!");
        form.reset();
        setPreviewImage(null);
      },
      onError: (error: AxiosError<{ message: string }>) => {
        console.error("Error creating post:", error);
        toast.error(error?.response?.data?.message || "Failed to create post");
      },
    });

    const updatePostMutation = useMutation({
      mutationFn: (data: FormData) =>
        updatePost(data, initialValues?.id as string),
      onSuccess: async (data) => {
        toast.success(data?.message || "Post updated successfully!");
      },
      onError: (error: AxiosError<{ message: string }>) => {
        console.error("Error updating post:", error);
        toast.error(error?.response?.data?.message || "Failed to update post");
      },
    });

    const onSubmit = async (values: BlogFormValues): Promise<boolean> => {
      try {
        const formData = new FormData();

        // Append all form values to FormData
        Object.entries(values).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            if (key === "image" && value instanceof File) {
              formData.append("image", value);
            } else {
              formData.append(key, value.toString());
            }
          }
        });

        if (initialValues?.id) {
          await updatePostMutation.mutateAsync(formData);
        } else {
          await createPostMutation.mutateAsync(formData);
        }
        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    };

    useImperativeHandle(ref, () => ({
      submitForm: async () => {
        try {
          await form.handleSubmit(onSubmit)();
          return true;
        } catch (error) {
          console.log(error);
          return false;
        }
      },
      isSubmitting:
        createPostMutation.isPending || updatePostMutation.isPending,
    }));

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const title = e.target.value;
      form.setValue("title", title);

      const currentSlug = form.getValues("slug");
      if (!currentSlug || currentSlug === form.formState.defaultValues?.slug) {
        const slug = title
          .toLowerCase()
          .replace(/[^\w\s]/g, "")
          .replace(/\s+/g, "-");
        form.setValue("slug", slug);
      }
    };

    const handleRemoveImage = () => {
      form.setValue("image", undefined);
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

    return (
      <ScrollArea className="h-[calc(100vh-200px)]">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 p-4"
          >
            {/* Image Upload */}
            <FormField
              control={form.control}
              name="image"
              render={({}) => (
                <FormItem>
                  <FormLabel>Image</FormLabel>
                  <FormControl>
                    <div className="space-y-4">
                      {previewImage ? (
                        <div className="relative">
                          <Image
                            src={previewImage}
                            alt="Preview"
                            className="w-full aspect-video object-cover rounded-lg"
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
                          className="border-2 border-input border-dashed  rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
                        >
                          <input {...getInputProps()} />
                          <div className="flex flex-col items-center justify-center gap-2">
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
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title *</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        handleTitleChange(e);
                      }}
                      placeholder="Enter post title"
                      className="focus-visible:ring-0 focus-visible:border-primary shadow-none rounded-sm"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug *</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter URL slug"
                      className="focus-visible:ring-0 focus-visible:border-primary shadow-none rounded-sm"
                    />
                  </FormControl>
                  <FormMessage />
                  <p className="text-sm text-muted-foreground">
                    This will be used in the URL for your post
                  </p>
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
    );
  }
);

BlogForm.displayName = "BlogForm";

export default BlogForm;
