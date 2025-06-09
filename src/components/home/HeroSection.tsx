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
import Autoplay from "embla-carousel-autoplay";
import Fade from "embla-carousel-fade";
import useAds from "@/hooks/use-ads";

const HeroSection = () => {
  const { ads } = useAds();

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
          }),
          Fade(),
        ]}
      >
        <CarouselContent className="-ml-0">
          {ads.map((slide) => (
            <CarouselItem key={slide._id} className="pl-0">
              <div className="p-0">
                <Card className="border-0 p-0 rounded-none">
                  <CardContent className="relative p-0 aspect-video md:aspect-[3/1]">
                    <div
                      className="w-full h-full bg-cover bg-center"
                      style={{ backgroundImage: `url(${slide.image})` }}
                    >
                      {/* <div className="absolute inset-0 bg-primary/30 flex items-center">
                        <div className="container mx-auto px-6 text-white">
                          <div className="max-w-lg">
                            <h1 className="text-4xl md:text-5xl font-bold mb-4">
                              {slide.title}
                            </h1>
                            <p className="text-lg md:text-xl mb-6">
                              {slide.description}
                            </p>
                            <Button
                              asChild
                              className="rounded-sm px-8 py-4 text-lg"
                            >
                              <a href={slide.link}>{slide.cta}</a>
                            </Button>
                          </div>
                        </div>
                      </div> */}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/30 hover:bg-white/50 text-white border-0 cursor-pointer opacity-0 transition-opacity duration-500 ease-in-out group-hover:opacity-100" />
        <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/30 hover:bg-white/50 text-white border-0 cursor-pointer opacity-0 transition-opacity duration-500 ease-in-out group-hover:opacity-100" />
      </Carousel>
    </section>
  );
};

export default HeroSection;
