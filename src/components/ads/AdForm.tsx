"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { format } from "date-fns";
import { CalendarIcon, ImagePlus, Loader2, Search, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { InputWithAffix } from "../shared/InputWithAffix";
import { Checkbox } from "../ui/checkbox";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { ScrollArea } from "../ui/scroll-area";
import { Skeleton } from "../ui/skeleton";
import { Textarea } from "../ui/textarea";

export const NairaIcon = () => <span className="font-medium">₦</span>;

const BANNER_POSITIONS = [
  { value: "hero", label: "Hero Banner" },
  { value: "featured", label: "Featured Section" },
  { value: "sidebar", label: "Sidebar" },
  { value: "promotion", label: "Promotion Section" },
  { value: "main", label: "Main Section" },
  { value: "product", label: "Product Section" },
  { value: "footer", label: "Bottom Section" },
] as const;

const BANNER_TYPES = [
  { value: "promotional", label: "Promotional" },
  { value: "seasonal", label: "Seasonal" },
  { value: "default", label: "Default" },
] as const;

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

    associatedProduct: z.string().min(1, {
      message: "Please select a product",
    }),
    otherAssociatedProducts: z.array(z.string()).optional(),
    isFreeDeliveryOnAssociatedProduct: z.boolean(),
    isActive: z.boolean(),
    type: z.enum(["promotional", "seasonal", "default"]),
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

interface BannerWithFiles {
  position: string;
  desktopImage: string | File;
  mobileImage?: string | File;
}

interface AdFormProps {
  initialValues?: Partial<IAds>;
  children?: React.ReactNode;
}

const PAYMENT_PERIODS = [
  { value: "month", label: "Per Month" },
  { value: "year", label: "Per Year" },
] as const;

const AdForm = ({ initialValues, children }: AdFormProps) => {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<ProductFilterInput>({
    limit: 10,
  });
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [isOtherProductsDialogOpen, setIsOtherProductsDialogOpen] =
    useState(false);

  // State for new banner creation
  const [bannersWithFiles, setBannersWithFiles] = useState<BannerWithFiles[]>(
    []
  );

  const [newBannerPosition, setNewBannerPosition] = useState<string>("");
  const [newBannerDesktopFile, setNewBannerDesktopFile] = useState<File | null>(
    null
  );
  const [newBannerMobileFile, setNewBannerMobileFile] = useState<File | null>(
    null
  );

  const { isPending: productsLoading, products } = useProducts(filters);

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
      name: "",
      description: "",
      validFrom: undefined,
      expiresOn: undefined,
      totalAmountPaid: undefined,
      paymentPer: "month",
      associatedProduct: "",
      otherAssociatedProducts: [],
      isFreeDeliveryOnAssociatedProduct: false,
      isActive: true,
      type: "default",
    },
  });

  useEffect(() => {
    if (initialValues) {
      form.reset({
        name: initialValues.name || "",
        description: initialValues.description || "",
        validFrom: initialValues.validFrom
          ? new Date(initialValues.validFrom)
          : undefined,
        expiresOn: initialValues.expiresOn
          ? new Date(initialValues.expiresOn)
          : undefined,
        totalAmountPaid: initialValues.totalAmountPaid || undefined,
        paymentPer: initialValues.paymentPer || "month",
        associatedProduct: initialValues.associatedProduct?._id || "",
        otherAssociatedProducts:
          initialValues.otherAssociatedProducts?.map((p) => p._id) || [],
        isFreeDeliveryOnAssociatedProduct:
          initialValues.isFreeDeliveryOnAssociatedProduct || false,
        isActive:
          initialValues.isActive !== undefined ? initialValues.isActive : true,
        type: initialValues.type || "default",
      });

      // Handle banners data
      if (initialValues.banners && initialValues.banners.length > 0) {
        const initialBanners = initialValues.banners.map((banner) => ({
          position: banner.position,
          desktopImage: banner.image, // URL string
          desktopImageUrl: banner.image, // Keep original URL
          mobileImage: banner.mobileImage, // URL string or undefined
          mobileImageUrl: banner.mobileImage, // Keep original URL
        }));
        setBannersWithFiles(initialBanners);
      } else {
        // No banners - clear existing
        setBannersWithFiles([]);
      }
    }
  }, [initialValues, form]);

  // Dropzone for desktop banner image
  const {
    getRootProps: getDesktopRootProps,
    getInputProps: getDesktopInputProps,
  } = useDropzone({
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".webp"] },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setNewBannerDesktopFile(acceptedFiles[0]);
      }
    },
  });

  // Dropzone for mobile banner image
  const {
    getRootProps: getMobileRootProps,
    getInputProps: getMobileInputProps,
  } = useDropzone({
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".webp"] },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setNewBannerMobileFile(acceptedFiles[0]);
      }
    },
  });

  // Add new banner to form
  const addNewBanner = () => {
    if (!newBannerPosition || !newBannerDesktopFile) {
      toast.error("Please provide banner position and desktop image");
      return;
    }

    const alreadyUsed = bannersWithFiles.some(
      (b) => b.position === newBannerPosition
    );
    if (alreadyUsed) {
      toast.error("Banner position already added");
      return;
    }

    setBannersWithFiles((prev) => [
      ...prev,
      {
        position: newBannerPosition,
        desktopImage: newBannerDesktopFile,
        mobileImage: newBannerMobileFile || undefined,
      },
    ]);
    // Reset new banner state
    setNewBannerPosition("");
    setNewBannerDesktopFile(null);
    setNewBannerMobileFile(null);
  };

  // Remove existing banner
  const removeBanner = (index: number) => {
    setBannersWithFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const createAdMutation = useMutation({
    mutationFn: createAd,
    onSuccess: async (data) => {
      toast.success(data?.message || "Post created successfully!");
      queryClient.invalidateQueries({ queryKey: ["allUserAds"] });
      queryClient.invalidateQueries({ queryKey: ["allAdminAds"] });
      handleClose();
    },
    onError: (error: AxiosError<{ message: string }>) => {
      console.error("Error creating post:", error);
      toast.error(error?.response?.data?.message || "Failed to create post");
    },
  });

  const updateAdMutation = useMutation({
    mutationFn: (data: FormData) =>
      updateAd(initialValues?._id as string, data),
    onSuccess: async (data) => {
      toast.success(data?.message || "Ad updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["allAdminAds"] });
      queryClient.invalidateQueries({ queryKey: ["allAdminAds"] });
      handleClose();
    },
    onError: (error: AxiosError<{ message: string }>) => {
      console.error("Error updating post:", error);
      toast.error(error?.response?.data?.message || "Failed to update post");
    },
  });

  const onSubmit = async (values: AdsFormValues) => {
    // Validate image for both create and edit cases
    const isEditing = !!initialValues?._id;

    const formData = new FormData();

    // Append all non-file fields
    formData.append("name", values.name);
    if (values.description) formData.append("description", values.description);
    formData.append("validFrom", values.validFrom.toISOString());
    formData.append("expiresOn", values.expiresOn.toISOString());
    formData.append("totalAmountPaid", values.totalAmountPaid.toString());
    formData.append("paymentPer", values.paymentPer);
    formData.append("associatedProduct", values.associatedProduct);
    formData.append(
      "isFreeDeliveryOnAssociatedProduct",
      values.isFreeDeliveryOnAssociatedProduct.toString()
    );
    formData.append("isActive", values.isActive.toString());
    formData.append("type", values.type);

    // Append other associated products if they exist
    if (
      values.otherAssociatedProducts &&
      values.otherAssociatedProducts.length > 0
    ) {
      values.otherAssociatedProducts.forEach((productId) => {
        formData.append("otherAssociatedProducts[]", productId);
      });
    }

    // Prepare banners data with correct field names
    const bannersPayload = bannersWithFiles.map((banner) => ({
      position: banner.position,
      // No need to include image field names here - backend expects specific field names
    }));

    formData.append("banners", JSON.stringify(bannersPayload));

    // Append image files with correct field names
    bannersWithFiles.forEach((banner) => {
      const position = banner.position;
      if (banner.desktopImage) {
        formData.append(`desktopImage_${position}`, banner.desktopImage);
      }
      if (banner.mobileImage) {
        formData.append(`mobileImage_${position}`, banner.mobileImage);
      }
    });

    if (isEditing) {
      updateAdMutation.mutate(formData);
    } else {
      createAdMutation.mutate(formData);
    }
  };

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

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      form.reset();
      setNewBannerPosition("");
      setNewBannerDesktopFile(null);
      setNewBannerMobileFile(null);
    }
    setOpen(isOpen);
  };

  const handleClose = () => {
    form.reset();
    setNewBannerPosition("");
    setNewBannerDesktopFile(null);
    setNewBannerMobileFile(null);
    setOpen(false);
  };

  const isLoading = createAdMutation.isPending || updateAdMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[900px]">
        <DialogHeader>
          <DialogTitle>
            {initialValues?._id ? "Edit Banner" : "Create New Banner"}
          </DialogTitle>
        </DialogHeader>

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
                                  format(field.value, "MMM d, yyyy")
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
                              disabled={(date) => {
                                // Get today's date at midnight (ignoring time)
                                const today = new Date();
                                today.setHours(0, 0, 0, 0);

                                // Disable all dates before tomorrow
                                return date < today;
                              }}
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
                                  format(field.value, "MMM d, yyyy")
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
                              disabled={(date) => {
                                const today = new Date();
                                today.setHours(0, 0, 0, 0);
                                const validFrom = form.getValues("validFrom");

                                // If validFrom is set, disable dates before or equal to validFrom
                                if (validFrom) {
                                  const validFromDate = new Date(validFrom);
                                  validFromDate.setHours(0, 0, 0, 0);
                                  return date <= validFromDate;
                                }
                                // Otherwise disable dates before tomorrow
                                return date <= today;
                              }}
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
                          <InputWithAffix
                            type="number"
                            min={0}
                            placeholder="Enter amount"
                            prefix={<NairaIcon />}
                            className="focus-visible:ring-0 focus-visible:border-primary"
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
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full cursor-pointer">
                              <SelectValue placeholder="Select payment period" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {PAYMENT_PERIODS.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ad Type*</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full cursor-pointer">
                              <SelectValue placeholder="Select ad type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {BANNER_TYPES.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
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
                            className="w-full justify-between cursor-pointer"
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
                              <DialogTitle>
                                Select Associated Product
                              </DialogTitle>
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
                            className="w-full cursor-pointer"
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
                                          tempOtherProducts.includes(
                                            product._id
                                          )
                                            ? tempOtherProducts.filter(
                                                (id) => id !== product._id
                                              )
                                            : [
                                                ...tempOtherProducts,
                                                product._id,
                                              ];
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
                                              ? [
                                                  ...tempOtherProducts,
                                                  product._id,
                                                ]
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

                  {/* Banner Images */}
                  <div className="space-y-2">
                    <FormLabel>Banners*</FormLabel>
                    <div className="space-y-4">
                      {/* Existing banners */}
                      {bannersWithFiles.map((banner, index) => (
                        <div
                          key={index}
                          className="border rounded-lg p-4 relative"
                        >
                          <div className="flex justify-between items-center mb-2">
                            <div className="font-medium">
                              {
                                BANNER_POSITIONS.find(
                                  (p) => p.value === banner.position
                                )?.label
                              }
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeBanner(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm font-medium mb-2">
                                Desktop Image
                              </p>
                              {banner.desktopImage ? (
                                <div className="relative aspect-video rounded-md overflow-hidden">
                                  <Image
                                    src={
                                      typeof banner.desktopImage === "string"
                                        ? banner.desktopImage
                                        : URL.createObjectURL(
                                            banner.desktopImage
                                          )
                                    }
                                    alt={`Banner ${index + 1}`}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                              ) : (
                                <div className="aspect-video bg-stone-100 dark:bg-stone-800 rounded-md flex items-center justify-center">
                                  <p className="text-sm text-stone-500">
                                    No image
                                  </p>
                                </div>
                              )}
                            </div>

                            <div>
                              <p className="text-sm font-medium mb-2">
                                Mobile Image
                              </p>
                              {banner.mobileImage ? (
                                <div className="relative aspect-video rounded-md overflow-hidden">
                                  <Image
                                    src={
                                      typeof banner.mobileImage === "string"
                                        ? banner.mobileImage
                                        : URL.createObjectURL(
                                            banner.mobileImage
                                          )
                                    }
                                    alt={`Mobile Banner ${index + 1}`}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                              ) : (
                                <div className="aspect-video bg-stone-100 dark:bg-stone-800 rounded-md flex items-center justify-center">
                                  <p className="text-sm text-stone-500">
                                    No image
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Add new banner section */}
                      <div className="border rounded-lg p-4">
                        <div className="mb-4">
                          <label className="block text-sm font-medium mb-2">
                            Select Position
                          </label>
                          <Select
                            value={newBannerPosition}
                            onValueChange={setNewBannerPosition}
                          >
                            <SelectTrigger className="w-full cursor-pointer">
                              <SelectValue placeholder="Select banner position" />
                            </SelectTrigger>
                            <SelectContent>
                              {BANNER_POSITIONS.map((position) => (
                                <SelectItem
                                  key={position.value}
                                  value={position.value}
                                >
                                  {position.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium mb-2">
                              Desktop Image*
                            </p>
                            <div
                              {...getDesktopRootProps()}
                              className="border-2 border-dashed rounded-md p-4 text-center cursor-pointer hover:border-primary"
                            >
                              <input {...getDesktopInputProps()} />
                              {newBannerDesktopFile ? (
                                <div className="relative aspect-video">
                                  <Image
                                    src={URL.createObjectURL(
                                      newBannerDesktopFile
                                    )}
                                    alt="Desktop banner preview"
                                    fill
                                    className="object-cover rounded-md"
                                  />
                                  <button
                                    type="button"
                                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setNewBannerDesktopFile(null);
                                    }}
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </div>
                              ) : (
                                <div className="flex flex-col items-center justify-center gap-2 h-full">
                                  <ImagePlus className="h-6 w-6 text-gray-400" />
                                  <p className="text-sm">
                                    Click or drag to upload
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    JPEG, PNG, WEBP (Max 5MB)
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>

                          <div>
                            <p className="text-sm font-medium mb-2">
                              Mobile Image (Optional)
                            </p>
                            <div
                              {...getMobileRootProps()}
                              className="border-2 border-dashed rounded-md p-4 text-center cursor-pointer hover:border-primary"
                            >
                              <input {...getMobileInputProps()} />
                              {newBannerMobileFile ? (
                                <div className="relative aspect-video">
                                  <Image
                                    src={URL.createObjectURL(
                                      newBannerMobileFile
                                    )}
                                    alt="Mobile banner preview"
                                    fill
                                    className="object-cover rounded-md"
                                  />
                                  <button
                                    type="button"
                                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setNewBannerMobileFile(null);
                                    }}
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </div>
                              ) : (
                                <div className="flex flex-col items-center justify-center gap-2 h-full">
                                  <ImagePlus className="h-6 w-6 text-gray-400" />
                                  <p className="text-sm">
                                    Click or drag to upload
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    JPEG, PNG, WEBP (Max 5MB)
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <Button
                          type="button"
                          className="mt-4 w-full"
                          onClick={addNewBanner}
                          disabled={!newBannerPosition || !newBannerDesktopFile}
                        >
                          Add Banner
                        </Button>
                      </div>
                    </div>
                    {/* {form.formState.errors.banners && (
                      <p className="text-sm font-medium text-destructive">
                        {form.formState.errors.banners.message}
                      </p>
                    )} */}
                  </div>
                </div>
              </div>
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
            form="ads-form"
            disabled={isLoading}
            className="cursor-pointer"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {initialValues?._id ? "Saving..." : "Creating..."}
              </>
            ) : initialValues?._id ? (
              "Save Changes"
            ) : (
              "Create Ad"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AdForm;
