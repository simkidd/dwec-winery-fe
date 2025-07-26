"use client";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import useAds from "@/hooks/use-ads";
import { FilterAdsParams, IAds } from "@/interfaces/ads.interface";
import { slugify } from "@/utils/helpers";
import Autoplay from "embla-carousel-autoplay";
import Link from "next/link";
import { useMemo, useState } from "react";

export type BannerPosition =
  | "featured"
  | "sidebar"
  | "promotion"
  | "main"
  | "product"
  | "footer";

const BANNER_DIMENSIONS = {
  featured: {
    desktop: { width: 1200, height: 300, aspect: "aspect-[1440/280]" },
    mobile: { width: 1080, height: 480, aspect: "aspect-[2.25/1]" },
  },
  sidebar: {
    desktop: { width: 300, height: 600, aspect: "aspect-[1/2]" },
    mobile: { width: 400, height: 800, aspect: "aspect-[1/2]" },
  },
  promotion: {
    desktop: { width: 1400, height: 500, aspect: "aspect-[2.8/1]" },
    mobile: { width: 1080, height: 500, aspect: "aspect-[2.16/1]" },
  },
  main: {
    desktop: { width: 1600, height: 500, aspect: "aspect-[3.2/1]" },
    mobile: { width: 1080, height: 520, aspect: "aspect-[2.08/1]" },
  },
  product: {
    desktop: { width: 800, height: 800, aspect: "aspect-[1/1]" },
    mobile: { width: 600, height: 600, aspect: "aspect-[1/1]" },
  },
  footer: {
    desktop: { width: 1200, height: 300, aspect: "aspect-[4/1]" },
    mobile: { width: 1080, height: 280, aspect: "aspect-[3.86/1]" },
  },
};

interface BannerSectionProps {
  position: BannerPosition;
  className?: string;
  maxItems?: number;
  autoplay?: boolean;
}

const BannerSection = ({
  position,
  className = "",
  maxItems = 3,
  autoplay = false,
}: BannerSectionProps) => {
  const [filter] = useState<FilterAdsParams>({ position });
  const { ads, isPending } = useAds(false, filter);

  const dimensions = BANNER_DIMENSIONS[position];
  const plugin = useMemo(
    () => (autoplay ? Autoplay({ delay: 5000 }) : undefined),
    [autoplay]
  );

  const getAdLink = (ad: IAds) => {
    if (ad.otherAssociatedProducts?.length) {
      return {
        pathname: `/catalog/${slugify(ad.name)}`,
        query: { id: ad._id },
      };
    }
    if (ad.associatedProduct?.slug) {
      return `/products/${ad.associatedProduct.slug}`;
    }
    return "/products";
  };

  const formatHref = (link: ReturnType<typeof getAdLink>) => {
    if (typeof link === "string") return link;
    return `${link.pathname}?${new URLSearchParams(link.query).toString()}`;
  };

  if (isPending)
    return (
      <div
        className={`w-full ${dimensions.desktop.aspect} bg-muted animate-pulse ${className}`}
      />
    );

  if (!ads.length) return null;

  const displayedAds = ads.slice(0, maxItems);

  return (
    <div className={`w-full ${className}`}>
      {displayedAds.length > 1 ? (
        <Carousel
          plugins={plugin ? [plugin] : []}
          opts={{ loop: true }}
          className="w-full group"
        >
          <CarouselContent>
            {displayedAds.map((ad) => {
              const link = getAdLink(ad);
              const banner = ad.banners?.find((b) => b.position === position);

              return (
                <CarouselItem key={ad._id}>
                  <div className="border-0 p-0 rounded-none overflow-hidden">
                    <div
                      className={`relative p-0 ${dimensions.desktop.aspect} md:${dimensions.mobile.aspect}`}
                    >
                      <Link
                        href={link}
                        as={typeof link === "string" ? link : formatHref(link)}
                        passHref
                      >
                        <div className="w-full h-full relative">
                          {/* Desktop Image */}
                          <div
                            className="hidden md:block w-full h-full "
                            style={{
                              backgroundImage: `url(${banner?.image})`,
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                              backgroundRepeat: "no-repeat",
                            }}
                          />
                          {/* Mobile Image */}
                          {banner?.mobileImage && (
                            <div
                              className="md:hidden w-full h-full "
                              style={{
                                backgroundImage: `url(${banner.mobileImage})`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                              }}
                            />
                          )}
                        </div>
                      </Link>
                    </div>
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          {displayedAds.length > 1 && (
            <>
              <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2" />
              <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2" />
            </>
          )}
        </Carousel>
      ) : (
        // Single banner display
        displayedAds.map((ad) => {
          const link = getAdLink(ad);
          const banner = ad.banners?.find((b) => b.position === position);

          return (
            <Card
              key={ad._id}
              className="border-0 p-0 rounded-none overflow-hidden"
            >
              <CardContent
                className={`relative p-0 ${dimensions.desktop.aspect} md:${dimensions.mobile.aspect}`}
              >
                <Link
                  href={link}
                  as={typeof link === "string" ? link : formatHref(link)}
                  passHref
                >
                  <div className="w-full h-full relative">
                    {/* Desktop Image */}
                    <div
                      className="hidden md:block w-full h-full "
                      style={{
                        backgroundImage: `url(${banner?.image})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    />
                    {/* Mobile Image */}
                    {banner?.mobileImage && (
                      <div
                        className="md:hidden w-full h-full "
                        style={{
                          backgroundImage: `url(${banner.mobileImage})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                      />
                    )}
                  </div>
                </Link>
              </CardContent>
            </Card>
          );
        })
      )}
    </div>
  );
};

export default BannerSection;
