"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import useProducts from "@/hooks/use-products";
import { IAds } from "@/interfaces/ads.interface";
import { ProductFilterInput } from "@/interfaces/product.interface";
import { createAd, updateAd } from "@/lib/api/products";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { format } from "date-fns";
import { CalendarIcon, ImagePlus, Search, UploadCloud, X } from "lucide-react";
import Image from "next/image";
import { forwardRef, useCallback, useImperativeHandle, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Checkbox } from "../ui/checkbox";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { ScrollArea } from "../ui/scroll-area";
import { Skeleton } from "../ui/skeleton";
import { Textarea } from "../ui/textarea";

export interface AdsFormRef {
  submitForm: () => Promise<boolean>;
  isSubmitting: boolean;
}

// Form validation schema
const formSchema = z
  .object({
    name: z.string().min(2, {
      message: "Name must be at least 2 characters.",
    }),
    description: z.string().optional(),
    validFrom: z.date({
      required_error: "Valid from date is required",
    }),
    expiresOn: z.date({
      required_error: "Expiration date is required",
    }),
    totalAmountPaid: z.number().min(0, {
      message: "Amount must be positive",
    }),
    paymentPer: z.string().min(1, {
      message: "Please select payment period",
    }),
    image: z
      .union([z.instanceof(File), z.string()])
      .refine((val) => val instanceof File || val.length > 0, {
        message: "Please upload a valid image.",
      }),
    associatedProduct: z.string().min(1, {
      message: "Please select a product",
    }),
    otherAssociatedProducts: z.array(z.string()).optional(),
    isFreeDeliveryOnAssociatedProduct: z.boolean(),
    isActive: z.boolean(),
  })
  .refine(
    (data) => {
      return data.expiresOn > data.validFrom;
    },
    {
      message: "Expiration date must be after valid from date",
      path: ["expiresOn"],
    }
  );

export type AdsFormValues = z.infer<typeof formSchema>;

interface AdFormProps {
  initialValues?: Partial<IAds>;
}

const PAYMENT_PERIODS = [
  { value: "month", label: "Per Month" },
  { value: "year", label: "Per Year" },
] as const;

const AdForm = forwardRef<AdsFormRef, AdFormProps>(({ initialValues }, ref) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<ProductFilterInput>({
    limit: 10,
  });
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [isOtherProductsDialogOpen, setIsOtherProductsDialogOpen] =
    useState(false);
  const { isPending: productsLoading, products } = useProducts(filters);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  // Add new state for temporary selections
  const [tempAssociatedProduct, setTempAssociatedProduct] =
    useState<string>("");
  const [tempOtherProducts, setTempOtherProducts] = useState<string[]>([]);

  const handleSearch = useCallback((search: string) => {
    setSearchTerm(search);
    setFilters((prev) => ({
      ...prev,
      search,
    }));
  }, []);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const form = useForm<AdsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialValues?.name || "",
      description: initialValues?.description || "",
      validFrom: initialValues?.validFrom
        ? new Date(initialValues.validFrom)
        : new Date(),
      expiresOn: initialValues?.expiresOn
        ? new Date(initialValues.expiresOn)
        : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default to 1 week from now
      totalAmountPaid: initialValues?.totalAmountPaid || undefined,
      paymentPer: initialValues?.paymentPer || "month",
      image: initialValues?.image || "",
      associatedProduct: initialValues?.associatedProduct?._id || "",
      otherAssociatedProducts:
        initialValues?.otherAssociatedProducts?.map((p) => p._id) || [],
      isFreeDeliveryOnAssociatedProduct:
        initialValues?.isFreeDeliveryOnAssociatedProduct || false,
      isActive: initialValues?.isActive || true,
    },
  });

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
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

  const removeImage = () => {
    form.setValue("image", "");
    if (previewImage) {
      URL.revokeObjectURL(previewImage);
    }
    setPreviewImage(null);
  };

  const createAdMutation = useMutation({
    mutationFn: createAd,
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

  const updateAdMutation = useMutation({
    mutationFn: (data: AdsFormValues) =>
      updateAd(initialValues?._id as string, data),
    onSuccess: async (data) => {
      toast.success(data?.message || "Ad updated successfully!");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      console.error("Error updating post:", error);
      toast.error(error?.response?.data?.message || "Failed to update post");
    },
  });

  const onSubmit = async (values: AdsFormValues) => {
    const payload = {
      ...values,
      name: values.name,
      description: values.description || undefined, // Send undefined if empty
      // validFrom: values.validFrom.toISOString(),
      // expiresOn: values.expiresOn.toISOString(),
      totalAmountPaid: values.totalAmountPaid,
      paymentPer: values.paymentPer,
      image: typeof values.image === "string" ? values.image : "", // Only send if it's a string
      associatedProduct: values.associatedProduct,
      otherAssociatedProducts: values.otherAssociatedProducts || [],
      isFreeDeliveryOnAssociatedProduct:
        values.isFreeDeliveryOnAssociatedProduct,
      isActive: values.isActive,
    };

    // Debug log
    console.log("Submitting payload:", payload);

    if (initialValues?._id) {
      updateAdMutation.mutate(payload);
    } else {
      createAdMutation.mutate(payload);
    }
  };

  useImperativeHandle(ref, () => ({
    submitForm: async () => {
      try {
        const isValid = await form.trigger();
        if (!isValid) return false;

        await form.handleSubmit(onSubmit)();
        return true;
      } catch (error) {
        console.error("Form submission error:", error);
        return false;
      }
    },
    isSubmitting: createAdMutation.isPending || updateAdMutation.isPending,
  }));

  const selectedProduct = products.find(
    (p) => p._id === form.watch("associatedProduct")
  );
  const selectedOtherProducts = products.filter((p) =>
    form.watch("otherAssociatedProducts")?.includes(p._id)
  );

  // Initialize temp values when dialogs open
  const openProductDialog = useCallback(() => {
    setTempAssociatedProduct(form.getValues("associatedProduct"));
    setIsProductDialogOpen(true);
  }, [form]);

  const openOtherProductsDialog = useCallback(() => {
    setTempOtherProducts(form.getValues("otherAssociatedProducts") || []);
    setIsOtherProductsDialogOpen(true);
  }, [form]);

  // Handle dialog confirmations
  const confirmProductSelection = useCallback(() => {
    form.setValue("associatedProduct", tempAssociatedProduct);
    setIsProductDialogOpen(false);
    setSearchTerm("");
  }, [tempAssociatedProduct, form]);

  const confirmOtherProductsSelection = useCallback(() => {
    form.setValue("otherAssociatedProducts", tempOtherProducts);
    setIsOtherProductsDialogOpen(false);
    setSearchTerm("");
  }, [tempOtherProducts, form]);

  // Handle dialog cancellations
  const cancelProductSelection = useCallback(() => {
    setIsProductDialogOpen(false);
    setSearchTerm("");
  }, []);

  const cancelOtherProductsSelection = useCallback(() => {
    setIsOtherProductsDialogOpen(false);
    setSearchTerm("");
  }, []);

  return (
    <ScrollArea className="h-[calc(100vh-200px)]">
      <Form {...form}>
        <form
          id="ads-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 p-4"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ad Name*</FormLabel>
                    <FormControl>
                      <Input
                        className="focus-visible:ring-0 focus-visible:border-primary"
                        placeholder="Summer Sale"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      The name that will identify this ad campaign.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        className="focus-visible:ring-0 focus-visible:border-primary"
                        placeholder="Describe your ad campaign (optional)"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="validFrom"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Valid From*</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          autoFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="expiresOn"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Expires On*</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date <=
                            (form.getValues("validFrom") || date < new Date())
                          }
                          autoFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="totalAmountPaid"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Amount Paid*</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        className="focus-visible:ring-0 focus-visible:border-primary"
                        placeholder="0.00"
                        min={0}
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="paymentPer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Period*</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment period" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {PAYMENT_PERIODS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="image"
                render={({}) => (
                  <FormItem>
                    <FormLabel>Ad Image*</FormLabel>
                    <div className="space-y-4">
                      {previewImage ? (
                        <div className="relative group">
                          <div className="relative w-full h-48 rounded-md overflow-hidden border">
                            <Image
                              src={previewImage}
                              alt="Ad preview"
                              fill
                              className="object-cover"
                              onError={() => setPreviewImage(null)}
                            />
                          </div>
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={removeImage}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div
                          {...getRootProps()}
                          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                            isDragActive
                              ? "border-primary bg-primary/10"
                              : "border-muted-foreground/30"
                          }`}
                        >
                          <input {...getInputProps()} />
                          <div className="flex flex-col items-center justify-center gap-2">
                            <UploadCloud className="h-10 w-10 text-muted-foreground" />
                            {isDragActive ? (
                              <p className="font-medium">Drop the image here</p>
                            ) : (
                              <>
                                <p className="font-medium">
                                  Drag & drop an image here
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  or click to select a file (JPEG, PNG, WebP)
                                </p>
                              </>
                            )}
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="mt-2"
                            >
                              <ImagePlus className="mr-2 h-4 w-4" />
                              Select Image
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Associated Product Field */}
              <FormField
                control={form.control}
                name="associatedProduct"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Associated Product*</FormLabel>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full justify-between"
                        onClick={openProductDialog}
                      >
                        {selectedProduct ? (
                          <div className="flex items-center gap-2">
                            {selectedProduct.images?.length > 0 && (
                              <div className="relative w-8 h-8 rounded-md overflow-hidden">
                                <Image
                                  src={selectedProduct.images[0]}
                                  alt={selectedProduct.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            )}
                            <span className="truncate">
                              {selectedProduct.name}
                            </span>
                          </div>
                        ) : (
                          <span>Select a product</span>
                        )}
                      </Button>
                      {selectedProduct && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => field.onChange("")}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <FormMessage />

                    {/* Product Selection Dialog */}
                    <Dialog
                      open={isProductDialogOpen}
                      onOpenChange={setIsProductDialogOpen}
                    >
                      <DialogContent className="max-h-[80vh] overflow-hidden">
                        <DialogHeader>
                          <DialogTitle>Select Associated Product</DialogTitle>
                        </DialogHeader>
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Search products..."
                            className="pl-10 focus-visible:ring-0 focus-visible:border-primary shadow-none"
                            value={searchTerm}
                            onChange={(e) => handleSearch(e.target.value)}
                          />
                        </div>
                        <ScrollArea className="max-h-[240px]">
                          {productsLoading ? (
                            <div className="space-y-2">
                              {[...Array(5)].map((_, i) => (
                                <div
                                  key={i}
                                  className="flex items-center space-x-3 p-2"
                                >
                                  <Skeleton className="h-4 w-4 rounded-full" />
                                  <Skeleton className="h-12 w-12 rounded-md" />
                                  <Skeleton className="h-4 w-[200px]" />
                                </div>
                              ))}
                            </div>
                          ) : filteredProducts.length > 0 ? (
                            <RadioGroup
                              value={tempAssociatedProduct}
                              onValueChange={setTempAssociatedProduct}
                              className="divide-y gap-0"
                            >
                              {filteredProducts.map((product) => (
                                <div
                                  key={product._id}
                                  className={`flex items-center p-2 cursor-pointer hover:bg-accent ${
                                    tempAssociatedProduct === product._id
                                      ? "bg-accent"
                                      : ""
                                  }`}
                                  onClick={() => {
                                    setTempAssociatedProduct(product._id);
                                  }}
                                >
                                  <div className="flex items-center space-x-3">
                                    <RadioGroupItem
                                      value={product._id}
                                      id={product._id}
                                    />
                                    {product.images?.length > 0 && (
                                      <div className="relative w-12 h-12 rounded-md overflow-hidden bg-primary/10">
                                        <Image
                                          src={product.images[0]}
                                          alt={product.name}
                                          width={50}
                                          height={50}
                                          className="w-full h-full object-contain"
                                        />
                                      </div>
                                    )}
                                    <label
                                      htmlFor={product._id}
                                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                      {product.name}
                                    </label>
                                  </div>
                                </div>
                              ))}
                            </RadioGroup>
                          ) : (
                            <div className="text-center py-12 text-muted-foreground">
                              No products found
                            </div>
                          )}
                        </ScrollArea>

                        <DialogFooter className="flex justify-end gap-2 pt-4">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={cancelProductSelection}
                          >
                            Cancel
                          </Button>
                          <Button
                            type="button"
                            disabled={!tempAssociatedProduct}
                            onClick={confirmProductSelection}
                          >
                            Done
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </FormItem>
                )}
              />

              {/* Other Associated Products Field */}
              <FormField
                control={form.control}
                name="otherAssociatedProducts"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Other Associated Products</FormLabel>
                    <div className="space-y-2">
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={openOtherProductsDialog}
                      >
                        Select Products ({field.value?.length || 0})
                      </Button>
                      {selectedOtherProducts.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {selectedOtherProducts.map((product) => (
                            <div
                              key={product._id}
                              className="flex items-center bg-accent px-3 py-1 rounded-full text-sm"
                            >
                              {product.images?.length > 0 && (
                                <div className="relative w-6 h-6 rounded-full overflow-hidden mr-2">
                                  <Image
                                    src={product.images[0]}
                                    alt={product.name}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                              )}
                              {product.name}
                              <button
                                type="button"
                                className="ml-2"
                                onClick={() => {
                                  field.onChange(
                                    field.value?.filter(
                                      (id) => id !== product._id
                                    )
                                  );
                                }}
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <FormMessage />

                    {/* Other Products Selection Dialog */}
                    <Dialog
                      open={isOtherProductsDialogOpen}
                      onOpenChange={setIsOtherProductsDialogOpen}
                    >
                      <DialogContent className="max-h-[80vh] overflow-hidden">
                        <DialogHeader>
                          <DialogTitle>
                            Select Other Associated Products
                          </DialogTitle>
                        </DialogHeader>
                        <div className="relative mb-4">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Search products..."
                            className="pl-10 focus-visible:ring-0 focus-visible:border-primary shadow-none"
                            value={searchTerm}
                            onChange={(e) => handleSearch(e.target.value)}
                          />
                        </div>
                        <ScrollArea className=" max-h-[240px] ">
                          {productsLoading ? (
                            <div className="space-y-2">
                              {[...Array(5)].map((_, i) => (
                                <div
                                  key={i}
                                  className="flex items-center space-x-3 p-2"
                                >
                                  <Skeleton className="h-4 w-4 rounded" />
                                  <Skeleton className="h-12 w-12 rounded-md" />
                                  <Skeleton className="h-4 w-[200px]" />
                                </div>
                              ))}
                            </div>
                          ) : filteredProducts.length > 0 ? (
                            <div className="divide-y">
                              {filteredProducts.map((product) => (
                                <div
                                  key={product._id}
                                  className={`flex items-center p-2 cursor-pointer hover:bg-accent ${
                                    tempOtherProducts.includes(product._id)
                                      ? "bg-accent"
                                      : ""
                                  }`}
                                  onClick={() => {
                                    const newValues =
                                      tempOtherProducts.includes(product._id)
                                        ? tempOtherProducts.filter(
                                            (id) => id !== product._id
                                          )
                                        : [...tempOtherProducts, product._id];
                                    setTempOtherProducts(newValues);
                                  }}
                                >
                                  <div className="flex items-center space-x-3">
                                    <Checkbox
                                      id={`other-${product._id}`}
                                      checked={tempOtherProducts.includes(
                                        product._id
                                      )}
                                      onCheckedChange={(checked) => {
                                        const newValues = checked
                                          ? [...tempOtherProducts, product._id]
                                          : tempOtherProducts.filter(
                                              (id) => id !== product._id
                                            );
                                        setTempOtherProducts(newValues);
                                      }}
                                    />
                                    {product.images?.length > 0 && (
                                      <div className="relative w-12 h-12 rounded-md overflow-hidden">
                                        <Image
                                          src={product.images[0]}
                                          alt={product.name}
                                          fill
                                          className="object-cover"
                                        />
                                      </div>
                                    )}
                                    <label
                                      htmlFor={`other-${product._id}`}
                                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                      {product.name}
                                    </label>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-4 text-muted-foreground">
                              No products found
                            </div>
                          )}
                        </ScrollArea>
                        <DialogFooter className="flex justify-end gap-2 pt-4">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={cancelOtherProductsSelection}
                          >
                            Cancel
                          </Button>
                          <Button
                            type="button"
                            onClick={confirmOtherProductsSelection}
                          >
                            Done
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isFreeDeliveryOnAssociatedProduct"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel>Free Delivery</FormLabel>
                      <FormDescription>
                        Offer free delivery for the associated product.
                      </FormDescription>
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
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel>Active</FormLabel>
                      <FormDescription>
                        Whether this ad should be displayed.
                      </FormDescription>
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
            </div>
          </div>
        </form>
      </Form>
    </ScrollArea>
  );
});

AdForm.displayName = "AdForm";

export default AdForm;
