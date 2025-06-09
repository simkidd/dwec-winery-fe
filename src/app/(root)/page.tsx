import ExploreCategories from "@/components/home/ExploreCategories";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import HeroSection from "@/components/home/HeroSection";
import SpecialOffers from "@/components/home/SpecialOffers";
import React from "react";

const HomePage = () => {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <ExploreCategories />
      <FeaturedProducts />
      <SpecialOffers />
    </div>
  );
};

export default HomePage;
