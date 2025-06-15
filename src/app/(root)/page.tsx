import BlogPreview from "@/components/home/BlogPreview";
import ExploreCategories from "@/components/home/ExploreCategories";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import HeroSection from "@/components/home/HeroSection";
import SpecialOffers from "@/components/home/SpecialOffers";

const HomePage = () => {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <ExploreCategories />
      <FeaturedProducts />
      <SpecialOffers />

      <BlogPreview />

      
    </div>
  );
};

export default HomePage;
