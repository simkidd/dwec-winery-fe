"use client";
import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Autoplay from "embla-carousel-autoplay";
import Fade from "embla-carousel-fade";
import useAds from "@/hooks/use-ads";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import Logo from "../shared/Logo";
import Link from "next/link";
import { IAds } from "@/interfaces/ads.interface";
import { slugify } from "@/utils/helpers";

const HeroSection = () => {
  const { ads, isPending } = useAds();

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
      <div className="w-full relative aspect-[2.5/1] md:aspect-[4/1]">
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
      <div className="w-full relative aspect-[2.5/1] md:aspect-[4/1] bg-gradient-to-r from-primary/50 to-primary/20 flex items-center justify-center text-white">
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
          {ads.map((slide) => {
            const link = getAdLink(slide);

            return (
              <CarouselItem key={slide._id} className="pl-0">
                <div className="p-0">
                  <Card className="border-0 p-0 rounded-none overflow-hidden">
                    <CardContent className="relative p-0 aspect-[2.5/1] md:aspect-[4/1]">
                      {/* Background Image with overlay */}
                      <Link
                        href={link}
                        as={typeof link === "string" ? link : formatHref(link)}
                        passHref
                      >
                        <div
                          className="w-full h-full bg-cover bg-center relative"
                          style={{ backgroundImage: `url(${slide.image})` }}
                        ></div>
                      </Link>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>

        {/* Navigation Arrows */}
        <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/30 hover:bg-white/50 text-white border-0 cursor-pointer opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100 focus-visible:opacity-100" />
        <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/30 hover:bg-white/50 text-white border-0 cursor-pointer opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100 focus-visible:opacity-100" />
      </Carousel>
    </section>
  );
};

export default HeroSection;
