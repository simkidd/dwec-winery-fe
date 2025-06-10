"use client";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import { useEffect, useState } from "react";

interface ProductImagesProps {
  images: string[];
  altText: string;
}

const ProductImages = ({ images, altText }: ProductImagesProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [api, setApi] = useState<CarouselApi>();
  const [thumbsApi, setThumbsApi] = useState<CarouselApi>();

  // Sync main carousel and thumbnails
  useEffect(() => {
    if (!api || !thumbsApi) return;

    api.on("select", () => {
      const selected = api.selectedScrollSnap();
      setSelectedIndex(selected);
      thumbsApi.scrollTo(selected);
    });

  }, [api, thumbsApi, setSelectedIndex]);

  return (
    <div className="w-full space-y-4">
      {/* Main Image Carousel */}

      <Carousel
        setApi={setApi}
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="w-full h-full">
          {images.map((img, index) => (
            <CarouselItem key={index} className="h-full w-full">
              <div className="relative h-full w-full aspect-square py-4">
                <Image
                  src={img}
                  alt={`${altText} - Image ${index + 1}`}
                  className="w-full h-full object-contain"
                  width={500}
                  height={500}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {images.length > 1 && (
          <>
            <CarouselPrevious className="left-2 h-8 w-8" />
            <CarouselNext className="right-2 h-8 w-8" />
          </>
        )}
      </Carousel>

      {/* Thumbnail Navigation */}
      {images.length > 1 && (
        <div className="px-4 sm:px-8">
          <Carousel
            setApi={setThumbsApi}
            opts={{
              align: "start",
              dragFree: true,
              containScroll: "keepSnaps",
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-1">
              {images.map((img, index) => (
                <CarouselItem
                  key={index}
                  className="basis-1/5 pl-1 md:basis-1/6"
                  onClick={() => setSelectedIndex(index)}
                >
                  <div
                    className={`relative aspect-square cursor-pointer overflow-hidden py-2 rounded-md border-2 transition-all ${
                      selectedIndex === index
                        ? "border-primary"
                        : "border-transparent"
                    }`}
                    onClick={() => {
                      setSelectedIndex(index);
                      api?.scrollTo(index);
                    }}
                  >
                    <Image
                      src={img}
                      alt={`Thumbnail ${index + 1}`}
                      width={300}
                      height={300}
                      className="w-full h-full object-contain"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      )}
    </div>
  );
};

export default ProductImages;
