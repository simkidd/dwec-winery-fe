"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import useCategories from "@/hooks/use-categories";
import useProducts from "@/hooks/use-products";
import { IProduct, ProductVariant } from "@/interfaces/product.interface";
import { addToCart } from "@/store/features/cart/cart.slice";
import { useAppDispatch } from "@/store/hooks";
import { formatCurrency } from "@/utils/helpers";
import {
  Facebook,
  Linkedin,
  LinkIcon,
  Minus,
  Plus,
  Share2,
  Shield,
  Truck,
  Twitter,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import FavouriteButton from "../shared/FavouriteButton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import ProductCard from "./ProductCard";
import ProductCardSkeleton from "./ProductCardSkeleton";
import ProductImages from "./ProductImages";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const ShareButtons = ({ product }: { product: IProduct }) => {
  const [currentUrl, setCurrentUrl] = useState("");

  useEffect(() => {
    setCurrentUrl(`${window.location.origin}/products/${product.slug}`);
  }, [product.slug]);

  const copyToClipboard = () => {
    if (!currentUrl) return;
    navigator.clipboard.writeText(currentUrl);
    toast.info("Link copied to clipboard!");
  };

  const encodedTitle = encodeURIComponent(product.name);

  return (
    <div className="flex space-x-4 p-4">
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${currentUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-700"
        aria-label="Share on Facebook"
      >
        <Facebook size={18} />
      </a>
      <a
        href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${currentUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-400 text-white hover:bg-blue-500"
        aria-label="Share on Twitter"
      >
        <Twitter size={18} />
      </a>
      <a
        href={`https://www.linkedin.com/shareArticle?mini=true&url=${currentUrl}&title=${encodedTitle}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-700 text-white hover:bg-blue-800"
        aria-label="Share on LinkedIn"
      >
        <Linkedin size={18} />
      </a>
      <button
        onClick={copyToClipboard}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 cursor-pointer"
        aria-label="Copy link"
        disabled={!currentUrl}
      >
        <LinkIcon size={18} />
      </button>
    </div>
  );
};

const ProductDetails = ({ product }: { product: IProduct }) => {
  const dispatch = useAppDispatch();
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    null
  );
  const { categories } = useCategories();

  const productCategory = categories.find(
    (c) => c._id === product.category?._id
  );

  const { products: relatedProducts, isPending: isLoadingRelated } =
    useProducts({
      limit: 8,
      category: [productCategory?._id as string],
    });

  const hasDiscount =
    product.currentOffer?.isActive && product.currentOffer?.percentageOff;

  const calculateDiscountPrice = (price: number, percentageOff: number) => {
    return price - (price * percentageOff) / 100;
  };

  // Combine all images (main + variants)
  const allImages = [
    ...product.images,
    ...(product.variants?.flatMap((variant) => variant.images) || []),
  ].filter((img, index, self) => index === self.findIndex((t) => t === img));

  const currentPrice = selectedVariant?.price || product.price;
  const currentStock =
    selectedVariant?.quantityInStock || product.quantityInStock;

  const discountedPrice = hasDiscount
    ? calculateDiscountPrice(currentPrice, product?.currentOffer?.percentageOff)
    : currentPrice;

  const handleAddToCart = () => {
    const payload = {
      product: {
        ...product,
        // Clear variants array to avoid data duplication
        variants: [],
      },
      quantity: quantity,
      ...(selectedVariant && { selectedVariant }),
    };

    dispatch(addToCart(payload));
    toast.success(
      `${quantity} ${product.name} ${
        selectedVariant ? `(${selectedVariant.name})` : ""
      } added to cart`
    );
  };

  const handleIncrement = () => {
    setQuantity(quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const toggleVariantSelection = (variant: ProductVariant) => {
    if (selectedVariant?._id === variant._id) {
      // Deselect if clicking the same variant
      setSelectedVariant(null);
    } else {
      // Select new variant
      setSelectedVariant(variant);
    }
    setQuantity(1); // Reset quantity when variant changes
  };

  return (
    <section>
      <div className="container mx-auto px-4 py-8 pb-16">
        <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-2 relative">
          {/* Image Gallery Section */}
          {/* <div className="lg:sticky lg:top-20 lg:self-start"> */}
          <div className="">
            <ProductImages images={allImages} altText={product.name} />
          </div>

          {/* Product Info Section */}
          <div className="">
            {/* Title and Rating */}
            <div className="mb-4">
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                {product.name}
              </h1>
            </div>

            {/* Price and Availability */}
            <div className="mb-6">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold">
                  {formatCurrency(discountedPrice)}
                </span>
                {hasDiscount && (
                  <span className="text-sm text-muted-foreground line-through">
                    {formatCurrency(product?.price)}
                  </span>
                )}
                {hasDiscount && (
                  <Badge variant="destructive" className="ml-2">
                    -{product?.currentOffer?.percentageOff}%
                  </Badge>
                )}
              </div>
              <div className="mt-2 flex items-center gap-2 text-sm ">
                {currentStock > 0 ? (
                  <span className="text-green-600">
                    {currentStock < 5
                      ? `Only (${currentStock} left)`
                      : "In Stock"}
                  </span>
                ) : (
                  <span className="text-red-500">Out of stock</span>
                )}
              </div>
            </div>

            {/* Variants */}
            {product.variants?.length > 0 && (
              <div className="mb-4">
                <h3 className="mb-2 text-sm font-medium">Variants</h3>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((variant) => (
                    <Button
                      key={variant._id}
                      variant={
                        selectedVariant?._id === variant._id
                          ? "default"
                          : "outline"
                      }
                      onClick={() => toggleVariantSelection(variant)}
                      className={cn(
                        "rounded-sm cursor-pointer border",
                        selectedVariant?._id === variant._id
                          ? "border-primary"
                          : " bg-transparent text-foreground"
                      )}
                    >
                      {variant.name} x {variant.quantity}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            <div className="mb-6">
              <h3 className="mb-2 text-sm font-medium">Description</h3>
              <p className="text-muted-foreground">{product.description}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4">
              {product.quantityInStock > 0 && (
                <>
                  <div className="flex items-center border rounded-sm px-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded cursor-pointer"
                      onClick={handleDecrement}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-10 text-center">{quantity}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded cursor-pointer"
                      onClick={handleIncrement}
                      disabled={quantity >= currentStock}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  <Button
                    size="lg"
                    className="flex-1 min-w-[200px] rounded-sm cursor-pointer"
                    onClick={handleAddToCart}
                  >
                    Add to Cart
                  </Button>
                </>
              )}

              <FavouriteButton product={product} className="" />

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full cursor-pointer"
                  >
                    <Share2 className="h-5 w-5" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <ShareButtons product={product} />
                </PopoverContent>
              </Popover>
            </div>

            {/* Trust Badges */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4 border-t pt-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                <span>Secure Payment</span>
              </div>
              {product?.isFreeDelivery && (
                <div className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  <span>Free Shipping</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        {isLoadingRelated ? (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">You may also like</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {[...Array(5)].map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          </div>
        ) : relatedProducts.length > 0 ? (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">You may also like</h2>
            <Carousel
              opts={{
                align: "start",
                slidesToScroll: 1,
              }}
              className="w-full px-2"
            >
              <CarouselContent className="-ml-2">
                {relatedProducts.map((product) => (
                  <CarouselItem
                    key={product._id}
                    className="flex-[0_0_46%] md:flex-[0_0_32%] lg:flex-[0_0_22%] pl-2"
                  >
                    <div className="p-1">
                      <ProductCard product={product} />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className=" disabled:hidden cursor-pointer hidden lg:flex" />
              <CarouselNext className=" disabled:hidden cursor-pointer hidden lg:flex" />
            </Carousel>
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default ProductDetails;
