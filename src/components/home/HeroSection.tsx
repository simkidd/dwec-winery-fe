"use client";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import useAds from "@/hooks/use-ads";
import { FilterAdsParams, IAds } from "@/interfaces/ads.interface";
import { slugify } from "@/utils/helpers";
import Autoplay from "embla-carousel-autoplay";
import Fade from "embla-carousel-fade";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import Logo from "../shared/Logo";

const HeroSection = () => {
  const [filter] = useState<FilterAdsParams>({
    position: "hero",
  });
  const { ads, isPending } = useAds(false, filter);
  const [api, setApi] = useState<CarouselApi>();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Update current index when slide changes
  const onSelect = () => {
    if (api) {
      setCurrentIndex(api.selectedScrollSnap());
    }
  };

  // Initialize carousel API
  useEffect(() => {
    if (api) {
      api.on("select", onSelect);
      return () => {
        api.off("select", onSelect);
      };
    }
  }, [api]);

  // Function to determine the link for each ad
  const getAdLink = (
    ad: IAds
  ): string | { pathname: string; query: { id: string } } => {
    // If there are other associated products, link to catalog page with slug and ID
    if (ad.otherAssociatedProducts?.length) {
      return {
        pathname: `/catalog/${slugify(ad.name)}`,
        query: { id: ad._id },
      };
    }
    // If there's a single associated product, link directly to it
    if (ad.associatedProduct?.slug) {
      return `/products/${ad.associatedProduct.slug}`;
    }
    // Fallback to products page
    return "/products";
  };

  // Function to properly format the href for Next.js Link
  const formatHref = (link: ReturnType<typeof getAdLink>) => {
    if (typeof link === "string") return link;
    return `${link.pathname}?${new URLSearchParams(link.query).toString()}`;
  };

  // Loading state
  if (isPending) {
    return (
      <div className="w-full relative aspect-[2.5/1] md:aspect-[3/1]">
        <Skeleton className="w-full h-full rounded-none" />
        <motion.div
          initial={{ opacity: 0.3, scale: 0.95 }}
          animate={{
            opacity: [0.3, 0.5, 0.3],
            scale: [0.95, 1, 0.95],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <Logo className="w-32 h-32 opacity-20 grayscale-100" />
        </motion.div>
      </div>
    );
  }

  // Empty state
  if (!ads.length) {
    return (
      <div className="w-full relative aspect-[2.5/1] md:aspect-[3/1] bg-gradient-to-r from-primary/50 to-primary/20 flex items-center justify-center text-white">
        <div className="text-center p-6">
          <h2 className="text-3xl font-bold mb-4">Welcome to Our Store</h2>
          <p className="text-xl mb-6">Discover our amazing products</p>
          <Button variant="secondary" size="lg" asChild className="rounded-sm">
            <Link href={"/products"}>Shop Now</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <section className="w-full relative">
      <Carousel
        setApi={setApi}
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full group"
        plugins={[
          Autoplay({
            delay: 5000,
            stopOnInteraction: false,
          }),
          Fade(),
        ]}
      >
        <CarouselContent className="-ml-0">
          {ads.map((ad) => {
            const link = getAdLink(ad);

            const banner = ad.banners?.[0];

            return (
              <CarouselItem key={ad._id} className="pl-0">
                <div className="p-0">
                  <div className="border-0 p-0 rounded-none overflow-hidden">
                    <div className="relative p-0 w-full aspect-[1440/428]">
                    {/* <div className="relative p-0 aspect-[2.5/1] md:aspect-[3.5/1]"> */}
                      {/* Blurred background */}
                      {/* {banner?.image && (
                        <div
                          className="absolute inset-0 w-full h-full"
                          style={{
                            backgroundImage: `url(${banner.image})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            filter: "blur(8px)",
                            opacity: 0.7,
                          }}
                        />
                      )} */}

                      {/* Main banner image container */}
                      <Link
                        href={link}
                        as={typeof link === "string" ? link : formatHref(link)}
                        passHref
                      >
                        <div
                          className="w-full h-full relative"
                          style={{
                            backgroundImage: `url(${banner?.image})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            backgroundRepeat: "no-repeat",
                          }}
                        >
                          {/* 1520x434 */}
                          {/* Mobile image that will show on smaller screens */}
                          {banner?.mobileImage && (
                            <div
                              className="md:hidden w-full h-full"
                              style={{
                                backgroundImage: `url(${banner.mobileImage})`,
                                backgroundSize: "contain",
                                backgroundPosition: "center",
                                backgroundRepeat: "no-repeat",
                              }}
                            />
                          )}
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>

        {/* Navigation Arrows */}
        <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/30 hover:bg-white/50 text-white border-0 cursor-pointer opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100 focus-visible:opacity-100 disabled:hidden" />
        <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/30 hover:bg-white/50 text-white border-0 cursor-pointer opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100 focus-visible:opacity-100 disabled:hidden" />
      </Carousel>

      {/* Pagination Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {ads.map((_, index) => (
          <button
            key={index}
            onClick={() => api?.scrollTo(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 cursor-pointer border-stone-400 ${
              currentIndex === index
                ? "bg-primary w-6"
                : "bg-white/50 hover:bg-white/70"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
